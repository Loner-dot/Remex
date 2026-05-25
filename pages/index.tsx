import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { initialMembers } from '../lib/members'

export default function Home({ 
  isLoggedIn, setIsLoggedIn, 
  memberData, setMemberData,
  allMembers, setAllMembers 
}) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [particles, setParticles] = useState([])
  const [time, setTime] = useState('')

  // Generate floating particles
  useEffect(() => {
    const pts = []
    for (let i = 0; i < 25; i++) {
      pts.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        delay: Math.random() * 5 + 's',
        duration: Math.random() * 3 + 3 + 's',
        size: Math.random() * 3 + 2 + 'px',
      })
    }
    setParticles(pts)
  }, [])

  // Update cyberpunk clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load all members from localStorage
    const savedMembers = localStorage.getItem('clan_members')
    const members = savedMembers ? JSON.parse(savedMembers) : initialMembers
    
    // Find member by password
    const member = members.find((m: any) => m.password === password && m.active)
    
    if (member) {
      // Update last login
      member.lastLogin = new Date().toISOString()
      const updatedMembers = members.map((m: any) => 
        m.id === member.id ? member : m
      )
      
      // Save to localStorage
      localStorage.setItem('clan_members', JSON.stringify(updatedMembers))
      localStorage.setItem('clan_current_user', JSON.stringify(member))
      
      setMemberData(member)
      setAllMembers(updatedMembers)
      setIsLoggedIn(true)
      setError('')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      setError('❌ Invalid password. Contact your clan leader.')
      // Shake animation
      const input = document.querySelector('input')
      if (input) {
        input.style.animation = 'shake 0.5s ease'
        setTimeout(() => {
          input.style.animation = ''
        }, 500)
      }
    }
  }

  // If already logged in, redirect to dashboard
  if (isLoggedIn && memberData) {
    router.push('/dashboard')
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0015 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      
      {/* Floating Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '450px',
        margin: '0 auto',
        paddingTop: '60px',
      }}>
        
        {/* Clan Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.5 }}
          style={{ textAlign: 'center', marginBottom: '25px' }}
        >
          <div style={{
            width: '130px',
            height: '130px',
            margin: '0 auto',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff2d95 0%, #9b30ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '55px',
            boxShadow: '0 0 60px rgba(255, 45, 149, 0.6)',
            animation: 'glow 2s ease-in-out infinite alternate',
          }}>
            ⚡
          </div>
        </motion.div>

        {/* Clan Name */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '35px' }}
        >
          <h1 style={{
            fontSize: '40px',
            fontWeight: '900',
            background: 'linear-gradient(to right, #ff2d95, #9b30ff, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            SHADOW SYNDICATE
          </h1>
          <p style={{
            color: '#888',
            fontSize: '15px',
            fontFamily: 'monospace',
          }}>
            「闇の組織」// GHETTO ELITE
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card glow-pink"
          style={{ marginBottom: '25px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ 
              fontSize: '22px', 
              color: '#ff2d95',
              marginBottom: '8px',
            }}>
              🔐 MEMBER ACCESS
            </h2>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Enter your unique clan password
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              autoFocus
              style={{
                fontSize: '16px',
                textAlign: 'center',
                letterSpacing: '2px',
              }}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 0, 68, 0.2)',
                  border: '1px solid rgba(255, 0, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '15px',
                  color: '#ff0044',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                {error}
              </motion.div>
            )}

            <button type="submit" className="btn-neon">
              ACCESS CLAN NETWORK
            </button>
          </form>
        </motion.div>

        {/* Clan Stats */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-card"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '15px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '28px' }}>👥</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff2d95' }}>
              {allMembers.length}
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Members</div>
          </div>
          <div>
            <div style={{ fontSize: '28px' }}>⚡</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#9b30ff' }}>
              {allMembers.filter(m => m.active).length}
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Active</div>
          </div>
          <div>
            <div style={{ fontSize: '28px' }}>🎯</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00d4ff' }}>23</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>Missions</div>
          </div>
        </motion.div>

        {/* Cyberpunk Clock */}
        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          color: '#ff2d95',
          fontFamily: 'monospace',
          fontSize: '12px',
          opacity: 0.6,
        }}>
          [SYS.TIME] {time} // NEO-TOKYO GRID
        </div>

      </div>

      {/* Shake Animation Style */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}