/**
 * 基礎實體類別
 */

export class Entity {
  x: number;
  y: number;
  radius: number;
  color: string;
  isDead: boolean = false;
  hitFlash: number = 0;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  updateHitFlash(dt: number): void {
    if (this.hitFlash > 0) {
      this.hitFlash -= dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.fill();
    ctx.closePath();
  }

  drawHealthBar(_ctx: CanvasRenderingContext2D): void {
    // 子類別可以覆蓋此方法
  }
}

export class Particle extends Entity {
  vx: number;
  vy: number;
  life: number = 1.0;
  decay: number;

  constructor(x: number, y: number, color: string, size: number, speed: number, lifeTime: number = 1.0) {
    super(x, y, Math.random() * size + 2, color);
    const angle = Math.random() * Math.PI * 2;
    const vel = Math.random() * speed + speed / 2;
    this.vx = Math.cos(angle) * vel;
    this.vy = Math.sin(angle) * vel;
    this.decay = lifeTime > 0 ? 1.0 / lifeTime : 2.0;
  }

  update(dt: number): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt * this.decay;
    this.radius = Math.max(0, this.radius - dt * 5);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number = 1.0;
  vy: number;
  size: number;

  constructor(x: number, y: number, value: number | string, color: string, isCrit: boolean = false) {
    this.x = x + (Math.random() * 20 - 10);
    this.y = y + (Math.random() * 10 - 5);
    this.text = String(value);
    this.color = color;
    this.vy = -30 - Math.random() * 20;
    this.size = isCrit ? 22 : 14;
  }

  update(dt: number): void {
    this.y += this.vy * dt;
    this.life -= dt * 1.5;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.font = `bold ${this.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
