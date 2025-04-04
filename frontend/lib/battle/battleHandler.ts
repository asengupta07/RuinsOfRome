import { Gladiator, BattleState } from "./types";
import {
  calculateDamage,
  generateRandomAttack,
  triggerConfetti,
} from "./utils";

// Function to start battle and determine first turn
export const startBattle = (
  battleState: BattleState,
  humanGladiator: Gladiator,
  aiGladiator: Gladiator,
  toast: (props: any) => void,
  setBattleStarted: (value: boolean) => void,
  setCurrentTurn: (value: string) => void
): void => {
  if (!battleState.battleStarted) {
    setBattleStarted(true);

    // Determine who goes first based on speed
    const humanFirst = humanGladiator.speed > aiGladiator.speed;
    const firstGladiator = humanFirst ? humanGladiator.name : aiGladiator.name;

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

// Function to start an AI battle
export const startAIBattle = (
  setBattleMode: (value: any) => void,
  setBattleStarted: (value: boolean) => void,
  setCurrentTurn: (value: string) => void,
  setHumanHealth: (value: number) => void,
  setAiHealth: (value: number) => void,
  setDisplayedHumanHealth: (value: number) => void,
  setDisplayedAIHealth: (value: number) => void,
  setShowVictoryModal: (value: boolean) => void,
  setShowDefeatModal: (value: boolean) => void,
  setHumanDefenseBonus: (value: number) => void,
  setAiDefenseBonus: (value: number) => void,
  setDefenseBonusTurns: (value: number) => void
): void => {
  setBattleMode("vsAI");
  // Reset all battle-related states
  setBattleStarted(false);
  setCurrentTurn("");
  setHumanHealth(100);
  setAiHealth(100);
  setDisplayedHumanHealth(100);
  setDisplayedAIHealth(100);
  setShowVictoryModal(false);
  setShowDefeatModal(false);
  setHumanDefenseBonus(0);
  setAiDefenseBonus(0);
  setDefenseBonusTurns(0);
};

// Function to start player vs player mode selection
export const startPlayerMode = (
  setBattleMode: (value: any) => void,
  setPlayerRoomMode: (value: any) => void
): void => {
  setBattleMode("vsPlayers");
  setPlayerRoomMode("select");
};

// Handle creating a new room
export const handleCreateRoom = (
  generateRoomId: () => string,
  setRoomId: (value: string) => void,
  toast: (props: any) => void
): void => {
  const newRoomId = generateRoomId();
  setRoomId(newRoomId);
  toast({
    title: "Room Created!",
    description: `Share this code with your friend: ${newRoomId}`,
    variant: "default",
  });
  // In a real app, you would connect to a WebSocket or other real-time service here
};

// Handle joining an existing room
export const handleJoinRoom = (
  joinRoomId: string,
  setRoomId: (value: string) => void,
  toast: (props: any) => void
): void => {
  if (!joinRoomId || joinRoomId.length < 4) {
    toast({
      title: "Invalid Room ID",
      description: "Please enter a valid room ID",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Joining Room",
    description: `Connecting to room ${joinRoomId}...`,
    variant: "default",
  });
  setRoomId(joinRoomId);
  // In a real app, you would connect to a WebSocket or other real-time service here
};

// Handle ability activation for either human or AI gladiator
export const handleAbilityActivation = (
  gladiatorName: string,
  abilityName: string,
  battleState: BattleState,
  humanGladiator: Gladiator,
  aiGladiator: Gladiator,
  // State setters
  setBattleStarted: (value: boolean) => void,
  setCurrentTurn: (value: string) => void,
  setHumanDefenseBonus: (value: number) => void,
  setAiDefenseBonus: (value: number) => void,
  setDefenseBonusTurns: (value: number) => void,
  setAttackAnimationType: (value: string) => void,
  setShowHumanAttackAnimation: (value: boolean) => void,
  setTargetShake: (value: string | null) => void,
  setAiHealth: (value: number) => void,
  setEarnedExp: (value: number) => void,
  setShowVictoryModal: (value: boolean) => void,
  setShowExpAnimation: (value: boolean) => void,
  setShowAIAttackAnimation: (value: boolean) => void,
  setHumanHealth: (value: number) => void,
  setShowDefeatModal: (value: boolean) => void,
  // Utility functions
  toast: (props: any) => void,
  startBattleFn: () => void
): void => {
  // Start battle if not started yet
  if (!battleState.battleStarted) {
    startBattleFn();
  }

  if (
    gladiatorName === humanGladiator.name &&
    abilityName === "heal"
  ) {
    // Apply healing to the human gladiator
    const healing = Math.round(humanGladiator.health + (humanGladiator.health * 0.3)); // 30% of base health
    setHumanHealth(Math.min(100, healing));
    
    toast({
      title: "Healing Applied!",
      description: `${humanGladiator.name} heals for ${healing > 100 ? 100 : healing} health!`,
      variant: "default",
    });
    
    // Show healing animation
    setShowExpAnimation(true);

    // Clear healing animation after a short delay
    setTimeout(() => {
      setShowExpAnimation(false);
    }, 1000);

    return;
  }

  // Apply defensive buffs if the ability is a defensive one
  if (
    gladiatorName === humanGladiator.name &&
    abilityName === "Roman Formation"
  ) {
    // Apply defense buff for the human gladiator
    const defenseBonus = Math.round(humanGladiator.defense * 0.3); // 30% of base defense
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
    const defenseBonus = Math.round(aiGladiator.defense * 0.3); // 30% of base defense
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
        handleAbilityActivation(
          aiGladiator.name,
          randomAbility.name,
          battleState,
          humanGladiator,
          aiGladiator,
          setBattleStarted,
          setCurrentTurn,
          setHumanDefenseBonus,
          setAiDefenseBonus,
          setDefenseBonusTurns,
          setAttackAnimationType,
          setShowHumanAttackAnimation,
          setTargetShake,
          setAiHealth,
          setEarnedExp,
          setShowVictoryModal,
          setShowExpAnimation,
          setShowAIAttackAnimation,
          setHumanHealth,
          setShowDefeatModal,
          toast,
          startBattleFn
        );
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
    const damage = calculateDamage(
      humanGladiator,
      aiGladiator,
      humanGladiator,
      aiGladiator,
      battleState.humanHealth,
      battleState.humanDefenseBonus,
      battleState.aiDefenseBonus,
      battleState.battleStarted,
      toast
    );

    // Show damage notification
    toast({
      title: "Damage Dealt!",
      description: `${gladiatorName} deals ${Math.round(damage)} damage to ${aiGladiator.name}!`,
      variant: "destructive",
    });

    // Apply damage after a short delay to allow animation to play
    setTimeout(() => {
      const newHealth = Math.max(0, battleState.aiHealth - damage);
      setAiHealth(newHealth);

      // Clear animations
      setShowHumanAttackAnimation(false);
      setTargetShake(null);

      // Check for victory
      if (newHealth <= 0) {
        // Calculate earned experience based on AI stats and remaining human health
        const expGained = Math.floor(
          (aiGladiator.attack + aiGladiator.defense + aiGladiator.speed) *
            (battleState.humanHealth / humanGladiator.health) *
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
        handleAbilityActivation(
          aiGladiator.name,
          randomAbility.name,
          battleState,
          humanGladiator,
          aiGladiator,
          setBattleStarted,
          setCurrentTurn,
          setHumanDefenseBonus,
          setAiDefenseBonus,
          setDefenseBonusTurns,
          setAttackAnimationType,
          setShowHumanAttackAnimation,
          setTargetShake,
          setAiHealth,
          setEarnedExp,
          setShowVictoryModal,
          setShowExpAnimation,
          setShowAIAttackAnimation,
          setHumanHealth,
          setShowDefeatModal,
          toast,
          startBattleFn
        );
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
    const damage = calculateDamage(
      aiGladiator,
      humanGladiator,
      humanGladiator,
      aiGladiator,
      battleState.humanHealth,
      battleState.humanDefenseBonus,
      battleState.aiDefenseBonus,
      battleState.battleStarted,
      toast
    );

    // Show damage notification
    toast({
      title: "Damage Dealt!",
      description: `${gladiatorName} deals ${Math.round(damage)} damage to ${humanGladiator.name}!`,
      variant: "destructive",
    });

    // Apply damage after animation delay
    setTimeout(() => {
      const newHealth = Math.max(0, battleState.humanHealth - damage);
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
