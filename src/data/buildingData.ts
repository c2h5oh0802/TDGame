/**
 * 建築資料定義
 */

import { BuildingType } from '@/core/types';

export interface BuildingConfig {
  type: BuildingType;
  name: string;
  icon: string;
  baseHp: number;
  color: string;
  cost: number;
  description: string;
}

export const BUILDING_DATA: Record<BuildingType, BuildingConfig> = {
  [BuildingType.WOOD_WALL]: {
    type: BuildingType.WOOD_WALL,
    name: '木牆',
    icon: '🪵',
    baseHp: 50,
    color: '#92400e',
    cost: 20,
    description: '基礎防禦建築，可以阻擋敵人'
  },
  [BuildingType.TURRET]: {
    type: BuildingType.TURRET,
    name: '弩砲塔',
    icon: '🏹',
    baseHp: 80,
    color: '#ca8a04',
    cost: 40,
    description: '基礎攻擊塔，持續射擊敵人'
  },
  [BuildingType.ARTILLERY_TURRET]: {
    type: BuildingType.ARTILLERY_TURRET,
    name: '重砲塔',
    icon: '💣',
    baseHp: 100,
    color: '#7f1d1d',
    cost: 80,
    description: '高傷害範圍攻擊塔'
  },
  [BuildingType.LIGHTNING_TURRET]: {
    type: BuildingType.LIGHTNING_TURRET,
    name: '閃電塔',
    icon: '⚡',
    baseHp: 70,
    color: '#6b21a8',
    cost: 70,
    description: '快速連鎖閃電攻擊'
  },
  [BuildingType.FROST_TURRET]: {
    type: BuildingType.FROST_TURRET,
    name: '冰霜塔',
    icon: '❄️',
    baseHp: 75,
    color: '#0ea5e9',
    cost: 75,
    description: '減速敵人的冰霜攻擊'
  },
  [BuildingType.TRAP_BUILDING]: {
    type: BuildingType.TRAP_BUILDING,
    name: '地刺陷阱',
    icon: '🪤',
    baseHp: 30,
    color: '#22c55e',
    cost: 30,
    description: '接觸傷害陷阱'
  },
  [BuildingType.SNIPER_TURRET]: {
    type: BuildingType.SNIPER_TURRET,
    name: '狙擊塔',
    icon: '🎯',
    baseHp: 60,
    color: '#1f2937',
    cost: 90,
    description: '遠距離精確打擊'
  },
  [BuildingType.POISON_TRAP]: {
    type: BuildingType.POISON_TRAP,
    name: '劇毒陷阱',
    icon: '🧪',
    baseHp: 25,
    color: '#22c55e',
    cost: 35,
    description: '持續中毒傷害'
  },
  [BuildingType.ALCHEMY_LAB]: {
    type: BuildingType.ALCHEMY_LAB,
    name: '煉金術廠',
    icon: '⚗️',
    baseHp: 50,
    color: '#a855f7',
    cost: 100,
    description: '自動產生金幣'
  },
  [BuildingType.AURA_BUILDING]: {
    type: BuildingType.AURA_BUILDING,
    name: '光環塔',
    icon: '✨',
    baseHp: 85,
    color: '#a855f7',
    cost: 110,
    description: '增強友方單位的光環'
  },
  [BuildingType.DEMON_SPAWNER]: {
    type: BuildingType.DEMON_SPAWNER,
    name: '惡魔巢穴',
    icon: '👿',
    baseHp: 100,
    color: '#991b1b',
    cost: 120,
    description: '生成惡魔戰士'
  },
  [BuildingType.MAGE_SPAWNER]: {
    type: BuildingType.MAGE_SPAWNER,
    name: '魔法陣',
    icon: '🔮',
    baseHp: 70,
    color: '#7c3aed',
    cost: 100,
    description: '生成黑暗術士'
  },
  [BuildingType.GHOST_SPAWNER]: {
    type: BuildingType.GHOST_SPAWNER,
    name: '幽靈之門',
    icon: '👻',
    baseHp: 50,
    color: '#e5e7eb',
    cost: 80,
    description: '生成幽靈戰士'
  },
  [BuildingType.ARCHER_SPAWNER]: {
    type: BuildingType.ARCHER_SPAWNER,
    name: '弓手營地',
    icon: '💀',
    baseHp: 60,
    color: '#84cc16',
    cost: 90,
    description: '生成骷髏弓手'
  },
  [BuildingType.BOMBER_SPAWNER]: {
    type: BuildingType.BOMBER_SPAWNER,
    name: '爆裂熔窯',
    icon: '🔥',
    baseHp: 80,
    color: '#ea580c',
    cost: 110,
    description: '生成爆裂元素'
  },
  [BuildingType.PRIEST_SPAWNER]: {
    type: BuildingType.PRIEST_SPAWNER,
    name: '祭壇',
    icon: '💗',
    baseHp: 70,
    color: '#db2777',
    cost: 100,
    description: '生成治療祭司'
  },
  [BuildingType.SKELETON_SPAWNER]: {
    type: BuildingType.SKELETON_SPAWNER,
    name: '墓地',
    icon: '💀',
    baseHp: 90,
    color: '#6b7280',
    cost: 95,
    description: '生成骷髏兵'
  },
  [BuildingType.WORKER_HUT]: {
    type: BuildingType.WORKER_HUT,
    name: '工人小屋',
    icon: '🏚️',
    baseHp: 40,
    color: '#b45309',
    cost: 50,
    description: '生成工人收集資源'
  },
  [BuildingType.MANA_POOL]: {
    type: BuildingType.MANA_POOL,
    name: '魔力池',
    icon: '💧',
    baseHp: 60,
    color: '#0369a1',
    cost: 85,
    description: '增加魔法能力'
  }
};

export function getBuildingConfig(type: BuildingType): BuildingConfig {
  return BUILDING_DATA[type] || BUILDING_DATA[BuildingType.WOOD_WALL];
}
