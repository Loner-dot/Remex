// Authentication utilities

export interface ClanMember {
  id: string
  username: string
  password: string
  rank: string
  avatar: string
  aura: string
  level: number
  xp: number
  active: boolean
  createdAt: string
  lastLogin?: string
}

// Validate member login
export function validateLogin(password: string, members: ClanMember[]): ClanMember | null {
  const member = members.find(m => m.password === password && m.active)
  return member || null
}

// Check if member has permission
export function hasPermission(member: ClanMember, permission: string): boolean {
  const permissions: Record<string, string[]> = {
    'Supreme Leader': ['all'],
    'Elite Commander': ['manage_members', 'post_announcements', 'moderate'],
    'Shadow Warrior': ['post_announcements', 'invite'],
    'Aura Master': ['invite'],
    'Neon Knight': ['view_all'],
    'Digital Scout': ['view_basic'],
    'Cyber Recruit': ['view_basic'],
  }
  
  const memberPermissions = permissions[member.rank] || []
  return memberPermissions.includes('all') || memberPermissions.includes(permission)
}

// Generate a unique session token
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}