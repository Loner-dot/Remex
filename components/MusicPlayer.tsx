import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [show, setShow] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [track, setTrack] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist = [
    { id: '1', title: 'Zen Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: '2', title: 'Dark Drone', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: '3', title: 'Void Theme', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ]

  const playTrack = (t: any) => {
    setTrack(t)
    if (audioRef.current) {
      audioRef.current.src = t.url
      audioRef.current.volume = volume
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  const toggle = () => {
    if (!track) { playTrack(playlist[0]); return }
    if (audioRef.current) {
      playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {})
      setPlaying(!playing)
    }
  }

  return (
    <>
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShow(!show)} style={{
          width: '48px', height: '48px', borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
          color: '#ffffff', fontSize: '16px', cursor: 'pointer', fontWeight: '600',
        }}>
          {playing ? '||' : 'AU'}
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="glass-card" style={{ position: 'fixed', bottom: '84px', right: '24px', width: '260px', zIndex: 99 }}>
            <div className="section-title">Audio</div>
            {track && <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px', color: '#ffffff' }}>{track.title}</div>}
            <button onClick={toggle} className="btn-zen" style={{ marginBottom: '10px', fontSize: '14px', padding: '12px' }}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Vol</span>
              <input type="range" min="0" max="1" step="0.1" value={volume}
                onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v }}
                style={{ flex: 1, margin: 0, padding: 0, height: '4px' }} />
            </div>
            <div style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '10px' }}>
              {playlist.map(t => (
                <div key={t.id} onClick={() => playTrack(t)} style={{
                  padding: '10px', borderRadius: '10px', cursor: 'pointer',
                  background: track?.id === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: track?.id === t.id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px', fontWeight: '500',
                }}>{t.title}</div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}