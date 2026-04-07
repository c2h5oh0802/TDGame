/**
 * 升級卡片資料定義
 */

import { CardType, Rarity } from '@/core/types';

export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: Rarity;
  icon: string;
  effect: (gameState: any) => void;
}

export const UPGRADE_CARDS: CardDefinition[] = [
  // 建築卡片
  {
    id: 'woodWall',
    name: '木牆',
    description: '放置木牆防禦',
    type: CardType.BUILDING,
    rarity: Rarity.COMMON,
    icon: '🪵',
    effect: (gs) => gs.addBuildQueue('woodWall')
  },
  {
    id: 'turret',
    name: '弩砲塔',
    description: '放置弩砲塔攻擊',
    type: CardType.BUILDING,
    rarity: Rarity.COMMON,
    icon: '🏹',
    effect: (gs) => gs.addBuildQueue('turret')
  },
  {
    id: 'lightningTurret',
    name: '閃電塔',
    description: '放置閃電塔快速攻擊',
    type: CardType.BUILDING,
    rarity: Rarity.RARE,
    icon: '⚡',
    effect: (gs) => gs.addBuildQueue('lightningTurret')
  },
  {
    id: 'demonSpawner',
    name: '惡魔巢穴',
    description: '放置惡魔巢穴生成戰士',
    type: CardType.BUILDING,
    rarity: Rarity.RARE,
    icon: '👿',
    effect: (gs) => gs.addBuildQueue('demonSpawner')
  },

  // 魔法卡片
  {
    id: 'fireballSpell',
    name: '爆裂火球',
    description: '+1 火系等級',
    type: CardType.SPELL,
    rarity: Rarity.COMMON,
    icon: '🔥',
    effect: (gs) => gs.playerStats.fireLevel++
  },
  {
    id: 'frostSpell',
    name: '冰霜術',
    description: '+1 冰系等級',
    type: CardType.SPELL,
    rarity: Rarity.COMMON,
    icon: '❄️',
    effect: (gs) => gs.playerStats.iceLevel++
  },
  {
    id: 'lightningSpell',
    name: '雷霆之怒',
    description: '+1 雷電等級',
    type: CardType.SPELL,
    rarity: Rarity.COMMON,
    icon: '⚡',
    effect: (gs) => gs.playerStats.lightningLevel++
  },

  // 強化卡片
  {
    id: 'powerUp',
    name: '魔王之力',
    description: '攻擊力 +20%',
    type: CardType.ENHANCE,
    rarity: Rarity.COMMON,
    icon: '⚔️',
    effect: (gs) => gs.playerStats.damageMultiplier *= 1.2
  },
  {
    id: 'speedUp',
    name: '魔王之速',
    description: '移動速度 +15%',
    type: CardType.ENHANCE,
    rarity: Rarity.COMMON,
    icon: '👟',
    effect: (gs) => gs.playerStats.moveSpeedMultiplier *= 1.15
  },
  {
    id: 'attackSpeedUp',
    name: '加速射擊',
    description: '攻擊速度 +25%',
    type: CardType.ENHANCE,
    rarity: Rarity.RARE,
    icon: '⚡',
    effect: (gs) => gs.playerStats.attackSpeedMultiplier *= 1.25
  },
  {
    id: 'projectileCount',
    name: '多重射擊',
    description: '+1 投射物數量',
    type: CardType.ENHANCE,
    rarity: Rarity.RARE,
    icon: '💫',
    effect: (gs) => gs.playerStats.projectileCount++
  },
  {
    id: 'corpseExplosion',
    name: '屍爆術',
    description: '友軍死亡時爆炸傷害',
    type: CardType.ENHANCE,
    rarity: Rarity.EPIC,
    icon: '💥',
    effect: (gs) => gs.playerStats.corpseExplosion = true
  },
  {
    id: 'wallExplosion',
    name: '爆破裝甲',
    description: '牆壞時造成爆炸傷害',
    type: CardType.ENHANCE,
    rarity: Rarity.EPIC,
    icon: '🧨',
    effect: (gs) => gs.playerStats.wallExplosion = true
  },
  {
    id: 'minionFrenzy',
    name: '狂暴小兵',
    description: '友軍傷害 x2，但 HP x0.5',
    type: CardType.ENHANCE,
    rarity: Rarity.EPIC,
    icon: '🔴',
    effect: (gs) => gs.playerStats.minionFrenzy = true
  },
  {
    id: 'homingMissiles',
    name: '自動追蹤',
    description: '投射物會自動跟蹤敵人',
    type: CardType.ENHANCE,
    rarity: Rarity.EPIC,
    icon: '🎯',
    effect: (gs) => gs.playerStats.homingMissiles = true
  },
  {
    id: 'orbitalOrbs',
    name: '護體星甲',
    description: '+1 護體星球數量',
    type: CardType.ENHANCE,
    rarity: Rarity.LEGENDARY,
    icon: '💫',
    effect: (gs) => gs.playerStats.orbitalLevel++
  },
  {
    id: 'toxicTrail',
    name: '深淵足跡',
    description: '移動時留下劇毒',
    type: CardType.ENHANCE,
    rarity: Rarity.EPIC,
    icon: '🐾',
    effect: (gs) => gs.playerStats.toxicTrail = true
  }
];

export function getCardById(id: string): CardDefinition | undefined {
  return UPGRADE_CARDS.find(card => card.id === id);
}

export function getRandomCards(count: number, excludeIds?: string[]): CardDefinition[] {
  const available = UPGRADE_CARDS.filter(card => !excludeIds?.includes(card.id));
  const result: CardDefinition[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    result.push(available[idx]);
    available.splice(idx, 1);
  }
  return result;
}
