/**
 * 遊戲狀態管理系統
 */

import { GameState, MinionMode, MetaUpgrades, MetaStats, PlayerStats } from './types';

export class GameStateManager {
  private currentState: GameState = GameState.START;
  private prePauseState: GameState = GameState.PLAYING;

  // 波次和時間
  currentWave: number = 1;
  readonly totalWaves: number = 20;
  isWaveSpawning: boolean = true;
  waveTimer: number = 30;
  maxWaveTimer: number = 30;
  breakTimer: number = 0;
  maxBreakTimer: number = 30;
  bossSpawned: boolean = false;

  // 資源與等級
  playerLevel: number = 1;
  currentExp: number = 0;
  maxExp: number = 15;
  gold: number = 30;
  rerollCost: number = 10;

  // 遊戲模式
  minionMode: MinionMode = MinionMode.AGGRESSIVE;
  selectedStage: number = 1;

  // 結算統計
  totalKills: number = 0;
  totalPlayTime: number = 0;

  // Meta 系統
  metaSystem = {
    souls: 0,
    upgrades: {} as MetaUpgrades,
    stats: {} as MetaStats
  };

  // 玩家屬性
  playerStats: PlayerStats = {
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.0,
    moveSpeedMultiplier: 1.0,
    projectileCount: 1,
    pierceLimit: 0,
    goldDamageScaling: 0,
    fireLevel: 0,
    iceLevel: 0,
    lightningLevel: 0,
    thorns: 0,
    corpseExplosion: false,
    wallExplosion: false,
    auraHeal: false,
    minionFrenzy: false,
    necromancy: false,
    buildingHpMultiplier: 1.0,
    extraMinionCapacity: 0,
    bonusGoldDrop: 0,
    lifeSteal: 0,
    spreadShot: false,
    explosiveRounds: false,
    homingMissiles: false,
    orbitalLevel: 0,
    toxicTrail: false
  };

  // 傷害統計
  damageStats: Record<string, number> = {};

  constructor() {
    this.initializeMetaSystem();
  }

  private initializeMetaSystem(): void {
    this.metaSystem.upgrades = {
      powerStacking: 0,
      speedStacking: 0,
      healthStacking: 0,
      coreHealthStacking: 0,
      goldStacking: 0,
      soulStacking: 0,
      startWalls: false,
      startTurret: false,
      extraCardSlot: false,
      extraMinionMax: false,
      luckyBlessing: false,
      endlessMode: false
    };

    this.metaSystem.stats = {
      totalRuns: 0,
      bestWave: 0,
      totalKillsAllTime: 0,
      unlockedStage: 1
    };
  }

  // 狀態管理
  setState(state: GameState): void {
    this.currentState = state;
  }

  getState(): GameState {
    return this.currentState;
  }

  setPauseState(state: GameState): void {
    this.prePauseState = state;
  }

  getPauseState(): GameState {
    return this.prePauseState;
  }

  // 模式管理
  setMinionMode(mode: MinionMode): void {
    this.minionMode = mode;
  }

  getMinionMode(): MinionMode {
    return this.minionMode;
  }

  // 傷害統計
  recordDamage(source: string, amount: number): void {
    if (!this.damageStats[source]) {
      this.damageStats[source] = 0;
    }
    this.damageStats[source] += amount;
  }

  getDamageStats(): Record<string, number> {
    return this.damageStats;
  }

  resetDamageStats(): void {
    this.damageStats = {};
  }

  // Meta 進度保存/加載
  saveMetaProgress(): void {
    const data = {
      souls: this.metaSystem.souls,
      upgrades: this.metaSystem.upgrades,
      stats: this.metaSystem.stats
    };
    localStorage.setItem('tdgameMeta', JSON.stringify(data));
  }

  loadMetaProgress(): void {
    const saved = localStorage.getItem('tdgameMeta');
    if (saved) {
      const data = JSON.parse(saved);
      this.metaSystem.souls = data.souls || 0;
      this.metaSystem.upgrades = { ...this.metaSystem.upgrades, ...data.upgrades };
      this.metaSystem.stats = { ...this.metaSystem.stats, ...data.stats };
    }
  }

  resetMetaProgress(): void {
    this.metaSystem.souls = 0;
    this.initializeMetaSystem();
    localStorage.removeItem('tdgameMeta');
  }

  // 重置遊戲狀態
  resetGameState(): void {
    this.playerLevel = 1;
    this.currentExp = 0;
    this.maxExp = 15;
    this.gold = 30;
    this.totalKills = 0;
    this.totalPlayTime = 0;
    this.currentWave = 1;
    this.bossSpawned = false;
    this.resetDamageStats();
    this.resetPlayerStats();
  }

  private resetPlayerStats(): void {
    this.playerStats = {
      damageMultiplier: 1.0,
      attackSpeedMultiplier: 1.0,
      moveSpeedMultiplier: 1.0,
      projectileCount: 1,
      pierceLimit: 0,
      goldDamageScaling: 0,
      fireLevel: 0,
      iceLevel: 0,
      lightningLevel: 0,
      thorns: 0,
      corpseExplosion: false,
      wallExplosion: false,
      auraHeal: false,
      minionFrenzy: false,
      necromancy: false,
      buildingHpMultiplier: 1.0,
      extraMinionCapacity: 0,
      bonusGoldDrop: 0,
      lifeSteal: 0,
      spreadShot: false,
      explosiveRounds: false,
      homingMissiles: false,
      orbitalLevel: 0,
      toxicTrail: false
    };
  }
}

// 全域狀態實例
export const gameState = new GameStateManager();
