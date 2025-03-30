import { Gladiator } from "./types";
import confetti from "canvas-confetti";

// Random number generator function
export const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a room ID for multiplayer battles
export const generateRoomId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Calculate damage based on attacker's attack and defender's defense
export const calculateDamage = (
  attacker: Gladiator,
  defender: Gladiator,
  humanGladiator: Gladiator,
  aiGladiator: Gladiator,
  humanHealth: number,
  humanDefenseBonus: number,
  aiDefenseBonus: number,
  battleStarted: boolean,
  toast: (props: any) => void
): number => {
  // Basic formula: attack - defense
  let damage = attacker.attack - defender.defense;

  // Apply defense bonuses from abilities
  if (defender.name === humanGladiator.name && humanDefenseBonus > 0) {
    damage = Math.max(1, damage - humanDefenseBonus);
    toast({
      title: "Defense Bonus Active!",
      description: `${humanGladiator.name}'s defense bonus reduced damage by ${humanDefenseBonus}!`,
      variant: "default",
    });
  } else if (defender.name === aiGladiator.name && aiDefenseBonus > 0) {
    damage = Math.max(1, damage - aiDefenseBonus);
    toast({
      title: "Defense Bonus Active!",
      description: `${aiGladiator.name}'s defense bonus reduced damage by ${aiDefenseBonus}!`,
      variant: "default",
    });
  }

  // Ensure minimum damage of 1
  if (damage < 1) damage = 1;

  // Apply passive abilities if applicable

  // For human gladiator passive: Reduce damage when below 30% health
  if (
    defender.name === humanGladiator.name &&
    humanHealth < humanGladiator.health * 0.3
  ) {
    damage = Math.floor(damage * 0.7); // 30% damage reduction
    toast({
      title: "Passive Ability Activated!",
      description: `${humanGladiator.passive.name}: Damage reduced by 30%!`,
      variant: "default",
    });
  }

  // For AI gladiator passive: Algorithm adaptation
  if (defender.name === aiGladiator.name && battleStarted) {
    // This could increase with each turn, but keeping it simple for now
    damage = Math.floor(damage * 1.1); // 10% bonus damage
  }

  return damage;
};

// Function to check if it's a gladiator's turn
export const isGladiatorTurn = (
  gladiatorName: string,
  battleStarted: boolean,
  currentTurn: string,
  humanGladiator: Gladiator,
  aiGladiator: Gladiator
): boolean => {
  // Before battle starts, check speed advantage
  if (!battleStarted) {
    if (gladiatorName === humanGladiator.name) {
      return humanGladiator.speed >= aiGladiator.speed;
    } else {
      return aiGladiator.speed > humanGladiator.speed;
    }
  }

  // After battle starts, check current turn
  return currentTurn === gladiatorName;
};

// Function to get placeholder image for gods
export const getGodPlaceholderImage = (): string => {
  // Just return a single placeholder for all gods
  return "/god-placeholder.svg";
};

// Generate random attack animation type
export const generateRandomAttack = (): string => {
  const attacks = ["slash", "stab", "punch", "magic", "arrow"];
  return attacks[Math.floor(Math.random() * attacks.length)];
};

// Function to trigger confetti effect
export const triggerConfetti = (): void => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Create confetti from random positions across the top
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

// Calculate initial gladiator stats
export const generateGladiator = (isHuman: boolean): Gladiator => {
  if (isHuman) {
    return {
      name: "Marcus Aurelius",
      attack: getRandomInRange(90, 100),
      defense: getRandomInRange(60, 75),
      health: 100,
      speed: getRandomInRange(60, 80),
      passive: {
        name: "Stoic Resilience",
        description: "Reduces damage taken when below 30% health",
        icon: "/passive-stoic.svg",
      },
      abilities: [
        {
          name: "Gladius Strike",
          description: "A powerful strike with the gladius",
          icon: "/ability-gladius.svg",
        },
        {
          name: "Roman Formation",
          description: "Increase defense for 2 turns",
          icon: "/ability-formation.svg",
        },
      ],
      gods: [
        {
          name: "Jupiter",
          icon: "/jupiter.png",
          rarity: "Legendary",
        },
        {
          name: "Mars",
          icon: "/mars.png",
          rarity: "Epic",
        },
        {
          name: "Mercury",
          icon: "/mercury.png",
          rarity: "Rare",
        },
      ],
    };
  } else {
    return {
      name: "Digitalis Maximus",
      attack: getRandomInRange(90, 100),
      defense: getRandomInRange(60, 75),
      health: 100,
      speed: getRandomInRange(60, 80),
      passive: {
        name: "Algorithm Adaptation",
        description: "Learns from opponent's moves, increasing counter damage",
        icon: "/passive-algorithm.svg",
      },
      abilities: [
        {
          name: "Neural Strike",
          description: "A calculated attack with high precision",
          icon: "/ability-neural.svg",
        },
        {
          name: "Data Shield",
          description: "Analyze opponent's next move and prepare defense",
          icon: "/ability-shield.svg",
        },
      ],
      gods: [
        {
          name: "Apollo",
          icon: "/apollo.png",
          rarity: "Epic",
        },
        {
          name: "Minerva",
          icon: "/minerva.png",
          rarity: "Legendary",
        },
        {
          name: "Neptune",
          icon: "/neptune.png",
          rarity: "Rare",
        },
      ],
    };
  }
};
