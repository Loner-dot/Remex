import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function Confessions({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [confession, setConfession] = useState('')
  const [confessions, setConfessions] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    
    // Load confessions from localStorage
    const saved = localStorage.getItem('clan_confessions')
    if (saved) {
      setConfessions(JSON.parse(saved))
    } else {
      // Sample confessions
      const samples = [
        { id: 1, text: 'I secretly think the Aura Scanner gives me higher scores than I deserve 😅', type: 'confession', reactions: ['😂', '❤️', '🔥'], timestamp: Date.now() - 3600000, color: '#ff2d95' },
        { id: 2, text: 'I joined this clan because of the aesthetic... the missions are cool too I guess 💜', type: 'confession', reactions: ['💀', '✨'], timestamp: Date.now() - 7200000, color: '#9b30ff' },
        { id: 3, text: 'Shadow Syndicate > Everything else. No cap. 🗿', type: 'confession', reactions: ['🗿', '⚡', '👑'], timestamp: Date.now() - 10800000, color: '#00d4ff' },
      ]
      localStorage.setItem('clan_confessions', JSON.stringify(samples))
      setConfessions(samples)
    }
  }, [isLoggedIn])

  const addConfession = () => {
    if (!confession.trim()) return
    
    const newConfession = {
      id: Date.now(),
      text: confession,
      type: 'confession',
      reactions: [],
      timestamp: Date.now(),
      color: ['#ff2d95', '#9b30ff', '#00d4ff', '#ff0044'][Math.floor(Math.random() * 4)],
      anonymous: true,
    }
    
    const updated = [newConfession, ...confessions]
    localStorage.setItem('clan_confessions', JSON.stringify(updated))
    setConfessions(updated)
    setConfession('')
  }

  const addReaction = (id, emoji) => {
    const updated = confessions.map(c => {
      if (c.id === id) {
        return { ...c, reactions: [...c.reactions, emoji] }
      }
      return c
    })
    localStorage.setItem('clan_confessions', JSON.stringify(updated))
    setConfessions(updated)
  }

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'rgba(255,45,149,0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            color: '#ff2d95',
            marginBottom: '30px',
            cursor: 'pointer',
          }}
        >
          ⬅️ Back
        </button>

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: '32px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ff2d95, #9b30ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '30px',
          }}
        >
          💌 ANONYMOUS CONFESSIONS
        </motion.h1>

        {/* Post Confession */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card glow-pink"
          style={{ marginBottom: '20px' }}
        >
          <h3 style={{ color: '#ff2d95', marginBottom: '15px', fontSize: '18px' }}>
            🕵️ Post Anonymously
          </h3>
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder="Share your secret..."
            rows={3}
            maxLength={200}
            style={{
              background: 'rgba(20,20,40,0.9)',
              border: '1px solid rgba(255,45,149,0.3)',
              borderRadius: '12px',
              padding: '15px',
              color: 'white',
              width: '100%',
              resize: 'none',
              fontSize: '16px',
              marginBottom: '15px',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>
              {confession.length}/200
            </span>
            <button
              onClick={addConfession}
              className="btn-neon"
              style={{ width: 'auto', padding: '12px 30px' }}
              disabled={!confession.trim()}
            >
              POST ANONYMOUSLY
            </button>
          </div>
        </motion.div>

        {/* Confessions Feed */}
        <div style={{ marginTop: '20px' }}>
          {confessions.map((conf, index) => (
            <motion.div
              key={conf.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card"
              style={{
                marginBottom: '15px',
                borderLeft: `4px solid ${conf.color}`,
                animation: 'float 6s ease-in-out infinite',
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: conf.color,
                    background: `${conf.color}22`,
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}>
                    🎭 Anonymous
                  </span>
                  <span style={{ fontSize: '11px', color: '#666' }}>
                    {timeAgo(conf.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '16px', color: '#ddd', lineHeight: '1.5' }}>
                  {conf.text}
                </p>
              </div>

              {/* Reactions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['❤️', '😂', '🔥', '💀', '✨', '🗿'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(conf.id, emoji)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      padding: '5px 12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    {emoji} {conf.reactions.filter(r => r === emoji).length || ''}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}