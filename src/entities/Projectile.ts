import { Entity } from './Entity';

export class Projectile extends Entity {
  speed: number;
  vx: number;
  vy: number;
  damage: number;
  lifeTime: number;
  isEnemyProj: boolean;
  isPlayerProj: boolean;
  pierceLimit: number;
  hitTargets: Set<any>;
  isArtillery: boolean;
  splashRadius: number;
  sourceType: string;

  constructor(
    x: number,
    y: number,
    angle: number,
    damage: number,
    color: string,
    isEnemyProj: boolean = false,
    size: number = 6,
    speed: number = 600,
    pierceLimit: number = 0,
    sourceType: string = 'unknown'
  ) {
    super(x, y, size, color);
    this.speed = speed;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.damage = damage;
    this.lifeTime = 2.5;
    this.isEnemyProj = isEnemyProj;
    this.isPlayerProj = false;
    this.pierceLimit = pierceLimit;
    this.hitTargets = new Set();
    this.isArtillery = false;
    this.splashRadius = 0;
    this.sourceType = sourceType;
  }

  update(dt: number, enemies: any[] = [], playerStats: any = {}): void {
    // Homing missiles support
    if (this.isPlayerProj && playerStats.homingMissiles && !this.isDead) {
      let target: any = null;
      let minDist = 250;

      enemies.forEach((e: any) => {
        if (e.isDead || this.hitTargets.has(e)) return;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = e;
        }
      });

      if (target) {
        const targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
        let currentAngle = Math.atan2(this.vy, this.vx);
        let diff = targetAngle - currentAngle;

        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        currentAngle += Math.sign(diff) * Math.min(Math.abs(diff), 3.0 * dt);
        this.vx = Math.cos(currentAngle) * this.speed;
        this.vy = Math.sin(currentAngle) * this.speed;
      }
    }

    // Move projectile
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifeTime -= dt;

    if (this.lifeTime <= 0) this.isDead = true;
  }

  canHit(target: any): boolean {
    if (this.hitTargets.has(target)) return false;
    if (this.pierceLimit > 0 && this.hitTargets.size >= this.pierceLimit) return false;
    return true;
  }

  registerHit(target: any): void {
    this.hitTargets.add(target);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    super.draw(ctx);
    ctx.restore();
  }
}
