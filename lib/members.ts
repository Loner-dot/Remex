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
  created_at: string;
  last_login?: string;
}

export function generateMemberPassword(username: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const nameCode = username.substring(0, 3).toUpperCase();
  return `ZEN_${nameCode}_${random}`;
}

export const CLAN_RANKS = [
  'Supreme Leader',
  'Overseer',
  'Commander',
  'Warden',
  'Shadow',
  'Phantom',
  'Spectre',
  'Knight',
  'Sentinel',
  'Enforcer',
  'Disciple',
  'Acolyte',
  'Scout',
  'Initiate',
  'Recruit',
];