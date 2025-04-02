"use client"

import type React from "react"

import { useState, useEffect, useRef, RefObject } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, Sword, Heart, Zap, Skull } from "lucide-react"
import confetti from "canvas-confetti"
import { celestialAbi, gladiatorAbi, gladiatorAddress } from "../abi"
import { useAccount } from "wagmi"
import { useReadContract } from "wagmi"
import { celestialAddress } from "../abi"
import Navbar from "@/components/Navbar"

// Battle Logic Interfaces
interface Buff {
  name: string;
  description: string;
  value?: number;
  duration?: number;
}

interface Spell {
  name: string;
  description: string;
  power?: number;
  cooldown?: number;
}

interface Celestial {
  name: string;
  type: 'god' | 'titan';
  tier: number;
  description: string;
  buffs: Record<string, number>;
  spells: Record<string, number>;
}

interface Move {
  name: string;
  type: 'attack' | 'defense' | 'passive';
  description: string;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  shield: number;
  attack: number;
  defense: number;
  speed: number;
}

interface Player {
  id: number;
  name: string;
  stats: PlayerStats;
  celestials: Celestial[];
  activeBuffs: Buff[];
  activeSpells: Spell[];
  moves: Move[];
}

interface BattleState {
  human: Player;
  ai: Player;
  turn: number;
  environment: 'day' | 'night';
  log: string[];
  battleEnded?: boolean;
  winner?: 'player' | 'ai';
}

// Battle Logic Functions
function processPassives(player: Player, currentState: BattleState) {
  player.moves.forEach(move => {
    if (move.type === 'passive') {
      switch (move.name) {
        case 'nightcrawler':
          if (currentState.environment === 'night') {
            player.activeBuffs.push({
              name: 'stealth',
              value: 15 + Math.random() * 5, // Random between 15-20
              duration: 1,
              description: 'Stealth'
            });
          }
          break;
        case 'daywalker':
          if (currentState.environment === 'day') {
            player.activeBuffs.push({
              name: 'attack',
              value: 10 + Math.random() * 5, // Random between 10-15
              duration: 1,
              description: 'Attack'
            });
          }
          break;
        case 'berserk':
          if (player.stats.health / player.stats.maxHealth < 0.3) {
            player.activeBuffs.push({
              name: 'fury',
              value: 20 + Math.random() * 10, // Random between 20-30
              duration: 1,
              description: 'Fury'
            });
          }
          break;
        case 'tank':
          player.activeBuffs.push({
            name: 'defense',
            value: 15 + Math.random() * 5, // Random between 15-20
            duration: 1,
            description: 'Defense'
          });
          break;
        case 'glass_cannon':
          player.activeBuffs.push({
            name: 'attack',
            value: 25 + Math.random() * 10, // Random between 25-35
            duration: 1,
            description: 'Attack'
          });
          break;
      }
    }
  });
}

const generateRandomBlessing = (player: Player): { celestialIndex: number; blessing: string } | null => {
  // 30% chance of blessing
  const chance = Math.random();
  console.log("Chance", chance);
  if (chance > 0.3) return null;

  // Get random celestial
  const celestialIndex = Math.floor(Math.random() * player.celestials.length);
  const celestial = player.celestials[celestialIndex];
  
  if (!celestial) return null;

  // Get random buff or spell from celestial
  const buffKeys = Object.keys(celestial.buffs);
  const spellKeys = Object.keys(celestial.spells);
  
  if (buffKeys.length === 0 && spellKeys.length === 0) return null;

  // 70% chance of buff, 30% chance of spell
  const blessingType = Math.random() < 0.7 ? 'buff' : 'move';
  
  let value: string;
  if (blessingType === 'buff') {
    value = buffKeys[Math.floor(Math.random() * buffKeys.length)];
  } else {
    value = spellKeys[Math.floor(Math.random() * spellKeys.length)];
  }

  return {
    celestialIndex,
    blessing: value,
  };
};



function executeAttack(attacker: Player, defender: Player, move: Move, state: BattleState) {
  let damage = attacker.stats.attack * (0.9 + Math.random() * 0.2); // Random between 90-110% of base attack

  const attackBuff = attacker.activeBuffs.find(b => b.name === 'attack');
  if (attackBuff) {
    damage *= (1 + (attackBuff.value || 0) / 100);
  }

  const furyBuff = attacker.activeBuffs.find(b => b.name === 'fury');
  if (furyBuff && (attacker.stats.health / attacker.stats.maxHealth < 0.3)) {
    damage *= (1 + (furyBuff.value || 0) / 100);
  }

  let defense = defender.stats.defense * (0.9 + Math.random() * 0.2); // Random between 90-110% of base defense
  const defenseBuff = defender.activeBuffs.find(b => b.name === 'defense');
  if (defenseBuff) {
    defense *= (1 + (defenseBuff.value || 0) / 100);
  }

  const stealthBuff = defender.activeBuffs.find(b => b.name === 'stealth');
  if (stealthBuff && Math.random() < (stealthBuff.value || 0) / 100) {
    const dodgeMessages = [
      `${defender.name} gracefully evades the attack like Mercury himself!`,
      `${defender.name} vanishes into the shadows like Pluto's realm!`,
      `${defender.name} slips away as if blessed by Fortuna!`
    ];
    state.log.push(dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)]);
    return;
  }

  damage = Math.max(1, damage - defense / 2);

  const fortuneBuff = attacker.activeBuffs.find(b => b.name === 'fortune');
  if (fortuneBuff && Math.random() < (fortuneBuff.value || 0) / 100) {
    damage *= (1.4 + Math.random() * 0.2); // Random between 140-160% damage
    const critMessages = [
      `By Jupiter's thunder! ${attacker.name} strikes with divine fury!`,
      `Mars himself guides ${attacker.name}'s hand in this devastating blow!`,
      `The gods smile upon ${attacker.name} as they deliver a mighty strike!`
    ];
    state.log.push(critMessages[Math.floor(Math.random() * critMessages.length)]);
  }

  if (defender.stats.shield > 0) {
    const shieldDamage = Math.min(damage, defender.stats.shield);
    defender.stats.shield -= shieldDamage;
    damage -= shieldDamage;
    const shieldMessages = [
      `${defender.name}'s shield of Minerva absorbs ${shieldDamage} damage!`,
      `The divine protection of ${defender.name}'s shield blocks ${shieldDamage} damage!`,
      `${defender.name}'s shield, blessed by Vulcan, deflects ${shieldDamage} damage!`
    ];
    state.log.push(shieldMessages[Math.floor(Math.random() * shieldMessages.length)]);
  }

  if (damage > 0) {
    defender.stats.health = Math.max(0, defender.stats.health - damage);
    const damageMessages = [
      `${attacker.name} strikes ${defender.name} for ${Math.round(damage)} damage, like Mars himself!`,
      `The blow from ${attacker.name} lands true, dealing ${Math.round(damage)} damage to ${defender.name}!`,
      `${attacker.name}'s attack pierces ${defender.name}'s defenses for ${Math.round(damage)} damage!`
    ];
    state.log.push(damageMessages[Math.floor(Math.random() * damageMessages.length)]);
  }
}

function executeDefense(player: Player, move: Move, state: BattleState) {
  switch (move.name) {
    case 'fortify':
      player.activeBuffs.push({
        name: 'defense',
        value: 30 + Math.random() * 10, // Random between 30-40
        duration: 2,
        description: 'Defense'
      });
      const fortifyMessages = [
        `${player.name} raises their shield like the walls of Rome!`,
        `${player.name} takes a defensive stance, blessed by Minerva's wisdom!`,
        `${player.name} fortifies their position like the legions of old!`
      ];
      state.log.push(fortifyMessages[Math.floor(Math.random() * fortifyMessages.length)]);
      break;
    case 'heal':
      const healAmount = player.stats.maxHealth * (0.15 + Math.random() * 0.1); // Random between 15-25% of max health
      player.stats.health = Math.min(player.stats.maxHealth, player.stats.health + healAmount);
      const healMessages = [
        `${player.name} receives healing from Apollo's divine light!`,
        `The healing touch of Venus restores ${Math.round(healAmount)} HP to ${player.name}!`,
        `${player.name} is rejuvenated by the waters of the Tiber, healing for ${Math.round(healAmount)} HP!`
      ];
      state.log.push(healMessages[Math.floor(Math.random() * healMessages.length)]);
      break;
  }
}

function executeCelestialSpell(attacker: Player, defender: Player, celestial: Celestial, spellName: string, state: BattleState) {
  const spellPower = celestial.spells[spellName];
  if (!spellPower) {
    state.log.push(`Celestial ${celestial.name} doesn't know spell ${spellName}`);
    return;
  }

  const isTitan = celestial.type === 'titan';

  switch (spellName) {
    case 'fireball':
    case 'inferno':
    case 'lightning':
    case 'meteor':
    case 'wrath':
    case 'smite':
    case 'aether_blast':
    case 'tempest':
      let damage = spellPower * (0.9 + Math.random() * 0.2); // Random between 90-110% of spell power

      const wisdomBuff = attacker.activeBuffs.find(b => b.name === 'wisdom');
      if (wisdomBuff) {
        damage *= (1 + (wisdomBuff.value || 0) / 100);
      }

      const divineBuff = defender.activeBuffs.find(b => b.name === 'divine_protection');
      if (divineBuff && (spellName === 'smite' || spellName === 'aether_blast')) {
        damage *= (1 - (divineBuff.value || 0) / 100);
      }

      if (defender.stats.shield > 0) {
        const shieldDamage = Math.min(damage, defender.stats.shield);
        defender.stats.shield -= shieldDamage;
        damage -= shieldDamage;
        state.log.push(`${defender.id === 1 ? 'Player' : 'AI'} shield absorbed ${Math.round(shieldDamage)} damage`);
      }

      if (damage > 0) {
        defender.stats.health = Math.max(0, defender.stats.health - damage);
        state.log.push(`Celestial ${celestial.name} cast ${spellName} for ${Math.round(damage)} damage`);
      }
      break;

    case 'icebolt':
    case 'abyssal_chain':
    case 'stun':
      defender.activeBuffs.push({
        name: 'speed',
        value: -30 - Math.random() * 10, // Random between -30 to -40
        duration: 2,
        description: 'Speed'
      });
      state.log.push(`Celestial ${celestial.name} cast ${spellName}, slowing the enemy`);
      break;

    case 'poison':
    case 'necrotic_touch':
      defender.activeBuffs.push({
        name: spellName,
        value: spellPower * (0.9 + Math.random() * 0.2), // Random between 90-110% of spell power
        duration: 3,
        description: 'Poison'
      });
      state.log.push(`Celestial ${celestial.name} cast ${spellName}, applying a damage over time effect`);
      break;

    case 'heal':
    case 'aether_blast':
      const healAmount = attacker.stats.maxHealth * (spellPower / 100) * (0.9 + Math.random() * 0.2); // Random between 90-110% of base heal
      attacker.stats.health = Math.min(attacker.stats.maxHealth, attacker.stats.health + healAmount);
      state.log.push(`Celestial ${celestial.name} cast ${spellName}, healing for ${Math.round(healAmount)} HP`);
      break;

    case 'shield':
      const shieldAmount = attacker.stats.maxHealth * (spellPower / 100) * (0.9 + Math.random() * 0.2); // Random between 90-110% of base shield
      attacker.stats.shield += shieldAmount;
      state.log.push(`Celestial ${celestial.name} cast ${spellName}, granting ${Math.round(shieldAmount)} shield`);
      break;

    case 'rewind':
      state.log.push(`Celestial ${celestial.name} attempted to rewind time (special effect)`);
      break;

    default:
      state.log.push(`Celestial ${celestial.name} cast unknown spell ${spellName}`);
  }
}

function updateBuffs(player: Player, state: BattleState) {
  player.activeBuffs = player.activeBuffs
    .map(buff => ({ ...buff, duration: buff.duration ? buff.duration - 1 : 0 }))
    .filter(buff => buff.duration > 0);

  const dotBuffs = player.activeBuffs.filter(buff =>
    buff.name === 'poison' || buff.name === 'necrotic_touch'
  );

  dotBuffs.forEach(buff => {
    const damage = buff.value || 0;
    player.stats.health = Math.max(0, player.stats.health - damage);
    state.log.push(`Suffered ${damage} from ${buff.name}`);
  });
}

function executeBattleMove(
  currentState: BattleState,
  moveName: string,
  moveFrom: number,
  targetCelestialIndex?: number,
  spellName?: string
): BattleState {
  const newState: BattleState = JSON.parse(JSON.stringify(currentState));

  const attacker = moveFrom === 1 ? newState.human : newState.ai;
  const defender = moveFrom === 1 ? newState.ai : newState.human;

  processPassives(attacker, newState);
  processPassives(defender, newState);

  const move = attacker.moves.find(m => m.name === moveName);
  if (!move) {
    newState.log.push(`Invalid move: ${moveName}`);
    return newState;
  }

  switch (move.type) {
    case 'attack':
      executeAttack(attacker, defender, move, newState);
      break;
    case 'defense':
      executeDefense(attacker, move, newState);
      break;
    case 'passive':
      newState.log.push(`${attacker.id === 1 ? 'Player' : 'AI'} activates passive: ${moveName}`);
      break;
  }

  if (targetCelestialIndex !== undefined && spellName) {
    const celestial = attacker.celestials[targetCelestialIndex];
    if (celestial) {
      // Check if the spellName is a buff
      const validBuffs = [
        "attack", "defense", "speed", "heal", "shield", "stealth", "fury",
        "divine_protection", "wisdom", "curse_resistance", "fortune"
      ];

      if (validBuffs.includes(spellName)) {
        // Add buff to activeBuffs
        const buffValue = celestial.buffs[spellName] || 0;
        attacker.activeBuffs.push({
          name: spellName,
          value: buffValue,
          duration: 2, // Buff lasts for 2 turns
          description: spellName.replace('_', ' ').charAt(0).toUpperCase() + spellName.replace('_', ' ').slice(1)
        });

        // Add thematic log message
        const buffMessages = {
          attack: `${celestial.name} blesses ${attacker.name} with divine strength!`,
          defense: `${celestial.name} grants ${attacker.name} divine protection!`,
          speed: `${celestial.name} bestows ${attacker.name} with godly swiftness!`,
          stealth: `${celestial.name} shrouds ${attacker.name} in divine shadows!`,
          fury: `${celestial.name} fills ${attacker.name} with divine rage!`,
          divine_protection: `${celestial.name} surrounds ${attacker.name} with divine aura!`,
          wisdom: `${celestial.name} enlightens ${attacker.name} with divine wisdom!`,
          curse_resistance: `${celestial.name} shields ${attacker.name} from dark forces!`,
          fortune: `${celestial.name} blesses ${attacker.name} with divine fortune!`
        };

        newState.log.push(buffMessages[spellName as keyof typeof buffMessages] || 
          `${celestial.name} blesses ${attacker.name} with divine power!`);
      } else {
        // Handle as a spell
        executeCelestialSpell(attacker, defender, celestial, spellName, newState);
      }
    }
  }

  updateBuffs(attacker, newState);
  updateBuffs(defender, newState);

  // Check for battle end conditions
  if (newState.human.stats.health <= 0 || newState.ai.stats.health <= 0) {
    newState.battleEnded = true;
    newState.winner = newState.human.stats.health <= 0 ? 'ai' : 'player';

    // Add victory/defeat message to battle log
    if (newState.winner === 'player') {
      newState.log.push(`${newState.human.name} stands victorious! ${newState.ai.name} has been defeated!`);
    } else {
      newState.log.push(`${newState.ai.name} emerges triumphant! ${newState.human.name} has fallen!`);
    }
  }

  newState.turn++;

  return newState;
}

// Types
type Attribute = {
  trait_type: string
  value: number | string
}

type God = {
  name: string
  description: string
  image: string
  attributes: Attribute[]
  properties: {
    category: string
    rarity_score: number
  }
}

type Character = {
  name: string
  description: string
  moveset: string[]
  attackValue: number
  defenceValue: number
  speedValue: number
  imageUrl: string
  success: boolean
}

const generateAiOpponent = (): { character: Character; gods: God[] } => {
  // Dummy functions
  const fetchGods = (): God[] => {
    return [
      {
        name: "bellona",
        description: "Goddess of war.",
        image: "https://corcel.b-cdn.net/5961d3b9-aebb-4626-add6-168563c66c4b.webp",
        attributes: [
          {
            trait_type: "Type",
            value: 3,
          },
          {
            trait_type: "Tier",
            value: 3,
          },
          {
            trait_type: "attack",
            value: 8,
          },
          {
            trait_type: "smite",
            value: 6,
          },
        ],
        properties: {
          category: "celestial",
          rarity_score: 26,
        },
      },
      {
        name: "saturn",
        description: "God of time and agriculture.",
        image: "https://corcel.b-cdn.net/9eff2be2-74ec-4077-8cd4-2326a8a90640.webp",
        attributes: [
          {
            trait_type: "wisdom",
            value: 8
          },
          {
            trait_type: "rewind",
            value: 7
          }
        ],
        properties: {
          category: "celestial",
          rarity_score: 20
        }
      },
      {
        name: "minerva",
        description: "Goddess of wisdom and strategic warfare.",
        image: "https://corcel.b-cdn.net/e2691b4f-185d-4450-a964-2881eeaace4d.webp",
        attributes: [
          {
            trait_type: "Type",
            value: 3,
          },
          {
            trait_type: "Tier",
            value: 3,
          },
          {
            trait_type: "wisdom",
            value: 9,
          },
          {
            trait_type: "shield",
            value: 7,
          },
        ],
        properties: {
          category: "celestial",
          rarity_score: 27,
        },
      },
      {
        name: "venus",
        description: "Goddess of love and beauty.",
        image: "https://corcel.b-cdn.net/4c19674f-91a3-454d-94bf-990e41ee6e62.webp",
        attributes: [
          {
            trait_type: "Type",
            value: "god"
          },
          {
            trait_type: "Tier",
            value: 3
          },
          {
            trait_type: "stealth",
            value: 7
          },
          {
            trait_type: "poison",
            value: 7
          }
        ],
        properties: {
          category: "celestial",
          rarity_score: 28
        }
      },
      {
        name: "mercury",
        description: "God of financial gain, commerce, and trickery.",
        image: "https://corcel.b-cdn.net/fa7206f1-81c8-4958-8936-397b1f383435.webp",
        attributes: [
          {
            trait_type: "Type",
            value: 3,
          },
          {
            trait_type: "Tier",
            value: 3,
          },
          {
            trait_type: "speed",
            value: 9,
          },
          {
            trait_type: "trickery",
            value: 8,
          },
        ],
        properties: {
          category: "celestial",
          rarity_score: 29,
        },
      },
      {
        name: "jupiter",
        description: "King of the gods and the god of sky and thunder.",
        image: "https://corcel.b-cdn.net/5961d3b9-aebb-4626-add6-168563c66c4b.webp",
        attributes: [
          {
            trait_type: "Type",
            value: 3,
          },
          {
            trait_type: "Tier",
            value: 3,
          },
          {
            trait_type: "thunder",
            value: 9,
          },
          {
            trait_type: "command",
            value: 8,
          },
        ],
        properties: {
          category: "celestial",
          rarity_score: 30,
        },
      },
    ]
  }
  const aiGods = fetchGods()
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  return {
    character: {
      name: "Maximus Decimus",
      description: "A legendary digital warrior whose code flows like the ancient rivers of Rome, wielding algorithms with the precision of a master gladiator. Born in the digital realm, this cybernetic champion combines the wisdom of ancient Rome with cutting-edge technology, making them an unstoppable force in the arena.",
      moveset: (() => {
        const attacks = ["melee", "ranged"];
        const defenses = ["fortify", "heal"];
        const passives = ["berserk", "tank", "glass_cannon", "daywalker", "nightcrawler"];
        
        return [
          attacks[Math.floor(Math.random() * attacks.length)],
          defenses[Math.floor(Math.random() * defenses.length)],
          passives[Math.floor(Math.random() * passives.length)]
        ];
      })(),
      attackValue: Math.floor(Math.random() * 21) + 50, // Random number between 50-70
      defenceValue: Math.floor(Math.random() * 21) + 50, // Random number between 50-70
      speedValue: Math.floor(Math.random() * 21) + 50, // Random number between 50-70
      imageUrl: "/stoicism.png",
      success: true,
    },
    gods: aiGods,
  }
}

const chooseRandomMove = (moveset: string[]): string => {
  return moveset[Math.floor(Math.random() * moveset.length)]
}

const chooseRandomGodBlessing = (gods: God[]): { god: God; attribute: Attribute } | null => {
  if (Math.random() > 0.7) {
    // 30% chance of blessing
    const randomGod = gods[Math.floor(Math.random() * gods.length)]
    const validAttributes = randomGod.attributes.filter(
      (attr) => attr.trait_type !== "Type" && attr.trait_type !== "Tier",
    )
    const randomAttribute = validAttributes[Math.floor(Math.random() * validAttributes.length)]
    return { god: randomGod, attribute: randomAttribute }
  }
  return null
}

// Update the processBattleAction function to use the new battle state structure
const processBattleAction = (
  state: BattleState,
  move: string,
  playerId: number
): BattleState => {
  const newState = { ...state }
  const logs: string[] = [...state.log]

  // Process move
  const player = playerId === 1 ? newState.human : newState.ai
  const opponent = playerId === 1 ? newState.ai : newState.human

  // Process passives first
  processPassives(player, newState)
  processPassives(opponent, newState)

  // Execute move
  const moveObj = player.moves.find(m => m.name === move)
  if (!moveObj) return state

  if (moveObj.type === 'attack') {
    executeAttack(player, opponent, moveObj, newState)
  } else if (moveObj.type === 'defense') {
    executeDefense(player, moveObj, newState)
  }

  // Update buffs
  updateBuffs(player, newState)
  updateBuffs(opponent, newState)

  // Switch turns
  newState.turn++
  newState.log = logs

  return newState
}

// God Icons component to display gods on the sides
const GodIcons = ({
  gods,
  position,
  activeGod,
}: {
  gods: God[]
  position: "left" | "right"
  activeGod?: string
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      {gods.map((god) => (
        <div
          key={god.name}
          className={`relative w-32 h-32 rounded-3xl overflow-hidden border-2 transition-all duration-300 ${activeGod === god.name
            ? "border-amber-400 scale-110 shadow-lg shadow-amber-500/50"
            : "border-gray-600 opacity-80 hover:opacity-100"
            }`}
        >
          <Image src={god.image || "/placeholder.svg"} alt={god.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 w-full text-center text-sm text-white capitalize font-bold py-1 bg-black/50">
            {god.name}
          </div>
        </div>
      ))}
    </div>
  )
}

// Blessing effect component
const BlessingEffect = ({
  isActive,
  godName,
  position,
  targetRef,
}: {
  isActive: boolean
  godName?: string
  position: "left" | "right"
  targetRef: React.RefObject<HTMLDivElement>
}) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; speed: number; color: string; rotation: number }>
  >([])

  useEffect(() => {
    if (isActive && godName) {
      // Create particles when blessing is active
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 0, // Start from top
        size: Math.random() * 8 + 4,
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        color: ["#FFD700", "#FFA500", "#FF8C00", "#FF4500", "#FFFFFF"][Math.floor(Math.random() * 5)],
      }))

      setParticles(newParticles)

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([])
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isActive, godName])

  if (!isActive || !godName) return null

  return (
    <div
      className={`absolute z-30 pointer-events-none ${position === "left" ? "left-20" : "right-20"} top-1/3 w-[calc(100%-40px)] h-1/3`}
    >
      <div className={`blessing-beam ${position === "left" ? "blessing-beam-left" : "blessing-beam-right"}`}></div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full blessing-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `blessing-particle-fall ${2 / particle.speed}s ease-out forwards`,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}

const sendBattleLogs = async (logs: string[]) => {
  console.log("Sending battle logs to API:", logs)
  // In a real implementation, this would be an API call
  return { success: true }
}

// Main component
export default function GladiatorBattle() {
  // Game state
  const [step, setStep] = useState<number>(1)
  const [availableGods, setAvailableGods] = useState<God[]>([])
  const [selectedGods, setSelectedGods] = useState<God[]>([])
  const [playerCharacter, setPlayerCharacter] = useState<Character | null>(null)
  const [aiOpponent, setAiOpponent] = useState<{ character: Character; gods: God[] } | null>(null)
  const [battleState, setBattleState] = useState<BattleState>({
    human: {
      id: 1,
      name: "",
      stats: {
        health: 100,
        maxHealth: 100,
        shield: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      },
      celestials: [],
      activeBuffs: [],
      activeSpells: [],
      moves: [],
    },
    ai: {
      id: 2,
      name: "",
      stats: {
        health: 100,
        maxHealth: 100,
        shield: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      },
      celestials: [],
      activeBuffs: [],
      activeSpells: [],
      moves: [],
    },
    turn: 1,
    environment: 'day',
    log: [],
  })
  const { address } = useAccount()
  const { data: celestialData } = useReadContract({
    abi: celestialAbi,
    address: celestialAddress,
    functionName: "getNFTs",
    args: [address],
  }) as any

  const { data: gladiatorData } = useReadContract({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "getGladiatorForPlayer",
    args: [address],
  }) as any

  // Move hooks from renderBattle to top level
  const playerRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const [showBlessingEffect, setShowBlessingEffect] = useState(false)
  const [blessingGod, setBlessingGod] = useState<string | undefined>(undefined)
  const [blessingTarget, setBlessingTarget] = useState<"player" | "ai" | null>(null)
  const battleLogRef = useRef<HTMLDivElement>(null)

  // Effect to trigger blessing animation when a new god blessing occurs
  useEffect(() => {
    const lastLog = battleState.log[battleState.log.length - 1]
    if (lastLog && lastLog.includes("Celestial")) {
      const godName = lastLog.split(" ")[1]
      setBlessingGod(godName)
      setBlessingTarget(lastLog.includes("healing") ? "player" : "ai")
      setShowBlessingEffect(true)

      const timer = setTimeout(() => {
        setShowBlessingEffect(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [battleState.log])

  const processGladiatorData = async (uri: string) => {
    const metadata = await fetch(uri)
    const metadataJson = await metadata.json()
    return metadataJson
  }

  // Dummy functions
  const fetchGods = (): God[] => {
    const godsData = celestialData.map((json: string) => JSON.parse(json))
    const godsDataFiltered = godsData.map((god: God) => ({
      ...god,
      attributes: god.attributes.filter((attr: Attribute) => attr.trait_type !== "Type" && attr.trait_type !== "Tier")
    }))
    console.log("godsData", godsDataFiltered)
    return godsDataFiltered as God[]
  }

  const fetchPlayerCharacter = async () => {
    console.log("Gladiator Data: ", gladiatorData)
    const uri = gladiatorData.toString()
    const metadata = await processGladiatorData(uri)
    console.log("Metadata: ", metadata)
    setPlayerCharacter(metadata)

    // Update battle state with player character
    setBattleState(prev => ({
      ...prev,
      human: {
        ...prev.human,
        name: metadata.name,
        stats: {
          health: 100,
          maxHealth: 100,
          shield: 0,
          attack: metadata.attackValue,
          defense: metadata.defenceValue,
          speed: metadata.speedValue,
        },
        moves: metadata.moveset.map((move: string) => ({
          name: move,
          type: move === 'heal' ? 'defense' : 'attack',
          description: move.replace('_', ' '),
        })),
      }
    }))
  }

  // Initialize game data
  useEffect(() => {
    if (!address || !celestialData || !gladiatorData) return
    setAvailableGods([...fetchGods()])
    fetchPlayerCharacter()
  }, [address, celestialData, gladiatorData])

  // Auto-scroll battle log
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight
    }
  }, [battleState.log])

  // AI turn logic
  useEffect(() => {
    if (step === 3 && battleState.turn % 2 === 0 && !battleState.battleEnded && aiOpponent) {
      // Add a delay to make AI turn feel more natural
      const aiTurnTimeout = setTimeout(() => {
        const aiMove = chooseRandomMove(aiOpponent.character.moveset)
        const blessing = generateRandomBlessing(battleState.ai)
        const newState = executeBattleMove(
          battleState,
          aiMove,
          2, // AI player,
          blessing?.celestialIndex,
          blessing?.blessing
        )
        setBattleState(newState)

        // Automatically handle battle end if health reaches 0
        if (newState.battleEnded) {
          handleBattleEnd(newState)
        }
      }, 1500)

      return () => clearTimeout(aiTurnTimeout)
    }
  }, [battleState, step, aiOpponent])

  // Handle god selection
  const handleGodSelection = (god: God) => {
    if (selectedGods.includes(god)) {
      setSelectedGods(selectedGods.filter((g) => g.name !== god.name))
    } else if (selectedGods.length < 3) {
      setSelectedGods([...selectedGods, god])
    }
  }

  // Start battle
  const startBattle = () => {
    if (!playerCharacter || !aiOpponent) return

    // Convert gods to celestials
    const playerCelestials = selectedGods.map(god => {
      // Define valid buff and spell names from config
      const validBuffs = [
        "attack", "defense", "speed", "heal", "shield", "stealth", "fury",
        "divine_protection", "wisdom", "curse_resistance", "fortune"
      ];
      const validSpells = [
        "fireball", "inferno", "icebolt", "lightning", "poison", "stun",
        "whirlpool", "earthquake", "meteor", "wrath", "smite", "rewind",
        "necrotic_touch", "aether_blast", "abyssal_chain", "tempest"
      ];

      // Separate attributes into buffs and spells
      const buffs: Record<string, number> = {};
      const spells: Record<string, number> = {};

      god.attributes.forEach(attr => {
        const traitName = attr.trait_type.toLowerCase();
        if (validBuffs.includes(traitName)) {
          buffs[traitName] = attr.value as number;
        } else if (validSpells.includes(traitName)) {
          spells[traitName] = attr.value as number;
        }
      });

      return {
        name: god.name,
        type: 'god' as const,
        tier: god.properties.rarity_score,
        description: god.description,
        buffs,
        spells,
      };
    });

    const aiCelestials = aiOpponent.gods.map(god => {
      // Define valid buff and spell names from config
      const validBuffs = [
        "attack", "defense", "speed", "heal", "shield", "stealth", "fury",
        "divine_protection", "wisdom", "curse_resistance", "fortune"
      ];
      const validSpells = [
        "fireball", "inferno", "icebolt", "lightning", "poison", "stun",
        "whirlpool", "earthquake", "meteor", "wrath", "smite", "rewind",
        "necrotic_touch", "aether_blast", "abyssal_chain", "tempest"
      ];

      // Separate attributes into buffs and spells
      const buffs: Record<string, number> = {};
      const spells: Record<string, number> = {};

      god.attributes.forEach(attr => {
        const traitName = attr.trait_type.toLowerCase();
        if (validBuffs.includes(traitName)) {
          buffs[traitName] = attr.value as number;
        } else if (validSpells.includes(traitName)) {
          spells[traitName] = attr.value as number;
        }
      });

      return {
        name: god.name,
        type: 'god' as const,
        tier: god.properties.rarity_score,
        description: god.description,
        buffs,
        spells,
      };
    });

    // Initialize battle state
    const initialState: BattleState = {
      human: {
        id: 1,
        name: playerCharacter.name,
        stats: {
          health: 100,
          maxHealth: 100,
          shield: 0,
          attack: playerCharacter.attackValue,
          defense: playerCharacter.defenceValue,
          speed: playerCharacter.speedValue,
        },
        celestials: playerCelestials,
        activeBuffs: [],
        activeSpells: [],
        moves: playerCharacter.moveset.map(move => ({
          name: move,
          type: move === 'heal' ? 'defense' : 'attack',
          description: move.replace('_', ' '),
        })),
      },
      ai: {
        id: 2,
        name: aiOpponent.character.name,
        stats: {
          health: 100,
          maxHealth: 100,
          shield: 0,
          attack: aiOpponent.character.attackValue,
          defense: aiOpponent.character.defenceValue,
          speed: aiOpponent.character.speedValue,
        },
        celestials: aiCelestials,
        activeBuffs: [],
        activeSpells: [],
        moves: aiOpponent.character.moveset.map(move => ({
          name: move,
          type: move === 'heal' ? 'defense' : 'attack',
          description: move.replace('_', ' '),
        })),
      },
      turn: 1,
      environment: 'day',
      log: [
        `The crowd roars as ${playerCharacter.name} and ${aiOpponent.character.name} enter the arena!`,
        `${playerCharacter.speedValue >= aiOpponent.character.speedValue ? playerCharacter.name : aiOpponent.character.name} moves with lightning speed, taking the initiative!`,
      ],
    }

    setBattleState(initialState)
    setStep(3)
  }

  // Handle player move
  const handlePlayerMove = (move: string) => {
    if (battleState.turn % 2 !== 1 || battleState.battleEnded) return
    const blessing = generateRandomBlessing(battleState.human)
    const newState = executeBattleMove(
      battleState,
      move,
      1, // Player 1
      blessing?.celestialIndex,
      blessing?.blessing
    )

    // Add impact effect for attack moves
    if (move !== 'heal') {
      handleAttackImpact(aiRef)
    }

    setBattleState(newState)

    // Automatically handle battle end if health reaches 0
    if (newState.battleEnded) {
      handleBattleEnd(newState)
    }
  }

  // Handle battle end
  const handleBattleEnd = async (newState: BattleState) => {
    if (!newState.battleEnded) return;

    // Update battle state to ensure it's properly set
    setBattleState(newState);

    // Wait a moment for the state to update
    await new Promise(resolve => setTimeout(resolve, 500));

    await sendBattleLogs(newState.log);
    setStep(4);

    if (newState.winner === 'player') {
      // Trigger victory confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

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
    }
  };

  // Reset game
  const resetGame = () => {
    setStep(1)
    setSelectedGods([])
    setAiOpponent(null)
    setBattleState({
      human: {
        id: 1,
        name: "",
        stats: {
          health: 100,
          maxHealth: 100,
          shield: 0,
          attack: 0,
          defense: 0,
          speed: 0,
        },
        celestials: [],
        activeBuffs: [],
        activeSpells: [],
        moves: [],
      },
      ai: {
        id: 2,
        name: "",
        stats: {
          health: 100,
          maxHealth: 100,
          shield: 0,
          attack: 0,
          defense: 0,
          speed: 0,
        },
        celestials: [],
        activeBuffs: [],
        activeSpells: [],
        moves: [],
      },
      turn: 1,
      environment: 'day',
      log: [],
    })
  }

  // Render god selection step
  const renderGodSelection = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-center mb-2 text-amber-500">Choose Your Divine Patrons</h2>
          <p className="text-center text-gray-300 mb-8">
            Select three gods to bless your battle. Choose wisely, gladiator!
          </p>

          <div className="flex overflow-x-auto space-x-6 pb-4 mb-8 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-gray-800">
            <div className="w-1 flex-shrink-0"></div>
            {availableGods.map((god) => (
              <motion.div
                key={god.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-80 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 my-4 ${selectedGods.includes(god)
                  ? "ring-4 ring-amber-500 shadow-lg shadow-amber-500/30"
                  : "ring-1 ring-gray-700 hover:ring-gray-500"
                  }`}
                onClick={() => handleGodSelection(god)}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  <Image
                    src={god.image || "/placeholder.svg"}
                    alt={god.name}
                    fill // Use fill to cover the container
                    className="object-cover" // Ensure image covers the area
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
                  <div>
                    {" "}
                    {/* Inner div to push content to bottom */}
                    <h3 className="text-2xl font-bold text-white capitalize">{god.name}</h3>
                    <p className="text-gray-300 text-base mt-2 line-clamp-2">{god.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {god.attributes
                        .filter((attr) => attr.trait_type !== "Type" && attr.trait_type !== "Tier")
                        .map((attr, index) => (
                          <span
                            key={index}
                            className="inline-block px-2.5 py-1 bg-gray-800/80 rounded text-sm text-amber-400"
                          >
                            {attr.trait_type}: {attr.value}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedGods.includes(god) && (
                  <div className="absolute top-3 right-3 z-30 bg-amber-500 rounded-full p-1.5 shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
            {/* Add a spacer div if needed to ensure last item doesn't touch edge */}
            <div className="w-1 flex-shrink-0"></div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setStep(2)
                setAiOpponent(generateAiOpponent())
              }}
              disabled={selectedGods.length !== 3}
              className={`px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 ${selectedGods.length === 3
                ? "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              {selectedGods.length === 3 ? "Continue to Battle" : `Select ${3 - selectedGods.length} more gods`}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render character preview step
  const renderCharacterPreview = () => {
    if (!playerCharacter || !aiOpponent) {
      console.log("playerCharacter", playerCharacter)
      console.log("aiOpponent", aiOpponent)
      return null
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-center mb-2 text-amber-500">The Gladiators</h2>
          <p className="text-center text-gray-300 mb-8">
            Today&apos;s match: {playerCharacter.name} vs {aiOpponent.character.name}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Player Character */}
            <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-amber-500/30">
              <div className="relative h-full">
                <div className="h-48 flex-shrink-0"></div>

                <Image
                  src={playerCharacter.imageUrl || "/placeholder.svg"}
                  alt={playerCharacter.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                <div className="relative p-4">
                  <h3 className="text-2xl font-bold text-white">{playerCharacter.name}</h3>
                  <p className="text-amber-400">Champion Gladiator</p>

                  <div className="mt-3">
                    <p className="text-gray-300 text-sm line-clamp-3">{playerCharacter.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3">
                    <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                      <Sword className="h-4 w-4 text-red-500 mx-auto mb-1" />
                      <span className="block text-xs text-gray-400">Attack</span>
                      <span className="block text-base font-bold text-white">{playerCharacter.attackValue}</span>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                      <Shield className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <span className="block text-xs text-gray-400">Defense</span>
                      <span className="block text-base font-bold text-white">{playerCharacter.defenceValue}</span>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                      <Zap className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
                      <span className="block text-xs text-gray-400">Speed</span>
                      <span className="block text-base font-bold text-white">{playerCharacter.speedValue}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-white font-bold mb-1">Moveset:</h4>
                    <div className="flex flex-wrap gap-2">
                      {playerCharacter.moveset.map((move, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-amber-400 text-xs capitalize"
                        >
                          {move.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-bold mb-1">Divine Patrons:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGods.map((god) => (
                        <div key={god.name} className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full overflow-hidden">
                            <Image
                              src={god.image || "/placeholder.svg"}
                              alt={god.name}
                              width={20}
                              height={20}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-amber-400 text-xs capitalize">{god.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Character */}
            <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-red-500/30">
              <div className="relative h-full">
                <Image
                  src={aiOpponent.character.imageUrl || "/placeholder.svg"}
                  alt={aiOpponent.character.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                
                {/* Content container with flex column to push everything to bottom */}
                <div className="relative p-4 flex flex-col h-full">
                  <div className="flex-grow"></div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{aiOpponent.character.name}</h3>
                      <p className="text-red-400">Fearsome Opponent</p>
                      <p className="text-gray-300 text-sm mt-2">{aiOpponent.character.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                        <Sword className="h-4 w-4 text-red-500 mx-auto mb-1" />
                        <span className="block text-xs text-gray-400">Attack</span>
                        <span className="block text-base font-bold text-white">{aiOpponent.character.attackValue}</span>
                      </div>
                      <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                        <Shield className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                        <span className="block text-xs text-gray-400">Defense</span>
                        <span className="block text-base font-bold text-white">{aiOpponent.character.defenceValue}</span>
                      </div>
                      <div className="bg-gray-800/80 backdrop-blur-sm p-2 rounded text-center">
                        <Zap className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
                        <span className="block text-xs text-gray-400">Speed</span>
                        <span className="block text-base font-bold text-white">{aiOpponent.character.speedValue}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-bold mb-1">Moveset:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiOpponent.character.moveset.map((move, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-red-400 text-xs capitalize"
                          >
                            {move.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-bold mb-1">Divine Patrons:</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiOpponent.gods.map((god) => (
                          <div key={god.name} className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full overflow-hidden">
                              <Image
                                src={god.image || "/placeholder.svg"}
                                alt={god.name}
                                width={20}
                                height={20}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-red-400 text-xs capitalize">{god.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={startBattle}
              className="px-8 py-3 rounded-lg text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300"
            >
              Begin the Battle!
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render battle step
  const renderBattle = () => {
    if (!playerCharacter || !aiOpponent) return null

    // Find the active god (the one that gave the most recent blessing)
    const lastGodBlessing = battleState.log.filter((log) => log.includes("Celestial")).slice(-1)[0]

    return (
      <div className="container mx-auto px-4 py-8 overflow-y-hidden">
        <h2 className="text-3xl font-bold text-center mb-8 text-amber-500 font-['Cinzel'] tracking-wider">FIGHT!</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative"
        >
          {/* Player Character */}
          <div className="relative">
            {/* Gods above player */}
            <div className="absolute z-[100] w-full -top-10">
              <GodIcons
                gods={selectedGods}
                position="left"
                activeGod={blessingTarget === "player" ? blessingGod : undefined}
              />
            </div>

            {/* Blessing effect for player */}
            <BlessingEffect
              isActive={showBlessingEffect && blessingTarget === "player"}
              godName={blessingGod}
              position="left"
              targetRef={playerRef as RefObject<HTMLDivElement>}
            />

            <div
              ref={playerRef}
              className="bg-gray-900/50 rounded-3xl overflow-hidden border border-amber-500/30 relative mt-28"
            >
              <Image
                src={playerCharacter.imageUrl || "/placeholder.svg"}
                alt={playerCharacter.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/10"></div>

              <div className="relative p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">{playerCharacter.name}</h3>
                </div>
                <div className="h-64 flex-shrink-0"></div>

                {/* Health and shield bars */}
                <div className="mb-6">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-white text-xs font-bold">Health</span>
                      </div>
                      <span className="text-white text-xs">{battleState.human.stats.health}/100</span>
                    </div>
                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                      <motion.div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full"
                        initial={{ width: `100%` }}
                        animate={{ width: `${battleState.human.stats.health}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-white text-xs font-bold">Shield</span>
                      </div>
                      <span className="text-white text-xs">{battleState.human.stats.shield}</span>
                    </div>
                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                        initial={{ width: `0%` }}
                        animate={{ width: `${Math.min(100, battleState.human.stats.shield)}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/80 p-4 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Moves:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {playerCharacter.moveset.map((move, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlayerMove(move)}
                        disabled={battleState.turn % 2 === 0 || battleState.battleEnded}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${battleState.turn % 2 === 0 || battleState.battleEnded
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-amber-500 hover:bg-amber-600 text-black"
                          }`}
                      >
                        {move.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-700 lg:col-span-1">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white text-center">Battle Log</h3>
            </div>

            <div
              ref={battleLogRef}
              className="p-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            >
              {battleState.log.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`mb-3 p-3 rounded-lg ${log.includes("Player")
                    ? "bg-amber-500/10 border-l-4 border-amber-500"
                    : log.includes("AI")
                      ? "bg-red-500/10 border-l-4 border-red-500"
                      : "bg-purple-500/10 border-l-4 border-purple-500"
                    }`}
                >
                  <div className="flex items-start">
                    {log.includes("Player") && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image
                          src={playerCharacter.imageUrl || "/placeholder.svg"}
                          alt={playerCharacter.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {log.includes("AI") && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image
                          src={aiOpponent.character.imageUrl || "/placeholder.svg"}
                          alt={aiOpponent.character.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {log.includes("Celestial") && log.includes("healing") && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                        <Image
                          src={
                            selectedGods.find((g) => g.name === log.split(" ")[1])?.image ||
                            aiOpponent.gods.find((g) => g.name === log.split(" ")[1])?.image ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={log.split(" ")[1]}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-bold mb-1">
                        {log.includes("Player") && <span className="text-amber-400">{playerCharacter.name}</span>}
                        {log.includes("AI") && <span className="text-red-400">{aiOpponent.character.name}</span>}
                        {log.includes("Celestial") && log.includes("healing") && (
                          <span className="text-purple-400 capitalize">{log.split(" ")[1]}</span>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm">
                        {log}
                        {log.includes("damage") && log.includes("+") && (
                          <span
                            className={`font-bold ml-1 ${log.includes("Player") ? "text-red-500" : "text-green-500"
                              }`}
                          >
                            {log.includes("damage") ? "+" : "-"}
                            {log.split(" ")[2]}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {battleState.turn % 2 !== 0 && !battleState.battleEnded && (
                <div className="text-center py-2 text-amber-400 animate-pulse">Your turn! Choose your move...</div>
              )}

              {battleState.turn % 2 === 0 && !battleState.battleEnded && (
                <div className="text-center py-2 text-red-400 animate-pulse">
                  {aiOpponent.character.name} is preparing to strike...
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {battleState.turn % 2 !== 1 ? "Your turn" : `${aiOpponent.character.name}'s turn`}
              </div>

              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${battleState.turn % 2 !== 1 ? "bg-amber-500" : "bg-red-500"
                    }`}
                ></div>
                <span className="text-sm text-gray-400">
                  {battleState.battleEnded ? "Battle ended" : "Battle in progress"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Character */}
          <div className="relative">
            {/* Gods above AI */}
            <div className="absolute z-[100] w-full -top-10">
              <GodIcons
                gods={aiOpponent.gods}
                position="right"
                activeGod={blessingTarget === "ai" ? blessingGod : undefined}
              />
            </div>

            {/* Blessing effect for AI */}
            <BlessingEffect
              isActive={showBlessingEffect && blessingTarget === "ai"}
              godName={blessingGod}
              position="right"
              targetRef={aiRef as RefObject<HTMLDivElement>}
            />

            <div ref={aiRef} className="bg-gray-900/50 rounded-3xl overflow-hidden border border-red-500/30 relative mt-28">
              <Image
                src={aiOpponent.character.imageUrl || "/placeholder.svg"}
                alt={aiOpponent.character.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/10"></div>

              <div className="relative p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">{aiOpponent.character.name}</h3>
                </div>
                <div className="h-64 flex-shrink-0"></div>

                {/* Health and shield bars */}
                <div className="mb-6">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-white text-xs font-bold">Health</span>
                      </div>
                      <span className="text-white text-xs">{battleState.ai.stats.health}/100</span>
                    </div>
                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                      <motion.div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full"
                        initial={{ width: `100%` }}
                        animate={{ width: `${battleState.ai.stats.health}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-white text-xs font-bold">Shield</span>
                      </div>
                      <span className="text-white text-xs">{battleState.ai.stats.shield}</span>
                    </div>
                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                        initial={{ width: `0%` }}
                        animate={{ width: `${Math.min(100, battleState.ai.stats.shield)}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/80 p-4 rounded-lg">
                  <h4 className="text-white font-bold mb-2">Moves:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {aiOpponent.character.moveset.map((move, index) => (
                      <div key={index} className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-700 text-gray-400">
                        {move.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render battle result step
  const renderBattleResult = () => {
    if (!playerCharacter || !aiOpponent || !battleState.winner) return null

    const isPlayerWinner = battleState.winner === "player"

    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className={`relative rounded-lg overflow-hidden border-4 ${isPlayerWinner ? "border-amber-500" : "border-red-500"
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>

            <div className="relative z-10 p-8 text-center">
              <h2
                className={`text-5xl md:text-6xl font-bold mb-4 ${isPlayerWinner ? "text-amber-500" : "text-red-500"}`}
              >
                {isPlayerWinner ? "VICTORY!" : "DEFEAT!"}
              </h2>

              <p className="text-white text-xl mb-8">
                {isPlayerWinner
                  ? `${playerCharacter.name} stands victorious in the arena! The crowd roars with approval as ${aiOpponent.character.name} falls to his knees.`
                  : `${aiOpponent.character.name} has bested ${playerCharacter.name} in combat. The crowd's cheers echo through the Colosseum as you taste the bitter dust of defeat.`}
              </p>

              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white mx-auto">
                    <Image
                      src={playerCharacter.imageUrl || "/placeholder.svg"}
                      alt={playerCharacter.name}
                      fill
                      className="object-cover"
                    />
                    {!isPlayerWinner && (
                      <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                        <Skull className="h-12 w-12 text-red-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold mt-2">{playerCharacter.name}</h3>
                </div>

                <div className="text-4xl font-bold text-gray-500">VS</div>

                <div className="text-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white mx-auto">
                    <Image
                      src={aiOpponent.character.imageUrl || "/placeholder.svg"}
                      alt={aiOpponent.character.name}
                      fill
                      className="object-cover"
                    />
                    {isPlayerWinner && (
                      <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                        <Skull className="h-12 w-12 text-red-500" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold mt-2">{aiOpponent.character.name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Battle Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Damage Dealt:</span>
                      <span className="text-white font-bold">
                        {battleState.log
                          .filter((log) => log.includes("Player") && log.includes("damage") && log.includes("+"))
                          .reduce((total, log) => total + parseInt(log.split(" ")[2]), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Damage Taken:</span>
                      <span className="text-white font-bold">
                        {battleState.log
                          .filter((log) => log.includes("AI") && log.includes("damage") && log.includes("-"))
                          .reduce((total, log) => total + parseInt(log.split(" ")[2]), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Divine Interventions:</span>
                      <span className="text-white font-bold">
                        {battleState.log.filter((log) => log.includes("Celestial")).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Battle Rewards</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Glory:</span>
                      <span className="text-amber-500 font-bold">{isPlayerWinner ? "+1,500" : "+300"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-blue-400 font-bold">{isPlayerWinner ? "+850" : "+200"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Divine Favor:</span>
                      <span className="text-purple-400 font-bold">{isPlayerWinner ? "+3" : "+1"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={resetGame}
                className={`px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 ${isPlayerWinner
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                Return to the Ludus
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Add this function to handle attack impact animation
  const handleAttackImpact = (targetRef: RefObject<HTMLDivElement | null>) => {
    if (targetRef.current) {
      targetRef.current.classList.add('attack-impact')
      setTimeout(() => {
        targetRef.current?.classList.remove('attack-impact')
      }, 500)
    }
  }

  return (
    <div className="h-screen bg-gray-950 text-white relative overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/fog3.png)" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500 opacity-20"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <Navbar />
      {/* <header className="relative z-10 py-4 px-4">
                <div className="container mx-auto">
                    <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-amber-500 mb-2">
                        GLADIATOR ARENA
                    </h1>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Enter the Colosseum, where glory awaits the victorious and death embraces the defeated. Choose your divine
                        patrons wisely, for their blessings may turn the tide of battle.
                    </p>
                </div>
            </header> */}

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-auto pt-20">
        {/* Step indicator */}
        {/* <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                    stepNumber === step
                      ? "bg-amber-500 text-black"
                      : stepNumber < step
                        ? "bg-green-500 text-black"
                        : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {stepNumber < step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {stepNumber < 4 && (
                  <div className={`w-12 md:w-16 h-1 ${stepNumber < step ? "bg-green-500" : "bg-gray-700"}`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <span className="text-amber-500 font-bold text-sm md:text-base">
              {step === 1 && "Choose Your Gods"}
              {step === 2 && "Meet Your Opponent"}
              {step === 3 && "Battle!"}
              {step === 4 && "Battle Results"}
            </span>
          </div>
        </div> */}

        {/* Step content */}
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {step === 1 && renderGodSelection()}
          {step === 2 && renderCharacterPreview()}
          {step === 3 && renderBattle()}
          {step === 4 && renderBattleResult()}
        </div>
      </main>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 3px;
        }
        
        .scrollbar-track-gray-900::-webkit-scrollbar-track {
          background-color: #111827;
        }

        @keyframes blessing-particle-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100px) rotate(360deg);
          }
        }

        .blessing-particle {
          animation: blessing-particle-fall 2s ease-out forwards;
        }

        .blessing-beam {
          position: absolute;
          height: 4px;
          background: linear-gradient(90deg, 
            rgba(255,215,0,0.8) 0%, 
            rgba(255,255,255,0.9) 50%, 
            rgba(255,215,0,0.8) 100%
          );
          top: 50%;
          transform-origin: left center;
          animation: beam-pulse 2s ease-out;
          box-shadow: 0 0 10px 2px rgba(255,215,0,0.6);
          z-index: 30;
        }

        .blessing-beam-left {
          left: 0;
          right: 0;
          transform-origin: left center;
        }

        .blessing-beam-right {
          left: 0;
          right: 0;
          transform-origin: right center;
        }

        @keyframes beam-pulse {
          0% {
            opacity: 0;
            transform: scaleX(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scaleX(1);
          }
        }

        @keyframes attack-impact {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-3px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .attack-impact {
          animation: attack-impact 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

