import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard({ memberData, isLoggedIn, setIsLoggedIn, setMemberData }) {
  const router = useRouter()
  const [time, setTime] = useState('')

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isLoggedIn])

  const logout = () => {
    localStorage.removeItem('zen_current_user')
    setMemberData(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  if (!memberData) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card"
          style={{ marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: '#555555',
                letterSpacing: '3px',
                marginBottom: '10px',
              }}>
                LOGGED IN AS
              </div>
              <h2 style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '18px',
                color: '#999999',
                letterSpacing: '4px',
                fontWeight: '300',
                marginBottom: '8px',
              }}>
                {memberData.username}
              </h2>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  color: '#555555',
                  letterSpacing: '2px',
                  border: '1px solid #1a1a1a',
                  padding: '4px 10px',
                }}>
                  {memberData.rank.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  color: '#444444',
                  letterSpacing: '2px',
                  border: '1px solid #111111',
                  padding: '4px 10px',
                }}>
                  LV.{memberData.level}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid #1a0000',
                padding: '10px 15px',
                color: '#660000',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
            >
              EXIT
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <NavButton label="AURA SCANNER" onClick={() => router.push('/aura-scanner')} />
          <NavButton label="PROFILE CARD" onClick={() => router.push('/profile-card')} />
          <NavButton label="CONFESSIONS" onClick={() => router.push('/confessions')} />
          <NavButton label="LEADERBOARD" onClick={() => router.push('/leaderboard')} />
        </motion.div>

        {memberData.rank === 'Supreme Leader' && (
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="btn-zen"
            onClick={() => router.push('/admin')}
            style={{ marginBottom: '20px', borderColor: '#333333' }}
          >
            COMMAND CENTER
          </motion.button>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: '#555555',
            letterSpacing: '3px',
            marginBottom: '20px',
          }}>
            STATISTICS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <StatBox label="AURA" value={memberData.aura} />
            <StatBox label="XP" value={memberData.xp.toString()} />
            <StatBox label="LEVEL" value={memberData.level.toString()} />
            <StatBox label="STATUS" value="ACTIVE" />
          </div>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: '#1a1a1a',
          fontSize: '9px',
          letterSpacing: '4px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          SYS {time} // {memberData.username}.EXE
        </div>

      </div>
    </div>
  )
}

function NavButton({ label, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card"
      onClick={onClick}
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        padding: '24px 15px',
      }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        color: '#666666',
        letterSpacing: '3px',
      }}>
        {label}
      </div>
    </motion.div>
  )
}

function StatBox({ label, value }) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #111111',
      background: '#050505',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '8px',
        color: '#444444',
        letterSpacing: '2px',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '16px',
        color: '#888888',
        letterSpacing: '2px',
        fontWeight: '300',
      }}>
        {value}
      </div>
    </div>
  )
}