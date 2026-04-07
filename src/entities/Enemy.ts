import { Entity, Particle, FloatingText } from './Entity';
import type { EnemyType } from '../core/types';
import { EnemyType as EnemyTypeEnum } from '../core/types';
import { getEnemyConfig } from '../data/enemyData';

export class Enemy extends Entity {
  type: EnemyType;
  angle: number;
  maxHp: number;
  hp: number;
  speed: number;
  damage: number;
  expValue: number;
  goldAmount: number;
  goldDropChance: number;
  attackCooldown: number;
  currentCooldown: number;
  orbHitTimer: number;
  freezeTimer: number;
  burnTimer: number;
  chillTimer: number;
  stateTimer: number;
  poisonTimer: number;
  poisonDps: number;
  poisonAccumulator: number;
  burnAccumulator: number;

  constructor(
    x: number,
    y: number,
    type: EnemyType,
    waveNumber: number = 1,
    playerLevel: number = 1,
    stageMultipliers: { enemyHpMul: number; enemyDmgMul: number; enemySpeedMul: number } = {
      enemyHpMul: 1,
      enemyDmgMul: 1,
      enemySpeedMul: 1,
    }
  ) {
    const config = getEnemyConfig(type);
    super(x, y, config.size, config.color);

    this.type = type;
    this.angle = 0;

    // Difficulty scaling curve (Flow Field Theory - segmented progression)
    let diffMult: number;
    if (waveNumber <= 5) {
      diffMult = waveNumber * 0.3; // Learning: 0.3, 0.6, 0.9, 1.2, 1.5
    } else if (waveNumber <= 10) {
      diffMult = 1.5 + (waveNumber - 5) * 0.5; // Growth: 2.0, 2.5, 3.0, 3.5, 4.0
    } else if (waveNumber <= 15) {
      diffMult = 4.0 + (waveNumber - 10) * 1.0; // Challenge: 5.0, 6.0, 7.0, 8.0, 9.0
    } else {
      diffMult = 9.0 + (waveNumber - 15) * 1.8; // Climax: 10.8, 12.6, 14.4, 16.2, 18.0
    }

    // Drop nerf from wave 12+
    let dropNerf = waveNumber >= 16 ? 0.5 : waveNumber >= 12 ? 0.75 : 1.0;

    // Early wave gold bonus
    let earlyWaveGoldBonus = waveNumber <= 10 ? 1.0 + (10 - waveNumber) * 0.15 : 1.0;

    // Set base stats based on type
    this.maxHp = config.baseHp + diffMult * 5 + playerLevel * 0.5;
    this.speed = config.speed + Math.random() * 20 + diffMult * 0.5;
    this.damage = config.damage + diffMult * 0.2;
    this.expValue = Math.ceil(config.reward.exp + diffMult * 2);
    this.goldAmount = Math.ceil(config.reward.gold * dropNerf * earlyWaveGoldBonus);
    this.goldDropChance = 0.7 * dropNerf;

    // Apply stage multipliers
    this.maxHp *= stageMultipliers.enemyHpMul;
    this.damage *= stageMultipliers.enemyDmgMul;
    this.speed *= stageMultipliers.enemySpeedMul;

    this.hp = this.maxHp;
    this.attackCooldown = type === EnemyTypeEnum.RANGED ? 2.0 : 1.0;
    this.currentCooldown = 0;
    this.orbHitTimer = 0;
    this.freezeTimer = 0;
    this.burnTimer = 0;
    this.chillTimer = 0;
    this.stateTimer = 0;
    this.poisonTimer = 0;
    this.poisonDps = 0;
    this.poisonAccumulator = 0;
    this.burnAccumulator = 0;
  }

  update(dt: number, particles: Particle[], floatingTexts: FloatingText[]): void {
    this.updateHitFlash(dt);

    if (this.orbHitTimer > 0) this.orbHitTimer -= dt;

    // Warlock particle effect
    if (this.type === EnemyTypeEnum.WARLOCK && Math.random() < 0.05) {
      particles.push(new Particle(this.x, this.y, '#c084fc', 1, 3, 20));
    }

    // Poison damage over time
    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      const d = this.poisonDps * dt;
      const actual = Math.min(Math.max(0, this.hp), d);
      this.hp -= d;
      this.poisonAccumulator += actual;

      if (Math.random() < 0.1) {
        particles.push(new Particle(this.x, this.y, '#22c55e', 1, 2, 20));
      }

      if (this.poisonAccumulator >= this.poisonDps * 0.5 && this.poisonAccumulator > 0) {
        floatingTexts.push(new FloatingText(this.x, this.y - this.radius, this.poisonAccumulator, '#22c55e'));
        this.poisonAccumulator = 0;
      }

      if (this.hp <= 0 && !this.isDead) {
        this.takeDamage(0, floatingTexts);
      }
    }

    // Burn damage over time
    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      const d = 15 * dt;
      const actual = Math.min(Math.max(0, this.hp), d);
      this.hp -= d;
      this.burnAccumulator += actual;

      if (Math.random() < 0.1) {
        particles.push(new Particle(this.x, this.y, '#ef4444', 1, 2, 20));
      }

      if (this.burnAccumulator >= 15 * 0.5 && this.burnAccumulator > 0) {
        floatingTexts.push(new FloatingText(this.x, this.y - this.radius, this.burnAccumulator, '#f97316'));
        this.burnAccumulator = 0;
      }

      if (this.hp <= 0 && !this.isDead) {
        this.takeDamage(0, floatingTexts);
      }
    }

    // Freeze prevents movement
    if (this.freezeTimer > 0) {
      this.freezeTimer -= dt;
      return;
    }

    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    // Movement
    let currentSpeed = this.speed;

    // Siege berserking at low HP
    if (this.type === EnemyTypeEnum.SIEGE && this.hp < this.maxHp * 0.3) {
      currentSpeed *= 1.8;
      if (Math.random() < 0.1) {
        particles.push(new Particle(this.x, this.y, '#d97706', 1, 3, 50));
      }
    }

    // Chill effect slows movement
    if (this.chillTimer > 0) {
      this.chillTimer -= dt;
      const slowFactor = Math.max(0.1, 1 - 0.4);
      currentSpeed *= slowFactor;
    }

    // Path movement would be handled by game systems
    this.angle = Math.atan2(this.y, this.x);
  }

  takeDamage(amount: number, floatingTexts: FloatingText[]): number {
    const actual = Math.min(Math.max(0, this.hp), amount);
    this.hp -= amount;
    this.hitFlash = 0.1;

    if (actual > 0) {
      floatingTexts.push(new FloatingText(this.x, this.y - this.radius, actual, '#fbbf24'));
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }

    return actual;
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

    // Draw type indicator (small details for different enemy types)
    if (this.type === EnemyTypeEnum.RANGED) {
      ctx.strokeStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === EnemyTypeEnum.ELITE) {
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D): void {
    if (this.hp >= this.maxHp) return;
    const bw = this.radius * 2;
    const bh = 3;
    const by = this.y - this.radius - 8;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - bw / 2, by, bw, bh);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - bw / 2, by, (bw * this.hp) / this.maxHp, bh);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x - bw / 2, by, bw, bh);
  }
}
