import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [trackList, setTrackList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Free playlist of cyberpunk/lofi tracks (direct MP3 URLs that work)
  const defaultPlaylist = [
    {
      id: '1',
      title: 'Cyberpunk 2077 Ambient',
      artist: 'Cyberwave',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbd07e.mp3',
      duration: '3:45',
    },
    {
      id: '2',
      title: 'Neon Nights',
      artist: 'Synthwave',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3',
      duration: '4:20',
    },
    {
      id: '3',
      title: 'Digital Dreams',
      artist: 'Cyberpunk',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
      duration: '5:10',
    },
    {
      id: '4',
      title: 'Future City',
      artist: 'Retrowave',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/17/audio_83f1c0e9cf.mp3',
      duration: '3:30',
    },
    {
      id: '5',
      title: 'Shadow Syndicate Theme',
      artist: 'Dark Synth',
      url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_8c5e8e4e1c.mp3',
      duration: '4:00',
    },
  ]

  // Search for music using free Deezer API (no auth needed!)
  const searchMusic = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      // Using free Deezer API - works without authentication
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(searchQuery)}&limit=10`
      )
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        const tracks = data.data.map((track: any) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.artist.name,
          url: track.preview, // 30-second preview (free)
          duration: formatTime(track.duration),
          fullDuration: track.duration,
          album: track.album.title,
          cover: track.album.cover_medium,
        }))
        setTrackList(tracks)
      } else {
        setError('No tracks found. Try a different search.')
        // Fall back to default playlist
        setTrackList(defaultPlaylist)
      }
    } catch (err) {
      console.log('API search failed, using default playlist')
      setTrackList(defaultPlaylist)
    } finally {
      setLoading(false)
    }
  }

  // Load default playlist on first open
  useEffect(() => {
    setTrackList(defaultPlaylist)
  }, [])

  // Play a track
  const playTrack = (track: any) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.volume = volume
      audioRef.current.play()
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (!currentTrack) return
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Next track
  const nextTrack = () => {
    if (trackList.length === 0) return
    const currentIndex = trackList.findIndex(t => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % trackList.length
    playTrack(trackList[nextIndex])
  }

  // Previous track
  const prevTrack = () => {
    if (trackList.length === 0) return
    const currentIndex = trackList.findIndex(t => t.id === currentTrack?.id)
    const prevIndex = currentIndex === 0 ? trackList.length - 1 : currentIndex - 1
    playTrack(trackList[prevIndex])
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Update time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onError={() => setError('Audio playback error')}
      />

      {/* Music Player Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 1 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowControls(!showControls)}
          style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff2d95, #9b30ff)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(255,45,149,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isPlaying ? '🎧' : '🎵'}
        </motion.button>
      </motion.div>

      {/* Music Player Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '85px',
              right: '20px',
              width: '320px',
              maxHeight: '500px',
              zIndex: 99,
              overflow: 'hidden',
              border: '1px solid rgba(255,45,149,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,45,149,0.2), rgba(155,48,255,0.2))',
              padding: '15px',
              borderRadius: '15px 15px 0 0',
              textAlign: 'center',
            }}>
              <h3 style={{ 
                color: '#ff2d95', 
                marginBottom: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}>
                🎵 CLAN RADIO
              </h3>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '15px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMusic()}
                  placeholder="Search any song..."
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    fontSize: '14px',
                    background: 'rgba(20,20,40,0.9)',
                    border: '1px solid rgba(255,45,149,0.3)',
                    borderRadius: '10px',
                    color: 'white',
                    margin: 0,
                  }}
                />
                <button
                  onClick={searchMusic}
                  disabled={loading}
                  style={{
                    padding: '10px 15px',
                    background: 'linear-gradient(135deg, #ff2d95, #9b30ff)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? '🔍' : '🔎'}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <p style={{
                  color: '#ff0044',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}>
                  {error}
                </p>
              )}

              {/* Now Playing */}
              {currentTrack && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(255,45,149,0.1)',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  border: '1px solid rgba(255,45,149,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Album Art */}
                    {currentTrack.cover && (
                      <img
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: '#ff2d95',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        marginBottom: '3px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {currentTrack.title}
                      </p>
                      <p style={{
                        color: '#888',
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {currentTrack.artist}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      marginBottom: '5px',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                        background: 'linear-gradient(to right, #ff2d95, #9b30ff)',
                        borderRadius: '2px',
                        transition: 'width 0.1s linear',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#888', fontSize: '10px' }}>
                        {formatTime(currentTime)}
                      </span>
                      <span style={{ color: '#888', fontSize: '10px' }}>
                        {currentTrack.duration || formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '15px',
                    marginTop: '10px',
                  }}>
                    <button
                      onClick={prevTrack}
                      style={controlButtonStyle('#9b30ff')}
                    >
                      ⏮️
                    </button>
                    <button
                      onClick={togglePlay}
                      style={{
                        ...controlButtonStyle('#ff2d95'),
                        width: '45px',
                        height: '45px',
                        fontSize: '20px',
                      }}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={nextTrack}
                      style={controlButtonStyle('#ff2d95')}
                    >
                      ⏭️
                    </button>
                  </div>

                  {/* Volume */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '10px',
                  }}>
                    <span style={{ fontSize: '14px' }}>🔈</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      style={{
                        flex: 1,
                        height: '4px',
                        margin: 0,
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '14px' }}>🔊</span>
                  </div>
                </div>
              )}
            </div>

            {/* Playlist */}
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '0 15px 15px',
            }}>
              <h4 style={{
                color: '#9b30ff',
                fontSize: '14px',
                marginBottom: '10px',
                fontWeight: 'bold',
              }}>
                📻 {searchQuery ? 'Search Results' : 'Cyberpunk Playlist'}
              </h4>
              
              {trackList.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ x: 5 }}
                  onClick={() => playTrack(track)}
                  style={{
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '10px',
                    background: currentTrack?.id === track.id
                      ? 'rgba(255,45,149,0.15)'
                      : 'rgba(20,20,40,0.5)',
                    border: `1px solid ${
                      currentTrack?.id === track.id
                        ? 'rgba(255,45,149,0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {track.cover ? (
                      <img
                        src={track.cover}
                        alt={track.title}
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ff2d95, #9b30ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}>
                        🎵
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: currentTrack?.id === track.id ? 'bold' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {track.title}
                      </p>
                      <p style={{
                        color: '#888',
                        fontSize: '11px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {track.artist}
                      </p>
                    </div>
                    <span style={{ color: '#888', fontSize: '11px' }}>
                      {track.duration}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowControls(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,0,68,0.3)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Reusable control button style
const controlButtonStyle = (color: string) => ({
  background: `${color}33`,
  border: `1px solid ${color}66`,
  borderRadius: '50%',
  width: '38px',
  height: '38px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
})