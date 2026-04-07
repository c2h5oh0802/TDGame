import { Entity } from './Entity';
import { SoundManager } from '../core/SoundManager';
import { Projectile } from './Projectile';
import { Particle, FloatingText } from './Entity';
import type { PlayerStats } from '../core/types';

export class Player extends Entity {
  maxHp: number;
  hp: number;
  baseSpeed: number;
  baseAttackCooldown: number;
  currentCooldown: number;
  magnetRadius: number;
  orbAngle: number;
  trailTimer: number;
  playerLevel: number;
  playerStats: PlayerStats;

  constructor(x: number, y: number, playerStats: PlayerStats, playerLevel: number = 1) {
    super(x, y, 20, '#9933ff');
    this.maxHp = 100;
    this.hp = this.maxHp;
    this.baseSpeed = 260;
    this.baseAttackCooldown = 0.4;
    this.currentCooldown = 0;
    this.magnetRadius = 180;
    this.orbAngle = 0;
    this.trailTimer = 0;
    this.playerLevel = playerLevel;
    this.playerStats = playerStats;
  }

  get speed(): number {
    return this.baseSpeed * this.playerStats.moveSpeedMultiplier;
  }

  get attackCooldown(): number {
    return this.baseAttackCooldown / this.playerStats.attackSpeedMultiplier;
  }

  update(
    dt: number,
    input: any,
    enemies: Entity[],
    particles: Particle[],
    projectiles: Projectile[],
    core: any,
    currentState: string
  ): void {
    this.updateHitFlash(dt);

    // Movement
    let dx = 0;
    let dy = 0;
    if (input.keys['KeyW']) dy -= 1;
    if (input.keys['KeyS']) dy += 1;
    if (input.keys['KeyA']) dx -= 1;
    if (input.keys['KeyD']) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy);
      dx /= length;
      dy /= length;
      this.x += dx * this.speed * dt;
      this.y += dy * this.speed * dt;

      // Toxic trail effect
      if (this.playerStats.toxicTrail) {
        this.trailTimer -= dt;
        if (this.trailTimer <= 0) {
          // SpawnParticles logic would be called here
          this.trailTimer = 0.3;
        }
      }
    }

    // Orbital attack system
    if (this.playerStats.orbitalLevel > 0) {
      this.orbAngle += dt * 2.5;
      const orbDamage = (15 + this.playerLevel * 2) * this.playerStats.damageMultiplier;

      for (let i = 0; i < this.playerStats.orbitalLevel; i++) {
        const angle = this.orbAngle + (i * Math.PI * 2) / this.playerStats.orbitalLevel;
        const ox = this.x + Math.cos(angle) * 85;
        const oy = this.y + Math.sin(angle) * 85;

        if (Math.random() < 0.2) {
          particles.push(new Particle(ox, oy, '#facc15', 1, 2, 20));
        }

        enemies.forEach((e: any) => {
          if (e.orbHitTimer <= 0 && Math.hypot(e.x - ox, e.y - oy) < 15 + e.radius) {
            e.takeDamage(orbDamage, []);
            e.orbHitTimer = 0.5;
          }
        });
      }
    }

    // Healing near core
    const distToCore = Math.hypot(this.x - core.x, this.y - core.y);
    if (distToCore < 120 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 2 * dt);
      if (Math.random() < 0.05) {
        particles.push(new Particle(this.x, this.y, '#4ade80', 1, 3, 20));
      }
    }

    // Attack cooldown and shooting
    if (this.currentCooldown > 0) this.currentCooldown -= dt;
    if (currentState === 'PLAYING' && input.mouseDown && this.currentCooldown <= 0) {
      this.shoot(input, projectiles);
      this.currentCooldown = this.attackCooldown;
    }
  }

  shoot(input: any, projectiles: Projectile[]): void {
    const angle = Math.atan2(input.worldMouseY - this.y, input.worldMouseX - this.x);
    const finalDamage = (10 * this.playerStats.damageMultiplier);

    let pColor = '#ffff66';
    if (this.playerStats.fireLevel > 0) pColor = '#ef4444';
    if (this.playerStats.iceLevel > 0) pColor = '#38bdf8';
    if (this.playerStats.lightningLevel > 0) pColor = '#c084fc';

    SoundManager.play('shoot');

    for (let i = 0; i < this.playerStats.projectileCount; i++) {
      const spreadFactor = this.playerStats.spreadShot ? 0.25 : 0.15;
      let offset = 0;
      if (this.playerStats.projectileCount > 1) {
        offset = (i - (this.playerStats.projectileCount - 1) / 2) * spreadFactor;
      }
      const proj = new Projectile(
        this.x,
        this.y,
        angle + offset,
        finalDamage,
        pColor,
        false,
        6,
        1000,
        this.playerStats.pierceLimit,
        'player'
      );
      proj.isPlayerProj = true;
      projectiles.push(proj);
    }
  }

  takeDamage(amount: number, floatingTexts: FloatingText[]): void {
    const actual = Math.min(Math.max(0, this.hp), amount);
    this.hp -= amount;
    this.hitFlash = 0.1;

    if (actual > 0) {
      floatingTexts.push(new FloatingText(this.x, this.y - 25, actual, '#ef4444'));
      SoundManager.play('player_hit');
    }

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
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Draw orbitals
    if (this.playerStats.orbitalLevel > 0) {
      ctx.save();
      ctx.translate(this.x, this.y);
      for (let i = 0; i < this.playerStats.orbitalLevel; i++) {
        const angle = this.orbAngle + (i * Math.PI * 2) / this.playerStats.orbitalLevel;
        const ox = Math.cos(angle) * 85;
        const oy = Math.sin(angle) * 85;
        ctx.beginPath();
        ctx.arc(ox, oy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#facc15';
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
