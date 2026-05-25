import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard({ memberData, isLoggedIn, setIsLoggedIn, setMemberData }) {
  const router = useRouter()
  const [time, setTime] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
    
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isLoggedIn])

  const logout = () => {
    localStorage.removeItem('clan_current_user')
    setMemberData(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  if (!memberData) return null

  return (
    <div className="cyber-grid" style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card glow-pink"
          style={{
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(255,45,149,0.2), rgba(155,48,255,0.2))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '45px' }}>{memberData.avatar}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', color: '#ff2d95', marginBottom: '5px' }}>
                {memberData.username}
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(155,48,255,0.3)',
                  fontSize: '12px',
                  color: '#9b30ff',
                }}>
                  {memberData.rank}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(0,212,255,0.3)',
                  fontSize: '12px',
                  color: '#00d4ff',
                }}>
                  Level {memberData.level}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255,0,68,0.2)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                color: '#ff0044',
                cursor: 'pointer',
              }}
            >
              🚪
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px',
          }}
        >
          <QuickAction 
            icon="🔮" 
            label="Aura Scanner" 
            onClick={() => router.push('/aura-scanner')}
          />
          <QuickAction 
            icon="💳" 
            label="Profile Card" 
            onClick={() => router.push('/profile-card')}
          />
          <QuickAction 
            icon="💌" 
            label="Confessions" 
            onClick={() => router.push('/confessions')}
          />
          <QuickAction 
            icon="🏆" 
            label="Leaderboard" 
            onClick={() => router.push('/leaderboard')}
          />
        </motion.div>

        {/* Admin Access */}
        {memberData.rank === 'Supreme Leader' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="btn-neon btn-red"
            onClick={() => router.push('/admin')}
            style={{ marginBottom: '20px' }}
          >
            👑 SUPREME COMMAND CENTER
          </motion.button>
        )}

        {/* Stats */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ marginBottom: '20px' }}
        >
          <h3 style={{ color: '#9b30ff', marginBottom: '15px', fontSize: '18px' }}>
            ⚡ Your Aura Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <StatBox label="Aura" value={memberData.aura} color="#ff2d95" />
            <StatBox label="XP" value={`${memberData.xp}`} color="#00d4ff" />
            <StatBox label="Level" value={memberData.level} color="#9b30ff" />
            <StatBox label="Status" value="Active" color="#00ff88" />
          </div>
        </motion.div>

        {/* Cyber Clock */}
        <div style={{
          textAlign: 'center',
          color: '#ff2d95',
          fontFamily: 'monospace',
          fontSize: '12px',
          opacity: 0.6,
          marginTop: '20px',
        }}>
          [SYS.TIME] {time} // {memberData.username}.exe running
        </div>

      </div>
    </div>
  )
}

function QuickAction({ icon, label, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-card"
      onClick={onClick}
      style={{ textAlign: 'center', cursor: 'pointer' }}
    >
      <div style={{ fontSize: '35px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '14px', color: '#888' }}>{label}</div>
    </motion.div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      padding: '15px',
      borderRadius: '12px',
      background: 'rgba(20,20,40,0.8)',
      border: `1px solid ${color}33`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  )
}