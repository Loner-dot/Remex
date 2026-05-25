import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const THEMES = {
  void: {
    name: 'VOID',
    bg: '#000000',
    card: 'rgba(5, 5, 5, 0.92)',
    border: '#1a1a1a',
    text: '#888888',
    accent: '#555555',
    tag: '#444444',
  },
  blood: {
    name: 'BLOOD',
    bg: '#0a0000',
    card: 'rgba(15, 0, 0, 0.92)',
    border: '#2a0000',
    text: '#996666',
    accent: '#660000',
    tag: '#440000',
  },
  ghost: {
    name: 'GHOST',
    bg: '#0a0a0f',
    card: 'rgba(10, 10, 20, 0.92)',
    border: '#1a1a2e',
    text: '#8888aa',
    accent: '#555577',
    tag: '#333355',
  },
  ash: {
    name: 'ASH',
    bg: '#0f0f0f',
    card: 'rgba(20, 20, 20, 0.92)',
    border: '#2a2a2a',
    text: '#999999',
    accent: '#666666',
    tag: '#444444',
  },
  abyss: {
    name: 'ABYSS',
    bg: '#000510',
    card: 'rgba(0, 5, 20, 0.92)',
    border: '#0a1530',
    text: '#7788aa',
    accent: '#445566',
    tag: '#223344',
  },
  rust: {
    name: 'RUST',
    bg: '#0a0505',
    card: 'rgba(15, 8, 5, 0.92)',
    border: '#2a1510',
    text: '#998877',
    accent: '#665544',
    tag: '#443322',
  },
  moss: {
    name: 'MOSS',
    bg: '#050a05',
    card: 'rgba(5, 10, 5, 0.92)',
    border: '#102010',
    text: '#778877',
    accent: '#445544',
    tag: '#223322',
  },
  ink: {
    name: 'INK',
    bg: '#000005',
    card: 'rgba(2, 2, 8, 0.92)',
    border: '#101025',
    text: '#8888cc',
    accent: '#444488',
    tag: '#222255',
  },
}

export default function Themes({ memberData, isLoggedIn, setMemberData }) {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState('void')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    if (memberData?.theme) setSelectedTheme(memberData.theme)
  }, [isLoggedIn, memberData])

  const saveTheme = async () => {
    await supabase
      .from('members')
      .update({ theme: selectedTheme })
      .eq('id', memberData.id)

    const updated = { ...memberData, theme: selectedTheme }
    localStorage.setItem('zen_current_user', JSON.stringify(updated))
    setMemberData(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentTheme = THEMES[selectedTheme] || THEMES.void

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: '1px solid #1a1a1a', padding: '10px 20px',
          color: '#555555', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '3px', cursor: 'pointer', marginBottom: '30px',
        }}>
          BACK
        </button>

        <h1 style={{
          fontSize: '20px', fontWeight: '300', color: '#777777',
          letterSpacing: '8px', textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px',
        }}>
          THEMES
        </h1>
        <div style={{ width: '25px', height: '1px', background: '#2a2a2a', marginBottom: '30px' }} />

        {/* Preview */}
        <div style={{
          padding: '24px',
          border: `1px solid ${currentTheme.border}`,
          background: currentTheme.card,
          marginBottom: '25px',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: currentTheme.tag,
            letterSpacing: '3px',
            marginBottom: '12px',
          }}>
            PREVIEW
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            color: currentTheme.text,
            letterSpacing: '3px',
            marginBottom: '10px',
          }}>
            {memberData?.username}
          </div>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            border: `1px solid ${currentTheme.border}`,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '8px',
            color: currentTheme.accent,
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            {memberData?.rank?.toUpperCase()}
          </div>
          <div style={{
            width: '100%',
            height: '1px',
            background: currentTheme.border,
            marginBottom: '12px',
          }} />
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            color: currentTheme.tag,
            letterSpacing: '2px',
          }}>
            SAMPLE TEXT DISPLAY
          </div>
        </div>

        {/* Theme Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '25px',
        }}>
          {Object.entries(THEMES).map(([key, theme]) => (
            <motion.div
              key={key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(key)}
              style={{
                padding: '20px',
                border: `1px solid ${selectedTheme === key ? theme.accent : '#1a1a1a'}`,
                background: theme.card,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                background: theme.accent,
                margin: '0 auto 10px',
                border: `1px solid ${theme.border}`,
              }} />
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: theme.text,
                letterSpacing: '3px',
              }}>
                {theme.name}
              </div>
            </motion.div>
          ))}
        </div>

        <button className="btn-zen" onClick={saveTheme}>
          {saved ? 'SAVED' : 'APPLY THEME'}
        </button>

      </div>
    </div>
  )
}