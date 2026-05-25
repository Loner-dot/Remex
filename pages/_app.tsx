import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const THEMES: any = {
  void: { bg: '#000000', card: 'rgba(5,5,5,0.92)', border: '#1a1a1a', text: '#888888', accent: '#555555', tag: '#444444', inputBg: '#050505', btnBg: '#080808', btnBorder: '#2a2a2a', btnText: '#aaaaaa' },
  blood: { bg: '#0a0000', card: 'rgba(15,0,0,0.92)', border: '#2a0000', text: '#996666', accent: '#660000', tag: '#440000', inputBg: '#0a0000', btnBg: '#0d0000', btnBorder: '#330000', btnText: '#aa6666' },
  ghost: { bg: '#0a0a0f', card: 'rgba(10,10,20,0.92)', border: '#1a1a2e', text: '#8888aa', accent: '#555577', tag: '#333355', inputBg: '#080810', btnBg: '#0a0a12', btnBorder: '#1a1a30', btnText: '#9999bb' },
  ash: { bg: '#0f0f0f', card: 'rgba(20,20,20,0.92)', border: '#2a2a2a', text: '#999999', accent: '#666666', tag: '#444444', inputBg: '#0a0a0a', btnBg: '#111111', btnBorder: '#333333', btnText: '#aaaaaa' },
  abyss: { bg: '#000510', card: 'rgba(0,5,20,0.92)', border: '#0a1530', text: '#7788aa', accent: '#445566', tag: '#223344', inputBg: '#000510', btnBg: '#020818', btnBorder: '#0a1530', btnText: '#8899bb' },
  rust: { bg: '#0a0505', card: 'rgba(15,8,5,0.92)', border: '#2a1510', text: '#998877', accent: '#665544', tag: '#443322', inputBg: '#0a0503', btnBg: '#0f0805', btnBorder: '#2a1510', btnText: '#aa9988' },
  moss: { bg: '#050a05', card: 'rgba(5,10,5,0.92)', border: '#102010', text: '#778877', accent: '#445544', tag: '#223322', inputBg: '#030803', btnBg: '#050d05', btnBorder: '#102010', btnText: '#889988' },
  ink: { bg: '#000005', card: 'rgba(2,2,8,0.92)', border: '#101025', text: '#8888cc', accent: '#444488', tag: '#222255', inputBg: '#020208', btnBg: '#040410', btnBorder: '#151530', btnText: '#9999dd' },
}

export default function App({ Component, pageProps, router }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberData, setMemberData] = useState<any>(null)
  const [allMembers, setAllMembers] = useState([])
  const [theme, setTheme] = useState<any>(THEMES.void)

  useEffect(() => {
    const savedUser = localStorage.getItem('zen_current_user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setMemberData(parsed)
      setIsLoggedIn(true)
      if (parsed.theme && THEMES[parsed.theme]) {
        setTheme(THEMES[parsed.theme])
      }
    }
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const { data } = await supabase.from('members').select('*')
    if (data) setAllMembers(data)
  }

  const updateMemberData = (data: any) => {
    setMemberData(data)
    if (data?.theme && THEMES[data.theme]) {
      setTheme(THEMES[data.theme])
    }
  }

  return (
    <div style={{
      background: theme.bg,
      minHeight: '100vh',
    }}>
      <style>{`
        body { background: ${theme.bg}; }
        .glass-card { background: ${theme.card}; border-color: ${theme.border}; }
        .btn-zen { background: ${theme.btnBg}; border-color: ${theme.btnBorder}; color: ${theme.btnText}; }
        input, select, textarea { background: ${theme.inputBg}; border-color: ${theme.border}; color: ${theme.text}; }
        input:focus, select:focus { border-color: ${theme.accent}; background: ${theme.btnBg}; color: ${theme.text}; }
        input::placeholder { color: ${theme.tag}; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; }
        .zen-divider { background: ${theme.border}; }
        .zen-tag { color: ${theme.tag}; }
      `}</style>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Component 
            {...pageProps} 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            memberData={memberData}
            setMemberData={updateMemberData}
            allMembers={allMembers}
            setAllMembers={setAllMembers}
            loadMembers={loadMembers}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}