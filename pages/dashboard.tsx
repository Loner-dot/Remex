import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MusicPlayer from '../components/MusicPlayer'

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
                letterSpacing: '3px',
                marginBottom: '10px',
              }}>
                LOGGED IN AS
              </div>
              <h2 style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '18px',
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
                  letterSpacing: '2px',
                  border: '1px solid',
                  padding: '4px 10px',
                }}>
                  {memberData.rank.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  border: '1px solid',
                  padding: '4px 10px',
                  opacity: 0.7,
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
          <NavButton label="POLLS" onClick={() => router.push('/polls')} />
          <NavButton label="MESSAGES" onClick={() => router.push('/chat')} />
          <NavButton label="THEMES" onClick={() => router.push('/themes')} />
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
            letterSpacing: '3px',
            marginBottom: '20px',
            opacity: 0.6,
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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ marginTop: '20px' }}
        >
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            letterSpacing: '3px',
            marginBottom: '15px',
            opacity: 0.6,
          }}>
            CLAN INFO
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            letterSpacing: '2px',
            lineHeight: '2',
            opacity: 0.7,
          }}>
            ZEN CLAN // EST. 2024<br />
            SUPREME LEADER: REM<br />
            NETWORK: SECURE<br />
            PROTOCOL: ACTIVE
          </div>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '9px',
          letterSpacing: '4px',
          fontFamily: 'JetBrains Mono, monospace',
          opacity: 0.3,
        }}>
          SYS {time} // {memberData.username}.EXE
        </div>

      </div>

      <MusicPlayer />
    </div>
  )
}

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card"
      onClick={onClick}
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        padding: '22px 15px',
      }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '10px',
        letterSpacing: '3px',
        opacity: 0.8,
      }}>
        {label}
      </div>
    </motion.div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid',
      opacity: 0.8,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '8px',
        letterSpacing: '2px',
        marginBottom: '6px',
        opacity: 0.6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '16px',
        letterSpacing: '2px',
        fontWeight: '300',
      }}>
        {value}
      </div>
    </div>
  )
}