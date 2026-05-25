import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Confessions({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadConfessions()
  }, [isLoggedIn])

  const loadConfessions = async () => {
    const { data } = await supabase.from('confessions').select('*').eq('active', true).order('created_at', { ascending: false }).limit(50)
    if (data) setConfessions(data)
  }

  const postConfession = async () => {
    if (!text.trim()) return
    setLoading(true)
    const { error } = await supabase.from('confessions').insert([{ text }])
    if (!error) { setText(''); loadConfessions() }
    setLoading(false)
  }

  const timeAgo = (ts: string) => {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (s < 60) return `${s}s`
    if (s < 3600) return `${Math.floor(s / 60)}m`
    if (s < 86400) return `${Math.floor(s / 3600)}h`
    return `${Math.floor(s / 86400)}d`
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
        }}>← Back</button>

        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', letterSpacing: '-0.5px' }}>Confessions</h1>

        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Share something anonymously..."
            rows={3} maxLength={300} style={{ resize: 'none' }} />
          <button className="btn-zen" onClick={postConfession} disabled={loading || !text.trim()}>
            {loading ? 'Posting...' : 'Post Anonymously'}
          </button>
        </div>

        {confessions.map((c: any) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card" style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.35)' }}>Anonymous</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>{timeAgo(c.created_at)}</span>
            </div>
            <p style={{ fontSize: '15px', color: '#e0e0e0', lineHeight: '1.5', fontWeight: '400' }}>{c.text}</p>
          </motion.div>
        ))}

      </div>
    </div>
  )
}