// This is your member database
// You'll manage this from the admin panel
// All passwords are stored here

export interface Member {
  id: string;
  username: string;
  password: string;
  rank: string;
  avatar: string;
  aura: string;
  level: number;
  xp: number;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Initial members database
// YOU are the first member (Admin)
export const initialMembers: Member[] = [
  {
    id: 'admin_001',
    username: 'GhettoMaster', // CHANGE THIS TO YOUR NAME
    password: 'GHETTO_ADMIN_2024', // YOUR MASTER PASSWORD
    rank: 'Supreme Leader',
    avatar: '👑',
    aura: 'Infinite Void',
    level: 99,
    xp: 99999,
    active: true,
    createdAt: new Date().toISOString(),
  }
];

// Generate a unique password for new members
export function generateMemberPassword(username: string, rank: string): string {
  const prefix = 'GHETTO';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const rankCode = rank.substring(0, 2).toUpperCase();
  return `${prefix}_${rankCode}_${random}`;
}

// Ranks available in the clan
export const CLAN_RANKS = [
  'Supreme Leader',    // Only you
  'Elite Commander',
  'Shadow Warrior',
  'Aura Master',
  'Neon Knight',
  'Digital Scout',
  'Cyber Recruit',
];

// Rank permissions
export const RANK_PERMISSIONS = {
  'Supreme Leader': ['all'],
  'Elite Commander': ['manage_members', 'post_announcements', 'moderate'],
  'Shadow Warrior': ['post_announcements', 'invite'],
  'Aura Master': ['invite'],
  'Neon Knight': ['view_all'],
  'Digital Scout': ['view_basic'],
  'Cyber Recruit': ['view_basic'],
};