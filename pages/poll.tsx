import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Polls({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [polls, setPolls] = useState([])
  const [question, setQuestion] = useState('')
  const [opt1, setOpt1] = useState('')
  const [opt2, setOpt2] = useState('')
  const [opt3, setOpt3] = useState('')
  const [opt4, setOpt4] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [voted, setVoted] = useState<number[]>([])

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadPolls()
    loadVotes()
  }, [isLoggedIn])

  const loadPolls = async () => {
    const { data } = await supabase
      .from('polls')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (data) setPolls(data)
  }

  const loadVotes = async () => {
    const { data } = await supabase
      .from('poll_votes')
      .select('poll_id')
      .eq('username', memberData?.username)
    if (data) setVoted(data.map(v => v.poll_id))
  }

  const createPoll = async () => {
    if (!question || !opt1 || !opt2) return

    await supabase.from('polls').insert([{
      question,
      option1: opt1,
      option2: opt2,
      option3: opt3 || null,
      option4: opt4 || null,
      created_by: memberData.username,
    }])

    setQuestion(''); setOpt1(''); setOpt2(''); setOpt3(''); setOpt4('')
    setShowCreate(false)
    loadPolls()
  }

  const vote = async (pollId: number, optionNum: number) => {
    if (voted.includes(pollId)) return

    const field = `votes${optionNum}`
    const { data: poll } = await supabase.from('polls').select(field).eq('id', pollId).single()
    if (poll) {
      await supabase.from('polls').update({ [field]: poll[field] + 1 }).eq('id', pollId)
      await supabase.from('poll_votes').insert([{
        poll_id: pollId,
        username: memberData.username,
        option_num: optionNum,
      }])
      setVoted([...voted, pollId])
      loadPolls()
    }
  }

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: '1px solid #1a1a1a', padding: '10px 20px',
          color: '#555555', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '3px', cursor: 'pointer', marginBottom: '30px',
        }}>
          BACK
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '20px', fontWeight: '300', color: '#777777',
            letterSpacing: '8px', textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            POLLS
          </h1>
          <button onClick={() => setShowCreate(!showCreate)} style={{
            background: 'none', border: '1px solid #333333', padding: '8px 15px',
            color: '#888888', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            letterSpacing: '2px', cursor: 'pointer',
          }}>
            {showCreate ? 'CLOSE' : 'CREATE'}
          </button>
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: '25px' }}>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="QUESTION" />
            <input value={opt1} onChange={(e) => setOpt1(e.target.value)} placeholder="OPTION 1" />
            <input value={opt2} onChange={(e) => setOpt2(e.target.value)} placeholder="OPTION 2" />
            <input value={opt3} onChange={(e) => setOpt3(e.target.value)} placeholder="OPTION 3 (optional)" />
            <input value={opt4} onChange={(e) => setOpt4(e.target.value)} placeholder="OPTION 4 (optional)" />
            <button className="btn-zen" onClick={createPoll}>CREATE POLL</button>
          </motion.div>
        )}

        {polls.map((poll: any) => {
          const total = poll.votes1 + poll.votes2 + poll.votes3 + poll.votes4
          const options = [
            { num: 1, text: poll.option1, votes: poll.votes1 },
            { num: 2, text: poll.option2, votes: poll.votes2 },
          ]
          if (poll.option3) options.push({ num: 3, text: poll.option3, votes: poll.votes3 })
          if (poll.option4) options.push({ num: 4, text: poll.option4, votes: poll.votes4 })

          return (
            <motion.div key={poll.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ marginBottom: '15px' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
                color: '#999999', letterSpacing: '1px', marginBottom: '15px',
              }}>
                {poll.question}
              </div>
              {options.map(opt => (
                <div key={opt.num} style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => vote(poll.id, opt.num)}
                    disabled={voted.includes(poll.id)}
                    style={{
                      width: '100%', padding: '12px', textAlign: 'left',
                      border: '1px solid #1a1a1a', background: '#050505',
                      color: voted.includes(poll.id) ? '#555555' : '#888888',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                      letterSpacing: '1px', cursor: voted.includes(poll.id) ? 'default' : 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{opt.text}</span>
                      {voted.includes(poll.id) && (
                        <span>{getPercentage(opt.votes, total)}%</span>
                      )}
                    </div>
                    {voted.includes(poll.id) && (
                      <div style={{
                        width: '100%', height: '2px', background: '#111111',
                        marginTop: '6px',
                      }}>
                        <div style={{
                          width: `${getPercentage(opt.votes, total)}%`,
                          height: '100%', background: '#333333',
                        }} />
                      </div>
                    )}
                  </button>
                </div>
              ))}
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
                color: '#333333', letterSpacing: '2px', marginTop: '8px',
              }}>
                {total} VOTES
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}