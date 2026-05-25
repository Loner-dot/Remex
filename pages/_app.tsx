import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps, router }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberData, setMemberData] = useState(null)
  const [allMembers, setAllMembers] = useState([])

  // Load data from localStorage on app start
  useEffect(() => {
    // Load current user
    const savedUser = localStorage.getItem('clan_current_user')
    if (savedUser) {
      setMemberData(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
    
    // Load all members
    const savedMembers = localStorage.getItem('clan_members')
    if (savedMembers) {
      setAllMembers(JSON.parse(savedMembers))
    } else {
      // If no members exist, create initial admin
      const { initialMembers } = require('../lib/members')
      localStorage.setItem('clan_members', JSON.stringify(initialMembers))
      setAllMembers(initialMembers)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Component 
          {...pageProps} 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          memberData={memberData}
          setMemberData={setMemberData}
          allMembers={allMembers}
          setAllMembers={setAllMembers}
        />
      </motion.div>
    </AnimatePresence>
  )
}