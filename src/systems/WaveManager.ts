/**
 * WaveManager
 * Manages enemy spawning, wave progression, and enemy lifecycle
 */

import { Enemy } from '../entities/Enemy';
import { WAVE_DATA } from '../data/waveData';
import type { EnemyType } from '../core/types';
import { FlowField } from './FlowField';

export interface EnemySpawn {
  type: EnemyType;
  spawnTime: number; // milliseconds from wave start
  difficulty: number;
}

export class WaveManager {
  currentWave: number = 0;
  maxWaves: number = WAVE_DATA.length;
  waveStartTime: number = 0;
  waveActive: boolean = false;
  enemies: Enemy[] = [];
  flowField: FlowField;
  gameWidth: number;
  gameHeight: number;
  coreX: number;
  coreY: number;
  difficulty: number = 1;
  spawnedIndices: Set<number> = new Set();
  currentEnemySchedule: EnemySpawn[] = [];

  constructor(
    flowField: FlowField,
    gameWidth: number,
    gameHeight: number,
    coreX: number,
    coreY: number
  ) {
    this.flowField = flowField;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.coreX = coreX;
    this.coreY = coreY;
  }

  /**
   * Start a new wave
   */
  startWave(): void {
    if (this.currentWave >= this.maxWaves) {
      // Game over - victory
      return;
    }

    this.waveStartTime = Date.now();
    this.waveActive = true;
    this.enemies = [];
    this.spawnedIndices.clear();
    this.difficulty = 1 + this.currentWave * 0.15; // Increase difficulty over waves

    // Build spawn schedule from wave enemies
    this.currentEnemySchedule = [];
    const waveData = WAVE_DATA[this.currentWave];
    let timeOffset = 0;

    for (const enemyGroup of waveData.enemies) {
      for (let i = 0; i < enemyGroup.count; i++) {
        this.currentEnemySchedule.push({
          type: enemyGroup.type,
          spawnTime: timeOffset,
          difficulty: this.difficulty,
        });
        timeOffset += enemyGroup.delay * 1000; // delay is in seconds
      }
    }
  }

  /**
   * Update wave - spawn enemies based on time
   */
  update(): void {
    if (!this.waveActive || this.currentWave >= this.maxWaves) {
      return;
    }

    const timeSinceWaveStart = (Date.now() - this.waveStartTime);

    // Spawn enemies according to schedule
    for (let i = 0; i < this.currentEnemySchedule.length; i++) {
      if (this.spawnedIndices.has(i)) continue;

      const spawn = this.currentEnemySchedule[i];
      if (timeSinceWaveStart >= spawn.spawnTime) {
        this.spawnEnemy(spawn.type);
        this.spawnedIndices.add(i);
      }
    }

    // Update all active enemies
    const aliveEnemies: Enemy[] = [];
    for (const enemy of this.enemies) {
      if (!enemy.isDead) {
        aliveEnemies.push(enemy);
      }
    }
    this.enemies = aliveEnemies;

    // Check if wave is complete
    if (
      this.spawnedIndices.size === this.currentEnemySchedule.length &&
      this.enemies.length === 0
    ) {
      this.completeWave();
    }
  }

  /**
   * Spawn a single enemy
   */
  private spawnEnemy(type: EnemyType): void {
    // Pick a random spawn point (top or left edge)
    let spawnX: number;
    let spawnY: number;

    if (Math.random() < 0.5) {
      // Spawn from top
      spawnX = Math.random() * this.gameWidth;
      spawnY = -20;
    } else {
      // Spawn from left
      spawnX = -20;
      spawnY = Math.random() * this.gameHeight;
    }

    const waveNum = this.currentWave + 1;
    const enemy = new Enemy(spawnX, spawnY, type, waveNum, 1);

    this.enemies.push(enemy);
  }

  /**
   * Complete the current wave and prepare for next
   */
  private completeWave(): void {
    this.waveActive = false;
    this.currentWave++;
  }

  /**
   * End the current wave early (for testing or special events)
   */
  endWave(): void {
    this.waveActive = false;
    this.enemies = [];
    this.spawnedIndices.clear();
  }

  /**
   * Get all active enemies
   */
  getEnemies(): Enemy[] {
    return this.enemies;
  }

  /**
   * Get number of enemies still in the wave
   */
  getEnemyCount(): number {
    return this.enemies.length;
  }

  /**
   * Check if all waves are complete
   */
  isGameComplete(): boolean {
    return this.currentWave >= this.maxWaves && this.enemies.length === 0;
  }

  /**
   * Get current wave number (1-indexed for display)
   */
  getCurrentWaveNumber(): number {
    return this.currentWave + 1;
  }

  /**
   * Get total number of waves
   */
  getTotalWaves(): number {
    return this.maxWaves;
  }

  /**
   * Check if currently in an active wave
   */
  isWaveActive(): boolean {
    return this.waveActive;
  }

  /**
   * Reset the wave manager for a new game
   */
  reset(): void {
    this.currentWave = 0;
    this.waveActive = false;
    this.enemies = [];
    this.spawnedIndices.clear();
    this.difficulty = 1;
    this.waveStartTime = 0;
    this.currentEnemySchedule = [];
  }

  /**
   * Get wave info for current wave
   */
  getCurrentWaveInfo(): typeof WAVE_DATA[0] | null {
    if (this.currentWave < this.maxWaves) {
      return WAVE_DATA[this.currentWave];
    }
    return null;
  }
}
