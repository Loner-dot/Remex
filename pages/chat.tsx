import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Chat({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [friends, setFriends] = useState([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [requests, setRequests] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [tab, setTab] = useState<'chats' | 'requests' | 'add'>('chats')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
    loadFriends()
    loadRequests()
  }, [isLoggedIn])

  useEffect(() => {
    if (selectedChat) {
      loadMessages()
      const interval = setInterval(loadMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadFriends = async () => {
    const { data } = await supabase
      .from('friends')
      .select('*')
      .or(`user1.eq.${memberData?.username},user2.eq.${memberData?.username}`)
    if (data) {
      const friendList = data.map((f: any) =>
        f.user1 === memberData.username ? f.user2 : f.user1
      )
      setFriends(friendList)
    }
  }

  const loadRequests = async () => {
    const { data } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('to_user', memberData?.username)
      .eq('status', 'pending')
    if (data) setRequests(data)
  }

  const loadMessages = async () => {
    if (!selectedChat) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender.eq.${memberData?.username},receiver.eq.${memberData?.username}`)
      .order('created_at', { ascending: true })
    if (data) {
      const filtered = data.filter((m: any) =>
        (m.sender === memberData?.username && m.receiver === selectedChat) ||
        (m.sender === selectedChat && m.receiver === memberData?.username)
      )
      setMessages(filtered)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return
    await supabase.from('messages').insert([{
      sender: memberData.username,
      receiver: selectedChat,
      text: newMessage,
    }])
    setNewMessage('')
    loadMessages()
  }

  const searchUsers = async () => {
    if (!searchUser) return
    const { data } = await supabase
      .from('members')
      .select('username')
      .neq('username', memberData?.username)
      .ilike('username', `%${searchUser}%`)
      .limit(10)
    if (data) setSearchResults(data)
  }

  const sendFriendRequest = async (toUser: string) => {
    await supabase.from('friend_requests').insert([{
      from_user: memberData.username,
      to_user: toUser,
    }])
    alert('REQUEST SENT')
    setSearchUser('')
    setSearchResults([])
  }

  const acceptRequest = async (requestId: number, fromUser: string) => {
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId)
    await supabase.from('friends').insert([{
      user1: memberData.username,
      user2: fromUser,
    }])
    loadRequests()
    loadFriends()
  }

  const declineRequest = async (requestId: number) => {
    await supabase.from('friend_requests').update({ status: 'declined' }).eq('id', requestId)
    loadRequests()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '20px' }}>
        
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: '1px solid #1a1a1a', padding: '10px 20px',
          color: '#555555', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '3px', cursor: 'pointer', marginBottom: '20px',
        }}>
          BACK
        </button>

        <h1 style={{
          fontSize: '20px', fontWeight: '300', color: '#777777',
          letterSpacing: '8px', textTransform: 'uppercase',
          fontFamily: 'JetBrains Mono, monospace', marginBottom: '20px',
        }}>
          MESSAGES
        </h1>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { key: 'chats', label: 'CHATS' },
            { key: 'requests', label: `REQUESTS (${requests.length})` },
            { key: 'add', label: 'ADD' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              style={{
                flex: 1, padding: '10px',
                border: `1px solid ${tab === t.key ? '#444444' : '#1a1a1a'}`,
                background: 'none',
                color: tab === t.key ? '#888888' : '#444444',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                letterSpacing: '2px', cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'chats' && (
          <div>
            {!selectedChat ? (
              <div>
                {friends.length === 0 && (
                  <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#444444', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '2px' }}>
                      NO CHATS YET
                    </p>
                  </div>
                )}
                {friends.map(friend => (
                  <div
                    key={friend}
                    onClick={() => setSelectedChat(friend)}
                    className="glass-card"
                    style={{ marginBottom: '8px', cursor: 'pointer' }}
                  >
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                      color: '#888888', letterSpacing: '2px',
                    }}>
                      {friend}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedChat(null)} style={{
                  background: 'none', border: '1px solid #1a1a1a', padding: '8px 15px',
                  color: '#555555', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  letterSpacing: '2px', cursor: 'pointer', marginBottom: '15px',
                }}>
                  BACK TO CHATS
                </button>
                
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: '#777777', letterSpacing: '3px', marginBottom: '15px',
                }}>
                  {selectedChat}
                </div>

                <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '15px' }}>
                  {messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.sender === memberData?.username ? 'flex-end' : 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        border: '1px solid #1a1a1a',
                        background: msg.sender === memberData?.username ? '#0a0a0a' : '#050505',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                        color: '#888888', letterSpacing: '1px',
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="TYPE MESSAGE..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <button onClick={sendMessage} style={{
                    padding: '16px 20px', border: '1px solid #333333',
                    background: '#080808', color: '#888888',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                    letterSpacing: '3px', cursor: 'pointer',
                  }}>
                    SEND
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div>
            {requests.length === 0 && (
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <p style={{ color: '#444444', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '2px' }}>
                  NO PENDING REQUESTS
                </p>
              </div>
            )}
            {requests.map((req: any) => (
              <div key={req.id} className="glass-card" style={{ marginBottom: '8px' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: '#888888', letterSpacing: '2px', marginBottom: '10px',
                }}>
                  {req.from_user}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => acceptRequest(req.id, req.from_user)} style={{
                    flex: 1, padding: '8px', border: '1px solid #2a2a2a',
                    background: 'none', color: '#888888',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                    letterSpacing: '2px', cursor: 'pointer',
                  }}>
                    ACCEPT
                  </button>
                  <button onClick={() => declineRequest(req.id)} style={{
                    flex: 1, padding: '8px', border: '1px solid #1a0000',
                    background: 'none', color: '#660000',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                    letterSpacing: '2px', cursor: 'pointer',
                  }}>
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'add' && (
          <div className="glass-card">
            <input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="SEARCH USERNAME"
            />
            <button className="btn-zen" onClick={searchUsers} style={{ marginBottom: '15px' }}>
              SEARCH
            </button>
            {searchResults.map((user: any) => (
              <div
                key={user.username}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', border: '1px solid #1a1a1a', marginBottom: '6px',
                }}
              >
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: '#888888', letterSpacing: '2px',
                }}>
                  {user.username}
                </span>
                <button onClick={() => sendFriendRequest(user.username)} style={{
                  padding: '6px 12px', border: '1px solid #2a2a2a',
                  background: 'none', color: '#888888',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                  letterSpacing: '2px', cursor: 'pointer',
                }}>
                  ADD
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}