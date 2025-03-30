"use client";

import { useState, useEffect } from "react";
import {
  Swords,
  Shield,
  Plus,
  Footprints,
  Zap,
  Trophy,
  X,
  Users,
  Bot,
  Copy,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import confetti from "canvas-confetti";
import {
  BattleMode,
  Gladiator,
  BattleState,
  PlayerRoomMode,
} from "@/lib/battle/types";
import { generateGladiator, generateRoomId } from "@/lib/battle/utils";
import {
  startBattle,
  startAIBattle,
  startPlayerMode,
  handleCreateRoom,
  handleJoinRoom,
  handleAbilityActivation,
} from "@/lib/battle/battleHandler";

// Components
import { BattleModeSelection } from "@/components/battle/BattleModeSelection";
import { PlayerRoomSelection } from "@/components/battle/PlayerRoomSelection";
import { CreateRoomUI } from "@/components/battle/CreateRoomUI";
import { JoinRoomUI } from "@/components/battle/JoinRoomUI";
import { BattleArena } from "@/components/battle/BattleArena";
import { VictoryModal } from "@/components/battle/VictoryModal";
import { DefeatModal } from "@/components/battle/DefeatModal";
import { useAccount } from "wagmi";
import { gladiatorAbi } from "../abi";
import { useReadContract } from "wagmi";
import { gladiatorAddress } from "../abi";

export default function BattlePage() {
  const { toast } = useToast();

  // Mode selection state
  const [battleMode, setBattleMode] = useState<BattleMode>("select");
  const [playerRoomMode, setPlayerRoomMode] =
    useState<PlayerRoomMode>("select");
  const [roomId, setRoomId] = useState<string>("");
  const [joinRoomId, setJoinRoomId] = useState<string>("");

  // Battle state
  const [battleState, setBattleState] = useState<BattleState>({
    battleStarted: false,
    currentTurn: "",
    humanHealth: 100,
    aiHealth: 100,
    displayedHumanHealth: 100,
    displayedAIHealth: 100,
    showVictoryModal: false,
    showDefeatModal: false,
    earnedExp: 0,
    showExpAnimation: false,
    currentPlayerExp: 320, // Mock starting exp
    playerLevel: 5, // Mock player level
    showHumanAttackAnimation: false,
    showAIAttackAnimation: false,
    attackAnimationType: "slash",
    targetShake: null,
    humanDefenseBonus: 0,
    aiDefenseBonus: 0,
    defenseBonusTurns: 0,
  });

  // Generate gladiator instances
  const { address } = useAccount();
  const { data: gladiatorData } = useReadContract({
    abi: gladiatorAbi,
    address: gladiatorAddress, 
    functionName: "getGladiatorForPlayer",
    args: [address],
  });

  const [humanGladiator, setHumanGladiator] = useState<Gladiator | null>(null);
  const [aiGladiator, setAiGladiator] = useState<Gladiator | null>(null);

  useEffect(() => {
    const initGladiators = async () => {
      if (gladiatorData) {
        const human = await generateGladiator(true, gladiatorData);
        const ai = await generateGladiator(false, gladiatorData);
        setHumanGladiator(human);
        setAiGladiator(ai);
      }
    };
    initGladiators();
  }, [gladiatorData]);

  // Individual state setters for battle state properties
  const setBattleStarted = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, battleStarted: value }));
  const setCurrentTurn = (value: string) =>
    setBattleState((prev) => ({ ...prev, currentTurn: value }));
  const setHumanHealth = (value: number) =>
    setBattleState((prev) => ({ ...prev, humanHealth: value }));
  const setAiHealth = (value: number) =>
    setBattleState((prev) => ({ ...prev, aiHealth: value }));
  const setDisplayedHumanHealth = (
    value: number | ((prev: number) => number)
  ) => {
    if (typeof value === "function") {
      setBattleState((prev) => ({
        ...prev,
        displayedHumanHealth: value(prev.displayedHumanHealth),
      }));
    } else {
      setBattleState((prev) => ({ ...prev, displayedHumanHealth: value }));
    }
  };
  const setDisplayedAIHealth = (value: number | ((prev: number) => number)) => {
    if (typeof value === "function") {
      setBattleState((prev) => ({
        ...prev,
        displayedAIHealth: value(prev.displayedAIHealth),
      }));
    } else {
      setBattleState((prev) => ({ ...prev, displayedAIHealth: value }));
    }
  };
  const setShowVictoryModal = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, showVictoryModal: value }));
  const setShowDefeatModal = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, showDefeatModal: value }));
  const setEarnedExp = (value: number) =>
    setBattleState((prev) => ({ ...prev, earnedExp: value }));
  const setShowExpAnimation = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, showExpAnimation: value }));
  const setShowHumanAttackAnimation = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, showHumanAttackAnimation: value }));
  const setShowAIAttackAnimation = (value: boolean) =>
    setBattleState((prev) => ({ ...prev, showAIAttackAnimation: value }));
  const setAttackAnimationType = (value: string) =>
    setBattleState((prev) => ({ ...prev, attackAnimationType: value }));
  const setTargetShake = (value: string | null) =>
    setBattleState((prev) => ({ ...prev, targetShake: value }));
  const setHumanDefenseBonus = (value: number) =>
    setBattleState((prev) => ({ ...prev, humanDefenseBonus: value }));
  const setAiDefenseBonus = (value: number) =>
    setBattleState((prev) => ({ ...prev, aiDefenseBonus: value }));
  const setDefenseBonusTurns = (value: number) =>
    setBattleState((prev) => ({ ...prev, defenseBonusTurns: value }));

  // Reset battle state
  const resetBattleState = () => {
    setBattleState({
      ...battleState,
      battleStarted: false,
      currentTurn: "",
      humanHealth: 100,
      aiHealth: 100,
      displayedHumanHealth: 100,
      displayedAIHealth: 100,
      showVictoryModal: false,
      showDefeatModal: false,
      humanDefenseBonus: 0,
      aiDefenseBonus: 0,
      defenseBonusTurns: 0,
    });
  };

  // Auto-start battle if AI has higher speed on component mount
  useEffect(() => {
    if (
      battleMode === "vsAI" &&
      !battleState.battleStarted &&
      aiGladiator.speed > humanGladiator.speed
    ) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        startBattleFn();

        // AI takes first turn automatically
        const randomAbility =
          aiGladiator?.abilities[
            Math.floor(Math.random() * aiGladiator?.abilities.length)
          ];

        handleAbilityClick(aiGladiator?.name, randomAbility?.name);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [battleMode]);

  // Update displayed health with animation when actual health changes
  useEffect(() => {
    if (battleState.displayedHumanHealth !== battleState.humanHealth) {
      const interval = setInterval(() => {
        setDisplayedHumanHealth((prev: number) => {
          if (prev > battleState.humanHealth) return prev - 1;
          if (prev < battleState.humanHealth) return prev + 1;
          return prev;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [battleState.humanHealth, battleState.displayedHumanHealth]);

  useEffect(() => {
    if (battleState.displayedAIHealth !== battleState.aiHealth) {
      const interval = setInterval(() => {
        setDisplayedAIHealth((prev: number) => {
          if (prev > battleState.aiHealth) return prev - 1;
          if (prev < battleState.aiHealth) return prev + 1;
          return prev;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [battleState.aiHealth, battleState.displayedAIHealth]);

  // Track and reduce defense bonus turns
  useEffect(() => {
    if (battleState.defenseBonusTurns > 0) {
      // Each ability activation represents a full turn
      // This will decrement the counter once per full turn
      const newTurns = battleState.defenseBonusTurns - 1;
      setDefenseBonusTurns(newTurns);

      if (newTurns === 0) {
        // Reset defense bonuses when turns expire
        if (battleState.humanDefenseBonus > 0) {
          setHumanDefenseBonus(0);
          toast({
            title: "Buff Expired",
            description: `${humanGladiator?.name}'s defense bonus has worn off.`,
            variant: "default",
          });
        }

        if (battleState.aiDefenseBonus > 0) {
          setAiDefenseBonus(0);
          toast({
            title: "Buff Expired",
            description: `${aiGladiator?.name}'s defense bonus has worn off.`,
            variant: "default",
          });
        }
      }
    }
  }, [battleState.currentTurn]);

  // Constants for level/exp calculation
  const EXP_PER_LEVEL = 100; // Base exp needed per level
  const expToNextLevel = battleState.playerLevel * EXP_PER_LEVEL;
  const expProgress =
    ((battleState.currentPlayerExp % expToNextLevel) / expToNextLevel) * 100;
  const newTotalExp = battleState.currentPlayerExp + battleState.earnedExp;
  const newLevel = Math.floor(newTotalExp / EXP_PER_LEVEL) + 1;
  const levelUp = newLevel > battleState.playerLevel;

  // Handler functions
  const startBattleFn = () => {
    startBattle(
      battleState,
      humanGladiator,
      aiGladiator,
      toast,
      setBattleStarted,
      setCurrentTurn
    );
  };

  const handleStartAIBattle = () => {
    startAIBattle(
      setBattleMode,
      setBattleStarted,
      setCurrentTurn,
      setHumanHealth,
      setAiHealth,
      setDisplayedHumanHealth,
      setDisplayedAIHealth,
      setShowVictoryModal,
      setShowDefeatModal,
      setHumanDefenseBonus,
      setAiDefenseBonus,
      setDefenseBonusTurns
    );
  };

  const handleStartPlayerMode = () => {
    startPlayerMode(setBattleMode, setPlayerRoomMode);
  };

  const handleCreateRoomFn = () => {
    handleCreateRoom(generateRoomId, setRoomId, toast);
  };

  const handleJoinRoomFn = () => {
    handleJoinRoom(joinRoomId, setRoomId, toast);
  };

  // Handle ability activation wrapper
  const handleAbilityClick = (gladiatorName: string, abilityName: string) => {
    handleAbilityActivation(
      gladiatorName,
      abilityName,
      battleState,
      humanGladiator,
      aiGladiator,
      // State setters
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
      // Utility functions
      toast,
      startBattleFn
    );
  };

  return (
    <>
      <div
        className={`h-screen w-screen text-white relative overflow-hidden flex flex-col ${
          battleState.showDefeatModal ? "grayscale" : ""
        }`}
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(0, 0, 0, 0.2) 0%, 
              rgba(0, 0, 0, 0.2) 60%, 
              rgba(0, 0, 0, 1) 100%
            ), url('/emeraldsky.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Header - Smaller to maximize battle area */}
        <div className="w-full py-2 px-4 z-20 border-b border-emerald-900/50 bg-black/70 backdrop-blur-sm">
          <Navbar />
        </div>

        {/* Toast container */}
        <Toaster />

        {/* Main Battle Area - Flex to maximize viewport usage */}
        <main className="flex-1 flex flex-col justify-center w-full max-w-screen-2xl mx-auto px-4 py-6 mt-2 relative">
          {/* Mode Selection UI */}
          {battleMode === "select" && (
            <BattleModeSelection
              setBattleMode={setBattleMode}
              setPlayerRoomMode={setPlayerRoomMode}
              setBattleStarted={setBattleStarted}
              setCurrentTurn={setCurrentTurn}
              setHumanHealth={setHumanHealth}
              setAiHealth={setAiHealth}
              setDisplayedHumanHealth={setDisplayedHumanHealth}
              setDisplayedAIHealth={setDisplayedAIHealth}
              setShowVictoryModal={setShowVictoryModal}
              setShowDefeatModal={setShowDefeatModal}
              setHumanDefenseBonus={setHumanDefenseBonus}
              setAiDefenseBonus={setAiDefenseBonus}
              setDefenseBonusTurns={setDefenseBonusTurns}
            />
          )}

          {/* Room Creation/Joining UI - Only show these if we're not in an active battle */}
          {battleMode === "vsPlayers" && !roomId && (
            <>
              {/* Player Room Selection */}
              {playerRoomMode === "select" && (
                <PlayerRoomSelection
                  setBattleMode={setBattleMode}
                  setPlayerRoomMode={setPlayerRoomMode}
                  setRoomId={setRoomId}
                  toast={toast}
                />
              )}

              {/* Room Created Interface */}
              {playerRoomMode === "create" && (
                <CreateRoomUI
                  roomId={roomId}
                  setPlayerRoomMode={setPlayerRoomMode}
                  setRoomId={setRoomId}
                  toast={toast}
                />
              )}

              {/* Join Room Interface */}
              {playerRoomMode === "join" && (
                <JoinRoomUI
                  setPlayerRoomMode={setPlayerRoomMode}
                  setJoinRoomId={setJoinRoomId}
                  joinRoomId={joinRoomId}
                  setRoomId={setRoomId}
                  toast={toast}
                />
              )}
            </>
          )}

          {/* Battle Interface - Only show for VS AI or when a multiplayer room is active */}
          {(battleMode === "vsAI" ||
            (battleMode === "vsPlayers" && roomId)) && (
            <BattleArena
              battleMode={battleMode}
              roomId={roomId}
              humanGladiator={humanGladiator}
              aiGladiator={aiGladiator}
              displayedHumanHealth={battleState.displayedHumanHealth}
              displayedAIHealth={battleState.displayedAIHealth}
              humanDefenseBonus={battleState.humanDefenseBonus}
              aiDefenseBonus={battleState.aiDefenseBonus}
              defenseBonusTurns={battleState.defenseBonusTurns}
              showHumanAttackAnimation={battleState.showHumanAttackAnimation}
              showAIAttackAnimation={battleState.showAIAttackAnimation}
              attackAnimationType={battleState.attackAnimationType}
              targetShake={battleState.targetShake}
              battleStarted={battleState.battleStarted}
              currentTurn={battleState.currentTurn}
              onAbilityClick={handleAbilityClick}
              setBattleMode={setBattleMode}
              setRoomId={setRoomId}
              setPlayerRoomMode={setPlayerRoomMode}
              resetBattleState={resetBattleState}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="py-2 text-center text-slate-400 text-xs relative z-10">
          <p>
            Epic Battle Simulator • Ruins of Rome • {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* Victory Modal - Outside the main container */}
      <VictoryModal
        showVictoryModal={battleState.showVictoryModal}
        setShowVictoryModal={setShowVictoryModal}
        humanGladiator={humanGladiator}
        aiGladiator={aiGladiator}
        humanHealth={battleState.humanHealth}
        currentPlayerExp={battleState.currentPlayerExp}
        playerLevel={battleState.playerLevel}
        earnedExp={battleState.earnedExp}
        showExpAnimation={battleState.showExpAnimation}
        expProgress={expProgress}
        expToNextLevel={expToNextLevel}
        newLevel={newLevel}
        levelUp={levelUp}
        newTotalExp={newTotalExp}
      />

      {/* Defeat Modal - Outside the main container */}
      <DefeatModal
        showDefeatModal={battleState.showDefeatModal}
        setShowDefeatModal={setShowDefeatModal}
        humanGladiator={humanGladiator}
        aiGladiator={aiGladiator}
        aiHealth={battleState.aiHealth}
        currentPlayerExp={battleState.currentPlayerExp}
        playerLevel={battleState.playerLevel}
        expProgress={expProgress}
        expToNextLevel={expToNextLevel}
      />
    </>
  );
}
