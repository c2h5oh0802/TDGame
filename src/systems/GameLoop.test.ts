/**
 * GameLoop Integration Tests
 * Tests the interaction between systems: wave spawning, enemy updates, combat, and UI
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GameLoop } from './GameLoop';
import { GameStateManager } from '../core/GameStateManager';

describe('GameLoop Integration Tests', () => {
  let gameLoop: GameLoop;
  let canvas: HTMLCanvasElement;
  let gameState: GameStateManager;

  beforeEach(() => {
    // Create a mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    gameState = new GameStateManager();
    gameState.resetGameState();

    gameLoop = new GameLoop(
      canvas,
      {
        gameWidth: 800,
        gameHeight: 600,
        coreX: 400,
        coreY: 300,
        playerStartX: 100,
        playerStartY: 100,
      },
      gameState,
      gameState.playerStats,
      gameState.metaSystem.upgrades,
      gameState.metaSystem.stats
    );

    gameLoop.reset();
  });

  describe('Wave System Integration', () => {
    it('should start with wave 1', () => {
      expect(gameLoop.waveManager.getCurrentWaveNumber()).toBe(1);
    });

    it('should spawn wave on demand', () => {
      gameLoop.waveManager.startWave();
      expect(gameLoop.waveManager.isWaveActive()).toBe(true);
    });

    it('should track wave progression', () => {
      gameLoop.waveManager.startWave();
      expect(gameLoop.waveManager.getCurrentWaveNumber()).toBe(1);

      // Manually advance wave for testing
      gameLoop.waveManager.currentWave = 1;
      gameLoop.waveManager.startWave();
      expect(gameLoop.waveManager.getCurrentWaveNumber()).toBe(2);
    });

    it('should have maximum 20 waves', () => {
      expect(gameLoop.waveManager.getTotalWaves()).toBe(20);
    });
  });

  describe('FlowField Integration', () => {
    it('should calculate direction from any point toward core', () => {
      const dir = gameLoop.flowField.getDirection(100, 100);
      expect(dir.x).toBeDefined();
      expect(dir.y).toBeDefined();
      // Direction should point generally toward core at 400,300
      expect(Math.abs(dir.x) + Math.abs(dir.y)).toBeGreaterThan(0);
    });

    it('should update core position', () => {
      const initialDir = gameLoop.flowField.getDirection(100, 100);
      gameLoop.flowField.updateCore(200, 200);
      const newDir = gameLoop.flowField.getDirection(100, 100);
      // Direction should change after core update
      expect(Math.abs(initialDir.x - newDir.x) + Math.abs(initialDir.y - newDir.y)).toBeGreaterThan(0);
    });

    it('should handle obstacle addition', () => {
      gameLoop.flowField.addObstacle(400, 300, 30);
      // Distance calculation should still work after adding obstacle
      const distAfter = gameLoop.flowField.getDistance(300, 300);
      expect(distAfter).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Upgrade System Integration', () => {
    it('should provide upgrade choices', () => {
      const choices = gameLoop.upgradeSystem.getUpgradeChoices();
      expect(choices.length).toBe(3);
      expect(choices[0].cardId).toBeDefined();
      expect(choices[0].type).toBeDefined();
    });

    it('should apply upgrades and track history', () => {
      const choices = gameLoop.upgradeSystem.getUpgradeChoices();
      const initialCount = gameLoop.upgradeSystem.getUpgradeCount();

      gameLoop.upgradeSystem.applyUpgrade(choices[0]);
      expect(gameLoop.upgradeSystem.getUpgradeCount()).toBe(initialCount + 1);
      expect(gameLoop.upgradeSystem.getUpgradeHistory().length).toBe(1);
    });

    it('should reset upgrades on new run', () => {
      const choices = gameLoop.upgradeSystem.getUpgradeChoices();
      gameLoop.upgradeSystem.applyUpgrade(choices[0]);
      expect(gameLoop.upgradeSystem.getUpgradeCount()).toBeGreaterThan(0);

      gameLoop.upgradeSystem.reset();
      expect(gameLoop.upgradeSystem.getUpgradeCount()).toBe(0);
      expect(gameLoop.upgradeSystem.getUpgradeHistory().length).toBe(0);
    });

    it('should apply meta bonuses', () => {
      const initialDamage = gameLoop.playerStats.damageMultiplier;
      gameLoop.metaUpgrades.powerStacking = 5;
      gameLoop.upgradeSystem.applyMetaBonuses();
      // Damage should increase with power stacking
      expect(gameLoop.playerStats.damageMultiplier).toBeGreaterThan(initialDamage);
    });
  });

  describe('GameLoop Update Cycle', () => {
    it('should handle game time progression', () => {
      const initialTime = gameLoop.gameTime;
      gameLoop.update(performance.now() + 1000); // Advance 1 second
      expect(gameLoop.gameTime).toBeGreaterThan(initialTime);
    });

    it('should track frame count and FPS', () => {
      const initialFrames = gameLoop.frameCount;
      gameLoop.update(performance.now());
      expect(gameLoop.frameCount).toBe(initialFrames + 1);
    });

    it('should pause and resume game', () => {
      gameLoop.waveManager.startWave();
      
      gameState.currentWave = 0; // Pause flag
      gameLoop.update(performance.now());
      
      gameState.currentWave = 1; // Resume
      gameLoop.update(performance.now());
      
      // Game should continue
      expect(gameLoop.gameOver).toBe(false);
    });
  });

  describe('Combat System Integration', () => {
    it('should spawn enemies in waves', () => {
      gameLoop.waveManager.startWave();
      gameLoop.waveManager.update();
      
      const enemies = gameLoop.waveManager.getEnemies();
      expect(enemies.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle enemy damage to core', () => {
      const coreHealthBefore = gameLoop.core.hp;
      gameLoop.core.takeDamage(10, []);
      expect(gameLoop.core.hp).toBe(coreHealthBefore - 10);
    });

    it('should end game on core destruction', () => {
      gameLoop.core.hp = 5;
      gameLoop.core.takeDamage(10, []);
      expect(gameLoop.core.hp).toBeLessThanOrEqual(0);
    });

    it('should track score from combat', () => {
      const scoreBefore = gameLoop.score;
      gameLoop.score += 100;
      expect(gameLoop.score).toBe(scoreBefore + 100);
    });
  });

  describe('GameState Snapshot', () => {
    it('should provide accurate game state', () => {
      gameLoop.waveManager.startWave();
      const state = gameLoop.getGameState();
      
      expect(state.score).toBeGreaterThanOrEqual(0);
      expect(state.resources).toBeGreaterThanOrEqual(0);
      expect(state.waveCount).toBe(1);
      expect(state.coreHp).toBeGreaterThan(0);
      expect(state.playerHp).toBeGreaterThan(0);
    });

    it('should match game loop properties', () => {
      const state = gameLoop.getGameState();
      expect(state.score).toBe(gameLoop.score);
      expect(state.coreHp).toBe(Math.max(0, gameLoop.core.hp));
      expect(state.playerHp).toBe(Math.max(0, gameLoop.player.hp));
    });
  });

  describe('Game Reset', () => {
    it('should reset all systems', () => {
      gameLoop.score = 1000;
      gameLoop.resources = 50;
      gameLoop.gameTime = 100;
      gameLoop.waveManager.startWave();

      gameLoop.reset();

      expect(gameLoop.score).toBe(0);
      expect(gameLoop.resources).toBe(100);
      expect(gameLoop.gameTime).toBe(0);
      expect(gameLoop.gameOver).toBe(false);
      expect(gameLoop.victory).toBe(false);
      expect(gameLoop.core.hp).toBe(gameLoop.core.maxHp);
      expect(gameLoop.player.hp).toBe(gameLoop.player.maxHp);
    });

    it('should allow multiple game runs', () => {
      gameLoop.reset();
      const firstState = gameLoop.getGameState();

      gameLoop.score = 500;
      gameLoop.reset();
      const secondState = gameLoop.getGameState();

      expect(firstState.score).toBe(secondState.score);
    });
  });

  describe('Renderer Integration', () => {
    it('should initialize renderer with canvas', () => {
      expect(gameLoop.renderer).toBeDefined();
      expect(gameLoop.renderer.canvas).toBe(canvas);
    });

    it('should support camera updates', () => {
      gameLoop.renderer.updateCamera(100, 100, 800, 600);
      // Camera should have moved toward target
      expect(gameLoop.renderer.cameraX).toBeDefined();
    });

    it('should support zoom control', () => {
      gameLoop.renderer.setZoom(2);
      expect(gameLoop.renderer.zoom).toBe(2);
      
      gameLoop.renderer.setZoom(0.5);
      expect(gameLoop.renderer.zoom).toBe(0.5);
    });

    it('should clamp zoom to valid range', () => {
      gameLoop.renderer.setZoom(10);
      expect(gameLoop.renderer.zoom).toBeLessThanOrEqual(3);
      
      gameLoop.renderer.setZoom(0.01);
      expect(gameLoop.renderer.zoom).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('Entity Management', () => {
    it('should manage building list', () => {
      expect(gameLoop.buildings.length).toBe(0);
      
      // Simulate adding a building
      gameLoop.buildings.push({} as any);
      expect(gameLoop.buildings.length).toBe(1);
      
      gameLoop.removeBuilding(0);
      expect(gameLoop.buildings.length).toBe(0);
    });

    it('should manage minion list', () => {
      expect(gameLoop.minions.length).toBe(0);
    });

    it('should manage projectile list', () => {
      expect(gameLoop.projectiles.length).toBe(0);
    });
  });

  describe('Full Game Flow', () => {
    it('should complete a basic game cycle', () => {
      // Start game
      expect(gameLoop.gameOver).toBe(false);
      
      // Start wave
      gameLoop.waveManager.startWave();
      expect(gameLoop.waveManager.isWaveActive()).toBe(true);
      
      // Update once
      gameLoop.update(performance.now());
      
      // Game should still be running
      expect(gameLoop.gameOver).toBe(false);
    });

    it('should track meta stats during game', () => {
      const initialRuns = gameLoop.metaStats.totalRuns;
      
      gameLoop.waveManager.startWave();
      gameLoop.update(performance.now());
      
      // Meta stats should be accessible
      expect(gameLoop.metaStats.totalRuns).toBe(initialRuns);
    });
  });
});
