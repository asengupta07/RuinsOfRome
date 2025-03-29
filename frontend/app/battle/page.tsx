"use client";

import { useState, useEffect } from "react";
import { Swords, Shield, Plus, Footprints, Zap, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import confetti from "canvas-confetti";

export default function BattlePage() {
  // Random number generator function
  const getRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // State variables
  const [battleStarted, setBattleStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string>("");
  const [humanHealth, setHumanHealth] = useState(100);
  const [aiHealth, setAiHealth] = useState(100);
  const [displayedHumanHealth, setDisplayedHumanHealth] = useState(100);
  const [displayedAIHealth, setDisplayedAIHealth] = useState(100);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [earnedExp, setEarnedExp] = useState(0);
  const [showExpAnimation, setShowExpAnimation] = useState(false);
  const [currentPlayerExp, setCurrentPlayerExp] = useState(320); // Mock starting exp
  const [playerLevel, setPlayerLevel] = useState(5); // Mock player level
  const [showHumanAttackAnimation, setShowHumanAttackAnimation] =
    useState(false);
  const [showAIAttackAnimation, setShowAIAttackAnimation] = useState(false);
  const [attackAnimationType, setAttackAnimationType] =
    useState<string>("slash");
  const [targetShake, setTargetShake] = useState<string | null>(null);
  const [humanDefenseBonus, setHumanDefenseBonus] = useState(0);
  const [aiDefenseBonus, setAiDefenseBonus] = useState(0);
  const [defenseBonusTurns, setDefenseBonusTurns] = useState(0);
  const { toast } = useToast();

  // Auto-start battle if AI has higher speed on component mount
  useEffect(() => {
    if (!battleStarted && aiGladiator.speed > humanGladiator.speed) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        startBattle();

        // AI takes first turn automatically
        const randomAbility =
          aiGladiator.abilities[
            Math.floor(Math.random() * aiGladiator.abilities.length)
          ];

        handleAbilityActivation(aiGladiator.name, randomAbility.name);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Track and reduce defense bonus turns
  useEffect(() => {
    if (defenseBonusTurns > 0) {
      // Each ability activation represents a full turn
      // This will decrement the counter once per full turn
      const newTurns = defenseBonusTurns - 1;
      setDefenseBonusTurns(newTurns);

      if (newTurns === 0) {
        // Reset defense bonuses when turns expire
        if (humanDefenseBonus > 0) {
          setHumanDefenseBonus(0);
          toast({
            title: "Buff Expired",
            description: `${humanGladiator.name}'s defense bonus has worn off.`,
            variant: "default",
          });
        }

        if (aiDefenseBonus > 0) {
          setAiDefenseBonus(0);
          toast({
            title: "Buff Expired",
            description: `${aiGladiator.name}'s defense bonus has worn off.`,
            variant: "default",
          });
        }
      }
    }
  }, [currentTurn]);

  // Function to start battle and determine first turn
  const startBattle = () => {
    if (!battleStarted) {
      setBattleStarted(true);

      // Determine who goes first based on speed
      const humanFirst = humanGladiator.speed > aiGladiator.speed;
      const firstGladiator = humanFirst
        ? humanGladiator.name
        : aiGladiator.name;

      // Set the current turn
      setCurrentTurn(firstGladiator);

      // Show who goes first
      toast({
        title: "Battle Begins!",
        description: `${firstGladiator} moves first due to higher speed!`,
        variant: "default",
      });
    }
  };

  // Update displayed health with animation when actual health changes
  useEffect(() => {
    if (displayedHumanHealth !== humanHealth) {
      const interval = setInterval(() => {
        setDisplayedHumanHealth((prev) => {
          if (prev > humanHealth) return prev - 1;
          if (prev < humanHealth) return prev + 1;
          return prev;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [humanHealth, displayedHumanHealth]);

  useEffect(() => {
    if (displayedAIHealth !== aiHealth) {
      const interval = setInterval(() => {
        setDisplayedAIHealth((prev) => {
          if (prev > aiHealth) return prev - 1;
          if (prev < aiHealth) return prev + 1;
          return prev;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [aiHealth, displayedAIHealth]);

  // Generate random attack animation type
  const generateRandomAttack = () => {
    const attacks = ["slash", "stab", "punch", "magic", "arrow"];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  // Generate random gladiator stats on component mount
  const [humanGladiator] = useState({
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
  });

  const [aiGladiator] = useState({
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
  });

  // Constants for level/exp calculation
  const EXP_PER_LEVEL = 100; // Base exp needed per level
  const expToNextLevel = playerLevel * EXP_PER_LEVEL;
  const expProgress =
    ((currentPlayerExp % expToNextLevel) / expToNextLevel) * 100;
  const newTotalExp = currentPlayerExp + earnedExp;
  const newLevel = Math.floor(newTotalExp / EXP_PER_LEVEL) + 1;
  const levelUp = newLevel > playerLevel;

  // Log initial stats to console for debugging
  useEffect(() => {
    console.log("Human Gladiator Stats:", {
      attack: humanGladiator.attack,
      defense: humanGladiator.defense,
      health: humanGladiator.health,
      speed: humanGladiator.speed,
    });

    console.log("AI Gladiator Stats:", {
      attack: aiGladiator.attack,
      defense: aiGladiator.defense,
      health: aiGladiator.health,
      speed: aiGladiator.speed,
    });
  }, [humanGladiator, aiGladiator]);

  // Calculate damage based on attacker's attack and defender's defense
  const calculateDamage = (
    attacker: typeof humanGladiator,
    defender: typeof aiGladiator
  ) => {
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

  // Function to handle ability activation
  const handleAbilityActivation = (
    gladiatorName: string,
    abilityName: string
  ) => {
    // Start battle if not started yet
    if (!battleStarted) {
      startBattle();
    }

    // Apply defensive buffs if the ability is a defensive one
    if (
      gladiatorName === humanGladiator.name &&
      abilityName === "Roman Formation"
    ) {
      // Apply defense buff for the human gladiator
      const defenseBonus = Math.floor(humanGladiator.defense * 0.3); // 30% of base defense
      setHumanDefenseBonus(defenseBonus);
      setDefenseBonusTurns(2); // Lasts for 2 turns

      toast({
        title: "Defense Buff Applied!",
        description: `${humanGladiator.name} gains +${defenseBonus} defense for 2 turns!`,
        variant: "default",
      });
    } else if (
      gladiatorName === aiGladiator.name &&
      abilityName === "Data Shield"
    ) {
      // Apply defense buff for the AI gladiator
      const defenseBonus = Math.floor(aiGladiator.defense * 0.3); // 30% of base defense
      setAiDefenseBonus(defenseBonus);
      setDefenseBonusTurns(2); // Lasts for 2 turns

      toast({
        title: "Defense Buff Applied!",
        description: `${aiGladiator.name} gains +${defenseBonus} defense for 2 turns!`,
        variant: "default",
      });
    }

    // Show ability activation
    toast({
      title: `${gladiatorName} Attacks!`,
      description: `${gladiatorName} uses ${abilityName}!`,
      variant: "default",
    });

    // Apply damage based on which gladiator is attacking
    if (gladiatorName === humanGladiator.name) {
      // Skip damage calculation for defensive abilities
      if (abilityName === "Roman Formation") {
        // Switch turn to AI after applying buff
        setCurrentTurn(aiGladiator.name);

        // Simulate AI turn after a delay
        setTimeout(() => {
          const randomAbility =
            aiGladiator.abilities[
              Math.floor(Math.random() * aiGladiator.abilities.length)
            ];
          handleAbilityActivation(aiGladiator.name, randomAbility.name);
        }, 1500);

        return;
      }

      // Generate random attack animation
      const attackType = generateRandomAttack();
      setAttackAnimationType(attackType);

      // Show attack animation
      setShowHumanAttackAnimation(true);

      // Shake the target
      setTargetShake("ai");

      // Human attacks AI
      const damage = calculateDamage(humanGladiator, aiGladiator);

      // Show damage notification
      toast({
        title: "Damage Dealt!",
        description: `${gladiatorName} deals ${damage} damage to ${aiGladiator.name}!`,
        variant: "destructive",
      });

      // Apply damage after a short delay to allow animation to play
      setTimeout(() => {
        const newHealth = Math.max(0, aiHealth - damage);
        setAiHealth(newHealth);

        // Clear animations
        setShowHumanAttackAnimation(false);
        setTargetShake(null);

        // Check for victory
        if (newHealth <= 0) {
          // Calculate earned experience based on AI stats and remaining human health
          const expGained = Math.floor(
            (aiGladiator.attack + aiGladiator.defense + aiGladiator.speed) *
              (humanHealth / humanGladiator.health) *
              2.5
          );
          setEarnedExp(expGained);

          // Show victory toast
          toast({
            title: "Victory!",
            description: `${humanGladiator.name} has defeated ${aiGladiator.name}!`,
            variant: "default",
          });

          // Trigger confetti and show victory modal after a short delay
          setTimeout(() => {
            triggerConfetti();
            setShowVictoryModal(true);

            // Start exp animation after modal appears
            setTimeout(() => {
              setShowExpAnimation(true);
            }, 500);
          }, 1000);

          return;
        }

        // Switch turn to AI
        setCurrentTurn(aiGladiator.name);

        // Simulate AI turn after a delay
        setTimeout(() => {
          // Generate random attack animation for AI
          const aiAttackType = generateRandomAttack();
          setAttackAnimationType(aiAttackType);

          const randomAbility =
            aiGladiator.abilities[
              Math.floor(Math.random() * aiGladiator.abilities.length)
            ];

          // AI takes its turn
          handleAbilityActivation(aiGladiator.name, randomAbility.name);
        }, 1500);
      }, 500);
    } else if (gladiatorName === aiGladiator.name) {
      // Skip damage calculation for defensive abilities
      if (abilityName === "Data Shield") {
        // Show AI attack animation for the buff with a magic effect
        setAttackAnimationType("magic");
        setShowAIAttackAnimation(true);

        setTimeout(() => {
          // Clear animations
          setShowAIAttackAnimation(false);

          // Switch turn to human
          setCurrentTurn(humanGladiator.name);
        }, 500);

        return;
      }

      // Show AI attack animation
      setShowAIAttackAnimation(true);

      // Shake human gladiator
      setTargetShake("human");

      // AI attacks Human
      const damage = calculateDamage(aiGladiator, humanGladiator);

      // Show damage notification
      toast({
        title: "Damage Dealt!",
        description: `${gladiatorName} deals ${damage} damage to ${humanGladiator.name}!`,
        variant: "destructive",
      });

      // Apply damage after animation delay
      setTimeout(() => {
        const newHealth = Math.max(0, humanHealth - damage);
        setHumanHealth(newHealth);

        // Clear animations
        setShowAIAttackAnimation(false);
        setTargetShake(null);

        // Check for victory
        if (newHealth <= 0) {
          // Show defeat toast
          toast({
            title: "Defeat!",
            description: `${humanGladiator.name} has been defeated by ${aiGladiator.name}!`,
            variant: "destructive",
          });

          // Show defeat modal after a short delay
          setTimeout(() => {
            setShowDefeatModal(true);
          }, 1000);

          return;
        }

        // Switch turn to human
        setCurrentTurn(humanGladiator.name);
      }, 500);
    }
  };

  // Function to check if it's a gladiator's turn
  const isGladiatorTurn = (gladiatorName: string) => {
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
  const getGodPlaceholderImage = (godName: string) => {
    // Just return a single placeholder for all gods
    return "/god-placeholder.svg";
  };

  // Function to trigger confetti effect
  const triggerConfetti = () => {
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

  // Function to get placeholder image for abilities and passives
  const getAbilityPlaceholder = (abilityName: string) => {
    return "/placeholder.svg";
  };

  // Function to render attack animation
  const renderAttackAnimation = (type: string, isHumanAttack: boolean) => {
    // Update base classes to position animations correctly based on attacker
    const baseClasses = `absolute z-20 transform ${
      isHumanAttack ? "left-0 translate-x-1/2" : "right-0 -translate-x-1/2"
    } top-1/2 -translate-y-1/2 pointer-events-none`;

    // Direction-specific transforms
    const directionTransform = isHumanAttack
      ? {
          start: "translateX(-100%) translateY(-50%)",
          middle: "translateX(0%) translateY(-50%)",
          end: "translateX(100%) translateY(-50%)",
        }
      : {
          start: "translateX(100%) translateY(-50%)",
          middle: "translateX(0%) translateY(-50%)",
          end: "translateX(-100%) translateY(-50%)",
        };

    switch (type) {
      case "slash":
        return (
          <div
            className={`${baseClasses} w-20 h-20 ${
              isHumanAttack ? "animate-slash-right" : "animate-slash"
            }`}
          >
            <div className="w-full h-full bg-red-500 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 to-red-500 rotate-45 blur-sm animate-pulse"></div>
          </div>
        );
      case "stab":
        return (
          <div
            className={`${baseClasses} w-32 h-8 ${
              isHumanAttack ? "animate-stab-right" : "animate-stab"
            }`}
          >
            <div className="w-full h-full bg-blue-500 transform skew-x-30 opacity-70"></div>
            <div
              className={`absolute w-4 h-4 bg-white ${
                isHumanAttack ? "right-0" : "left-0"
              } top-1/2 -translate-y-1/2 rounded-full shadow-lg shadow-blue-500`}
            ></div>
          </div>
        );
      case "punch":
        return (
          <div
            className={`${baseClasses} w-16 h-16 ${
              isHumanAttack ? "animate-punch-right" : "animate-punch"
            }`}
          >
            <div className="w-full h-full bg-orange-600 rounded-full relative flex items-center justify-center">
              <span className="text-white font-bold text-xl">POW!</span>
            </div>
          </div>
        );
      case "magic":
        return (
          <div
            className={`${baseClasses} w-24 h-24 ${
              isHumanAttack ? "animate-magic-right" : "animate-magic"
            }`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-400 opacity-70 animate-pulse"></div>
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-xl animate-bounce">
                ✨
              </span>
            </div>
          </div>
        );
      case "arrow":
        return (
          <div
            className={`${baseClasses} w-32 h-6 ${
              isHumanAttack ? "animate-arrow-right" : "animate-arrow"
            }`}
          >
            <div className="w-full h-1 bg-brown-500"></div>
            <div
              className={`absolute ${
                isHumanAttack ? "left-0" : "right-0"
              } w-0 h-0 border-y-8 border-y-transparent ${
                isHumanAttack
                  ? "border-l-8 border-l-brown-800"
                  : "border-r-8 border-r-brown-800"
              }`}
            ></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`h-screen w-screen text-white relative overflow-hidden flex flex-col ${
          showDefeatModal ? "grayscale" : ""
        }`}
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(0, 0, 0, 0.5) 0%, 
              rgba(0, 0, 0, 0.5) 60%, 
              rgba(0, 0, 0, 1) 100%
            ), url('/colloseum.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Header - Smaller to maximize battle area */}
        <div className="w-full py-2 px-4 z-10">
          <Navbar />
        </div>

        {/* Toast container */}
        <Toaster />

        {/* Main Battle Area - Flex to maximize viewport usage */}
        <main className="flex-1 flex flex-col justify-center w-full max-w-screen-2xl mx-auto px-4 py-2">
          <div className="flex flex-row justify-between items-center h-full">
            {/* Left Side - Human Gladiator with Gods */}
            <div className="flex flex-row h-full py-4 w-5/12 gap-4">
              {/* Gods Owned Column */}
              <div className="flex flex-col justify-center gap-4 w-1/4">
                {humanGladiator.gods.map((god, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden border-2 
                      ${
                        god.rarity === "Legendary"
                          ? "border-yellow-500"
                          : god.rarity === "Epic"
                          ? "border-purple-500"
                          : "border-blue-500"
                      } 
                      bg-slate-800/80 p-2 shadow-lg`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={getGodPlaceholderImage(god.name)}
                        alt={god.name}
                        width={60}
                        height={60}
                        className="object-cover"
                        // Fallback in case the placeholder doesn't exist yet
                        onError={(e) => {
                          e.currentTarget.src = "/god-placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="text-center text-xs mt-1 font-semibold">
                      {god.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gladiator Card */}
              <div className="flex items-center relative">
                {/* Human attack animation */}
                {showHumanAttackAnimation &&
                  renderAttackAnimation(attackAnimationType, true)}

                <Card
                  className={`w-full bg-gradient-to-b from-slate-700/80 to-slate-900/80 border-2 border-red-600 shadow-lg shadow-red-900/20 ${
                    targetShake === "human" ? "animate-shake" : ""
                  }`}
                >
                  {targetShake === "human" && (
                    <div className="absolute inset-0 bg-red-500/30 animate-flash z-10"></div>
                  )}
                  <CardHeader className="text-center border-b border-slate-600 pb-2 pt-3">
                    <h3 className="text-xl font-bold tracking-wider text-white">
                      {humanGladiator.name}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex flex-row gap-6 flex-1">
                      {/* Gladiator Image */}
                      <div className="aspect-square relative bg-slate-900 rounded-md overflow-hidden border border-slate-700">
                        <Image
                          src="/marcus.png"
                          alt="Human Gladiator"
                          height={200}
                          width={200}
                          className="object-cover"
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-2">
                          <Swords className="h-5 w-5 text-red-400" />
                          <span className="font-semibold text-white">
                            Attack
                          </span>
                          <span className="ml-auto text-white">
                            {humanGladiator.attack}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-400" />
                          <span className="font-semibold text-white">
                            Defense
                          </span>
                          <span className="ml-auto text-white">
                            {humanGladiator.defense}
                            {humanDefenseBonus > 0 && (
                              <span className="text-green-400 ml-1">
                                +{humanDefenseBonus}
                              </span>
                            )}
                            {defenseBonusTurns > 0 && humanDefenseBonus > 0 && (
                              <span className="text-xs ml-1 text-yellow-300">
                                ({defenseBonusTurns})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Footprints className="h-5 w-5 text-yellow-400" />
                          <span className="font-semibold text-white">
                            Speed
                          </span>
                          <span className="ml-auto text-white">
                            {humanGladiator.speed}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div className="mt-4 flex justify-center gap-4 pt-2 border-t border-slate-600">
                      {/* Passive Ability */}
                      <div className="relative group">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-gray-500 flex items-center justify-center opacity-50">
                          <Image
                            src="/placeholder.svg"
                            alt={humanGladiator.passive.name}
                            width={30}
                            height={30}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block">
                          <div className="font-bold">
                            {humanGladiator.passive.name}
                          </div>
                          <div>{humanGladiator.passive.description}</div>
                        </div>
                      </div>

                      {/* Active Abilities */}
                      {humanGladiator.abilities.map((ability, index) => (
                        <div
                          key={index}
                          className="relative group"
                          onClick={() =>
                            isGladiatorTurn(humanGladiator.name) &&
                            handleAbilityActivation(
                              humanGladiator.name,
                              ability.name
                            )
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-full bg-slate-800 border-2 ${
                              !isGladiatorTurn(humanGladiator.name)
                                ? "border-gray-500 opacity-30 cursor-not-allowed"
                                : "border-red-500 hover:border-red-300 hover:animate-pulse cursor-pointer"
                            } flex items-center justify-center transition-all duration-300`}
                          >
                            <Image
                              src="/placeholder.svg"
                              alt={ability.name}
                              width={30}
                              height={30}
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block">
                            <div className="font-bold">{ability.name}</div>
                            <div>{ability.description}</div>
                            {!isGladiatorTurn(humanGladiator.name) && (
                              <div className="text-red-400 mt-1">
                                {battleStarted
                                  ? "Not your turn"
                                  : "Wait for faster opponent"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-900/80 py-2 flex justify-center">
                    <div className="w-full px-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Plus className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-xs text-white">
                          HP: {displayedHumanHealth}/{humanGladiator.health}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                          style={{
                            width: `${
                              (displayedHumanHealth / humanGladiator.health) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Center - VS Symbol */}
            <div className="flex flex-col items-center justify-center h-full w-2/12 relative">
              <div className="relative z-10">
                <div className="text-6xl font-extrabold text-red-600 bg-slate-900/60 p-6 rounded-full border-4 border-red-700 shadow-lg shadow-red-900/30 transform rotate-0 hover:rotate-12 transition-all">
                  VS
                </div>
              </div>
            </div>

            {/* Right Side - AI Gladiator with Gods */}
            <div className="flex flex-row-reverse h-full py-4 w-5/12 gap-4">
              {/* Gods Owned Column */}
              <div className="flex flex-col justify-center gap-4 w-1/4">
                {aiGladiator.gods.map((god, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden border-2 
                      ${
                        god.rarity === "Legendary"
                          ? "border-yellow-500"
                          : god.rarity === "Epic"
                          ? "border-purple-500"
                          : "border-blue-500"
                      } 
                      bg-slate-800/80 p-2 shadow-lg`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={getGodPlaceholderImage(god.name)}
                        alt={god.name}
                        width={60}
                        height={60}
                        className="object-cover"
                        // Fallback in case the placeholder doesn't exist yet
                        onError={(e) => {
                          e.currentTarget.src = "/god-placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="text-center text-xs mt-1 font-semibold">
                      {god.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Gladiator Card */}
              <div className="flex items-center relative">
                {/* AI attack animation */}
                {showAIAttackAnimation &&
                  renderAttackAnimation(attackAnimationType, false)}

                <Card
                  className={`w-full bg-gradient-to-b from-slate-700/80 to-slate-900/80 border-2 border-blue-600 shadow-lg shadow-blue-900/20 ${
                    targetShake === "ai" ? "animate-shake" : ""
                  }`}
                >
                  {targetShake === "ai" && (
                    <div className="absolute inset-0 bg-red-500/30 animate-flash z-10"></div>
                  )}
                  <CardHeader className="text-center border-b border-slate-600 pb-2 pt-3">
                    <h3 className="text-xl font-bold tracking-wider text-white">
                      {aiGladiator.name}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex flex-row gap-6 flex-1">
                      {/* Gladiator Image */}
                      <div className="aspect-square relative bg-slate-900 rounded-md overflow-hidden border border-slate-700">
                        <Image
                          src="/stoicism.png"
                          alt="AI Gladiator"
                          height={200}
                          width={200}
                          className="object-cover"
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col justify-center space-y-3">
                        <div className="flex items-center gap-2">
                          <Swords className="h-5 w-5 text-red-400" />
                          <span className="font-semibold text-white">
                            Attack
                          </span>
                          <span className="ml-auto text-white">
                            {aiGladiator.attack}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-400" />
                          <span className="font-semibold text-white">
                            Defense
                          </span>
                          <span className="ml-auto text-white">
                            {aiGladiator.defense}
                            {aiDefenseBonus > 0 && (
                              <span className="text-green-400 ml-1">
                                +{aiDefenseBonus}
                              </span>
                            )}
                            {defenseBonusTurns > 0 && aiDefenseBonus > 0 && (
                              <span className="text-xs ml-1 text-yellow-300">
                                ({defenseBonusTurns})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Footprints className="h-5 w-5 text-yellow-400" />
                          <span className="font-semibold text-white">
                            Speed
                          </span>
                          <span className="ml-auto text-white">
                            {aiGladiator.speed}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div className="mt-4 flex justify-center gap-4 pt-2 border-t border-slate-600">
                      {/* Passive Ability */}
                      <div className="relative group">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-gray-500 flex items-center justify-center opacity-50">
                          <Image
                            src="/placeholder.svg"
                            alt={aiGladiator.passive.name}
                            width={30}
                            height={30}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block">
                          <div className="font-bold">
                            {aiGladiator.passive.name}
                          </div>
                          <div>{aiGladiator.passive.description}</div>
                        </div>
                      </div>

                      {/* Active Abilities */}
                      {aiGladiator.abilities.map((ability, index) => (
                        <div
                          key={index}
                          className="relative group"
                          onClick={() =>
                            isGladiatorTurn(aiGladiator.name) &&
                            handleAbilityActivation(
                              aiGladiator.name,
                              ability.name
                            )
                          }
                        >
                          <div
                            className={`w-12 h-12 rounded-full bg-slate-800 border-2 ${
                              !isGladiatorTurn(aiGladiator.name)
                                ? "border-gray-500 opacity-30 cursor-not-allowed"
                                : "border-blue-500 hover:border-blue-300 hover:animate-pulse cursor-pointer"
                            } flex items-center justify-center transition-all duration-300`}
                          >
                            <Image
                              src="/placeholder.svg"
                              alt={ability.name}
                              width={30}
                              height={30}
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block">
                            <div className="font-bold">{ability.name}</div>
                            <div>{ability.description}</div>
                            {!isGladiatorTurn(aiGladiator.name) && (
                              <div className="text-red-400 mt-1">
                                {battleStarted
                                  ? "Not your turn"
                                  : "Wait for faster opponent"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-900/80 py-2 flex justify-center">
                    <div className="w-full px-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Plus className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-xs text-white">
                          HP: {displayedAIHealth}/{aiGladiator.health}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                          style={{
                            width: `${
                              (displayedAIHealth / aiGladiator.health) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="py-2 text-center text-slate-400 text-xs relative z-10">
          <p>
            Epic Battle Simulator • Ruins of Rome • {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* Victory Modal - Outside the main container */}
      {(showVictoryModal || showDefeatModal) && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              setShowVictoryModal(false);
              setShowDefeatModal(false);
            }
          }}
        >
          {/* Victory Modal Content */}
          {showVictoryModal && (
            <div className="animate-in zoom-in-95 duration-300 ease-out bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-yellow-500 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal header */}
              <div className="bg-yellow-600/30 p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
                    <Trophy className="h-7 w-7" />
                    Victory!
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVictoryModal(false)}
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-slate-300">The crowd roars with approval!</p>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <div className="flex gap-4 items-center mb-8">
                  <div className="flex-shrink-0 w-20 h-20 bg-slate-700 rounded-full border-4 border-yellow-600 p-1 overflow-hidden">
                    <Image
                      src="/marcus.png"
                      alt="Human Gladiator"
                      width={80}
                      height={80}
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {humanGladiator.name}
                      </h3>
                      <span className="text-sm text-yellow-400">
                        VICTORIOUS
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                      Defeated {aiGladiator.name} with {humanHealth} HP
                      remaining
                    </p>

                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-slate-700"></div>
                      <div
                        className="absolute h-full bg-yellow-500 transition-all duration-1000 ease-out"
                        style={{ width: `${expProgress}%` }}
                      ></div>
                      <div
                        className={`absolute h-full bg-green-500 transition-all duration-1000 ease-out ${
                          showExpAnimation ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          width: `${
                            (((currentPlayerExp % expToNextLevel) + earnedExp) /
                              expToNextLevel) *
                            100
                          }%`,
                          maxWidth: "100%",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Level {playerLevel}</span>
                      {levelUp && showExpAnimation && (
                        <span className="text-green-400 animate-pulse">
                          ↑ Level {newLevel}
                        </span>
                      )}
                      <span>
                        {currentPlayerExp % expToNextLevel}/{expToNextLevel} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards section */}
                <div className="bg-slate-700/50 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-semibold text-center mb-4 text-yellow-400">
                    Rewards
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Experience:</span>
                      <div className="flex items-center">
                        <span className="text-white mr-2">
                          {currentPlayerExp}
                        </span>
                        {showExpAnimation && (
                          <>
                            <span className="text-white mx-1">+</span>
                            <span className="text-lg font-bold text-green-400 animate-in slide-in-from-bottom-3 fade-in duration-500">
                              {earnedExp}
                            </span>
                            <span className="text-white mx-1">=</span>
                            <span className="text-lg font-bold text-yellow-400 animate-in slide-in-from-right-3 fade-in duration-700 delay-300">
                              {newTotalExp}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {levelUp && showExpAnimation && (
                      <div className="bg-yellow-500/20 p-3 rounded-md text-center animate-in slide-in-from-bottom-5 fade-in duration-700 delay-500">
                        <span className="text-lg font-bold text-yellow-400">
                          LEVEL UP!
                        </span>
                        <div className="text-sm text-slate-300">
                          Your gladiator has reached level {newLevel}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Glory Points:</span>
                      <span className="text-lg font-bold text-blue-400">
                        +25
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
                  onClick={() => window.location.reload()}
                >
                  Fight Again
                </Button>
              </div>
            </div>
          )}

          {/* Defeat Modal Content */}
          {showDefeatModal && (
            <div className="animate-in zoom-in-95 duration-300 ease-out bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-red-600 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal header */}
              <div className="bg-red-900/30 p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-3xl font-bold text-red-400 flex items-center gap-3">
                    <Shield className="h-7 w-7" />
                    Defeat
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDefeatModal(false)}
                    className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-slate-300">The crowd is not pleased...</p>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <div className="flex gap-4 items-center mb-8">
                  <div className="relative flex-shrink-0 w-20 h-20 bg-slate-700 rounded-full border-4 border-red-600 p-1 overflow-hidden">
                    <Image
                      src="/marcus.png"
                      alt="Human Gladiator"
                      width={80}
                      height={80}
                      className="object-cover rounded-full opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-2 bg-red-600 rotate-45 rounded-full"></div>
                      <div className="w-12 h-2 bg-red-600 -rotate-45 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {humanGladiator.name}
                      </h3>
                      <span className="text-sm text-red-400">DEFEATED</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                      Slain by {aiGladiator.name} with {aiHealth} HP remaining
                    </p>

                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-slate-700"></div>
                      <div
                        className="absolute h-full bg-red-500 transition-all duration-500 ease-out"
                        style={{ width: `${expProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Level {playerLevel}</span>
                      <span>
                        {currentPlayerExp % expToNextLevel}/{expToNextLevel} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message section */}
                <div className="bg-slate-700/50 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-semibold text-center mb-4 text-red-400">
                    The Emperor is Disappointed
                  </h3>

                  <div className="space-y-3">
                    <div className="text-center text-slate-300">
                      <p className="mb-2">
                        Train harder and return to the arena when you're ready.
                      </p>
                      <p className="text-sm text-slate-400">
                        Hint: Perhaps try a different strategy or improve your
                        armor first.
                      </p>
                    </div>

                    <div className="animate-pulse flex justify-center mt-4">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">
                          No rewards earned
                        </span>
                        <Zap className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
