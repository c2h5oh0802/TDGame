/**
 * 資料系統測試
 */

import { describe, it, expect } from 'vitest';
import { getEnemyConfig } from '@/data/enemyData';
import { getBuildingConfig } from '@/data/buildingData';
import { getCardById, getRandomCards } from '@/data/cardData';
import { EnemyType, BuildingType } from '@/core/types';

describe('Enemy Data', () => {
  it('should load enemy config correctly', () => {
    const config = getEnemyConfig(EnemyType.NORMAL);
    expect(config.name).toBe('普通敵人');
    expect(config.baseHp).toBeGreaterThan(0);
    expect(config.speed).toBeGreaterThan(0);
  });

  it('should handle all enemy types', () => {
    const types = [
      EnemyType.NORMAL,
      EnemyType.ELITE,
      EnemyType.RANGED,
      EnemyType.SIEGE
    ];

    types.forEach(type => {
      const config = getEnemyConfig(type);
      expect(config).toBeDefined();
      expect(config.type).toBe(type);
    });
  });
});

describe('Building Data', () => {
  it('should load building config correctly', () => {
    const config = getBuildingConfig(BuildingType.TURRET);
    expect(config.name).toBe('弩砲塔');
    expect(config.baseHp).toBeGreaterThan(0);
    expect(config.cost).toBeGreaterThan(0);
  });

  it('should handle all building types', () => {
    const types = [
      BuildingType.WOOD_WALL,
      BuildingType.TURRET,
      BuildingType.LIGHTNING_TURRET,
      BuildingType.DEMON_SPAWNER
    ];

    types.forEach(type => {
      const config = getBuildingConfig(type);
      expect(config).toBeDefined();
      expect(config.type).toBe(type);
    });
  });
});

describe('Card Data', () => {
  it('should retrieve card by ID', () => {
    const card = getCardById('powerUp');
    expect(card).toBeDefined();
    expect(card?.name).toBe('魔王之力');
  });

  it('should return undefined for invalid card ID', () => {
    const card = getCardById('nonexistent');
    expect(card).toBeUndefined();
  });

  it('should generate random cards', () => {
    const cards = getRandomCards(3);
    expect(cards.length).toBe(3);
    expect(cards[0]).toBeDefined();
  });

  it('should not return excluded cards', () => {
    const cards = getRandomCards(10, ['powerUp', 'speedUp']);
    const ids = cards.map(c => c.id);
    expect(ids).not.toContain('powerUp');
    expect(ids).not.toContain('speedUp');
  });
});
