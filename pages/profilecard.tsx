import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function ProfileCard({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [quote, setQuote] = useState('')
  const [glowColor, setGlowColor] = useState('#ff2d95')
  const [bgStyle, setBgStyle] = useState('cyber')
  const [cardGenerated, setCardGenerated] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn])

  const generateCard = () => {
    setCardGenerated(true)
  }

  const downloadCard = () => {
    alert('📸 Screenshot this card to save it!')
  }

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: `${memberData?.username}'s Clan Card`,
        text: `Check out my Shadow Syndicate profile card!\nRank: ${memberData?.rank}\nAura: ${memberData?.aura}`,
      })
    }
  }

  const backgroundStyles = {
    cyber: 'linear-gradient(135deg, #1a0033 0%, #0a0a1a 50%, #1a0033 100%)',
    neon: 'linear-gradient(135deg, #ff2d9511 0%, #9b30ff11 100%)',
    void: 'linear-gradient(135deg, #000000 0%, #1a0a2e 100%)',
    matrix: 'linear-gradient(135deg, #003300 0%, #000000 100%)',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'rgba(255,45,149,0.2)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            color: '#ff2d95',
            marginBottom: '30px',
            cursor: 'pointer',
          }}
        >
          ⬅️ Back
        </button>

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: '32px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ff2d95, #9b30ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '30px',
          }}
        >
          💳 PROFILE CARD GENERATOR
        </motion.h1>

        {/* Customization Panel */}
        {!cardGenerated && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{ marginBottom: '20px' }}
          >
            <h3 style={{ color: '#ff2d95', marginBottom: '20px', fontSize: '18px' }}>
              🎨 Customize Your Card
            </h3>

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              Your Quote
            </label>
            <input
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your quote..."
              maxLength={50}
            />

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              Glow Color
            </label>
            <select value={glowColor} onChange={(e) => setGlowColor(e.target.value)}>
              <option value="#ff2d95">Neon Pink</option>
              <option value="#9b30ff">Neon Purple</option>
              <option value="#00d4ff">Cyber Blue</option>
              <option value="#ff0044">Red Alert</option>
              <option value="#00ff88">Matrix Green</option>
            </select>

            <label style={{ color: '#888', fontSize: '13px', marginBottom: '5px', display: 'block' }}>
              Background Style
            </label>
            <select value={bgStyle} onChange={(e) => setBgStyle(e.target.value)}>
              <option value="cyber">Cyberpunk</option>
              <option value="neon">Neon Lights</option>
              <option value="void">Dark Void</option>
              <option value="matrix">Matrix</option>
            </select>

            <button onClick={generateCard} className="btn-neon" style={{ marginTop: '15px' }}>
              GENERATE CARD
            </button>
          </motion.div>
        )}

        {/* Generated Card */}
        {cardGenerated && (
          <motion.div
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div style={{
              background: backgroundStyles[bgStyle],
              borderRadius: '20px',
              padding: '30px',
              border: `2px solid ${glowColor}33`,
              boxShadow: `0 0 40px ${glowColor}44, 0 0 80px ${glowColor}22`,
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(to right, transparent, ${glowColor}, transparent)`,
              }} />
              
              {/* Card Content */}
              <div style={{ textAlign: 'center' }}>
                {/* Avatar */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 20px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${glowColor}44, #9b30ff44)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    border: `3px solid ${glowColor}`,
                    boxShadow: `0 0 30px ${glowColor}66`,
                  }}
                >
                  {memberData?.avatar || '⚡'}
                </motion.div>

                {/* Username */}
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: glowColor,
                  marginBottom: '5px',
                  textShadow: `0 0 20px ${glowColor}`,
                }}>
                  {memberData?.username}
                </h2>

                {/* Rank */}
                <div style={{
                  display: 'inline-block',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  background: `${glowColor}22`,
                  border: `1px solid ${glowColor}44`,
                  color: glowColor,
                  fontSize: '14px',
                  marginBottom: '15px',
                }}>
                  {memberData?.rank}
                </div>

                {/* Aura */}
                <div style={{
                  padding: '15px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.5)',
                  marginBottom: '15px',
                }}>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '5px' }}>
                    AURA TYPE
                  </p>
                  <p style={{ color: '#9b30ff', fontSize: '20px', fontWeight: 'bold' }}>
                    {memberData?.aura}
                  </p>
                </div>

                {/* Quote */}
                {quote && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      color: '#888',
                      fontStyle: 'italic',
                      fontSize: '16px',
                      marginBottom: '15px',
                      padding: '10px',
                      borderLeft: `3px solid ${glowColor}`,
                      textAlign: 'left',
                    }}
                  >
                    &ldquo;{quote}&rdquo;
                  </motion.p>
                )}

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '10px',
                  marginTop: '15px',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888' }}>LEVEL</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: glowColor }}>
                      {memberData?.level}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888' }}>XP</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00d4ff' }}>
                      {memberData?.xp}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#888' }}>CLAN</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9b30ff' }}>
                      SYNDICATE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={downloadCard} className="btn-neon" style={{ flex: 1 }}>
                📸 SAVE CARD
              </button>
              <button onClick={shareCard} className="btn-neon btn-blue" style={{ flex: 1 }}>
                📤 SHARE
              </button>
              <button
                onClick={() => setCardGenerated(false)}
                className="btn-neon btn-red"
                style={{ flex: 1 }}
              >
                🔄 EDIT
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}