/**
 * UIManager
 * Manages DOM elements and UI updates
 */

import type { GameLoop } from '../systems/GameLoop';

export class UIManager {
  gameLoop: GameLoop;
  hudElement: HTMLElement;
  statsPanel: HTMLElement;
  upgradePanel: HTMLElement;
  pausePanel: HTMLElement;
  gameOverPanel: HTMLElement;
  visible: boolean = true;

  constructor(gameLoop: GameLoop) {
    this.gameLoop = gameLoop;
    this.hudElement = this.createHUD();
    this.statsPanel = this.createStatsPanel();
    this.upgradePanel = this.createUpgradePanel();
    this.pausePanel = this.createPausePanel();
    this.gameOverPanel = this.createGameOverPanel();

    document.body.appendChild(this.hudElement);
    document.body.appendChild(this.statsPanel);
    document.body.appendChild(this.upgradePanel);
    document.body.appendChild(this.pausePanel);
    document.body.appendChild(this.gameOverPanel);
  }

  /**
   * Create HUD element
   */
  private createHUD(): HTMLElement {
    const hud = document.createElement('div');
    hud.id = 'game-hud';
    hud.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      font-family: monospace;
      font-size: 14px;
      color: #fff;
      z-index: 10;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      max-width: 300px;
    `;
    return hud;
  }

  /**
   * Create stats panel
   */
  private createStatsPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'stats-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      font-family: monospace;
      font-size: 12px;
      color: #fff;
      z-index: 10;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      max-width: 250px;
    `;
    return panel;
  }

  /**
   * Create upgrade selection panel
   */
  private createUpgradePanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'upgrade-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(20, 20, 40, 0.95);
      border: 2px solid #4ade80;
      border-radius: 8px;
      padding: 20px;
      z-index: 100;
      display: none;
      max-width: 600px;
      color: #fff;
      font-family: Arial, sans-serif;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Select an Upgrade';
    title.style.cssText = 'margin-top: 0; color: #4ade80; text-align: center;';
    panel.appendChild(title);

    const choices = document.createElement('div');
    choices.id = 'upgrade-choices';
    choices.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;';
    panel.appendChild(choices);

    return panel;
  }

  /**
   * Create pause menu
   */
  private createPausePanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'pause-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(20, 20, 40, 0.95);
      border: 2px solid #fbbf24;
      border-radius: 8px;
      padding: 20px;
      z-index: 100;
      display: none;
      color: #fff;
      font-family: Arial, sans-serif;
      text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'PAUSED';
    title.style.cssText = 'color: #fbbf24; margin-top: 0;';
    panel.appendChild(title);

    const resumeBtn = document.createElement('button');
    resumeBtn.textContent = 'Resume (ESC)';
    resumeBtn.style.cssText = `
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      background: #4ade80;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    resumeBtn.onclick = () => this.togglePauseMenu();
    panel.appendChild(resumeBtn);

    return panel;
  }

  /**
   * Create game over screen
   */
  private createGameOverPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'game-over-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(20, 20, 40, 0.95);
      border: 2px solid #ef4444;
      border-radius: 8px;
      padding: 30px;
      z-index: 100;
      display: none;
      color: #fff;
      font-family: Arial, sans-serif;
      text-align: center;
      max-width: 400px;
    `;

    const title = document.createElement('h2');
    title.id = 'game-over-title';
    title.textContent = 'GAME OVER';
    title.style.cssText = 'color: #ef4444; margin-top: 0;';
    panel.appendChild(title);

    const stats = document.createElement('div');
    stats.id = 'game-over-stats';
    stats.style.cssText = 'margin: 20px 0; text-align: left;';
    panel.appendChild(stats);

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Play Again';
    restartBtn.style.cssText = `
      display: block;
      margin: 10px auto;
      padding: 10px 20px;
      background: #4ade80;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    restartBtn.onclick = () => location.reload();
    panel.appendChild(restartBtn);

    return panel;
  }

  /**
   * Update HUD information
   */
  updateHUD(): void {
    const state = this.gameLoop.getGameState();

    this.hudElement.innerHTML = `
      <div>Wave: ${state.waveCount}/${this.gameLoop.waveManager.getTotalWaves()}</div>
      <div>Resources: ${state.resources}</div>
      <div>Score: ${state.score}</div>
      <div>Enemies: ${state.enemyCount}</div>
      <div style="color: ${state.coreHp < state.coreHp * 0.25 ? '#ef4444' : '#4ade80'}">
        Core: ${state.coreHp}/${this.gameLoop.core.maxHp}
      </div>
    `;
  }

  /**
   * Update stats panel
   */
  updateStatsPanel(): void {
    const stats = this.gameLoop.playerStats;

    this.statsPanel.innerHTML = `
      <div><strong>Player Stats</strong></div>
      <div>Damage Mult: ${stats.damageMultiplier.toFixed(1)}x</div>
      <div>Speed Mult: ${stats.moveSpeedMultiplier.toFixed(1)}x</div>
      <div>Attack Speed Mult: ${stats.attackSpeedMultiplier.toFixed(1)}x</div>
      <div>Projectiles: ${stats.projectileCount}</div>
      <div>Pierce: ${stats.pierceLimit}</div>
    `;
  }

  /**
   * Show upgrade selection menu
   */
  showUpgradeMenu(): void {
    const choices = this.gameLoop.upgradeSystem.getUpgradeChoices();
    const choicesDiv = document.getElementById('upgrade-choices')!;
    choicesDiv.innerHTML = '';

    for (const choice of choices) {
      const button = document.createElement('button');
      button.style.cssText = `
        flex: 1;
        min-width: 150px;
        padding: 15px;
        background: rgba(50, 50, 100, 0.8);
        border: 1px solid #4ade80;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      `;

      button.innerHTML = `
        <div style="color: #4ade80; font-weight: bold;">${choice.type}</div>
        <div style="color: #aaa; font-size: 11px; margin-top: 5px;">${choice.effect}</div>
      `;

      button.onmouseover = () => {
        button.style.background = 'rgba(74, 222, 128, 0.2)';
      };

      button.onmouseout = () => {
        button.style.background = 'rgba(50, 50, 100, 0.8)';
      };

      button.onclick = () => {
        this.gameLoop.upgradeSystem.applyUpgrade(choice);
        this.hideUpgradeMenu();
      };

      choicesDiv.appendChild(button);
    }

    this.upgradePanel.style.display = 'block';
  }

  /**
   * Hide upgrade menu
   */
  hideUpgradeMenu(): void {
    this.upgradePanel.style.display = 'none';
  }

  /**
   * Toggle pause menu
   */
  togglePauseMenu(): void {
    // Since currentState is private, we'll use a simple flag approach
    const isPaused = this.gameLoop.gameState.currentWave === 0;

    if (!isPaused) {
      // Pause: set flag
      const temp = this.gameLoop.gameState.currentWave;
      (this.gameLoop.gameState as any)._pausedWave = temp;
      this.gameLoop.gameState.currentWave = 0;
      this.pausePanel.style.display = 'block';
    } else {
      // Resume
      const pausedWave = (this.gameLoop.gameState as any)._pausedWave || 1;
      this.gameLoop.gameState.currentWave = pausedWave;
      this.pausePanel.style.display = 'none';
    }
  }

  /**
   * Show game over screen
   */
  showGameOverScreen(): void {
    const title = document.getElementById('game-over-title')!;
    const stats = document.getElementById('game-over-stats')!;
    const state = this.gameLoop.getGameState();

    if (this.gameLoop.victory) {
      title.textContent = 'VICTORY!';
      title.style.color = '#4ade80';
    } else {
      title.textContent = 'DEFEAT!';
      title.style.color = '#ef4444';
    }

    stats.innerHTML = `
      <div>Final Score: <strong>${state.score}</strong></div>
      <div>Wave Reached: <strong>${state.waveCount}</strong></div>
      <div>Total Upgrades: <strong>${this.gameLoop.upgradeSystem.getUpgradeCount()}</strong></div>
      <div>Core Remaining: <strong>${state.coreHp} HP</strong></div>
    `;

    this.gameOverPanel.style.display = 'block';
  }

  /**
   * Toggle HUD visibility
   */
  toggleHUD(): void {
    this.visible = !this.visible;
    this.hudElement.style.display = this.visible ? 'block' : 'none';
    this.statsPanel.style.display = this.visible ? 'block' : 'none';
  }

  /**
   * Cleanup and remove UI elements
   */
  destroy(): void {
    this.hudElement.remove();
    this.statsPanel.remove();
    this.upgradePanel.remove();
    this.pausePanel.remove();
    this.gameOverPanel.remove();
  }
}
