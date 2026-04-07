import { Entity, Particle } from './Entity';

export class Worker extends Entity {
  maxHp: number;
  hp: number;
  baseSpeed: number;
  level: number;
  carryingResources: number;
  targetX: number;
  targetY: number;
  hasTarget: boolean;
  returnPath: Array<{ x: number; y: number }>;

  constructor(x: number, y: number, level: number = 1) {
    super(x, y, 8, '#a78bfa');
    this.maxHp = 5 + level * 2;
    this.hp = this.maxHp;
    this.baseSpeed = 150;
    this.level = level;
    this.carryingResources = 0;
    this.targetX = x;
    this.targetY = y;
    this.hasTarget = false;
    this.returnPath = [];
  }

  get speed(): number {
    return this.baseSpeed * (this.carryingResources > 0 ? 0.8 : 1.0);
  }

  update(
    dt: number,
    resources: Array<{ x: number; y: number; amount: number; isDead: boolean }>,
    dropoffPoint: { x: number; y: number },
    particles: Particle[]
  ): void {
    this.updateHitFlash(dt);

    // If no target, find nearest resource
    if (!this.hasTarget || this.carryingResources === 0) {
      let closestResource: any = null;
      let minDist = Infinity;

      resources.forEach((r) => {
        if (!r.isDead) {
          const dist = Math.hypot(r.x - this.x, r.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            closestResource = r;
          }
        }
      });

      if (closestResource) {
        this.targetX = closestResource.x;
        this.targetY = closestResource.y;
        this.hasTarget = true;
      }
    }

    // Move towards target
    const distToTarget = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    if (distToTarget > 5) {
      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;

      // Particle trail
      if (this.carryingResources > 0 && Math.random() < 0.2) {
        particles.push(new Particle(this.x, this.y, '#fbbf24', 1, 1, 30));
      }
    } else if (this.carryingResources === 0) {
      // Pick up resource
      this.carryingResources += 10;
      this.hasTarget = false;

      // Head to dropoff
      this.targetX = dropoffPoint.x;
      this.targetY = dropoffPoint.y;
      this.hasTarget = true;
    } else {
      // Drop off resource and return to start
      this.carryingResources = 0;
      this.hasTarget = false;
    }
  }

  takeDamage(amount: number): void {
    Math.min(Math.max(0, this.hp), amount);
    this.hp -= amount;
    this.hitFlash = 0.1;

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw carrying indicator
    if (this.carryingResources > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2, -4, 4, 3);
    }

    ctx.restore();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D): void {
    if (this.hp >= this.maxHp) return;
    const bw = this.radius * 2;
    const bh = 1.5;
    const by = this.y - this.radius - 3;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - bw / 2, by, bw, bh);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - bw / 2, by, (bw * this.hp) / this.maxHp, bh);
  }
}
