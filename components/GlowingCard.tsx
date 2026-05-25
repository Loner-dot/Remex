import { motion } from 'framer-motion'

export default function GlowingCard({ children, color = '#ff2d95', style = {} }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card"
      style={{
        border: `1px solid ${color}33`,
        boxShadow: `0 0 30px ${color}22`,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}