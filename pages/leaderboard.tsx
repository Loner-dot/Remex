import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function Leaderboard({ memberData, isLoggedIn, allMembers }) {
  const router = useRouter()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [sortBy, setSortBy] = useState('level')

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    
    // Sort members by different criteria
    const sorted = [...allMembers].sort((a, b) => {
      if (sortBy === 'level') return b.level - a.level
      if (sortBy === 'xp') return b.xp - a.xp
      return 0
    })
    setLeaderboardData(sorted)
  }, [isLoggedIn, allMembers, sortBy])

  const getRankEmoji = (index) => {
    if (index === 0) return '👑'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getGlowColor = (index) => {
    if (index === 0) return '#ffd700'
    if (index === 1) return '#c0c0c0'
    if (index === 2) return '#cd7f32'
    return '#ff2d95'
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
            background: 'linear-gradient(to right, #ffd700, #ff2d95, #9b30ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '30px',
          }}
        >
          🏆 CLAN LEADERBOARD
        </motion.h1>

        {/* Sort Buttons */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
        >
          <button
            onClick={() => setSortBy('level')}
            className="btn-neon"
            style={{
              flex: 1,
              opacity: sortBy === 'level' ? 1 : 0.5,
            }}
          >
            BY LEVEL
          </button>
          <button
            onClick={() => setSortBy('xp')}
            className="btn-neon btn-blue"
            style={{
              flex: 1,
              opacity: sortBy === 'xp' ? 1 : 0.5,
            }}
          >
            BY XP
          </button>
        </motion.div>

        {/* Leaderboard List */}
        {leaderboardData.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{
              marginBottom: '12px',
              borderLeft: `4px solid ${getGlowColor(index)}`,
              background: index === 0 ? 'rgba(255,215,0,0.05)' : undefined,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}>
              {/* Rank */}
              <div style={{
                fontSize: '30px',
                minWidth: '40px',
                textAlign: 'center',
              }}>
                {getRankEmoji(index)}
              </div>

              {/* Avatar */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(155,48,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '25px',
                border: `2px solid ${getGlowColor(index)}`,
              }}>
                {member.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {member.username}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: 'rgba(155,48,255,0.2)',
                    color: '#9b30ff',
                  }}>
                    {member.rank}
                  </span>
                </div>
                
                {/* Stats Bar */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                  <span style={{ color: '#ff2d95' }}>
                    ⚡ Lv.{member.level}
                  </span>
                  <span style={{ color: '#00d4ff' }}>
                    ✨ {member.xp} XP
                  </span>
                  <span style={{
                    color: member.active ? '#00ff88' : '#ff0044',
                  }}>
                    {member.active ? '🟢' : '🔴'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '60px',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(member.level / 99) * 100}%`,
                  background: getGlowColor(index),
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Your Position */}
        {memberData && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card glow-pink"
            style={{ marginTop: '20px', textAlign: 'center' }}
          >
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>
              YOUR RANKING
            </p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff2d95' }}>
              #{leaderboardData.findIndex(m => m.id === memberData.id) + 1}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}