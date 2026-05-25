import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { generateMemberPassword, CLAN_RANKS } from '../lib/members'

export default function AdminPanel({ 
  memberData, allMembers, setAllMembers,
  isLoggedIn, loadMembers 
}) {
  const router = useRouter()
  const [newUsername, setNewUsername] = useState('')
  const [selectedRank, setSelectedRank] = useState('Recruit')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn || memberData?.rank !== 'Supreme Leader') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            color: '#660000',
            fontSize: '40px',
            marginBottom: '20px',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            //
          </div>
          <h2 style={{
            color: '#660000',
            fontSize: '14px',
            letterSpacing: '5px',
            marginBottom: '25px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '300',
          }}>
            ACCESS DENIED
          </h2>
          <button className="btn-zen" onClick={() => router.push('/dashboard')}>
            RETURN
          </button>
        </div>
      </div>
    )
  }

  const generatePassword = () => {
    if (!newUsername) return
    const password = generateMemberPassword(newUsername)
    setGeneratedPassword(password)
  }

  const addMember = async () => {
    if (!newUsername || !generatedPassword) {
      setMessage('FILL ALL FIELDS')
      return
    }

    setLoading(true)
    setMessage('')

    const newMember = {
      id: `zen_${Date.now()}`,
      username: newUsername.toUpperCase(),
      password: generatedPassword,
      rank: selectedRank,
      avatar: newUsername.substring(0, 2).toUpperCase(),
      aura: 'Dark',
      level: 1,
      xp: 0,
      active: true,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('members').insert([newMember])

    if (error) {
      if (error.code === '23505') {
        setMessage('ERROR: USERNAME EXISTS')
      } else {
        setMessage('ERROR: TRY AGAIN')
      }
    } else {
      setMessage(`ADDED: ${newUsername} | ${generatedPassword}`)
      setNewUsername('')
      setGeneratedPassword('')
      loadMembers()
    }
    setLoading(false)
  }

  const toggleMember = async (memberId: string, currentActive: boolean) => {
    await supabase
      .from('members')
      .update({ active: !currentActive })
      .eq('id', memberId)
    loadMembers()
  }

  const deleteMember = async (memberId: string) => {
    if (confirm('DELETE THIS MEMBER PERMANENTLY?')) {
      await supabase.from('members').delete().eq('id', memberId)
      loadMembers()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '30px' }}>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: '40px' }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'none',
              border: '1px solid #1a1a1a',
              padding: '10px 20px',
              color: '#555555',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              letterSpacing: '3px',
              cursor: 'pointer',
              marginBottom: '30px',
            }}
          >
            BACK
          </button>
          
          <h1 style={{
            fontSize: '22px',
            fontWeight: '300',
            color: '#777777',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            COMMAND CENTER
          </h1>
          <div style={{ width: '25px', height: '1px', background: '#2a2a2a', marginTop: '15px' }} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card"
          style={{ marginBottom: '30px' }}
        >
          <h3 style={{
            color: '#555555',
            fontSize: '10px',
            letterSpacing: '4px',
            marginBottom: '25px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '300',
          }}>
            ADD MEMBER
          </h3>

          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="USERNAME"
            style={{ textTransform: 'uppercase' }}
          />

          <select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
          >
            {CLAN_RANKS.filter(r => r !== 'Supreme Leader').map(rank => (
              <option key={rank} value={rank}>{rank.toUpperCase()}</option>
            ))}
          </select>

          <button className="btn-zen" onClick={generatePassword} style={{ marginBottom: '12px' }}>
            GENERATE PASSWORD
          </button>

          {generatedPassword && (
            <div style={{
              background: '#050505',
              border: '1px solid #1a1a1a',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <p style={{
                color: '#3a3a3a',
                fontSize: '9px',
                letterSpacing: '3px',
                marginBottom: '8px',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                PASSWORD
              </p>
              <code style={{ 
                color: '#888888', 
                fontSize: '13px',
                letterSpacing: '2px',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {generatedPassword}
              </code>
            </div>
          )}

          <button 
            className="btn-zen" 
            onClick={addMember}
            disabled={loading || !generatedPassword}
          >
            {loading ? 'ADDING...' : 'ADD TO CLAN'}
          </button>

          {message && (
            <div style={{
              marginTop: '15px',
              padding: '14px',
              border: `1px solid ${message.includes('ERROR') ? '#2a0000' : '#1a1a1a'}`,
              color: message.includes('ERROR') ? '#660000' : '#666666',
              fontSize: '10px',
              letterSpacing: '2px',
              fontFamily: 'JetBrains Mono, monospace',
              textAlign: 'center',
            }}>
              {message}
            </div>
          )}
        </motion.div>

        <div className="glass-card">
          <h3 style={{
            color: '#555555',
            fontSize: '10px',
            letterSpacing: '4px',
            marginBottom: '25px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '300',
          }}>
            MEMBERS ({allMembers.length})
          </h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allMembers.map(member => (
              <div
                key={member.id}
                style={{
                  padding: '16px',
                  marginBottom: '8px',
                  border: '1px solid #111111',
                  background: '#050505',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <div>
                    <span style={{
                      color: '#888888',
                      fontSize: '12px',
                      letterSpacing: '2px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {member.username}
                    </span>
                    <span style={{
                      marginLeft: '12px',
                      fontSize: '8px',
                      color: '#444444',
                      letterSpacing: '2px',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {member.rank.toUpperCase()}
                    </span>
                  </div>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    background: member.active ? '#333333' : '#1a0000',
                  }} />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `USER: ${member.username} | PASS: ${member.password}`
                      )
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #1a1a1a',
                      background: 'none',
                      color: '#666666',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '9px',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                    }}
                  >
                    COPY
                  </button>
                  
                  <button
                    onClick={() => toggleMember(member.id, member.active)}
                    style={{
                      padding: '8px 14px',
                      border: '1px solid #1a1a1a',
                      background: 'none',
                      color: member.active ? '#666666' : '#333333',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '9px',
                      cursor: 'pointer',
                    }}
                  >
                    {member.active ? 'ON' : 'OFF'}
                  </button>
                  
                  {member.rank !== 'Supreme Leader' && (
                    <button
                      onClick={() => deleteMember(member.id)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid #1a0000',
                        background: 'none',
                        color: '#660000',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '9px',
                        cursor: 'pointer',
                      }}
                    >
                      DEL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}