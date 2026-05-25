import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Home({ 
  isLoggedIn, setIsLoggedIn, 
  memberData, setMemberData,
  allMembers, setAllMembers,
  loadMembers
}) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('ENTER CREDENTIALS')
      return
    }

    setLoading(true)
    setError('')

    const { data, error: dbError } = await supabase
      .from('members')
      .select('*')
      .eq('username', username.toUpperCase())
      .eq('password', password)
      .eq('active', true)
      .single()

    if (data) {
      await supabase
        .from('members')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id)

      localStorage.setItem('zen_current_user', JSON.stringify(data))
      setMemberData(data)
      setIsLoggedIn(true)
      loadMembers()
      router.push('/dashboard')
    } else {
      setError('INVALID CREDENTIALS')
    }
    setLoading(false)
  }

  if (isLoggedIn && memberData) {
    router.push('/dashboard')
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 30px',
            border: '1px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color: '#666666',
              fontSize: '24px',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '6px',
            }}>
              ZN
            </span>
          </div>
          
          <h1 className="zen-title" style={{
            fontSize: '26px',
            color: '#777777',
            marginBottom: '12px',
          }}>
            ZEN CLAN
          </h1>
          
          <div style={{
            width: '30px',
            height: '1px',
            background: '#2a2a2a',
            margin: '20px auto',
          }} />
          
          <p style={{
            color: '#3a3a3a',
            fontSize: '10px',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            Access Terminal
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              autoFocus
              style={{ textTransform: 'uppercase' }}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  border: '1px solid #2a0000',
                  padding: '14px',
                  marginBottom: '18px',
                  color: '#660000',
                  fontSize: '10px',
                  textAlign: 'center',
                  letterSpacing: '3px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              className="btn-zen"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER'}
            </button>
          </form>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          color: '#1a1a1a',
          fontSize: '9px',
          letterSpacing: '4px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          SYS {time} // ZEN NETWORK
        </div>

      </div>
    </div>
  )
}