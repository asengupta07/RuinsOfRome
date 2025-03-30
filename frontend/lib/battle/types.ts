export type BattleMode = "select" | "vsAI" | "vsPlayers";
export type PlayerRoomMode = "select" | "create" | "join";

export interface God {
  name: string;
  icon: string;
  rarity: "Legendary" | "Epic" | "Rare";
}

export interface Ability {
  name: string;
  description: string;
  icon: string;
}

export interface Passive {
  name: string;
  description: string;
  icon: string;
}

export interface Gladiator {
  name: string;
  attack: number;
  defense: number;
  health: number;
  speed: number;
  passive: Passive;
  abilities: Ability[];
  gods: God[];
  image: string;
}

export interface BattleState {
  battleStarted: boolean;
  currentTurn: string;
  humanHealth: number;
  aiHealth: number;
  displayedHumanHealth: number;
  displayedAIHealth: number;
  showVictoryModal: boolean;
  showDefeatModal: boolean;
  earnedExp: number;
  showExpAnimation: boolean;
  currentPlayerExp: number;
  playerLevel: number;
  showHumanAttackAnimation: boolean;
  showAIAttackAnimation: boolean;
  attackAnimationType: string;
  targetShake: string | null;
  humanDefenseBonus: number;
  aiDefenseBonus: number;
  defenseBonusTurns: number;
}
