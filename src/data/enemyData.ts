/**
 * 敵人資料定義
 */

import { EnemyType } from '@/core/types';

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  icon: string;
  baseHp: number;
  speed: number;
  damage: number;
  size: number;
  color: string;
  reward: {
    exp: number;
    gold: number;
  };
  specialAbility?: string;
}

export const ENEMY_DATA: Record<EnemyType, EnemyConfig> = {
  [EnemyType.NORMAL]: {
    type: EnemyType.NORMAL,
    name: '普通敵人',
    icon: '👹',
    baseHp: 10,
    speed: 70,
    damage: 6,
    size: 15,
    color: '#33cc33',
    reward: { exp: 5, gold: 2 }
  },
  [EnemyType.ELITE]: {
    type: EnemyType.ELITE,
    name: '精英敵人',
    icon: '🦹',
    baseHp: 50,
    speed: 50,
    damage: 10,
    size: 25,
    color: '#b91c1c',
    reward: { exp: 25, gold: 15 }
  },
  [EnemyType.RANGED]: {
    type: EnemyType.RANGED,
    name: '遠程敵人',
    icon: '🏹',
    baseHp: 6,
    speed: 60,
    damage: 4,
    size: 14,
    color: '#0284c7',
    reward: { exp: 6, gold: 2 }
  },
  [EnemyType.SIEGE]: {
    type: EnemyType.SIEGE,
    name: '攻城敵人',
    icon: '🛒',
    baseHp: 15,
    speed: 90,
    damage: 20,
    size: 18,
    color: '#d97706',
    reward: { exp: 10, gold: 4 }
  },
  [EnemyType.ASSASSIN]: {
    type: EnemyType.ASSASSIN,
    name: '刺客敵人',
    icon: '🗡️',
    baseHp: 4,
    speed: 120,
    damage: 10,
    size: 12,
    color: '#ec4899',
    reward: { exp: 8, gold: 2 }
  },
  [EnemyType.WARLOCK]: {
    type: EnemyType.WARLOCK,
    name: '術士敵人',
    icon: '🔮',
    baseHp: 8,
    speed: 60,
    damage: 5,
    size: 16,
    color: '#9333ea',
    reward: { exp: 12, gold: 4 }
  },
  [EnemyType.BOSS]: {
    type: EnemyType.BOSS,
    name: '傳說勇者',
    icon: '👑',
    baseHp: 6000,
    speed: 90,
    damage: 40,
    size: 40,
    color: '#facc15',
    reward: { exp: 1000, gold: 250 }
  }
};

export function getEnemyConfig(type: EnemyType): EnemyConfig {
  return ENEMY_DATA[type] || ENEMY_DATA[EnemyType.NORMAL];
}
