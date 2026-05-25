import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Chat({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [friends, setFriends] = useState<string[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [requests, setRequests] = useState<any[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [tab, setTab] = useState<'chats' | 'requests' | 'add'>('chats')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadFriends()
    loadRequests()
  }, [isLoggedIn])

  useEffect(() => {
    if (selectedChat) {
      loadMessages()
      const interval = setInterval(loadMessages, 2000)
      return () => clearInterval(interval)
    }
  }, [selectedChat])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const loadFriends = async () => {
    const { data } = await supabase.from('friends').select('*').or(`user1.eq.${memberData?.username},user2.eq.${memberData?.username}`)
    if (data) setFriends(data.map((f: any) => f.user1 === memberData.username ? f.user2 : f.user1))
  }

  const loadRequests = async () => {
    const { data } = await supabase.from('friend_requests').select('*').eq('to_user', memberData?.username).eq('status', 'pending')
    if (data) setRequests(data)
  }

  const loadMessages = async () => {
    if (!selectedChat) return
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
    if (data) {
      setMessages(data.filter((m: any) =>
        (m.sender === memberData?.username && m.receiver === selectedChat) ||
        (m.sender === selectedChat && m.receiver === memberData?.username)
      ))
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    await supabase.from('messages').insert([{ sender: memberData.username, receiver: selectedChat, text: newMessage }])
    setNewMessage('')
    loadMessages()
  }

  const searchUsers = async () => {
    if (!searchUser) return
    const { data } = await supabase.from('members').select('username').neq('username', memberData?.username).ilike('username', `%${searchUser}%`).limit(10)
    if (data) setSearchResults(data)
  }

  const sendRequest = async (to: string) => {
    await supabase.from('friend_requests').insert([{ from_user: memberData.username, to_user: to }])
    alert('Request sent')
    setSearchUser('')
    setSearchResults([])
  }

  const acceptRequest = async (id: number, from: string) => {
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', id)
    await supabase.from('friends').insert([{ user1: memberData.username, user2: from }])
    loadRequests()
    loadFriends()
  }

  const declineRequest = async (id: number) => {
    await supabase.from('friend_requests').update({ status: 'declined' }).eq('id', id)
    loadRequests()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
          fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '20px',
          fontFamily: 'Inter, sans-serif',
        }}>← Back</button>

        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', marginBottom: '20px', letterSpacing: '-0.5px' }}>Messages</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { key: 'chats', label: 'Chats' },
            { key: 'requests', label: `Requests (${requests.length})` },
            { key: 'add', label: 'Add' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              flex: 1, padding: '12px', borderRadius: '14px', border: 'none',
              background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: tab === t.key ? '#ffffff' : 'rgba(255,255,255,0.5)',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Chats */}
        {tab === 'chats' && (
          <div>
            {!selectedChat ? (
              friends.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No chats yet</p>
                </div>
              ) : (
                friends.map(f => (
                  <motion.div key={f} whileTap={{ scale: 0.98 }} className="glass-card"
                    onClick={() => setSelectedChat(f)}
                    style={{ marginBottom: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '14px' }}>{f.substring(0, 2)}</div>
                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#ffffff' }}>{f}</div>
                  </motion.div>
                ))
              )
            ) : (
              <div>
                <button onClick={() => setSelectedChat(null)} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                  fontSize: '14px', cursor: 'pointer', marginBottom: '16px',
                  fontFamily: 'Inter, sans-serif',
                }}>← Back</button>
                <div style={{ fontWeight: '600', fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>{selectedChat}</div>
                <div style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '12px' }}>
                  {messages.map((m: any) => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === memberData?.username ? 'flex-end' : 'flex-start', marginBottom: '6px' }}>
                      <div className={m.sender === memberData?.username ? 'message-bubble-sent' : 'message-bubble-received'}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..." style={{ flex: 1, marginBottom: 0 }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                  <button onClick={sendMessage} className="btn-zen" style={{ width: 'auto', padding: '16px 24px' }}>Send</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Requests */}
        {tab === 'requests' && (
          <div>
            {requests.length === 0 && (
              <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No pending requests</p>
              </div>
            )}
            {requests.map((r: any) => (
              <div key={r.id} className="glass-card" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '13px' }}>{r.from_user.substring(0, 2)}</div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff' }}>{r.from_user}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => acceptRequest(r.id, r.from_user)} className="btn-zen" style={{ flex: 1, fontSize: '14px', padding: '12px' }}>Accept</button>
                  <button onClick={() => declineRequest(r.id)} className="btn-danger" style={{ flex: 1, fontSize: '14px', padding: '12px' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add */}
        {tab === 'add' && (
          <div className="glass-card">
            <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search username" />
            <button className="btn-secondary" onClick={searchUsers} style={{ marginBottom: '12px' }}>Search</button>
            {searchResults.map((u: any) => (
              <div key={u.username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '12px' }}>{u.username.substring(0, 2)}</div>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff' }}>{u.username}</span>
                </div>
                <button onClick={() => sendRequest(u.username)} className="btn-secondary" style={{ width: 'auto', padding: '10px 18px', fontSize: '13px' }}>Add</button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}