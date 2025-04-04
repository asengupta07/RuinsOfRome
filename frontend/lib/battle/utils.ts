import { Gladiator } from "./types";
import confetti from "canvas-confetti";
import { config } from "../config";

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
  let damage = Math.round(attacker.attack - defender.defense);

  // Apply defense bonuses from abilities
  if (defender.name === humanGladiator.name && humanDefenseBonus > 0) {
    damage = Math.max(1, Math.round(damage - humanDefenseBonus));
    toast({
      title: "Defense Bonus Active!",
      description: `${humanGladiator.name}'s defense bonus reduced damage by ${Math.round(humanDefenseBonus)}!`,
      variant: "default",
    });
  } else if (defender.name === aiGladiator.name && aiDefenseBonus > 0) {
    damage = Math.max(1, Math.round(damage - aiDefenseBonus));
    toast({
      title: "Defense Bonus Active!",
      description: `${aiGladiator.name}'s defense bonus reduced damage by ${Math.round(aiDefenseBonus)}!`,
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
    damage = Math.round(damage * 0.7); // 30% damage reduction
    toast({
      title: "Passive Ability Activated!",
      description: `${humanGladiator.passive.name}: Damage reduced by 30%!`,
      variant: "default",
    });
  }

  // For AI gladiator passive: Algorithm adaptation
  if (defender.name === aiGladiator.name && battleStarted) {
    // This could increase with each turn, but keeping it simple for now
    damage = Math.round(damage * 1.1); // 10% bonus damage
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
export const generateGladiator = async (isHuman: boolean, gladiatorData: any, godsData: any): Promise<Gladiator> => {
  const processGladiatorData = async (uri: string) => {
    const metadata = await fetch(uri);
    const metadataJson = await metadata.json();
    return metadataJson;
  }

  const gladiatorDataJSON = await processGladiatorData(gladiatorData);
  const gladiatorDataJson = {
    ...gladiatorDataJSON,
    gods: godsData,
  }
  console.log("Gladiator Data JSON: ", gladiatorDataJson);

  const moveset = gladiatorDataJson.moveset;
  const movesetConfig = config.moves;
  const pass = moveset.find((move: string) => movesetConfig.find(config => config.type === 'passive' && config.name === move));
  const att = moveset.find((move: string) => movesetConfig.find(config => config.type === 'attack' && config.name === move));
  const def = moveset.find((move: string) => movesetConfig.find(config => config.type === 'defense' && config.name === move));
  const attack = movesetConfig.find((config: any) => config.name === att);
  const defense = movesetConfig.find((config: any) => config.name === def);
  const passive = movesetConfig.find((config: any) => config.name === pass);
  const gods = gladiatorDataJson.gods;

  console.log("GODS: ", gods);
  console.log("Passive: ", passive);
  console.log("Attack: ", attack);
  console.log("Defense: ", defense);
  if (isHuman && passive && attack && defense) {
    const gladiator = {
      name: gladiatorDataJson.name,
      attack: gladiatorDataJson.attackValue,
      defense: gladiatorDataJson.defenceValue,
      health: 100,
      speed: gladiatorDataJson.speedValue,
      passive: {
        name: passive.name,
        description: passive.description,
        icon: "/passive-stoic.svg",
      },
      abilities: [
        {
          name: attack.name,
          description: attack.description,
          icon: "/ability-gladius.svg",
        },
        {
          name: defense.name,
          description: defense.description,
          icon: "/ability-formation.svg",
        },
      ],
      gods: [
        {
          name: gods[0].name,
          icon: gods[0].image,
          rarity: gods[0].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 1 ? "Rare" : gods[0].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 2 ? "Epic" : gods[0].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 3 ? "Legendary" : "Mythic",
        },
        {
          name: gods[1].name,
          icon: gods[1].image,
          rarity: gods[1].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 1 ? "Rare" : gods[1].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 2 ? "Epic" : gods[1].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 3 ? "Legendary" : "Mythic",
        },
        {
          name: gods[2].name,
          icon: gods[2].image,
          rarity: gods[2].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 1 ? "Rare" : gods[2].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 2 ? "Epic" : gods[2].attributes.find((a: { trait_type: string }) => a.trait_type === "Tier")?.value === 3 ? "Legendary" : "Mythic",
        },
      ],
      image: gladiatorDataJson.imageUrl,
    } as Gladiator;
    console.log("Gladiator: ", gladiator);
    return gladiator;
  } else {
    const gladiatorAI = {
      name: "Digitalis Maximus",
      attack: getRandomInRange(32, 48),
      defense: getRandomInRange(32, 48),
      health: 100,
      speed: getRandomInRange(32, 48),
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
      image: "/digitalis-maximus.png",
    } as Gladiator;
    console.log("Gladiator AI: ", gladiatorAI);
    return gladiatorAI;
  }
};
