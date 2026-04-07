/**
 * TDGAME Main Entry Point
 * Initializes and runs the complete game with all systems integrated
 */

import { GameLoop, type GameConfig } from './systems/GameLoop';
import { UIManager } from './ui/UIManager';
import { GameStateManager } from './core/GameStateManager';

class Game {
  private gameLoop: GameLoop | null = null;
  private uiManager: UIManager | null = null;
  private gameState: GameStateManager;
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;

  constructor() {
    this.gameState = new GameStateManager();
    this.gameState.resetGameState();
  }

  /**
   * Initialize the game
   */
  public init(): boolean {
    // Get canvas element
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found');
      return false;
    }

    // Set canvas size
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
    } else {
      this.canvas.width = 800;
      this.canvas.height = 600;
    }

    // Game configuration
    const gameConfig: GameConfig = {
      gameWidth: this.canvas.width,
      gameHeight: this.canvas.height,
      coreX: this.canvas.width / 2,
      coreY: this.canvas.height / 2,
      playerStartX: 100,
      playerStartY: 100,
    };

    // Initialize GameLoop
    try {
      this.gameLoop = new GameLoop(
        this.canvas,
        gameConfig,
        this.gameState,
        this.gameState.playerStats,
        this.gameState.metaSystem.upgrades,
        this.gameState.metaSystem.stats
      );

      // Initialize UI Manager
      this.uiManager = new UIManager(this.gameLoop);

      // Setup input handlers
      this.setupInputHandlers();

      // Start the game
      this.start();

      console.log('✓ Game initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize game:', error);
      return false;
    }
  }

  /**
   * Start the game loop
   */
  private start(): void {
    if (!this.gameLoop) return;

    // Reset game state
    this.gameLoop.reset();

    // Start first wave
    this.gameLoop.waveManager.startWave();

    // Begin animation loop
    this.animate();
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (this.gameLoop) {
      // Update game state
      this.gameLoop.update(performance.now());

      // Update UI
      if (this.uiManager) {
        this.uiManager.updateHUD();
        this.uiManager.updateStatsPanel();

        // Show game over screen if needed
        if (this.gameLoop.gameOver) {
          this.uiManager.showGameOverScreen();
        }
      }

      // Render
      this.gameLoop.render();
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Setup input event handlers
   */
  private setupInputHandlers(): void {
    if (!this.gameLoop?.inputManager) return;

    const inputManager = this.gameLoop.inputManager;

    // Handle pause/resume
    inputManager.onKeyDown((code: string) => {
      if (code === 'Escape' && this.uiManager) {
        this.uiManager.togglePauseMenu();
      }
    });

    // Handle HUD toggle
    inputManager.onKeyDown((code: string) => {
      if (code === 'KeyH' && this.uiManager) {
        this.uiManager.toggleHUD();
      }
    });

    // Setup canvas mouse tracking
    if (this.canvas) {
      inputManager.onMouseMove((clientX: number, clientY: number) => {
        const rect = this.canvas!.getBoundingClientRect();
        const worldX = (clientX - rect.left) / this.gameLoop!.renderer.zoom + this.gameLoop!.renderer.cameraX;
        const worldY = (clientY - rect.top) / this.gameLoop!.renderer.zoom + this.gameLoop!.renderer.cameraY;
        inputManager.setWorldMousePos(worldX, worldY);
      });
    }

    // Window resize handler
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (!this.canvas) return;

    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;

      if (this.gameLoop) {
        this.gameLoop.renderer.resize(this.canvas.width, this.canvas.height);
      }
    }
  }

  /**
   * Stop the game
   */
  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.uiManager) {
      this.uiManager.destroy();
    }
  }
}

/**
 * Initialize game when DOM is ready
 */
function initializeGame(): void {
  const game = new Game();

  // Try to initialize
  if (!game.init()) {
    console.error('Failed to initialize game. Check console for errors.');
  }

  // Store game reference globally for debugging
  (window as any).gameInstance = game;
}

// Start game when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}

export { Game };
