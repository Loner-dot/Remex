import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { generateMemberPassword, CLAN_RANKS } from '../lib/members'

export default function AdminPanel({ memberData, allMembers, isLoggedIn, loadMembers }) {
  const router = useRouter()
  const [newUsername, setNewUsername] = useState('')
  const [selectedRank, setSelectedRank] = useState('Recruit')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn || memberData?.rank !== 'Supreme Leader') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div className="avatar" style={{ width: '56px', height: '56px', margin: '0 auto 16px', background: 'rgba(255,59,48,0.2)' }}>//</div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ff3b30', marginBottom: '8px' }}>Access Denied</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Admin credentials required</p>
          <button className="btn-zen" onClick={() => router.push('/dashboard')}>Return</button>
        </div>
      </div>
    )
  }

  const generatePassword = () => {
    if (!newUsername) return
    setGeneratedPassword(generateMemberPassword(newUsername))
  }

  const addMember = async () => {
    if (!newUsername || !generatedPassword) { setMessage('Fill all fields'); return }
    setLoading(true)
    setMessage('')
    const { error } = await supabase.from('members').insert([{
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
    }])
    if (error) {
      setMessage(error.code === '23505' ? 'Username exists' : 'Error')
    } else {
      setMessage(`Added: ${newUsername}`)
      setNewUsername('')
      setGeneratedPassword('')
      loadMembers()
    }
    setLoading(false)
  }

  const toggleMember = async (id: string, active: boolean) => {
    await supabase.from('members').update({ active: !active }).eq('id', id)
    loadMembers()
  }

  const deleteMember = async (id: string) => {
    if (confirm('Delete permanently?')) {
      await supabase.from('members').delete().eq('id', id)
      loadMembers()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '24px',
          fontFamily: 'Inter, sans-serif',
        }}>
          ← Back
        </button>

        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', letterSpacing: '-0.5px' }}>
          Command Center
        </h1>

        {/* Add Member */}
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <div className="section-title">Add Member</div>
          <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Username" style={{ textTransform: 'uppercase' }} />
          <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
            {CLAN_RANKS.filter(r => r !== 'Supreme Leader').map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button className="btn-secondary" onClick={generatePassword} style={{ marginBottom: '8px' }}>
            Generate Password
          </button>
          {generatedPassword && (
            <div style={{
              padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
              marginBottom: '8px', fontFamily: 'Inter, monospace',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: '500' }}>PASSWORD</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>{generatedPassword}</div>
            </div>
          )}
          <button className="btn-zen" onClick={addMember} disabled={loading || !generatedPassword}>
            {loading ? 'Adding...' : 'Add to Clan'}
          </button>
          {message && (
            <div style={{
              marginTop: '12px', padding: '12px', borderRadius: '12px',
              background: message.includes('Error') || message.includes('exists') ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)',
              color: message.includes('Error') || message.includes('exists') ? '#ff3b30' : '#34c759',
              fontSize: '14px', textAlign: 'center', fontWeight: '500',
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="glass-card">
          <div className="section-title">Members ({allMembers.length})</div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allMembers.map((m: any) => (
              <div key={m.id} style={{
                padding: '14px', marginBottom: '8px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                      {m.username.substring(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff' }}>{m.username}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '500' }}>{m.rank}</div>
                    </div>
                  </div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.active ? '#34c759' : '#ff3b30' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => navigator.clipboard.writeText(`User: ${m.username} | Pass: ${m.password}`)} style={{
                    flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                    Copy
                  </button>
                  <button onClick={() => toggleMember(m.id, m.active)} style={{
                    padding: '8px 14px', borderRadius: '10px', border: 'none',
                    background: m.active ? 'rgba(255,255,255,0.06)' : 'rgba(52,199,89,0.1)',
                    color: m.active ? '#ffffff' : '#34c759', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                    {m.active ? 'Off' : 'On'}
                  </button>
                  {m.rank !== 'Supreme Leader' && (
                    <button onClick={() => deleteMember(m.id)} style={{
                      padding: '8px 14px', borderRadius: '10px', border: 'none',
                      background: 'rgba(255,59,48,0.1)', color: '#ff3b30', fontSize: '12px', fontWeight: '500',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}>
                      Del
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