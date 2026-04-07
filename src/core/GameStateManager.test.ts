/**
 * 遊戲狀態管理器測試
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameStateManager } from '@/core/GameStateManager';
import { GameState, MinionMode } from '@/core/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('GameStateManager', () => {
  let gameState: GameStateManager;

  beforeEach(() => {
    gameState = new GameStateManager();
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with correct default values', () => {
    expect(gameState.getState()).toBe(GameState.START);
    expect(gameState.playerLevel).toBe(1);
    expect(gameState.currentExp).toBe(0);
    expect(gameState.gold).toBe(30);
    expect(gameState.totalKills).toBe(0);
  });

  it('should change game state correctly', () => {
    gameState.setState(GameState.PLAYING);
    expect(gameState.getState()).toBe(GameState.PLAYING);

    gameState.setState(GameState.PAUSED);
    expect(gameState.getState()).toBe(GameState.PAUSED);
  });

  it('should manage minion mode', () => {
    gameState.setMinionMode(MinionMode.DEFEND);
    expect(gameState.getMinionMode()).toBe(MinionMode.DEFEND);

    gameState.setMinionMode(MinionMode.FOLLOW);
    expect(gameState.getMinionMode()).toBe(MinionMode.FOLLOW);
  });

  it('should record damage statistics', () => {
    gameState.recordDamage('player', 100);
    gameState.recordDamage('player', 50);
    gameState.recordDamage('turret', 75);

    const stats = gameState.getDamageStats();
    expect(stats['player']).toBe(150);
    expect(stats['turret']).toBe(75);
  });

  it('should reset damage statistics', () => {
    gameState.recordDamage('player', 100);
    gameState.resetDamageStats();
    
    const stats = gameState.getDamageStats();
    expect(Object.keys(stats).length).toBe(0);
  });

  it('should handle pause state correctly', () => {
    gameState.setState(GameState.PLAYING);
    gameState.setPauseState(GameState.PLAYING);
    expect(gameState.getPauseState()).toBe(GameState.PLAYING);

    gameState.setState(GameState.PAUSED);
    expect(gameState.getPauseState()).toBe(GameState.PLAYING);
  });

  it('should apply meta progress', () => {
    gameState.metaSystem.souls = 100;
    gameState.metaSystem.upgrades.powerStacking = 1;

    gameState.saveMetaProgress();
    
    // 模擬新遊戲
    const newGameState = new GameStateManager();
    newGameState.loadMetaProgress();
    
    expect(newGameState.metaSystem.souls).toBe(100);
    expect(newGameState.metaSystem.upgrades.powerStacking).toBe(1);
  });

  it('should reset game state', () => {
    gameState.playerLevel = 10;
    gameState.gold = 500;
    gameState.currentExp = 50;
    gameState.totalKills = 100;

    gameState.resetGameState();

    expect(gameState.playerLevel).toBe(1);
    expect(gameState.gold).toBe(30);
    expect(gameState.currentExp).toBe(0);
    expect(gameState.totalKills).toBe(0);
  });

  it('should reset meta progress', () => {
    gameState.metaSystem.souls = 500;
    gameState.metaSystem.upgrades.powerStacking = 5;
    gameState.metaSystem.stats.totalRuns = 10;

    gameState.resetMetaProgress();

    expect(gameState.metaSystem.souls).toBe(0);
    expect(gameState.metaSystem.upgrades.powerStacking).toBe(0);
    expect(gameState.metaSystem.stats.totalRuns).toBe(0);
  });
});
