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
  const [showCreate, setShowCreate] = useState(false)
  const [voted, setVoted] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadPolls()
    loadVotes()
  }, [isLoggedIn])

  const loadPolls = async () => {
    const { data } = await supabase.from('polls').select('*').eq('active', true).order('created_at', { ascending: false })
    if (data) setPolls(data)
  }

  const loadVotes = async () => {
    const { data } = await supabase.from('poll_votes').select('poll_id').eq('username', memberData?.username)
    if (data) setVoted(data.map(v => v.poll_id))
  }

  const createPoll = async () => {
    if (!question || !opt1 || !opt2) return
    setLoading(true)
    await supabase.from('polls').insert([{
      question, option1: opt1, option2: opt2, created_by: memberData.username,
    }])
    setQuestion(''); setOpt1(''); setOpt2('')
    setShowCreate(false)
    loadPolls()
    setLoading(false)
  }

  const vote = async (pollId: number, optionNum: number) => {
    if (voted.includes(pollId)) return
    const field = `votes${optionNum}`
    const { data: poll } = await supabase.from('polls').select(field).eq('id', pollId).single()
    if (poll) {
      await supabase.from('polls').update({ [field]: poll[field] + 1 }).eq('id', pollId)
      await supabase.from('poll_votes').insert([{ poll_id: pollId, username: memberData.username, option_num: optionNum }])
      setVoted([...voted, pollId])
      loadPolls()
    }
  }

  const getPct = (votes: number, total: number) => total === 0 ? 0 : Math.round((votes / total) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
        }}>← Back</button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px' }}>Polls</h1>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-secondary" style={{ width: 'auto', padding: '12px 20px', fontSize: '14px' }}>
            {showCreate ? 'Close' : 'Create'}
          </button>
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: '24px' }}>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
            <input value={opt1} onChange={(e) => setOpt1(e.target.value)} placeholder="Option 1" />
            <input value={opt2} onChange={(e) => setOpt2(e.target.value)} placeholder="Option 2" />
            <button className="btn-zen" onClick={createPoll} disabled={loading}>
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </motion.div>
        )}

        {polls.map((poll: any) => {
          const total = poll.votes1 + poll.votes2
          return (
            <motion.div key={poll.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff', marginBottom: '16px' }}>{poll.question}</div>
              {[1, 2].map(num => {
                const votes = poll[`votes${num}`]
                const option = poll[`option${num}`]
                return (
                  <button key={num} onClick={() => vote(poll.id, num)} disabled={voted.includes(poll.id)}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                      background: voted.includes(poll.id) ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff', fontSize: '14px', fontWeight: '500', textAlign: 'left',
                      cursor: voted.includes(poll.id) ? 'default' : 'pointer', marginBottom: '8px',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{option}</span>
                      {voted.includes(poll.id) && <span style={{ opacity: 0.6 }}>{getPct(votes, total)}%</span>}
                    </div>
                    {voted.includes(poll.id) && (
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '8px' }}>
                        <div style={{ width: `${getPct(votes, total)}%`, height: '100%', background: '#ffffff', borderRadius: '2px', transition: 'width 0.3s' }} />
                      </div>
                    )}
                  </button>
                )
              })}
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>{total} votes</div>
            </motion.div>
          )
        })}

      </div>
    </div>
  )
}