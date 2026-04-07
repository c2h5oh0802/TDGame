/**
 * FlowField Pathfinding System
 * Uses BFS to create a flow field from the Core to guide enemies
 */

export interface FlowFieldCell {
  x: number;
  y: number;
  distance: number;
  directionX: number; // normalized direction to core
  directionY: number;
}

export class FlowField {
  width: number;
  height: number;
  cellSize: number;
  field: Map<string, FlowFieldCell> = new Map();
  coreX: number;
  coreY: number;
  private obstacles: Set<string> = new Set();

  constructor(
    width: number,
    height: number,
    cellSize: number = 20,
    coreX: number = 0,
    coreY: number = 0
  ) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.coreX = coreX;
    this.coreY = coreY;
    this.initialize();
  }

  /**
   * Initialize the flow field with BFS from the core
   */
  private initialize(): void {
    this.field.clear();

    // Convert core position to grid
    const startGridX = Math.floor(this.coreX / this.cellSize);
    const startGridY = Math.floor(this.coreY / this.cellSize);

    // BFS queue
    const queue: [number, number][] = [[startGridX, startGridY]];
    const visited = new Set<string>();
    const key = (x: number, y: number) => `${x},${y}`;

    // Initialize start cell
    visited.add(key(startGridX, startGridY));
    this.field.set(key(startGridX, startGridY), {
      x: startGridX * this.cellSize,
      y: startGridY * this.cellSize,
      distance: 0,
      directionX: 0,
      directionY: 0,
    });

    // BFS to fill the flow field
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const currentCell = this.field.get(key(x, y))!;

      // Check all 8 directions
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;
          const nKey = key(nx, ny);

          // Check bounds
          if (nx < 0 || nx >= Math.ceil(this.width / this.cellSize)) continue;
          if (ny < 0 || ny >= Math.ceil(this.height / this.cellSize)) continue;

          // Skip if visited or obstacle
          if (visited.has(nKey) || this.obstacles.has(nKey)) continue;

          visited.add(nKey);

          // Calculate distance (diagonal = 1.4x horizontal/vertical)
          const dist =
            dx !== 0 && dy !== 0
              ? currentCell.distance + 1.4
              : currentCell.distance + 1;

          // Calculate direction from this cell back to core
          const worldX = nx * this.cellSize + this.cellSize / 2;
          const worldY = ny * this.cellSize + this.cellSize / 2;
          const dx_to_core = this.coreX - worldX;
          const dy_to_core = this.coreY - worldY;
          const len = Math.hypot(dx_to_core, dy_to_core);
          const dirX = len > 0 ? dx_to_core / len : 0;
          const dirY = len > 0 ? dy_to_core / len : 0;

          this.field.set(nKey, {
            x: worldX,
            y: worldY,
            distance: dist,
            directionX: dirX,
            directionY: dirY,
          });

          queue.push([nx, ny]);
        }
      }
    }
  }

  /**
   * Get the direction an entity at (x, y) should move towards the core
   */
  getDirection(x: number, y: number): { x: number; y: number } {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    const key = `${gridX},${gridY}`;

    const cell = this.field.get(key);
    if (!cell) {
      // If out of bounds, point directly to core
      const dx = this.coreX - x;
      const dy = this.coreY - y;
      const len = Math.hypot(dx, dy);
      return {
        x: len > 0 ? dx / len : 0,
        y: len > 0 ? dy / len : 0,
      };
    }

    return {
      x: cell.directionX,
      y: cell.directionY,
    };
  }

  /**
   * Get the distance field value at a position
   */
  getDistance(x: number, y: number): number {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    const key = `${gridX},${gridY}`;

    const cell = this.field.get(key);
    if (!cell) {
      return Math.hypot(this.coreX - x, this.coreY - y) / this.cellSize;
    }

    return cell.distance;
  }

  /**
   * Add an obstacle to the flow field (e.g., a building)
   */
  addObstacle(x: number, y: number, radius: number = 20): void {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    const gridRadius = Math.ceil(radius / this.cellSize);

    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        if (Math.hypot(dx, dy) <= gridRadius) {
          this.obstacles.add(`${gridX + dx},${gridY + dy}`);
        }
      }
    }

    // Rebuild the flow field after adding obstacle
    this.initialize();
  }

  /**
   * Remove an obstacle from the flow field
   */
  removeObstacle(x: number, y: number, radius: number = 20): void {
    const gridX = Math.floor(x / this.cellSize);
    const gridY = Math.floor(y / this.cellSize);
    const gridRadius = Math.ceil(radius / this.cellSize);

    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        if (Math.hypot(dx, dy) <= gridRadius) {
          this.obstacles.delete(`${gridX + dx},${gridY + dy}`);
        }
      }
    }

    // Rebuild the flow field after removing obstacle
    this.initialize();
  }

  /**
   * Update the core position and rebuild the flow field
   */
  updateCore(x: number, y: number): void {
    this.coreX = x;
    this.coreY = y;
    this.initialize();
  }

  /**
   * Debug visualization data (returns cells for drawing)
   */
  getDebugVisualization(): FlowFieldCell[] {
    return Array.from(this.field.values());
  }
}
