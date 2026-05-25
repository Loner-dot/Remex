import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function AuraScanner({ memberData, isLoggedIn }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [scanComplete, setScanComplete] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn])

  const auraDatabase = [
    { name: 'Inferno Dragon', emoji: '🐉', color: '#ff2d95', rarity: 'Legendary', power: 9500 },
    { name: 'Shadow Phantom', emoji: '👻', color: '#9b30ff', rarity: 'Mythic', power: 8800 },
    { name: 'Neon Thunder', emoji: '⚡', color: '#00d4ff', rarity: 'Epic', power: 7200 },
    { name: 'Digital Witch', emoji: '🧙‍♀️', color: '#ff0044', rarity: 'Legendary', power: 9100 },
    { name: 'Cyber Samurai', emoji: '⚔️', color: '#ff6b35', rarity: 'Epic', power: 7800 },
    { name: 'Void Walker', emoji: '🌑', color: '#8b00ff', rarity: 'Mythic', power: 9700 },
    { name: 'Glitch Master', emoji: '💾', color: '#00ff88', rarity: 'Rare', power: 6500 },
    { name: 'Pixel Demon', emoji: '👾', color: '#ff1493', rarity: 'Legendary', power: 8900 },
  ]

  const energyTypes = ['Fire', 'Ice', 'Lightning', 'Shadow', 'Holy', 'Chaos', 'Void', 'Digital']
  const dangerLevels = ['Safe', 'Low', 'Medium', 'High', 'Extreme', 'FATAL']
  const emotionalStates = ['Chaotic', 'Mysterious', 'Passionate', 'Calm', 'Aggressive', 'Enlightened', 'Dark', 'Pure']
  const clanClasses = ['Warrior', 'Mage', 'Assassin', 'Tank', 'Healer', 'Berserker', 'Necromancer', 'Paladin']

  const startScan = () => {
    if (!username) return
    setScanning(true)
    setProgress(0)
    setScanComplete(false)
    setResult(null)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          setScanComplete(true)
          
          // Generate random result
          const aura = auraDatabase[Math.floor(Math.random() * auraDatabase.length)]
          setResult({
            ...aura,
            energy: energyTypes[Math.floor(Math.random() * energyTypes.length)],
            danger: dangerLevels[Math.floor(Math.random() * dangerLevels.length)],
            emotional: emotionalStates[Math.floor(Math.random() * emotionalStates.length)],
            clanClass: clanClasses[Math.floor(Math.random() * clanClasses.length)],
            scanDate: new Date().toISOString(),
            scannedBy: memberData?.username || 'Unknown',
          })
          return 100
        }
        return prev + Math.random() * 10 + 2
      })
    }, 150)
  }

  const shareResult = () => {
    if (!result) return
    const text = `🔮 My Aura: ${result.name} (${result.rarity})\n⚡ Power: ${result.power}\n🔥 Energy: ${result.energy}\n💀 Danger: ${result.danger}\n\nScanned at Shadow Syndicate HQ`
    
    if (navigator.share) {
      navigator.share({ title: 'My Aura Scan', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '40px' }}>
        
        {/* Back Button */}
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
            fontSize: '14px',
          }}
        >
          ⬅️ Back to Dashboard
        </button>

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: '36px',
            textAlign: 'center',
            background: 'linear-gradient(to right, #ff2d95, #9b30ff, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '30px',
            fontWeight: 'bold',
          }}
        >
          🔮 AURA SCANNER
        </motion.h1>

        {/* Input Section */}
        {!scanning && !scanComplete && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card glow-pink"
            style={{ marginBottom: '20px' }}
          >
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username to scan..."
              style={{ fontSize: '16px' }}
            />
            <button
              onClick={startScan}
              className="btn-neon"
              disabled={!username}
            >
              INITIATE AURA SCAN
            </button>
          </motion.div>
        )}

        {/* Scanning Animation */}
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}
          >
            {/* Scan Line */}
            <div className="scan-line" />
            
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ fontSize: '80px', marginBottom: '30px' }}
              >
                ⚡
              </motion.div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '20px',
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #ff2d95, #9b30ff)',
                    borderRadius: '4px',
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <p style={{ color: '#ff2d95', fontFamily: 'monospace', fontSize: '16px' }}>
                SCANNING AURA FIELD... {Math.floor(progress)}%
              </p>
              <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                Analyzing energy signatures...
              </p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {scanComplete && result && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <div className="glass-card glow-pink" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '100px', marginBottom: '20px' }}
              >
                {result.emoji}
              </motion.div>

              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: result.color,
                marginBottom: '10px',
              }}>
                {result.name}
              </h2>

              <div style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: '20px',
                background: `${result.color}33`,
                color: result.color,
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '25px',
                border: `1px solid ${result.color}66`,
              }}>
                {result.rarity}
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <ResultStat label="Aura Power" value={result.power.toLocaleString()} color="#ff2d95" />
                <ResultStat label="Energy Type" value={result.energy} color="#00d4ff" />
                <ResultStat label="Danger Level" value={result.danger} color="#ff0044" />
                <ResultStat label="Clan Class" value={result.clanClass} color="#9b30ff" />
              </div>

              {/* Emotional State */}
              <div style={{
                padding: '15px',
                borderRadius: '12px',
                background: 'rgba(155,48,255,0.1)',
                border: '1px solid rgba(155,48,255,0.2)',
                marginBottom: '20px',
              }}>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '5px' }}>
                  Emotional Signature
                </p>
                <p style={{ color: '#9b30ff', fontSize: '20px', fontWeight: 'bold' }}>
                  {result.emotional}
                </p>
              </div>

              {/* Scanned By */}
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '20px' }}>
                Scanned by: {result.scannedBy}
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={shareResult} className="btn-neon" style={{ flex: 1 }}>
                  📤 SHARE RESULT
                </button>
                <button
                  onClick={() => {
                    setScanComplete(false)
                    setResult(null)
                    setUsername('')
                  }}
                  className="btn-neon btn-blue"
                  style={{ flex: 1 }}
                >
                  🔄 SCAN AGAIN
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

function ResultStat({ label, value, color }) {
  return (
    <div style={{
      padding: '15px',
      borderRadius: '12px',
      background: 'rgba(20,20,40,0.8)',
      border: `1px solid ${color}33`,
    }}>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  )
}