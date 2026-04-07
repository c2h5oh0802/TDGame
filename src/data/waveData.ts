/**
 * 波次資料定義
 */

import { EnemyType } from '@/core/types';

export interface WaveSpawnConfig {
  wave: number;
  enemies: Array<{
    type: EnemyType;
    count: number;
    delay: number;
  }>;
  duration: number; // 波次持續時間
}

export const WAVE_DATA: WaveSpawnConfig[] = [
  { wave: 1, enemies: [{ type: EnemyType.NORMAL, count: 5, delay: 0.5 }], duration: 30 },
  { wave: 2, enemies: [{ type: EnemyType.NORMAL, count: 8, delay: 0.4 }], duration: 30 },
  {
    wave: 3,
    enemies: [
      { type: EnemyType.NORMAL, count: 5, delay: 0.4 },
      { type: EnemyType.RANGED, count: 3, delay: 0.6 }
    ],
    duration: 30
  },
  {
    wave: 4,
    enemies: [
      { type: EnemyType.NORMAL, count: 6, delay: 0.4 },
      { type: EnemyType.ELITE, count: 2, delay: 0.8 }
    ],
    duration: 30
  },
  {
    wave: 5,
    enemies: [
      { type: EnemyType.NORMAL, count: 5, delay: 0.4 },
      { type: EnemyType.RANGED, count: 4, delay: 0.5 },
      { type: EnemyType.ELITE, count: 1, delay: 1.0 }
    ],
    duration: 30
  },
  {
    wave: 6,
    enemies: [
      { type: EnemyType.ELITE, count: 3, delay: 0.6 },
      { type: EnemyType.RANGED, count: 5, delay: 0.4 }
    ],
    duration: 40
  },
  {
    wave: 7,
    enemies: [
      { type: EnemyType.NORMAL, count: 4, delay: 0.3 },
      { type: EnemyType.RANGED, count: 3, delay: 0.5 },
      { type: EnemyType.WARLOCK, count: 2, delay: 0.8 }
    ],
    duration: 40
  },
  {
    wave: 8,
    enemies: [
      { type: EnemyType.ELITE, count: 2, delay: 0.7 },
      { type: EnemyType.WARLOCK, count: 3, delay: 0.6 },
      { type: EnemyType.SIEGE, count: 1, delay: 1.2 }
    ],
    duration: 45
  },
  {
    wave: 9,
    enemies: [
      { type: EnemyType.SIEGE, count: 2, delay: 0.8 },
      { type: EnemyType.RANGED, count: 4, delay: 0.4 },
      { type: EnemyType.NORMAL, count: 3, delay: 0.3 }
    ],
    duration: 45
  },
  {
    wave: 10,
    enemies: [
      { type: EnemyType.ELITE, count: 4, delay: 0.5 },
      { type: EnemyType.WARLOCK, count: 2, delay: 0.8 },
      { type: EnemyType.ASSASSIN, count: 3, delay: 0.3 }
    ],
    duration: 50
  },
  {
    wave: 11,
    enemies: [
      { type: EnemyType.SIEGE, count: 3, delay: 0.7 },
      { type: EnemyType.ASSASSIN, count: 2, delay: 0.4 },
      { type: EnemyType.WARLOCK, count: 3, delay: 0.6 }
    ],
    duration: 50
  },
  {
    wave: 12,
    enemies: [
      { type: EnemyType.ELITE, count: 5, delay: 0.4 },
      { type: EnemyType.SIEGE, count: 2, delay: 0.9 },
      { type: EnemyType.ASSASSIN, count: 2, delay: 0.4 }
    ],
    duration: 55
  },
  {
    wave: 13,
    enemies: [
      { type: EnemyType.ELITE, count: 3, delay: 0.5 },
      { type: EnemyType.RANGED, count: 4, delay: 0.4 },
      { type: EnemyType.WARLOCK, count: 2, delay: 0.7 },
      { type: EnemyType.ASSASSIN, count: 2, delay: 0.3 }
    ],
    duration: 60
  },
  {
    wave: 14,
    enemies: [
      { type: EnemyType.SIEGE, count: 3, delay: 0.8 },
      { type: EnemyType.ELITE, count: 4, delay: 0.5 },
      { type: EnemyType.WARLOCK, count: 2, delay: 0.7 }
    ],
    duration: 60
  },
  {
    wave: 15,
    enemies: [
      { type: EnemyType.ELITE, count: 6, delay: 0.4 },
      { type: EnemyType.SIEGE, count: 2, delay: 1.0 },
      { type: EnemyType.ASSASSIN, count: 3, delay: 0.3 }
    ],
    duration: 65
  },
  {
    wave: 16,
    enemies: [
      { type: EnemyType.SIEGE, count: 4, delay: 0.7 },
      { type: EnemyType.ELITE, count: 5, delay: 0.4 },
      { type: EnemyType.WARLOCK, count: 3, delay: 0.6 }
    ],
    duration: 70
  },
  {
    wave: 17,
    enemies: [
      { type: EnemyType.ELITE, count: 7, delay: 0.3 },
      { type: EnemyType.ASSASSIN, count: 4, delay: 0.3 },
      { type: EnemyType.RANGED, count: 3, delay: 0.5 }
    ],
    duration: 70
  },
  {
    wave: 18,
    enemies: [
      { type: EnemyType.SIEGE, count: 5, delay: 0.6 },
      { type: EnemyType.ELITE, count: 4, delay: 0.5 },
      { type: EnemyType.WARLOCK, count: 3, delay: 0.7 }
    ],
    duration: 75
  },
  {
    wave: 19,
    enemies: [
      { type: EnemyType.ELITE, count: 8, delay: 0.3 },
      { type: EnemyType.SIEGE, count: 3, delay: 0.8 },
      { type: EnemyType.ASSASSIN, count: 3, delay: 0.3 }
    ],
    duration: 80
  },
  {
    wave: 20,
    enemies: [{ type: EnemyType.BOSS, count: 1, delay: 0 }],
    duration: 120
  }
];

export function getWaveConfig(waveNumber: number): WaveSpawnConfig | undefined {
  return WAVE_DATA.find((w) => w.wave === waveNumber);
}
