import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps, router }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberData, setMemberData] = useState(null)
  const [allMembers, setAllMembers] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('zen_current_user')
    if (savedUser) {
      setMemberData(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const { data } = await supabase.from('members').select('*')
    if (data) setAllMembers(data)
  }

  return (
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
          setMemberData={setMemberData}
          allMembers={allMembers}
          setAllMembers={setAllMembers}
          loadMembers={loadMembers}
        />
      </motion.div>
    </AnimatePresence>
  )
}