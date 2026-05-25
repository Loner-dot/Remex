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

  useEffect(() => {
    if (isLoggedIn && memberData) router.push('/dashboard')
  }, [isLoggedIn, memberData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Enter your credentials')
      return
    }
    setLoading(true)
    setError('')
    const { data } = await supabase
      .from('members')
      .select('*')
      .eq('username', username.toUpperCase())
      .eq('password', password)
      .eq('active', true)
      .single()
    if (data) {
      await supabase.from('members').update({ last_login: new Date().toISOString() }).eq('id', data.id)
      localStorage.setItem('zen_current_user', JSON.stringify(data))
      setMemberData(data)
      setIsLoggedIn(true)
      loadMembers()
      router.push('/dashboard')
    } else {
      setError('Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div className="avatar" style={{ 
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #4a4a4a, #1a1a1a)',
            fontSize: '24px',
          }}>
            ZN
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '-0.5px',
            marginBottom: '6px',
          }}>
            Zen Clan
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: '400',
          }}>
            Sign in to continue
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
              style={{ textTransform: 'uppercase', marginBottom: '8px' }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ marginBottom: error ? '8px' : '20px' }}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,59,48,0.1)',
                  color: '#ff3b30',
                  fontSize: '14px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                {error}
              </motion.div>
            )}
            <button type="submit" className="btn-zen" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>

        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '13px',
        }}>
          Zen Network
        </div>
      </div>
    </div>
  )
}