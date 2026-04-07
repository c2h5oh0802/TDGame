import { Entity, FloatingText } from './Entity';
import { Projectile } from './Projectile';
import type { MinionType, MinionMode } from '../core/types';
import { MinionMode as MinionModeEnum } from '../core/types';

export class FriendlyMinion extends Entity {
  type: MinionType;
  maxHp: number;
  hp: number;
  baseSpeed: number;
  speed: number;
  baseDamage: number;
  damage: number;
  level: number;
  expValue: number;
  attackCooldown: number;
  currentCooldown: number;
  attackRange: number;
  projectilePierce: number;
  forceDefend: boolean;
  chillOnHit: number;
  burnOnExplode: boolean;
  knockbackBlast: boolean;
  healAmount?: number;
  healRange?: number;
  mode: MinionMode;

  constructor(
    x: number,
    y: number,
    type: MinionType,
    level: number = 1,
    playerStats: any
  ) {
    // Determine size and color based on type
    let mSize = type === 'demon' ? 14 : type === 'ghost' ? 8 : 10;
    let mColor = '#d1d5db';

    if (type === 'demon') mColor = '#991b1b';
    else if (type === 'mage') mColor = '#7c3aed';
    else if (type === 'ghost') mColor = 'rgba(241, 245, 249, 0.8)';
    else if (type === 'archer') mColor = '#84cc16';
    else if (type === 'bomber') mColor = '#ea580c';
    else if (type === 'priest') mColor = '#db2777';

    super(x, y, mSize, mColor);

    this.type = type;
    this.level = level;
    this.mode = MinionModeEnum.DEFEND;

    // HP scaling
    if (type === 'demon') this.maxHp = 80 + level * 20;
    else if (type === 'ghost') this.maxHp = 4 + level * 1.5;
    else if (type === 'bomber') this.maxHp = 5 + level * 1;
    else if (type === 'priest') this.maxHp = 25 + level * 8;
    else this.maxHp = 15 + level * 5;

    // Apply frenzy modifier
    if (playerStats.minionFrenzy) this.maxHp *= 0.5;

    // Catchup multiplier for waves
    const waveNumber = Math.floor(Math.random() * 20) + 1;
    const expCatchupMultiplier = waveNumber <= 12 ? 1.35 : 1.15;
    this.expValue = Math.ceil(15 * expCatchupMultiplier);

    this.hp = this.maxHp;

    // Speed scaling
    if (type === 'demon') this.baseSpeed = 120;
    else if (type === 'ghost') this.baseSpeed = 220;
    else if (type === 'bomber') this.baseSpeed = 180;
    else if (type === 'priest') this.baseSpeed = 100;
    else this.baseSpeed = 90;

    this.speed = this.baseSpeed;

    // Damage scaling
    if (type === 'demon') this.baseDamage = 20 + level * 5;
    else if (type === 'ghost') this.baseDamage = 1.5 + level * 0.3;
    else if (type === 'bomber') this.baseDamage = 80 + level * 30;
    else if (type === 'archer') this.baseDamage = 8 + level * 3;
    else if (type === 'priest') this.baseDamage = 0; // Priests heal, not damage
    else this.baseDamage = 3 + level * 1;

    // Apply frenzy damage modifier
    if (playerStats.minionFrenzy) this.baseDamage *= 2.0;

    this.damage = this.baseDamage;
    this.attackCooldown = Math.max(0.5, 1.0 - level * 0.05);
    this.currentCooldown = 0;
    this.attackRange = 0;
    this.projectilePierce = 0;
    this.forceDefend = false;
    this.chillOnHit = 0;
    this.burnOnExplode = false;
    this.knockbackBlast = false;

    // Type-specific setup
    if (type === 'archer') {
      this.attackCooldown = Math.max(0.6, 1.2 - level * 0.1);
      this.attackRange = 280;
    }
    if (type === 'mage') {
      this.attackRange = 200;
    }
    if (type === 'priest') {
      this.attackCooldown = Math.max(1.5, 3.0 - level * 0.1);
      this.healAmount = 15 + level * 5;
      this.healRange = 180;
    }
  }

  update(
    dt: number,
    enemies: Entity[],
    projectiles: Projectile[],
    friendlyMinions: FriendlyMinion[],
    floatingTexts: FloatingText[],
    playerPosition?: { x: number; y: number }
  ): void {
    this.updateHitFlash(dt);

    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    // Mode-based movement
    if (this.mode === MinionModeEnum.DEFEND && playerPosition) {
      // Return to core area
      const distToPlayer = Math.hypot(this.x - playerPosition.x, this.y - playerPosition.y);
      if (distToPlayer > 150) {
        const angle = Math.atan2(playerPosition.y - this.y, playerPosition.x - this.x);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;
      }
    } else if (this.mode === MinionModeEnum.AGGRESSIVE) {
      // Engage enemies
      const target = this.findTarget(enemies);
      if (target) {
        const distToTarget = Math.hypot(target.x - this.x, target.y - this.y);
        if (distToTarget > this.attackRange) {
          const angle = Math.atan2(target.y - this.y, target.x - this.x);
          this.x += Math.cos(angle) * this.speed * dt;
          this.y += Math.sin(angle) * this.speed * dt;
        }

        // Attack
        if (distToTarget <= this.attackRange && this.currentCooldown <= 0) {
          this.attack(target, projectiles, floatingTexts);
          this.currentCooldown = this.attackCooldown;
        }
      }
    }

    // Healing for priests
    if (this.type === 'priest' && this.healAmount && this.healRange && this.currentCooldown <= 0) {
      let lowestHpMinion: FriendlyMinion | null = null;
      let lowestHp = Infinity;
      const healRange = this.healRange;

      for (const m of friendlyMinions) {
        if (
          !m.isDead &&
          m.hp < m.maxHp &&
          Math.hypot(m.x - this.x, m.y - this.y) < healRange
        ) {
          if (m.hp < lowestHp) {
            lowestHp = m.hp;
            lowestHpMinion = m;
          }
        }
      }

      if (lowestHpMinion && this.healAmount) {
        lowestHpMinion.hp = Math.min(lowestHpMinion.maxHp, lowestHpMinion.hp + this.healAmount);
        floatingTexts.push(
          new FloatingText(lowestHpMinion.x, lowestHpMinion.y - 15, this.healAmount, '#4ade80')
        );
        this.currentCooldown = this.attackCooldown;
      }
    }
  }

  findTarget(enemies: Entity[]): any {
    if (this.attackRange <= 0) return null;

    let closest: any = null;
    let minDist = this.attackRange;

    enemies.forEach((e: any) => {
      if (!e.isDead) {
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          closest = e;
        }
      }
    });

    return closest;
  }

  attack(target: any, projectiles: Projectile[], floatingTexts: FloatingText[]): void {
    if (this.type === 'archer') {
      // Ranged attack
      const angle = Math.atan2(target.y - this.y, target.x - this.x);
      projectiles.push(
        new Projectile(this.x, this.y, angle, this.damage, '#84cc16', false, 5, 600, 0, 'minion')
      );
    } else if (this.type === 'mage') {
      // Magic attack
      const angle = Math.atan2(target.y - this.y, target.x - this.x);
      projectiles.push(
        new Projectile(this.x, this.y, angle, this.damage, '#7c3aed', false, 6, 700, 1, 'minion')
      );
    } else {
      // Melee attack
      target.takeDamage(this.damage, floatingTexts);
      if (this.chillOnHit > 0) {
        target.chillTimer = Math.max(target.chillTimer, this.chillOnHit);
      }
    }
  }

  takeDamage(amount: number, floatingTexts: FloatingText[]): void {
    const actual = Math.min(Math.max(0, this.hp), amount);
    this.hp -= amount;
    this.hitFlash = 0.1;

    if (actual > 0) {
      floatingTexts.push(
        new FloatingText(this.x, this.y - this.radius - 5, actual, '#fbbf24')
      );
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

    // Draw mode indicator
    if (this.mode === MinionModeEnum.AGGRESSIVE) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D): void {
    if (this.hp >= this.maxHp) return;
    const bw = this.radius * 2;
    const bh = 2;
    const by = this.y - this.radius - 5;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - bw / 2, by, bw, bh);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - bw / 2, by, (bw * this.hp) / this.maxHp, bh);
  }
}
