import { useEffect, useState } from 'react'

export default function ParticleBackground() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const pts = []
    for (let i = 0; i < 30; i++) {
      pts.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 8 + 's',
        animationDuration: Math.random() * 5 + 5 + 's',
        size: Math.random() * 4 + 2 + 'px',
        opacity: Math.random() * 0.5 + 0.3,
      })
    }
    setParticles(pts)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: '#ff2d95',
            borderRadius: '50%',
            opacity: p.opacity,
            animation: `float ${p.animationDuration} ${p.animationDelay} infinite ease-in-out`,
            boxShadow: '0 0 10px #ff2d95',
          }}
        />
      ))}
    </div>
  )
}