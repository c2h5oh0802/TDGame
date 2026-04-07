/**
 * GameRenderer
 * Handles all canvas rendering for game entities and UI
 */

import type { Entity } from '../entities/Entity';
import type { Player } from '../entities/Player';
import type { Core } from '../entities/Core';
import type { Enemy } from '../entities/Enemy';
import type { FriendlyMinion } from '../entities/FriendlyMinion';
import type { Projectile } from '../entities/Projectile';
import { FlowField } from './FlowField';

export interface RenderOptions {
  showDebugGrid?: boolean;
  showFlowField?: boolean;
  showRanges?: boolean;
}

export class GameRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cameraX: number = 0;
  cameraY: number = 0;
  zoom: number = 1;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Clear the canvas
   */
  clear(bgColor: string = '#1a1a2e'): void {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Update camera position to follow target
   */
  updateCamera(targetX: number, targetY: number, mapWidth: number, mapHeight: number): void {
    const targetCameraX = targetX - this.width / 2 / this.zoom;
    const targetCameraY = targetY - this.height / 2 / this.zoom;

    // Smooth camera follow
    this.cameraX += (targetCameraX - this.cameraX) * 0.1;
    this.cameraY += (targetCameraY - this.cameraY) * 0.1;

    // Clamp to map bounds
    this.cameraX = Math.max(0, Math.min(this.cameraX, mapWidth - this.width / this.zoom));
    this.cameraY = Math.max(0, Math.min(this.cameraY, mapHeight - this.height / this.zoom));
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  private worldToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: (x - this.cameraX) * this.zoom,
      y: (y - this.cameraY) * this.zoom,
    };
  }

  /**
   * Draw a single entity
   */
  drawEntity(entity: Entity): void {
    entity.draw(this.ctx);
  }

  /**
   * Draw all entities
   */
  drawEntities(entities: Entity[]): void {
    for (const entity of entities) {
      this.drawEntity(entity);
    }
  }

  /**
   * Draw the player
   */
  drawPlayer(player: Player): void {
    this.drawEntity(player);
  }

  /**
   * Draw the core
   */
  drawCore(core: Core): void {
    this.drawEntity(core);
  }

  /**
   * Draw all enemies
   */
  drawEnemies(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      this.drawEntity(enemy);
      
      // Draw health bar
      const screenPos = this.worldToScreen(enemy.x, enemy.y);
      const barWidth = 20;
      const barHeight = 3;
      const barX = screenPos.x - barWidth / 2;
      const barY = screenPos.y - 15;

      // Background
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);

      // Health
      const healthPercent = Math.max(0, enemy.hp / enemy.maxHp);
      this.ctx.fillStyle = healthPercent > 0.5 ? '#4ade80' : healthPercent > 0.25 ? '#fbbf24' : '#ef4444';
      this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      // Border
      this.ctx.strokeStyle = '#666';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }

  /**
   * Draw all buildings
   */
  drawBuildings(buildings: any[]): void {
    for (const building of buildings) {
      this.drawEntity(building as any);
    }
  }

  /**
   * Draw all friendly minions
   */
  drawMinions(minions: FriendlyMinion[]): void {
    for (const minion of minions) {
      this.drawEntity(minion);
      
      // Draw health bar
      const screenPos = this.worldToScreen(minion.x, minion.y);
      const barWidth = 15;
      const barHeight = 2;
      const barX = screenPos.x - barWidth / 2;
      const barY = screenPos.y - 8;

      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(barX, barY, barWidth, barHeight);

      const healthPercent = Math.max(0, minion.hp / minion.maxHp);
      this.ctx.fillStyle = '#4ade80';
      this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      this.ctx.strokeStyle = '#666';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }

  /**
   * Draw all projectiles
   */
  drawProjectiles(projectiles: Projectile[]): void {
    for (const proj of projectiles) {
      this.drawEntity(proj);
    }
  }

  /**
   * Draw UI text overlay
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color: string = '#fff',
    size: number = 14,
    align: CanvasTextAlign = 'left'
  ): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px Arial`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw a centered text with background
   */
  drawTextBox(
    text: string,
    x: number,
    y: number,
    bgColor: string = 'rgba(0, 0, 0, 0.7)',
    textColor: string = '#fff',
    padding: number = 5
  ): void {
    const fontSize = 14;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    
    const metrics = this.ctx.measureText(text);
    const width = metrics.width + padding * 2;
    const height = fontSize + padding * 2;

    // Draw background
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

    // Draw border
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    // Draw text
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(text, x, y - fontSize / 2);
  }

  /**
   * Draw debug grid
   */
  drawDebugGrid(cellSize: number = 20): void {
    this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    this.ctx.lineWidth = 0.5;

    const startX = Math.floor(this.cameraX / cellSize) * cellSize;
    const startY = Math.floor(this.cameraY / cellSize) * cellSize;
    const endX = startX + this.width / this.zoom + cellSize;
    const endY = startY + this.height / this.zoom + cellSize;

    // Vertical lines
    for (let x = startX; x < endX; x += cellSize) {
      const screenX = (x - this.cameraX) * this.zoom;
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, 0);
      this.ctx.lineTo(screenX, this.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y < endY; y += cellSize) {
      const screenY = (y - this.cameraY) * this.zoom;
      this.ctx.beginPath();
      this.ctx.moveTo(0, screenY);
      this.ctx.lineTo(this.width, screenY);
      this.ctx.stroke();
    }
  }

  /**
   * Draw flow field for debugging
   */
  drawFlowField(flowField: FlowField): void {
    const cells = flowField.getDebugVisualization();
    const arrowLength = 10;

    for (const cell of cells) {
      const screenPos = this.worldToScreen(cell.x, cell.y);
      
      // Draw direction arrow
      const endX = screenPos.x + cell.directionX * arrowLength;
      const endY = screenPos.y + cell.directionY * arrowLength;

      this.ctx.strokeStyle = 'rgba(0, 200, 0, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(screenPos.x, screenPos.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Draw cell distance as color intensity
      const intensity = Math.min(255, Math.floor((cell.distance / 100) * 255));
      this.ctx.fillStyle = `rgba(0, ${intensity}, 0, 0.2)`;
      this.ctx.fillRect(screenPos.x - 5, screenPos.y - 5, 10, 10);
    }
  }

  /**
   * Resize the canvas
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Set zoom level
   */
  setZoom(zoom: number): void {
    this.zoom = Math.max(0.1, Math.min(3, zoom));
  }
}
