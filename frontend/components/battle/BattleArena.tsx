import { GladiatorCard } from "./GladiatorCard";
import { GodCard } from "./GodCard";
import { MultiplayerStatusBar } from "./MultiplayerStatusBar";
import { Gladiator } from "@/lib/battle/types";
import { renderAttackAnimation } from "./BattleAnimations";

interface BattleArenaProps {
  battleMode: string;
  roomId: string;
  humanGladiator: Gladiator;
  aiGladiator: Gladiator;
  displayedHumanHealth: number;
  displayedAIHealth: number;
  humanDefenseBonus: number;
  aiDefenseBonus: number;
  defenseBonusTurns: number;
  showHumanAttackAnimation: boolean;
  showAIAttackAnimation: boolean;
  attackAnimationType: string;
  targetShake: string | null;
  battleStarted: boolean;
  currentTurn: string;
  onAbilityClick: (gladiatorName: string, abilityName: string) => void;
  setBattleMode: (value: any) => void;
  setRoomId: (value: string) => void;
  setPlayerRoomMode: (value: any) => void;
  resetBattleState: () => void;
}

export const BattleArena = ({
  battleMode,
  roomId,
  humanGladiator,
  aiGladiator,
  displayedHumanHealth,
  displayedAIHealth,
  humanDefenseBonus,
  aiDefenseBonus,
  defenseBonusTurns,
  showHumanAttackAnimation,
  showAIAttackAnimation,
  attackAnimationType,
  targetShake,
  battleStarted,
  currentTurn,
  onAbilityClick,
  setBattleMode,
  setRoomId,
  setPlayerRoomMode,
  resetBattleState,
}: BattleArenaProps) => {
  return (
    <>
      {/* Multiplayer status bar - only displayed for player vs player battles */}
      {battleMode === "vsPlayers" && roomId && (
        <MultiplayerStatusBar
          roomId={roomId}
          setBattleMode={setBattleMode}
          setRoomId={setRoomId}
          setPlayerRoomMode={setPlayerRoomMode}
          resetBattleState={resetBattleState}
        />
      )}

      <div className="flex flex-row justify-between items-center h-full relative z-10">
        {/* Left Side - Human Gladiator with Gods */}
        <div className="flex flex-row h-full py-4 w-5/12 gap-4">
          {/* Gods Owned Column */}
          <div className="flex flex-col justify-center gap-4 w-1/4">
            {humanGladiator.gods.map((god, index) => (
              <GodCard key={index} god={god} isHuman={true} />
            ))}
          </div>

          {/* Gladiator Card */}
          <GladiatorCard
            gladiator={humanGladiator}
            isHuman={true}
            displayedHealth={displayedHumanHealth}
            defenseBonusTurns={defenseBonusTurns}
            defenseBonus={humanDefenseBonus}
            showAttackAnimation={showHumanAttackAnimation}
            attackAnimationType={attackAnimationType}
            targetShake={targetShake}
            battleStarted={battleStarted}
            currentTurn={currentTurn}
            humanGladiator={humanGladiator}
            aiGladiator={aiGladiator}
            onAbilityClick={onAbilityClick}
            renderAttackAnimation={renderAttackAnimation}
          />
        </div>

        {/* Center - VS Symbol */}
        <div className="flex flex-col items-center justify-center h-full w-2/12 relative">
          <div className="relative z-20">
            <div className="text-6xl font-extrabold text-emerald-600 bg-slate-900/60 p-6 rounded-full border-4 border-emerald-700 shadow-lg shadow-emerald-900/30 transform rotate-0 hover:rotate-12 transition-all">
              VS
            </div>
          </div>
        </div>

        {/* Right Side - AI Gladiator with Gods */}
        <div className="flex flex-row-reverse h-full py-4 w-5/12 gap-4">
          {/* Gods Owned Column */}
          <div className="flex flex-col justify-center gap-4 w-1/4">
            {aiGladiator.gods.map((god, index) => (
              <GodCard key={index} god={god} isHuman={false} />
            ))}
          </div>

          {/* Gladiator Card */}
          <GladiatorCard
            gladiator={aiGladiator}
            isHuman={false}
            displayedHealth={displayedAIHealth}
            defenseBonusTurns={defenseBonusTurns}
            defenseBonus={aiDefenseBonus}
            showAttackAnimation={showAIAttackAnimation}
            attackAnimationType={attackAnimationType}
            targetShake={targetShake}
            battleStarted={battleStarted}
            currentTurn={currentTurn}
            humanGladiator={humanGladiator}
            aiGladiator={aiGladiator}
            onAbilityClick={onAbilityClick}
            renderAttackAnimation={renderAttackAnimation}
          />
        </div>
      </div>
    </>
  );
};
