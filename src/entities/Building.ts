import { Projectile } from './Projectile';
import { Particle, FloatingText } from './Entity';

export class Building {
  gridX: number;
  gridY: number;
  size: number;
  x: number;
  y: number;
  maxHp: number;
  hp: number;
  color: string;
  isDead: boolean;
  level: number;
  maxLevel: number;
  hitFlash: number;
  isWall: boolean;
  isPassable: boolean;
  hpGrowth: number;
  evolved: boolean;
  evolutionName: string;
  damageReduction: number;
  passiveRegen: number;
  gridSize: number;
  playerStats: any;

  constructor(
    gridX: number,
    gridY: number,
    gridSize: number,
    maxHp: number,
    color: string,
    playerStats: any
  ) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.gridSize = gridSize;
    this.size = gridSize;
    this.x = gridX * gridSize + gridSize / 2;
    this.y = gridY * gridSize + gridSize / 2;
    this.maxHp = maxHp * playerStats.buildingHpMultiplier;
    this.hp = this.maxHp;
    this.color = color;
    this.isDead = false;
    this.level = 1;
    this.maxLevel = 5;
    this.hitFlash = 0;
    this.isWall = false;
    this.isPassable = false;
    this.hpGrowth = 100;
    this.evolved = false;
    this.evolutionName = '';
    this.damageReduction = 0;
    this.passiveRegen = 0;
    this.playerStats = playerStats;
  }

  get upgradeCost(): number {
    const costs = [0, 30, 75, 150, 300];
    return costs[this.level] || 300;
  }

  get repairCost(): number {
    return this.level * 10;
  }

  levelUp(): void {
    if (this.level < this.maxLevel) {
      this.level++;
      const hpBonus = this.hpGrowth * this.level;
      this.maxHp += hpBonus;
      this.hp += hpBonus;
    }
  }

  update(dt: number): void {
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.passiveRegen > 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + this.passiveRegen * dt);
    }
  }

  takeDamage(
    amount: number,
    enemies: any[],
    floatingTexts: FloatingText[],
    particles: Particle[]
  ): void {
    const reduced = amount * (1 - this.damageReduction);
    this.hp -= reduced;
    this.hitFlash = 0.1;
    floatingTexts.push(new FloatingText(this.x, this.y - 20, reduced, '#ef4444'));

    // Thorns damage (if applicable)
    if ((this as any).thornsDamage) {
      enemies.forEach((e: any) => {
        if (!e.isDead && Math.hypot(e.x - this.x, e.y - this.y) < 90) {
          e.takeDamage((this as any).thornsDamage, floatingTexts);
          if ((this as any).entangleOnHit) {
            e.chillTimer = Math.max(e.chillTimer, (this as any).entangleOnHit);
          }
        }
      });
    }

    // Shockwave damage (if applicable)
    if ((this as any).shockwaveDamage) {
      enemies.forEach((e: any) => {
        if (!e.isDead && Math.hypot(e.x - this.x, e.y - this.y) < 120) {
          e.takeDamage((this as any).shockwaveDamage, floatingTexts);
          if ((this as any).shockKnockback) {
            const a = Math.atan2(e.y - this.y, e.x - this.x);
            e.x += Math.cos(a) * (this as any).shockKnockback;
            e.y += Math.sin(a) * (this as any).shockKnockback;
          }
        }
      });
      particles.push(new Particle(this.x, this.y, '#f59e0b', 8, 3, 80));
    }

    if (this.hp <= 0) {
      this.isDead = true;
      particles.push(new Particle(this.x, this.y, '#555', 20, 8, 100));

      // Wall explosion (if applicable)
      if (this.isWall && this.playerStats.wallExplosion) {
        particles.push(new Particle(this.x, this.y, '#ef4444', 40, 8, 200));
        enemies.forEach((e: any) => {
          if (Math.hypot(e.x - this.x, e.y - this.y) < 150) {
            e.takeDamage(200, floatingTexts);
          }
        });
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.gridX * this.gridSize, this.gridY * this.gridSize);
    ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
    ctx.fillRect(1, 1, this.gridSize - 2, this.gridSize - 2);

    // Draw border based on level
    if (this.level >= 5) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
    } else if (this.level >= 3) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
    }
    ctx.strokeRect(1, 1, this.gridSize - 2, this.gridSize - 2);

    // Draw level number
    if (this.level > 1) {
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Lv.${this.level}`, this.gridSize - 4, this.gridSize - 4);
    }
    ctx.restore();
  }

  drawHealthBar(ctx: CanvasRenderingContext2D): void {
    if (this.hp >= this.maxHp) return;
    const bw = this.gridSize - 10;
    const bh = 4;
    const bx = this.x - bw / 2;
    const by = this.y - this.gridSize / 2 - 8;
    ctx.fillStyle = 'red';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(bx, by, (bw * this.hp) / this.maxHp, bh);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(bx, by, bw, bh);
  }
}

export class Turret extends Building {
  range: number;
  baseAttackCooldown: number;
  currentCooldown: number;
  damage: number;
  hasAura: boolean;
  echoShot: boolean;

  constructor(gridX: number, gridY: number, gridSize: number, playerStats: any) {
    super(gridX, gridY, gridSize, 80, '#ca8a04', playerStats);
    this.range = 350;
    this.baseAttackCooldown = 1.0;
    this.currentCooldown = 0;
    this.damage = 15;
    this.hasAura = false;
    this.hpGrowth = 30;
    this.echoShot = false;
  }

  get attackCooldown(): number {
    return this.hasAura ? this.baseAttackCooldown * 0.4 : this.baseAttackCooldown;
  }

  levelUp(): void {
    super.levelUp();
    this.damage += 15;
    this.range += 25;
    this.baseAttackCooldown = Math.max(0.3, this.baseAttackCooldown - 0.15);
  }

  updateTurret(dt: number, enemies: any[], projectiles: Projectile[]): void {
    this.update(dt);

    if (this.currentCooldown > 0) this.currentCooldown -= dt;

    if (this.currentCooldown <= 0) {
      let closest: any = null;
      let minDist = this.range;

      for (const e of enemies) {
        if (e.type === 'assassin') continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          closest = e;
        }
      }

      if (closest) {
        const angle = Math.atan2(closest.y - this.y, closest.x - this.x);
        const projColor = this.level >= 5 ? '#facc15' : this.level >= 3 ? '#ef4444' : '#fb923c';
        projectiles.push(new Projectile(this.x, this.y, angle, this.damage, projColor, false, 6, 600, 0, 'turret'));

        if (this.echoShot) {
          projectiles.push(
            new Projectile(this.x, this.y, angle + 0.08, this.damage * 0.75, '#fde68a', false, 5, 650, 0, 'turret')
          );
          projectiles.push(
            new Projectile(this.x, this.y, angle - 0.08, this.damage * 0.75, '#fde68a', false, 5, 650, 0, 'turret')
          );
        }

        this.currentCooldown = this.attackCooldown;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, 10 + this.level, 0, Math.PI * 2);
    ctx.fillStyle = this.level >= 5 ? '#facc15' : '#333';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}

export class Wall extends Building {
  constructor(gridX: number, gridY: number, gridSize: number, playerStats: any) {
    super(gridX, gridY, gridSize, 150, '#666666', playerStats);
    this.isWall = true;
    this.hpGrowth = 50;
  }

  levelUp(): void {
    super.levelUp();
    this.damageReduction = Math.min(0.3, this.level * 0.05);
  }
}

export class Reactor extends Building {
  regenAmount: number;

  constructor(gridX: number, gridY: number, gridSize: number, playerStats: any) {
    super(gridX, gridY, gridSize, 120, '#00aa00', playerStats);
    this.regenAmount = 5;
    this.passiveRegen = this.regenAmount;
    this.hpGrowth = 40;
  }

  levelUp(): void {
    super.levelUp();
    this.regenAmount += 3;
    this.passiveRegen = this.regenAmount;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    // Draw circle to indicate healing
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.gridSize / 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
