import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist = [
    {
      id: '1',
      title: 'ZEN MEDITATION',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      title: 'DARK AMBIENT',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: '3',
      title: 'VOID THEME',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      id: '4',
      title: 'SHADOW DRONE',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
  ]

  const playTrack = (track: any) => {
    setError(false)
    setCurrentTrack(track)
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.volume = volume
      audioRef.current.play().catch(() => setError(true))
      setIsPlaying(true)
    }
  }

  const togglePlay = () => {
    if (!currentTrack) {
      playTrack(playlist[0])
      return
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => setError(true))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={() => setError(true)} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowControls(!showControls)}
          style={{
            width: '48px',
            height: '48px',
            border: '1px solid #333333',
            background: '#0a0a0a',
            color: '#888888',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? '||' : 'AU'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              width: '280px',
              zIndex: 99,
            }}
          >
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: '#555555',
              letterSpacing: '3px',
              marginBottom: '15px',
            }}>
              AUDIO TERMINAL
            </div>

            {error && (
              <div style={{
                color: '#660000',
                fontSize: '9px',
                letterSpacing: '2px',
                marginBottom: '12px',
                textAlign: 'center',
              }}>
                PLAYBACK ERROR
              </div>
            )}

            {currentTrack && (
              <div style={{
                border: '1px solid #1a1a1a',
                padding: '12px',
                marginBottom: '12px',
                background: '#050505',
              }}>
                <div style={{
                  color: '#888888',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {currentTrack.title}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={togglePlay}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #2a2a2a',
                  background: '#080808',
                  color: '#aaaaaa',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '3px',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? 'STOP' : 'PLAY'}
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px',
            }}>
              <span style={{ color: '#444444', fontSize: '10px' }}>VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                style={{ flex: 1, margin: 0, padding: 0, height: '2px' }}
              />
            </div>

            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {playlist.map(track => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  style={{
                    padding: '10px',
                    marginBottom: '4px',
                    border: '1px solid #111111',
                    background: currentTrack?.id === track.id ? '#0f0f0f' : '#050505',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '9px',
                    color: currentTrack?.id === track.id ? '#999999' : '#555555',
                    letterSpacing: '2px',
                  }}
                >
                  {track.title}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowControls(false)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                border: '1px solid #1a0000',
                background: 'none',
                color: '#660000',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}