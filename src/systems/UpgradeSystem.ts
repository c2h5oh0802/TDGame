/**
 * UpgradeSystem
 * Manages card selection, effect application, and meta progression
 */

import type { PlayerStats, MetaUpgrades, MetaStats, CardType, Rarity } from '../core/types';
import { UPGRADE_CARDS } from '../data/cardData';

export interface UpgradeChoice {
  cardId: number;
  type: CardType;
  rarity: Rarity;
  effect: string;
}

export class UpgradeSystem {
  playerStats: PlayerStats;
  metaUpgrades: MetaUpgrades;
  metaStats: MetaStats;
  selectedCards: CardType[] = [];
  upgradeHistory: UpgradeChoice[] = [];

  constructor(
    playerStats: PlayerStats,
    metaUpgrades: MetaUpgrades,
    metaStats: MetaStats
  ) {
    this.playerStats = playerStats;
    this.metaUpgrades = metaUpgrades;
    this.metaStats = metaStats;
  }

  /**
   * Get available upgrade cards (3 random cards)
   */
  getUpgradeChoices(): UpgradeChoice[] {
    const choices: UpgradeChoice[] = [];
    const selectedIds = new Set<number>();

    // Pick 3 random unique cards
    while (choices.length < 3 && selectedIds.size < UPGRADE_CARDS.length) {
      const randomId = Math.floor(Math.random() * UPGRADE_CARDS.length);
      if (!selectedIds.has(randomId)) {
        selectedIds.add(randomId);
        const card = UPGRADE_CARDS[randomId];
        choices.push({
          cardId: randomId,
          type: card.type,
          rarity: card.rarity,
          effect: card.description,
        });
      }
    }

    return choices;
  }

  /**
   * Apply a selected upgrade to the player
   */
  applyUpgrade(choice: UpgradeChoice): void {
    const card = UPGRADE_CARDS[choice.cardId];

    // Try to apply the card's effect using the provided function
    try {
      card.effect({
        playerStats: this.playerStats,
        metaUpgrades: this.metaUpgrades,
        addBuildQueue: () => {}, // Stub for building queue
      });
    } catch (e) {
      // Silently fail if effect is not compatible
      console.warn('Card effect not fully implemented:', choice.type);
    }

    // Track the selection
    this.selectedCards.push(choice.type);
    this.upgradeHistory.push(choice);

    // Update meta stats
    this.metaStats.totalRuns++;
  }

  /**
   * Get all available card data
   */
  getCardCatalog(): typeof UPGRADE_CARDS {
    return UPGRADE_CARDS;
  }

  /**
   * Get upgrade history for this run
   */
  getUpgradeHistory(): UpgradeChoice[] {
    return this.upgradeHistory;
  }

  /**
   * Reset upgrades for a new run
   */
  reset(): void {
    this.selectedCards = [];
    this.upgradeHistory = [];
  }

  /**
   * Get the total number of upgrades applied
   */
  getUpgradeCount(): number {
    return this.selectedCards.length;
  }

  /**
   * Apply meta progression upgrade (persistent across runs)
   */
  applyMetaUpgrade(upgradeKey: keyof MetaUpgrades): void {
    const currentLevel = this.metaUpgrades[upgradeKey];

    // Handle boolean and numeric upgrades
    if (typeof currentLevel === 'boolean') {
      (this.metaUpgrades[upgradeKey] as boolean) = true;
    } else if (typeof currentLevel === 'number') {
      const maxLevel = 10; // Max level for each meta upgrade
      if (currentLevel < maxLevel) {
        (this.metaUpgrades[upgradeKey] as number) = currentLevel + 1;
      }
    }
  }

  /**
   * Get the bonus from a meta upgrade level
   */
  getMetaUpgradeBonus(level: number): number {
    // Each level of meta upgrade provides 2% bonus
    return 1 + level * 0.02;
  }

  /**
   * Apply all applicable meta upgrade bonuses to player stats
   */
  applyMetaBonuses(): void {
    const powerBonus = this.getMetaUpgradeBonus(this.metaUpgrades.powerStacking);
    const speedBonus = this.getMetaUpgradeBonus(this.metaUpgrades.speedStacking);

    this.playerStats.damageMultiplier *= powerBonus;
    this.playerStats.moveSpeedMultiplier *= speedBonus;
    // Health bonus would apply to initial HP calculation
  }
}
