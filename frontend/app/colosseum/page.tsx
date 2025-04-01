"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, Sword, Heart, Zap, Skull } from "lucide-react"
import confetti from "canvas-confetti"
import { celestialAbi } from "../abi"
import { useAccount } from "wagmi"
import { useReadContract } from "wagmi"
import { celestialAddress } from "../abi"
import Navbar from "@/components/Navbar"

// Types
type Attribute = {
    trait_type: string
    value: number
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
    gender: string
    description: string
    backstory: string
    moveset: string[]
    attackValue: number
    defenceValue: number
    speedValue: number
    imageUrl: string
    success: boolean
}

type BattleState = {
    playerHealth: number
    playerShield: number
    aiHealth: number
    aiShield: number
    currentTurn: "player" | "ai"
    battleLogs: BattleLog[]
    battleEnded: boolean
    winner: "player" | "ai" | null
}

type BattleLog = {
    actor: "player" | "ai" | "god"
    godName?: string
    action: string
    target: "player" | "ai"
    value?: number
    moveType?: string
    timestamp: number
}



const fetchPlayerCharacter = (): Character => {
    return {
        name: "Grace",
        gender: "female",
        description:
            "A fierce and agile female gladiator, standing at 170 cm with an athletic build and a lean, muscular frame. Her striking pink eyes seem to glow with a determined intensity, framed by long, wavy purple hair that cascades down her shoulders. Her hair is dyed a vibrant shade of purple, a mark of her defiance against the decay of the once-great city. Her body is covered in scars, each one a testament to her countless battles in the arena. She moves with a grace that belies her strength, her movements fluid and precise, as though she were born to fight. Her personality is defensive by nature, always ready to protect herself and those she cares about. She is not afraid to take risks, often putting herself in danger to ensure the survival of her companions.",
        backstory:
            "Born into a family of gladiators, she was trained from a young age to fight. Her parents were both skilled warriors, and she was expected to follow in their footsteps. However, she always felt a deep sense of unease about the violence of her life. Despite her fears, she proved to be a natural fighter, her reflexes and agility making her a formidable opponent. As she grew older, she began to question the morality of the games, but her sense of duty to her family and her people kept her in the arena. Over time, she became known as a skilled and ruthless fighter, feared by her opponents. Her reputation grew, and she was often called upon to fight in the most dangerous matches. Despite her success, she remained haunted by the violence she was forced to perpetrate. She longed for a life where she could use her skills to protect, rather than destroy. Her ultimate goal is to find a way to escape the arena and build a life where she can use her strength to help others, rather than harm them.",
        moveset: ["melee", "heal", "glass_cannon"],
        attackValue: 63,
        defenceValue: 63,
        speedValue: 60,
        imageUrl: "https://corcel.b-cdn.net/ad6841ce-5470-4342-baa9-16f66a562a2f.webp",
        success: true,
    }
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
                name: "mars",
                description: "God of war and guardian of agriculture.",
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
                        trait_type: "strength",
                        value: 9,
                    },
                    {
                        trait_type: "fury",
                        value: 7,
                    },
                ],
                properties: {
                    category: "celestial",
                    rarity_score: 28,
                },
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
                name: "apollo",
                description: "God of light, music, and healing.",
                image: "https://corcel.b-cdn.net/361e57e5-0b0b-4ea4-a2d6-35eb17a27086.webp",
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
                        trait_type: "heal",
                        value: 8,
                    },
                    {
                        trait_type: "light",
                        value: 7,
                    },
                ],
                properties: {
                    category: "celestial",
                    rarity_score: 25,
                },
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
            gender: "male",
            description:
                "A towering colossus of a man, with muscles like iron and eyes that burn with the fury of a thousand suns. His body is a canvas of battle scars and glory, each mark telling the tale of a victory hard-won.",
            backstory:
                "Once a general in the emperor's army, betrayed and sold into slavery. Now he fights for his freedom and revenge in the blood-soaked sands of the Colosseum.",
            moveset: ["melee", "shield_bash", "execute"],
            attackValue: 70,
            defenceValue: 65,
            speedValue: 55,
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

const processBattleAction = (
    state: BattleState,
    actor: "player" | "ai",
    moveType: string,
    playerGods: God[],
    aiGods: God[],
    playerCharacter: Character,
    aiCharacter: Character,
): BattleState => {
    const newState = { ...state }
    const logs: BattleLog[] = [...state.battleLogs]

    // Process move
    if (moveType === "melee") {
        const attackValue =
            actor === "player"
                ? Math.floor(playerCharacter.attackValue * (0.8 + Math.random() * 0.4))
                : Math.floor(aiCharacter.attackValue * (0.8 + Math.random() * 0.4))

        const targetShield = actor === "player" ? state.aiShield : state.playerShield
        const damage = Math.max(1, attackValue - targetShield)

        if (actor === "player") {
            newState.aiShield = Math.max(0, state.aiShield - Math.floor(damage * 0.3))
            newState.aiHealth = Math.max(0, state.aiHealth - damage)
            logs.push({
                actor: "player",
                action: `unleashes a devastating melee attack on ${aiCharacter.name}`,
                target: "ai",
                value: damage,
                moveType: "melee",
                timestamp: Date.now(),
            })
        } else {
            newState.playerShield = Math.max(0, state.playerShield - Math.floor(damage * 0.3))
            newState.playerHealth = Math.max(0, state.playerHealth - damage)
            logs.push({
                actor: "ai",
                action: `strikes ${playerCharacter.name} with a powerful blow`,
                target: "player",
                value: damage,
                moveType: "melee",
                timestamp: Date.now(),
            })
        }
    } else if (moveType === "heal") {
        const healAmount =
            actor === "player" ? Math.floor(playerCharacter.defenceValue * 0.5) : Math.floor(aiCharacter.defenceValue * 0.5)

        if (actor === "player") {
            newState.playerHealth = Math.min(100, state.playerHealth + healAmount)
            logs.push({
                actor: "player",
                action: "focuses and recovers strength",
                target: "player",
                value: healAmount,
                moveType: "heal",
                timestamp: Date.now(),
            })
        } else {
            newState.aiHealth = Math.min(100, state.aiHealth + healAmount)
            logs.push({
                actor: "ai",
                action: "takes a moment to recover",
                target: "ai",
                value: healAmount,
                moveType: "heal",
                timestamp: Date.now(),
            })
        }
    } else if (moveType === "glass_cannon") {
        const attackValue =
            actor === "player" ? Math.floor(playerCharacter.attackValue * 1.5) : Math.floor(aiCharacter.attackValue * 1.5)

        const selfDamage = Math.floor(attackValue * 0.2)
        const targetShield = actor === "player" ? state.aiShield : state.playerShield
        const damage = Math.max(1, attackValue - Math.floor(targetShield * 0.5))

        if (actor === "player") {
            newState.aiHealth = Math.max(0, state.aiHealth - damage)
            newState.playerHealth = Math.max(0, state.playerHealth - selfDamage)
            logs.push({
                actor: "player",
                action: `performs a reckless all-out attack on ${aiCharacter.name}, hurting herself in the process`,
                target: "ai",
                value: damage,
                moveType: "glass_cannon",
                timestamp: Date.now(),
            })
        } else {
            newState.playerHealth = Math.max(0, state.playerHealth - damage)
            newState.aiHealth = Math.max(0, state.aiHealth - selfDamage)
            logs.push({
                actor: "ai",
                action: `executes a desperate attack against ${playerCharacter.name}, taking damage in return`,
                target: "player",
                value: damage,
                moveType: "glass_cannon",
                timestamp: Date.now(),
            })
        }
    } else if (moveType === "shield_bash") {
        const attackValue =
            actor === "player" ? Math.floor(playerCharacter.defenceValue * 0.7) : Math.floor(aiCharacter.defenceValue * 0.7)

        const shieldBoost = Math.floor(attackValue * 0.5)

        if (actor === "player") {
            newState.aiHealth = Math.max(0, state.aiHealth - attackValue)
            newState.playerShield = state.playerShield + shieldBoost
            logs.push({
                actor: "player",
                action: `bashes ${aiCharacter.name} with her shield, reinforcing her defenses`,
                target: "ai",
                value: attackValue,
                moveType: "shield_bash",
                timestamp: Date.now(),
            })
        } else {
            newState.playerHealth = Math.max(0, state.playerHealth - attackValue)
            newState.aiShield = state.aiShield + shieldBoost
            logs.push({
                actor: "ai",
                action: `slams his shield into ${playerCharacter.name}, strengthening his guard`,
                target: "player",
                value: attackValue,
                moveType: "shield_bash",
                timestamp: Date.now(),
            })
        }
    } else if (moveType === "execute") {
        const targetHealth = actor === "player" ? state.aiHealth : state.playerHealth
        const executeDamage =
            targetHealth < 30
                ? Math.floor(targetHealth * 0.8)
                : Math.floor((actor === "player" ? playerCharacter.attackValue : aiCharacter.attackValue) * 0.9)

        if (actor === "player") {
            newState.aiHealth = Math.max(0, state.aiHealth - executeDamage)
            logs.push({
                actor: "player",
                action: `attempts to finish ${aiCharacter.name} with a deadly execution strike`,
                target: "ai",
                value: executeDamage,
                moveType: "execute",
                timestamp: Date.now(),
            })
        } else {
            newState.playerHealth = Math.max(0, state.playerHealth - executeDamage)
            logs.push({
                actor: "ai",
                action: `tries to end the fight with a brutal execution move against ${playerCharacter.name}`,
                target: "player",
                value: executeDamage,
                moveType: "execute",
                timestamp: Date.now(),
            })
        }
    }

    // Process god blessing
    const gods = actor === "player" ? playerGods : aiGods
    const blessing = chooseRandomGodBlessing(gods)

    if (blessing) {
        const { god, attribute } = blessing
        const blessingValue = Math.floor(attribute.value * 3)

        if (
            attribute.trait_type === "attack" ||
            attribute.trait_type === "strength" ||
            attribute.trait_type === "smite" ||
            attribute.trait_type === "fury" ||
            attribute.trait_type === "thunder"
        ) {
            // Offensive blessing
            if (actor === "player") {
                newState.aiHealth = Math.max(0, state.aiHealth - blessingValue)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${playerCharacter.name} with ${attribute.trait_type}, dealing additional damage to ${aiCharacter.name}`,
                    target: "ai",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            } else {
                newState.playerHealth = Math.max(0, state.playerHealth - blessingValue)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${aiCharacter.name} with ${attribute.trait_type}, dealing additional damage to ${playerCharacter.name}`,
                    target: "player",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            }
        } else if (attribute.trait_type === "heal" || attribute.trait_type === "light") {
            // Healing blessing
            if (actor === "player") {
                newState.playerHealth = Math.min(100, state.playerHealth + blessingValue)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${playerCharacter.name} with healing energy`,
                    target: "player",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            } else {
                newState.aiHealth = Math.min(100, state.aiHealth + blessingValue)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${aiCharacter.name} with healing energy`,
                    target: "ai",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            }
        } else if (attribute.trait_type === "shield" || attribute.trait_type === "wisdom") {
            // Shield blessing
            if (actor === "player") {
                newState.playerShield = state.playerShield + blessingValue
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${playerCharacter.name} with protective energy`,
                    target: "player",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            } else {
                newState.aiShield = state.aiShield + blessingValue
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${aiCharacter.name} with protective energy`,
                    target: "ai",
                    value: blessingValue,
                    timestamp: Date.now(),
                })
            }
        } else if (attribute.trait_type === "speed" || attribute.trait_type === "trickery") {
            // Speed/trickery blessing - extra damage and dodge
            const extraDamage = Math.floor(blessingValue * 0.7)
            if (actor === "player") {
                newState.aiHealth = Math.max(0, state.aiHealth - extraDamage)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${playerCharacter.name} with supernatural speed, allowing a swift extra strike`,
                    target: "ai",
                    value: extraDamage,
                    timestamp: Date.now(),
                })
            } else {
                newState.playerHealth = Math.max(0, state.playerHealth - extraDamage)
                logs.push({
                    actor: "god",
                    godName: god.name,
                    action: `blesses ${aiCharacter.name} with supernatural speed, allowing a swift extra strike`,
                    target: "player",
                    value: extraDamage,
                    timestamp: Date.now(),
                })
            }
        }
    }

    // Check if battle has ended
    if (newState.playerHealth <= 0 || newState.aiHealth <= 0) {
        newState.battleEnded = true
        newState.winner = newState.playerHealth <= 0 ? "ai" : "player"

        logs.push({
            actor: newState.winner,
            action:
                newState.winner === "player"
                    ? `${playerCharacter.name} stands victorious over the fallen ${aiCharacter.name}!`
                    : `${aiCharacter.name} has defeated ${playerCharacter.name} in glorious combat!`,
            target: newState.winner === "player" ? "ai" : "player",
            timestamp: Date.now(),
        })
    }

    // Switch turns
    newState.currentTurn = state.currentTurn === "player" ? "ai" : "player"
    newState.battleLogs = logs

    return newState
}

const sendBattleLogs = async (logs: BattleLog[]) => {
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
        playerHealth: 100,
        playerShield: 0,
        aiHealth: 100,
        aiShield: 0,
        currentTurn: "player",
        battleLogs: [],
        battleEnded: false,
        winner: null,
    })
    const { address } = useAccount();
    const { data: celestialData } = useReadContract({
        abi: celestialAbi,
        address: celestialAddress,
        functionName: "getNFTs",
        args: [address],
    }) as any;

    const battleLogRef = useRef<HTMLDivElement>(null)
    // Dummy functions
    const fetchGods = (): God[] => {
        const godsData = celestialData.map((json: string) => JSON.parse(json));
        console.log("godsData", godsData);
        return godsData as God[];
    }
    // Initialize game data
    useEffect(() => {
        if (!address || !celestialData) return;
        setAvailableGods([
            ...fetchGods(),
        ])
        setPlayerCharacter(fetchPlayerCharacter())
    }, [address, celestialData])

    // Auto-scroll battle log
    useEffect(() => {
        if (battleLogRef.current) {
            battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight
        }
    }, [battleState.battleLogs])

    // AI turn logic
    useEffect(() => {
        if (step === 3 && battleState.currentTurn === "ai" && !battleState.battleEnded && aiOpponent) {
            // Add a delay to make AI turn feel more natural
            const aiTurnTimeout = setTimeout(() => {
                const aiMove = chooseRandomMove(aiOpponent.character.moveset)
                const newState = processBattleAction(
                    battleState,
                    "ai",
                    aiMove,
                    selectedGods,
                    aiOpponent.gods,
                    playerCharacter!,
                    aiOpponent.character,
                )
                setBattleState(newState)
            }, 1500)

            return () => clearTimeout(aiTurnTimeout)
        }
    }, [battleState, step, aiOpponent, selectedGods, playerCharacter])

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

        // Determine who goes first based on speed
        const playerSpeed = playerCharacter?.speedValue || 0
        const aiSpeed = aiOpponent?.character.speedValue || 0
        const firstTurn = playerSpeed >= aiSpeed ? "player" : "ai"

        setBattleState({
            ...battleState,
            currentTurn: firstTurn,
            battleLogs: [
                {
                    actor: "player",
                    action: "The crowd roars as the gladiators enter the arena!",
                    target: "player",
                    timestamp: Date.now(),
                },
                {
                    actor: firstTurn,
                    action:
                        firstTurn === "player"
                            ? `${playerCharacter?.name} moves with lightning speed, taking the initiative!`
                            : `${aiOpponent?.character.name} is quicker to the draw and strikes first!`,
                    target: firstTurn === "player" ? "ai" : "player",
                    timestamp: Date.now() + 100,
                },
            ],
        })

        setStep(3)
    }

    // Handle player move
    const handlePlayerMove = (moveType: string) => {
        if (battleState.currentTurn !== "player" || battleState.battleEnded) return

        const newState = processBattleAction(
            battleState,
            "player",
            moveType,
            selectedGods,
            aiOpponent?.gods || [],
            playerCharacter!,
            aiOpponent?.character!,
        )

        setBattleState(newState)
    }

    // Handle battle end
    const handleBattleEnd = async () => {
        if (battleState.battleEnded && battleState.winner) {
            await sendBattleLogs(battleState.battleLogs)
            setStep(4)

            if (battleState.winner === "player") {
                // Trigger victory confetti
                const duration = 3 * 1000
                const animationEnd = Date.now() + duration
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

                const randomInRange = (min: number, max: number) => {
                    return Math.random() * (max - min) + min
                }

                const interval: any = setInterval(() => {
                    const timeLeft = animationEnd - Date.now()

                    if (timeLeft <= 0) {
                        return clearInterval(interval)
                    }

                    const particleCount = 50 * (timeLeft / duration)

                    // Since particles fall down, start a bit higher than random
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    })
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    })
                }, 250)
            }
        }
    }

    // Reset game
    const resetGame = () => {
        setStep(1)
        setSelectedGods([])
        setAiOpponent(null)
        setBattleState({
            playerHealth: 100,
            playerShield: 0,
            aiHealth: 100,
            aiShield: 0,
            currentTurn: "player",
            battleLogs: [],
            battleEnded: false,
            winner: null,
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
                                    <div> {/* Inner div to push content to bottom */}
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
            console.log("playerCharacter", playerCharacter);
            console.log("aiOpponent", aiOpponent);
            return null;
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-4xl font-bold text-center mb-2 text-amber-500">The Gladiators</h2>
                    <p className="text-center text-gray-300 mb-8">
                        Today's match: {playerCharacter.name} vs {aiOpponent.character.name}
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
                                <div className="h-48 flex-shrink-0"></div>

                                <Image
                                    src={aiOpponent.character.imageUrl || "/placeholder.svg"}
                                    alt={aiOpponent.character.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                                <div className="relative p-4">
                                    <h3 className="text-2xl font-bold text-white">{aiOpponent.character.name}</h3>
                                    <p className="text-red-400">Fearsome Opponent</p>
                                    
                                    <div className="mt-3">
                                        <p className="text-gray-300 text-sm line-clamp-3">{aiOpponent.character.description}</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 my-3">
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

                                    <div className="mb-3">
                                        <h4 className="text-white font-bold mb-1">Moveset:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {aiOpponent.character.moveset.map((move, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-red-400 text-xs capitalize">
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

        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Player Character */}
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-amber-500/30 relative">
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
                                        <span className="text-white text-xs">{battleState.playerHealth}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full"
                                            initial={{ width: `100%` }}
                                            animate={{ width: `${battleState.playerHealth}%` }}
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
                                        <span className="text-white text-xs">{battleState.playerShield}</span>
                                    </div>
                                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                                            initial={{ width: `0%` }}
                                            animate={{ width: `${Math.min(100, battleState.playerShield)}%` }}
                                            transition={{ duration: 0.5 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/80 p-4 rounded-lg mb-4">
                                <h4 className="text-white font-bold mb-2">Divine Patrons:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGods.map((god) => (
                                        <div key={god.name} className="flex items-center gap-1">
                                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                                <Image
                                                    src={god.image || "/placeholder.svg"}
                                                    alt={god.name}
                                                    width={24}
                                                    height={24}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-amber-400 text-sm capitalize">{god.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-900/80 p-4 rounded-lg">
                                <h4 className="text-white font-bold mb-2">Moves:</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {playerCharacter.moveset.map((move, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePlayerMove(move)}
                                            disabled={battleState.currentTurn !== "player" || battleState.battleEnded}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                                                battleState.currentTurn === "player" && !battleState.battleEnded
                                                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {move === "melee" && "Melee Attack"}
                                            {move === "heal" && "Heal"}
                                            {move === "glass_cannon" && "Glass Cannon"}
                                            {move === "shield_bash" && "Shield Bash"}
                                            {move === "execute" && "Execute"}
                                        </button>
                                    ))}

                                    {battleState.battleEnded && (
                                        <button
                                            onClick={handleBattleEnd}
                                            className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all duration-300 mt-2"
                                        >
                                            End Battle
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Battle Log */}
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 lg:col-span-1">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white text-center">Battle Log</h3>
                        </div>

                        <div
                            ref={battleLogRef}
                            className="p-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                        >
                            {battleState.battleLogs.map((log, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className={`mb-3 p-3 rounded-lg ${log.actor === "player"
                                            ? "bg-amber-500/10 border-l-4 border-amber-500"
                                            : log.actor === "ai"
                                                ? "bg-red-500/10 border-l-4 border-red-500"
                                                : "bg-purple-500/10 border-l-4 border-purple-500"
                                        }`}
                                >
                                    <div className="flex items-start">
                                        {log.actor === "player" && (
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

                                        {log.actor === "ai" && (
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

                                        {log.actor === "god" && log.godName && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                                <Image
                                                    src={
                                                        selectedGods.find((g) => g.name === log.godName)?.image ||
                                                        aiOpponent.gods.find((g) => g.name === log.godName)?.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={log.godName}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <div className="text-sm font-bold mb-1">
                                                {log.actor === "player" && <span className="text-amber-400">{playerCharacter.name}</span>}
                                                {log.actor === "ai" && <span className="text-red-400">{aiOpponent.character.name}</span>}
                                                {log.actor === "god" && log.godName && (
                                                    <span className="text-purple-400 capitalize">{log.godName}</span>
                                                )}
                                            </div>

                                            <p className="text-gray-300 text-sm">
                                                {log.action}
                                                {log.value && log.value > 0 && (
                                                    <span
                                                        className={`font-bold ml-1 ${(log.target === "player" && log.moveType !== "heal") ||
                                                                (log.target === "ai" && log.moveType === "heal")
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                            }`}
                                                    >
                                                        {log.moveType === "heal" ? "+" : "-"}
                                                        {log.value}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {battleState.currentTurn === "player" && !battleState.battleEnded && (
                                <div className="text-center py-2 text-amber-400 animate-pulse">Your turn! Choose your move...</div>
                            )}

                            {battleState.currentTurn === "ai" && !battleState.battleEnded && (
                                <div className="text-center py-2 text-red-400 animate-pulse">
                                    {aiOpponent.character.name} is preparing to strike...
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                            <div className="text-sm text-gray-400">
                                {battleState.currentTurn === "player" ? "Your turn" : `${aiOpponent.character.name}'s turn`}
                            </div>

                            <div className="flex items-center">
                                <div
                                    className={`w-3 h-3 rounded-full mr-2 ${battleState.currentTurn === "player" ? "bg-amber-500" : "bg-red-500"
                                        }`}
                                ></div>
                                <span className="text-sm text-gray-400">
                                    {battleState.battleEnded ? "Battle ended" : "Battle in progress"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* AI Character */}
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-red-500/30 relative">
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
                                        <span className="text-white text-xs">{battleState.aiHealth}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full"
                                            initial={{ width: `100%` }}
                                            animate={{ width: `${battleState.aiHealth}%` }}
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
                                        <span className="text-white text-xs">{battleState.aiShield}</span>
                                    </div>
                                    <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                                            initial={{ width: `0%` }}
                                            animate={{ width: `${Math.min(100, battleState.aiShield)}%` }}
                                            transition={{ duration: 0.5 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/80 p-4 rounded-lg mb-4">
                                <h4 className="text-white font-bold mb-2">Divine Patrons:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {aiOpponent.gods.map((god) => (
                                        <div key={god.name} className="flex items-center gap-1">
                                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                                <Image
                                                    src={god.image || "/placeholder.svg"}
                                                    alt={god.name}
                                                    width={24}
                                                    height={24}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-red-400 text-sm capitalize">{god.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-900/80 p-4 rounded-lg">
                                <h4 className="text-white font-bold mb-2">Moves:</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {aiOpponent.character.moveset.map((move, index) => (
                                        <div key={index} className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-700 text-gray-400">
                                            {move === "melee" && "Melee Attack"}
                                            {move === "heal" && "Heal"}
                                            {move === "glass_cannon" && "Glass Cannon"}
                                            {move === "shield_bash" && "Shield Bash"}
                                            {move === "execute" && "Execute"}
                                        </div>
                                    ))}
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
                                                {battleState.battleLogs
                                                    .filter((log) => log.actor === "player" && log.value && log.target === "ai")
                                                    .reduce((total, log) => total + (log.value || 0), 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Damage Taken:</span>
                                            <span className="text-white font-bold">
                                                {battleState.battleLogs
                                                    .filter((log) => log.actor === "ai" && log.value && log.target === "player")
                                                    .reduce((total, log) => total + (log.value || 0), 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Divine Interventions:</span>
                                            <span className="text-white font-bold">
                                                {battleState.battleLogs.filter((log) => log.actor === "god").length}
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

    return (
        <div className="h-screen bg-gray-950 text-white relative overflow-hidden flex flex-col">
            {/* Background effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
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
                <div className="h-[calc(100vh-8rem)] overflow-auto">
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
      `}</style>
        </div>
    )
}

