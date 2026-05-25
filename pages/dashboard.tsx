import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import MusicPlayer from '../components/MusicPlayer'

export default function Dashboard({ memberData, isLoggedIn, setIsLoggedIn, setMemberData }) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn])

  const logout = () => {
    localStorage.removeItem('zen_current_user')
    setMemberData(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  if (!memberData) return null

  const menuItems = [
    { label: 'Aura Scanner', route: '/aura-scanner' },
    { label: 'Profile Card', route: '/profile-card' },
    { label: 'Confessions', route: '/confessions' },
    { label: 'Leaderboard', route: '/leaderboard' },
    { label: 'Polls', route: '/polls' },
    { label: 'Messages', route: '/chat' },
    { label: 'Themes', route: '/themes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="avatar" style={{ 
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #3a3a3a, #1a1a1a)',
            }}>
              {memberData.username.substring(0, 2)}
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                letterSpacing: '-0.3px',
              }}>
                {memberData.username}
              </h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span className="chip">{memberData.rank}</span>
                <span className="chip" style={{ opacity: 0.6 }}>Lv.{memberData.level}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(255,59,48,0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#ff3b30',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Exit
          </button>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.route}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileTap={{ scale: 0.97 }}
              className="glass-card"
              onClick={() => router.push(item.route)}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '22px 16px',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#ffffff',
                letterSpacing: '-0.2px',
              }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin Button */}
        {memberData.rank === 'Supreme Leader' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="btn-zen"
            onClick={() => router.push('/admin')}
            style={{ marginBottom: '24px' }}
          >
            Command Center
          </motion.button>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <div className="section-title">Statistics</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <StatBox label="Aura" value={memberData.aura} />
            <StatBox label="XP" value={memberData.xp.toLocaleString()} />
            <StatBox label="Level" value={memberData.level} />
            <StatBox label="Status" value="Active" />
          </div>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          color: 'rgba(255,255,255,0.15)',
          fontSize: '13px',
          fontWeight: '400',
        }}>
          Zen Clan
        </div>

      </div>
      <MusicPlayer />
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.03)',
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#ffffff',
        letterSpacing: '-0.3px',
      }}>
        {value}
      </div>
    </div>
  )
}