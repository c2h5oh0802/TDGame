/**
 * 遊戲核心型別定義
 */

// 遊戲狀態
export enum GameState {
  START = -1,
  PLAYING = 0,
  GAMEOVER = 1,
  LEVEL_UP = 2,
  BUILDING = 3,
  VICTORY = 4,
  PAUSED = 5
}

// 敵人類型
export enum EnemyType {
  NORMAL = 'normal',
  ELITE = 'elite',
  RANGED = 'ranged',
  SIEGE = 'siege',
  ASSASSIN = 'assassin',
  WARLOCK = 'warlock',
  BOSS = 'boss'
}

// 建築類型
export enum BuildingType {
  WOOD_WALL = 'woodWall',
  TURRET = 'turret',
  ARTILLERY_TURRET = 'artilleryTurret',
  LIGHTNING_TURRET = 'lightningTurret',
  FROST_TURRET = 'frostTurret',
  TRAP_BUILDING = 'trapBuilding',
  SNIPER_TURRET = 'sniperTurret',
  POISON_TRAP = 'poisonTrap',
  ALCHEMY_LAB = 'alchemyLab',
  AURA_BUILDING = 'auraBuilding',
  DEMON_SPAWNER = 'demonSpawner',
  MAGE_SPAWNER = 'mageSpawner',
  GHOST_SPAWNER = 'ghostSpawner',
  ARCHER_SPAWNER = 'archerSpawner',
  BOMBER_SPAWNER = 'bomberSpawner',
  PRIEST_SPAWNER = 'priestSpawner',
  SKELETON_SPAWNER = 'skeletonSpawner',
  WORKER_HUT = 'workerHut',
  MANA_POOL = 'manaPool'
}

// 友軍類型
export enum MinionType {
  DEMON = 'demon',
  MAGE = 'mage',
  GHOST = 'ghost',
  ARCHER = 'archer',
  BOMBER = 'bomber',
  PRIEST = 'priest',
  SKELETON = 'skeleton'
}

// 小兵模式
export enum MinionMode {
  DEFEND = 'defend',
  AGGRESSIVE = 'aggressive',
  FOLLOW = 'follow'
}

// 升級卡片類型
export enum CardType {
  BUILDING = 'building',
  SPELL = 'spell',
  ENHANCE = 'enhance'
}

// 稀有度
export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// 傷害來源
export interface DamageSource {
  source: string;
  icon: string;
  color: string;
}

// 玩家統計
export interface PlayerStats {
  damageMultiplier: number;
  attackSpeedMultiplier: number;
  moveSpeedMultiplier: number;
  projectileCount: number;
  pierceLimit: number;
  goldDamageScaling: number;
  fireLevel: number;
  iceLevel: number;
  lightningLevel: number;
  thorns: number;
  corpseExplosion: boolean;
  wallExplosion: boolean;
  auraHeal: boolean;
  minionFrenzy: boolean;
  necromancy: boolean;
  buildingHpMultiplier: number;
  extraMinionCapacity: number;
  bonusGoldDrop: number;
  lifeSteal: number;
  spreadShot: boolean;
  explosiveRounds: boolean;
  homingMissiles: boolean;
  orbitalLevel: number;
  toxicTrail: boolean;
}

// Meta 系統升級
export interface MetaUpgrades {
  // 可疊加升級
  powerStacking: number;
  speedStacking: number;
  healthStacking: number;
  coreHealthStacking: number;
  goldStacking: number;
  soulStacking: number;
  
  // 一次性解鎖
  startWalls: boolean;
  startTurret: boolean;
  extraCardSlot: boolean;
  extraMinionMax: boolean;
  luckyBlessing: boolean;
  endlessMode: boolean;
}

// Meta 系統統計
export interface MetaStats {
  totalRuns: number;
  bestWave: number;
  totalKillsAllTime: number;
  unlockedStage: number;
}

// 輸入狀態
export interface InputState {
  keys: Record<string, boolean>;
  mouseX: number;
  mouseY: number;
  worldMouseX: number;
  worldMouseY: number;
  mouseDown: boolean;
}

// 鏡頭
export interface Camera {
  x: number;
  y: number;
  update(targetX: number, targetY: number): void;
}

// 關卡配置
export interface StageConfig {
  name: string;
  enemyHpMul: number;
  enemyDmgMul: number;
  enemySpeedMul: number;
  spawnRateMul: number;
  soulMul: number;
}

// Boss 配置
export interface BossConfig {
  name: string;
  warning: string;
  icon: string;
  projectileColor: string;
  volleyAngles: number[];
  skillCooldown: number;
}
