import { Entity } from './Entity';
import { SoundManager } from '../core/SoundManager';
import { FloatingText } from './Entity';

export class Core extends Entity {
  maxHp: number;
  hp: number;
  isCore: boolean;

  constructor() {
    super(0, 0, 50, '#ff3333');
    this.maxHp = 1000;
    this.hp = this.maxHp;
    this.isCore = true;
  }

  takeDamage(amount: number, floatingTexts: FloatingText[]): void {
    let actual = Math.min(Math.max(0, this.hp), amount);
    this.hp -= amount;
    this.hitFlash = 0.1;

    if (actual > 0) {
      floatingTexts.push(new FloatingText(this.x, this.y - 40, Math.ceil(actual), '#ef4444'));
      SoundManager.play('player_hit');
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      // Game over event would be triggered here
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw radius indicator
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.setLineDash([5, 10]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw core structure
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-50, -50, 100, 100);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(-50, -50, 100, 100);

    // Draw diamond shape with glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = this.hitFlash > 0 ? '#fff' : '#ff0000';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(35, 0);
    ctx.lineTo(0, 40);
    ctx.lineTo(-35, 0);
    ctx.closePath();
    ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.restore();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D): void {
    if (this.hp >= this.maxHp) return;
    const bw = 80;
    const bh = 8;
    const by = this.y - 60;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - bw / 2, by, bw, bh);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - bw / 2, by, (bw * this.hp) / this.maxHp, bh);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x - bw / 2, by, bw, bh);
  }
}
