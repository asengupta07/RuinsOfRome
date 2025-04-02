interface Buff {
    name: string;
    description: string;
    value?: number; // Current intensity/level of the buff
    duration?: number; // Turns remaining
}

interface Spell {
    name: string;
    description: string;
    power?: number; // Base power of the spell
    cooldown?: number; // Turns until it can be used again
}

interface Celestial {
    name: string;
    type: 'god' | 'titan';
    tier: number;
    description: string;
    buffs: Record<string, number>; // Buff names and their values
    spells: Record<string, number>; // Spell names and their power values
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
    id: number; // 1 for human, 2 for AI
    name: string; // Added name field
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
    environment: 'day' | 'night'; // For daywalker/nightcrawler
    log: string[]; // Battle log entries
}

// Additional interfaces for more complex scenarios
interface DamageOverTimeEffect {
    name: string;
    damagePerTurn: number;
    remainingTurns: number;
}

interface CelestialBlessing {
    celestialName: string;
    buffsApplied: Buff[];
    spellsGranted: Spell[];
}

interface BattleResult {
    winner: number | null; // 1 for human, 2 for AI, null if ongoing
    turnsTaken: number;
    finalState: BattleState;
}

// For tracking celestial cooldowns
interface CelestialCooldown {
    celestialIndex: number;
    spellName: string;
    remainingTurns: number;
}

// For the player's celestial selection
interface CelestialSelection {
    primary: Celestial | null;
    secondary: Celestial | null;
    tertiary: Celestial | null;
}

// For move effects
interface MoveEffect {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'shield';
    value: number;
    target: 'self' | 'enemy';
    duration?: number;
}

// For the battle history
interface BattleHistoryEntry {
    turn: number;
    actor: number; // 1 or 2
    action: string;
    result: string;
    stateSnapshot: PlayerStats;
}

function executeBattleMove(
    currentState: BattleState,
    moveName: string,
    moveFrom: number, // 1 for human, 2 for AI
    targetCelestialIndex?: number, // Optional: which celestial to invoke
    spellName?: string // Optional: which spell to cast
): BattleState {
    // Create a deep copy of the state to modify
    const newState: BattleState = JSON.parse(JSON.stringify(currentState));

    const attacker = moveFrom === 1 ? newState.human : newState.ai;
    const defender = moveFrom === 1 ? newState.ai : newState.human;

    // Process passive effects at start of turn
    processPassives(attacker, newState);
    processPassives(defender, newState);

    // Execute the move
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
            // Passives are processed at start of turn
            newState.log.push(`${attacker.id === 1 ? 'Player' : 'AI'} activates passive: ${moveName}`);
            break;
    }

    // Process celestial spells if invoked
    if (targetCelestialIndex !== undefined && spellName) {
        const celestial = attacker.celestials[targetCelestialIndex];
        if (celestial) {
            executeCelestialSpell(attacker, defender, celestial, spellName, newState);
        }
    }

    // Process buff durations
    updateBuffs(attacker, newState);
    updateBuffs(defender, newState);

    // Increment turn counter
    newState.turn++;

    return newState;
}

// Helper functions
function processPassives(player: Player, currentState: BattleState) {
    player.moves.forEach(move => {
        if (move.type === 'passive') {
            switch (move.name) {
                case 'nightcrawler':
                    if (currentState.environment === 'night') {
                        player.activeBuffs.push({
                            name: 'stealth',
                            value: 15,
                            duration: 1,
                            description: 'Stealth'
                        });
                    }
                    break;
                case 'daywalker':
                    if (currentState.environment === 'day') {
                        player.activeBuffs.push({
                            name: 'attack',
                            value: 10,
                            duration: 1,
                            description: 'Attack'
                        });
                    }
                    break;
                case 'berserk':
                    if (player.stats.health / player.stats.maxHealth < 0.3) {
                        player.activeBuffs.push({
                            name: 'fury',
                            value: 20,
                            duration: 1,
                            description: 'Fury'
                        });
                    }
                    break;
                case 'tank':
                    player.activeBuffs.push({
                        name: 'defense',
                        value: 15,
                        duration: 1,
                        description: 'Defense'
                    });
                    break;
                case 'glass_cannon':
                    player.activeBuffs.push({
                        name: 'attack',
                        value: 25,
                        duration: 1,
                        description: 'Attack'
                    });
                    break;
            }
        }
    });
}

function executeAttack(attacker: Player, defender: Player, move: Move, state: BattleState) {
    // Calculate base damage
    let damage = attacker.stats.attack;

    // Apply attack buffs
    const attackBuff = attacker.activeBuffs.find(b => b.name === 'attack');
    if (attackBuff) {
        damage *= (1 + (attackBuff.value || 0) / 100);
    }

    // Apply fury if health is low
    const furyBuff = attacker.activeBuffs.find(b => b.name === 'fury');
    if (furyBuff && (attacker.stats.health / attacker.stats.maxHealth < 0.3)) {
        damage *= (1 + (furyBuff.value || 0) / 100);
    }

    // Apply defense reduction
    let defense = defender.stats.defense;
    const defenseBuff = defender.activeBuffs.find(b => b.name === 'defense');
    if (defenseBuff) {
        defense *= (1 + (defenseBuff.value || 0) / 100);
    }

    // Apply stealth chance
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

    // Final damage calculation
    damage = Math.max(1, damage - defense / 2);

    // Apply fortune/luck
    const fortuneBuff = attacker.activeBuffs.find(b => b.name === 'fortune');
    if (fortuneBuff && Math.random() < (fortuneBuff.value || 0) / 100) {
        damage *= 1.5; // Critical hit
        const critMessages = [
            `By Jupiter's thunder! ${attacker.name} strikes with divine fury!`,
            `Mars himself guides ${attacker.name}'s hand in this devastating blow!`,
            `The gods smile upon ${attacker.name} as they deliver a mighty strike!`
        ];
        state.log.push(critMessages[Math.floor(Math.random() * critMessages.length)]);
    }

    // Apply shield first
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

    // Apply remaining damage to health
    if (damage > 0) {
        defender.stats.health = Math.max(0, defender.stats.health - damage);
        const damageMessages = [
            `${attacker.name} strikes ${defender.name} for ${damage} damage, like Mars himself!`,
            `The blow from ${attacker.name} lands true, dealing ${damage} damage to ${defender.name}!`,
            `${attacker.name}'s attack pierces ${defender.name}'s defenses for ${damage} damage!`
        ];
        state.log.push(damageMessages[Math.floor(Math.random() * damageMessages.length)]);
    }
}

function executeDefense(player: Player, move: Move, state: BattleState) {
    switch (move.name) {
        case 'fortify':
            player.activeBuffs.push({
                name: 'defense',
                value: 30,
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
            const healAmount = player.stats.maxHealth * 0.2;
            player.stats.health = Math.min(player.stats.maxHealth, player.stats.health + healAmount);
            const healMessages = [
                `${player.name} receives healing from Apollo's divine light!`,
                `The healing touch of Venus restores ${healAmount} HP to ${player.name}!`,
                `${player.name} is rejuvenated by the waters of the Tiber, healing for ${healAmount} HP!`
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

    // Check if celestial is a god or titan for special effects
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
            // Offensive spells
            let damage = spellPower;

            // Apply wisdom buff if exists
            const wisdomBuff = attacker.activeBuffs.find(b => b.name === 'wisdom');
            if (wisdomBuff) {
                damage *= (1 + (wisdomBuff.value || 0) / 100);
            }

            // Apply divine protection if exists
            const divineBuff = defender.activeBuffs.find(b => b.name === 'divine_protection');
            if (divineBuff && (spellName === 'smite' || spellName === 'aether_blast')) {
                damage *= (1 - (divineBuff.value || 0) / 100);
            }

            // Apply shield first
            if (defender.stats.shield > 0) {
                const shieldDamage = Math.min(damage, defender.stats.shield);
                defender.stats.shield -= shieldDamage;
                damage -= shieldDamage;
                state.log.push(`${defender.id === 1 ? 'Player' : 'AI'} shield absorbed ${shieldDamage} damage`);
            }

            if (damage > 0) {
                defender.stats.health = Math.max(0, defender.stats.health - damage);
                state.log.push(`Celestial ${celestial.name} cast ${spellName} for ${damage} damage`);
            }
            break;

        case 'icebolt':
        case 'abyssal_chain':
        case 'stun':
            // Crowd control spells
            defender.activeBuffs.push({
                name: 'speed',
                value: -30,
                duration: 2,
                description: 'Speed'
            });
            state.log.push(`Celestial ${celestial.name} cast ${spellName}, slowing the enemy`);
            break;

        case 'poison':
        case 'necrotic_touch':
            // Damage over time spells
            defender.activeBuffs.push({
                name: spellName,
                value: spellPower,
                duration: 3,
                description: 'Poison'
            });
            state.log.push(`Celestial ${celestial.name} cast ${spellName}, applying a damage over time effect`);
            break;

        case 'heal':
        case 'aether_blast': // Assuming this can also heal in some cases
            const healAmount = attacker.stats.maxHealth * (spellPower / 100);
            attacker.stats.health = Math.min(attacker.stats.maxHealth, attacker.stats.health + healAmount);
            state.log.push(`Celestial ${celestial.name} cast ${spellName}, healing for ${healAmount} HP`);
            break;

        case 'shield':
            const shieldAmount = attacker.stats.maxHealth * (spellPower / 100);
            attacker.stats.shield += shieldAmount;
            state.log.push(`Celestial ${celestial.name} cast ${spellName}, granting ${shieldAmount} shield`);
            break;

        case 'rewind':
            // This would need more complex state management to rewind
            state.log.push(`Celestial ${celestial.name} attempted to rewind time (special effect)`);
            break;

        default:
            state.log.push(`Celestial ${celestial.name} cast unknown spell ${spellName}`);
    }
}

function updateBuffs(player: Player, state: BattleState) {
    // Update durations and remove expired buffs
    player.activeBuffs = player.activeBuffs
        .map(buff => ({ ...buff, duration: buff.duration ? buff.duration - 1 : 0 }))
        .filter(buff => buff.duration > 0);

    // Process damage over time effects
    const dotBuffs = player.activeBuffs.filter(buff =>
        buff.name === 'poison' || buff.name === 'necrotic_touch'
    );

    dotBuffs.forEach(buff => {
        const damage = buff.value || 0;
        player.stats.health = Math.max(0, player.stats.health - damage);
        state.log.push(`Suffered ${damage} from ${buff.name}`);
    });
}


// Initial state
const initialState: BattleState = {
    human: {
        id: 1,
        name: "Marcus Aurelius",
        stats: {
            health: 100,
            maxHealth: 100,
            shield: 0,
            attack: 10,
            defense: 8,
            speed: 7,
        },
        celestials: [
            // Example celestial
            {
                name: "jupiter",
                type: "god",
                tier: 1,
                description: "King of the gods, ruler of the heavens.",
                buffs: { "attack": 10, "defense": 8, "speed": 7 },
                spells: { "lightning": 12, "smite": 10, "tempest": 9 }
            }
        ],
        activeBuffs: [],
        activeSpells: [],
        moves: [
            { name: "melee", type: "attack", description: "Melee attack" },
            { name: "fortify", type: "defense", description: "Fortify your defenses" },
            { name: "glass_cannon", type: "passive", description: "You have attack buffs" }
        ]
    },
    ai: {
        id: 2,
        name: "Julius Caesar",
        stats: {
            health: 100,
            maxHealth: 100,
            shield: 0,
            attack: 10,
            defense: 8,
            speed: 7,
        },
        celestials: [
            // Example celestial
            {
                name: "mars",
                type: "god",
                tier: 2,
                description: "God of war and destruction.",
                buffs: { "attack": 12, "fury": 10 },
                spells: { "wrath": 10, "smite": 9 }
            }
        ],
        activeBuffs: [],
        activeSpells: [],
        moves: [
            { name: "ranged", type: "attack", description: "Ranged attack" },
            { name: "heal", type: "defense", description: "Heal yourself" },
            { name: "berserk", type: "passive", description: "You have a fury buff" }
        ]
    },
    turn: 1,
    environment: 'day',
    log: []
};

// Write battle logs to a file
import * as fs from 'fs';
import * as path from 'path';

const logBattleState = (state: BattleState, description: string) => {
    const logEntry = `\n=== ${description} ===\n${JSON.stringify(state, null, 2)}\n`;
    fs.appendFileSync(
        path.join(__dirname, 'battle_log.txt'),
        logEntry
    );
};

// Log initial state
logBattleState(initialState, "Initial state");

// Player makes a move
const afterPlayerMove = executeBattleMove(
    initialState,
    'melee', // Move name
    1 // Player 1 (human)
);
logBattleState(afterPlayerMove, "After player move");

// AI makes a move
const afterAIMove = executeBattleMove(
    afterPlayerMove,
    'ranged', // Move name
    2 // Player 2 (AI)
);
logBattleState(afterAIMove, "After AI move");

// Player uses a celestial spell
const afterCelestial = executeBattleMove(
    afterAIMove,
    'melee', // Move name
    1, // Player 1
    0, // First celestial
    'tempest' // Spell to cast
);
logBattleState(afterCelestial, "After celestial");