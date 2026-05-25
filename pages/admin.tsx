import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { generateMemberPassword, CLAN_RANKS } from '../lib/members'

export default function AdminPanel({ 
  memberData, allMembers, setAllMembers,
  isLoggedIn 
}) {
  const router = useRouter()
  const [newUsername, setNewUsername] = useState('')
  const [selectedRank, setSelectedRank] = useState('Cyber Recruit')
  const [newMemberPassword, setNewMemberPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [copiedId, setCopiedId] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [announcements, setAnnouncements] = useState([
    '⚠️ New mission briefing at 2200 hours',
    '🎉 Clan War Event this weekend',
    '🆕 New member ranks available',
  ])

  // Check if user is admin (Supreme Leader)
  if (!isLoggedIn || memberData?.rank !== 'Supreme Leader') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '70px' }}>🚫</div>
          <h2 style={{ color: '#ff0044', fontSize: '24px', marginTop: '20px', marginBottom: '10px' }}>
            ACCESS DENIED
          </h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Only the Supreme Leader can access this area
          </p>
          <button className="btn-neon" onClick={() => router.push('/dashboard')}>
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    )
  }

  const generateNewPassword = () => {
    const password = generateMemberPassword(newUsername, selectedRank)
    setNewMemberPassword(password)
  }

  const addNewMember = () => {
    if (!newUsername || !newMemberPassword) return
    
    const newMember = {
      id: `member_${Date.now()}`,
      username: newUsername,
      password: newMemberPassword,
      rank: selectedRank,
      avatar: '🦅',
      aura: 'Mystic Fire',
      level: 1,
      xp: 0,
      active: true,
      createdAt: new Date().toISOString(),
    }
    
    const updatedMembers = [...allMembers, newMember]
    localStorage.setItem('clan_members', JSON.stringify(updatedMembers))
    setAllMembers(updatedMembers)
    
    // Reset form
    setNewUsername('')
    setNewMemberPassword('')
    setSelectedRank('Cyber Recruit')
    
    // Show success
    alert(`✅ Member created!\nUsername: ${newUsername}\nPassword: ${newMemberPassword}`)
  }

  const toggleMemberStatus = (memberId: string) => {
    const updated = allMembers.map(m => 
      m.id === memberId ? { ...m, active: !m.active } : m
    )
    localStorage.setItem('clan_members', JSON.stringify(updated))
    setAllMembers(updated)
  }

  const deleteMember = (memberId: string) => {
    if (confirm('Delete this member permanently?')) {
      const updated = allMembers.filter(m => m.id !== memberId)
      localStorage.setItem('clan_members', JSON.stringify(updated))
      setAllMembers(updated)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  const addAnnouncement = () => {
    if (!announcement) return
    setAnnouncements([announcement, ...announcements])
    setAnnouncement('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ff0044, #ff2d95)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '5px',
          }}>
            👑 SUPREME COMMAND
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Welcome back, {memberData?.username}
          </p>
        </motion.div>

        {/* CREATE NEW MEMBER */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-card glow-purple"
          style={{ marginBottom: '20px' }}
        >
          <h2 style={{ 
            color: '#9b30ff', 
            fontSize: '20px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span>➕</span> Generate Member Password
          </h2>

          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Member username..."
          />

          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
          >
            {CLAN_RANKS.filter(r => r !== 'Supreme Leader').map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>

          <button
            className="btn-neon btn-blue"
            onClick={generateNewPassword}
            disabled={!newUsername}
            style={{ marginBottom: '12px' }}
          >
            GENERATE PASSWORD
          </button>

          {newMemberPassword && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: 'rgba(0, 212, 255, 0.15)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '12px',
              }}
            >
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                GENERATED PASSWORD:
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '8px',
                padding: '12px',
              }}>
                <code style={{ 
                  color: '#00d4ff', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  {newMemberPassword}
                </code>
                <button
                  onClick={() => copyToClipboard(newMemberPassword, 'new')}
                  style={{
                    background: 'rgba(0,212,255,0.3)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 15px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {copiedId === 'new' ? '✅' : '📋'}
                </button>
              </div>
            </motion.div>
          )}

          <button
            className="btn-neon"
            onClick={addNewMember}
            disabled={!newUsername || !newMemberPassword}
          >
            ADD MEMBER TO CLAN
          </button>
        </motion.div>

        {/* ANNOUNCEMENTS */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{ marginBottom: '20px' }}
        >
          <h2 style={{ color: '#ff2d95', fontSize: '20px', marginBottom: '15px' }}>
            📢 Post Announcement
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type announcement..."
              style={{ marginBottom: 0 }}
            />
            <button
              className="btn-neon"
              onClick={addAnnouncement}
              style={{ width: 'auto', padding: '15px 20px' }}
            >
              POST
            </button>
          </div>
          <div style={{ marginTop: '15px' }}>
            {announcements.map((ann, i) => (
              <div key={i} style={{
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '10px',
                background: 'rgba(255,45,149,0.1)',
                fontSize: '14px',
              }}>
                {ann}
              </div>
            ))}
          </div>
        </motion.div>

        {/* MEMBER LIST */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h2 style={{ color: '#ff2d95', fontSize: '20px', marginBottom: '15px' }}>
            👥 Clan Members ({allMembers.length})
          </h2>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {allMembers.map(member => (
              <div
                key={member.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '12px',
                  background: member.active 
                    ? 'rgba(155,48,255,0.1)' 
                    : 'rgba(255,0,68,0.1)',
                  border: `1px solid ${
                    member.active 
                      ? 'rgba(155,48,255,0.2)' 
                      : 'rgba(255,0,68,0.2)'
                  }`,
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{member.avatar}</span>
                      <strong style={{ fontSize: '16px' }}>{member.username}</strong>
                      <span style={{
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        background: member.rank === 'Supreme Leader' 
                          ? 'rgba(255,215,0,0.2)' 
                          : 'rgba(155,48,255,0.2)',
                        color: member.rank === 'Supreme Leader' ? '#ffd700' : '#9b30ff',
                      }}>
                        {member.rank}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: member.active ? '#00ff88' : '#ff0044',
                  }} />
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  marginTop: '10px',
                }}>
                  <button
                    onClick={() => copyToClipboard(member.password, member.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(0,212,255,0.2)',
                      color: '#00d4ff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {copiedId === member.id ? '✅ Copied!' : '📋 Password'}
                  </button>
                  
                  <button
                    onClick={() => toggleMemberStatus(member.id)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      background: member.active 
                        ? 'rgba(255,0,68,0.2)' 
                        : 'rgba(0,255,136,0.2)',
                      color: member.active ? '#ff0044' : '#00ff88',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {member.active ? '❌' : '✅'}
                  </button>
                  
                  {member.rank !== 'Supreme Leader' && (
                    <button
                      onClick={() => deleteMember(member.id)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(255,0,68,0.2)',
                        color: '#ff0044',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <button
          className="btn-neon"
          onClick={() => router.push('/dashboard')}
          style={{ marginTop: '20px' }}
        >
          BACK TO DASHBOARD
        </button>

      </div>
    </div>
  )
}