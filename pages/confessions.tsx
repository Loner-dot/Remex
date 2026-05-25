import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Confessions({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadConfessions()
  }, [isLoggedIn])

  const loadConfessions = async () => {
    const { data } = await supabase
      .from('confessions')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setConfessions(data)
  }

  const postConfession = async () => {
    if (!text.trim()) return
    setLoading(true)

    const { error } = await supabase.from('confessions').insert([{
      text,
      type: filter === 'crush' ? 'crush' : 'confession',
      username: 'anonymous',
    }])

    if (!error) {
      setText('')
      loadConfessions()
    }
    setLoading(false)
  }

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
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

        <h1 style={{
          fontSize: '20px', fontWeight: '300', color: '#777777',
          letterSpacing: '8px', textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace', marginBottom: '30px',
        }}>
          CONFESSIONS
        </h1>

        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="TYPE YOUR CONFESSION..."
            rows={3}
            maxLength={300}
            style={{ resize: 'none' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['all', 'confession', 'crush'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  border: `1px solid ${filter === f ? '#444444' : '#1a1a1a'}`,
                  background: 'none',
                  color: filter === f ? '#888888' : '#444444',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn-zen" onClick={postConfession} disabled={loading || !text.trim()}>
            POST ANONYMOUSLY
          </button>
        </div>

        {confessions.map((c: any) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ marginBottom: '10px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
                color: '#444444', letterSpacing: '2px',
              }}>
                ANONYMOUS
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '8px',
                color: '#333333', letterSpacing: '1px',
              }}>
                {timeAgo(c.created_at)}
              </span>
            </div>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              color: '#888888', lineHeight: '1.6', letterSpacing: '1px',
            }}>
              {c.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}