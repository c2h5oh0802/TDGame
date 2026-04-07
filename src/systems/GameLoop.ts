/**
 * GameLoop
 * Main game simulation and update loop
 */

import { Player } from '../entities/Player';
import { Core } from '../entities/Core';
import type { Building } from '../entities/Building';
import type { FriendlyMinion } from '../entities/FriendlyMinion';
import type { Projectile } from '../entities/Projectile';
import { GameStateManager } from '../core/GameStateManager';
import { InputManager } from '../core/InputManager';
import { SoundManager } from '../core/SoundManager';
import { FlowField } from './FlowField';
import { WaveManager } from './WaveManager';
import { UpgradeSystem } from './UpgradeSystem';
import { GameRenderer } from './GameRenderer';
import type { PlayerStats, MetaUpgrades, MetaStats } from '../core/types';

export interface GameConfig {
  gameWidth: number;
  gameHeight: number;
  coreX: number;
  coreY: number;
  playerStartX: number;
  playerStartY: number;
}

export class GameLoop {
  // Core systems
  gameState: GameStateManager;
  inputManager: InputManager;
  soundManager: SoundManager;
  flowField: FlowField;
  waveManager: WaveManager;
  upgradeSystem: UpgradeSystem;
  renderer: GameRenderer;

  // Game entities
  player: Player;
  core: Core;
  buildings: Building[] = [];
  minions: FriendlyMinion[] = [];
  projectiles: Projectile[] = [];

  // Game config
  config: GameConfig;
  gameTime: number = 0;
  lastFrameTime: number = 0;
  deltaTime: number = 0;
  frameCount: number = 0;
  fps: number = 0;

  // Game state
  playerStats: PlayerStats;
  metaUpgrades: MetaUpgrades;
  metaStats: MetaStats;
  resources: number = 0;
  score: number = 0;
  gameOver: boolean = false;
  victory: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    config: GameConfig,
    gameState: GameStateManager,
    playerStats: PlayerStats,
    metaUpgrades: MetaUpgrades,
    metaStats: MetaStats
  ) {
    this.config = config;
    this.gameState = gameState;
    this.playerStats = playerStats;
    this.metaUpgrades = metaUpgrades;
    this.metaStats = metaStats;

    // Initialize core systems
    this.inputManager = new InputManager();
    this.soundManager = SoundManager;
    this.renderer = new GameRenderer(canvas, config.gameWidth, config.gameHeight);

    // Initialize game entities
    this.core = new Core();
    this.player = new Player(
      config.playerStartX,
      config.playerStartY,
      playerStats
    );

    // Initialize game systems
    this.flowField = new FlowField(
      config.gameWidth,
      config.gameHeight,
      20,
      config.coreX,
      config.coreY
    );

    this.waveManager = new WaveManager(
      this.flowField,
      config.gameWidth,
      config.gameHeight,
      config.coreX,
      config.coreY
    );

    this.upgradeSystem = new UpgradeSystem(
      playerStats,
      metaUpgrades,
      metaStats
    );

    this.lastFrameTime = performance.now();
  }

  /**
   * Main game loop - called every frame
   */
  update(currentTime: number): void {
    // Calculate delta time
    this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    this.gameTime += this.deltaTime;
    this.frameCount++;

    // Update FPS every second
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1 / this.deltaTime);
    }

    // Early exit if game is over or paused
    if (this.gameOver || this.victory) {
      return;
    }

    if (this.gameState.currentWave === 0) {
      return;
    }

    // Update wave system
    this.waveManager.update();
    if (!this.waveManager.isWaveActive() && !this.waveManager.isGameComplete()) {
      // Wave ended, prepare next wave
      this.waveManager.startWave();
    }

    // Update player
    const enemies = this.waveManager.getEnemies();

    // Update enemies
    for (const enemy of enemies) {
      enemy.update(this.deltaTime, [], []);
      
      // Check if enemy reached core
      if (Math.hypot(enemy.x - this.core.x, enemy.y - this.core.y) < 30) {
        const damageValue = 10; // Default damage
        this.core.takeDamage(damageValue, []);
        enemy.isDead = true;

        if (this.core.hp <= 0) {
          this.endGame(false); // Defeat
        }
      }
    }

    // Update camera
    this.renderer.updateCamera(
      this.player.x,
      this.player.y,
      this.config.gameWidth,
      this.config.gameHeight
    );

    // Update projectiles
    const aliveProjectiles: Projectile[] = [];
    for (const proj of this.projectiles) {
      proj.update(this.deltaTime);
      
      // Check collisions with enemies
      for (const enemy of enemies) {
        if (
          !proj.isDead &&
          Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < 20
        ) {
          // Hit
          const damage = 10;
          enemy.takeDamage(damage, []);

          this.score += Math.floor(damage);

          if (proj.lifeTime !== undefined) {
            proj.lifeTime -= 1;
            if (proj.lifeTime <= 0) {
              proj.isDead = true;
            }
          }
        }
      }

      if (!proj.isDead) {
        aliveProjectiles.push(proj);
      }
    }
    this.projectiles = aliveProjectiles;

    // Check victory condition
    if (this.waveManager.isGameComplete() && enemies.length === 0) {
      this.endGame(true); // Victory
    }
  }

  /**
   * Render the current game state
   */
  render(): void {
    this.renderer.clear();

    // Render game entities
    this.renderer.drawPlayer(this.player);
    this.renderer.drawCore(this.core);
    this.renderer.drawBuildings(this.buildings);
    this.renderer.drawMinions(this.minions);
    this.renderer.drawEnemies(this.waveManager.getEnemies());
    this.renderer.drawProjectiles(this.projectiles);

    // Render UI overlay
    this.renderUI();
  }

  /**
   * Render UI information
   */
  private renderUI(): void {
    const padding = 10;
    const lineHeight = 20;
    let y = padding;

    // Wave info
    this.renderer.drawText(
      `Wave: ${this.waveManager.getCurrentWaveNumber()}/${this.waveManager.getTotalWaves()}`,
      padding,
      y,
      '#fff',
      16
    );
    y += lineHeight;

    // Resources
    this.renderer.drawText(
      `Resources: ${Math.floor(this.resources)}`,
      padding,
      y,
      '#4ade80',
      14
    );
    y += lineHeight;

    // Score
    this.renderer.drawText(
      `Score: ${this.score}`,
      padding,
      y,
      '#fbbf24',
      14
    );
    y += lineHeight;

    // Enemy count
    this.renderer.drawText(
      `Enemies: ${this.waveManager.getEnemyCount()}`,
      padding,
      y,
      '#ef4444',
      14
    );
    y += lineHeight;

    // Core health
    this.renderer.drawText(
      `Core HP: ${Math.max(0, this.core.hp)}/${this.core.maxHp}`,
      padding,
      y,
      this.core.hp < this.core.maxHp * 0.25 ? '#ef4444' : '#4ade80',
      14
    );

    // FPS (top right)
    this.renderer.drawText(
      `FPS: ${this.fps}`,
      this.config.gameWidth - 100,
      padding,
      '#888',
      12,
      'right'
    );
  }

  /**
   * Add a building at the specified location
   */
  addBuilding(building: Building): void {
    this.buildings.push(building);
  }

  /**
   * Remove a building
   */
  removeBuilding(index: number): void {
    if (index >= 0 && index < this.buildings.length) {
      this.buildings.splice(index, 1);
    }
  }

  /**
   * Spawn a friendly minion
   */
  spawnMinion(minion: FriendlyMinion): void {
    this.minions.push(minion);
  }

  /**
   * End the game (victory or defeat)
   */
  private endGame(victory: boolean): void {
    this.victory = victory;
    this.gameOver = true;
    this.gameState.currentWave = 0; // Use a flag to indicate game over

    if (victory) {
      this.metaStats.totalRuns++;
    }
  }

  /**
   * Reset the game for a new run
   */
  reset(): void {
    this.buildings = [];
    this.minions = [];
    this.projectiles = [];
    this.resources = 100; // Starting resources
    this.score = 0;
    this.gameTime = 0;
    this.gameOver = false;
    this.victory = false;
    this.frameCount = 0;

    this.core.hp = this.core.maxHp;
    this.player.hp = this.player.maxHp;
    this.waveManager.reset();
    this.upgradeSystem.reset();

    this.gameState.currentWave = 1;
  }

  /**
   * Get current game state snapshot
   */
  getGameState(): {
    score: number;
    resources: number;
    waveCount: number;
    enemyCount: number;
    coreHp: number;
    playerHp: number;
  } {
    return {
      score: this.score,
      resources: Math.floor(this.resources),
      waveCount: this.waveManager.getCurrentWaveNumber(),
      enemyCount: this.waveManager.getEnemyCount(),
      coreHp: Math.max(0, this.core.hp),
      playerHp: Math.max(0, this.player.hp),
    };
  }
}
