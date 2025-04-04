import { Swords, Shield, Footprints, Plus } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Gladiator } from "@/lib/battle/types";
import { isGladiatorTurn } from "@/lib/battle/utils";

interface GladiatorCardProps {
  gladiator: Gladiator;
  isHuman: boolean;
  displayedHealth: number;
  defenseBonusTurns: number;
  defenseBonus: number;
  showAttackAnimation: boolean;
  attackAnimationType: string;
  targetShake: string | null;
  battleStarted: boolean;
  currentTurn: string;
  humanGladiator: Gladiator;
  aiGladiator: Gladiator;
  onAbilityClick: (gladiatorName: string, abilityName: string) => void;
  renderAttackAnimation: (
    type: string,
    isHumanAttack: boolean
  ) => React.ReactNode;
}

export const GladiatorCard = ({
  gladiator,
  isHuman,
  displayedHealth,
  defenseBonusTurns,
  defenseBonus,
  showAttackAnimation,
  attackAnimationType,
  targetShake,
  battleStarted,
  currentTurn,
  humanGladiator,
  aiGladiator,
  onAbilityClick,
  renderAttackAnimation,
}: GladiatorCardProps) => {
  // Determine if this gladiator can act based on turn
  const canAct = isGladiatorTurn(
    gladiator.name,
    battleStarted,
    currentTurn,
    humanGladiator,
    aiGladiator
  );

  // Determine if this gladiator is shaking from being hit
  const isShaking = targetShake === (isHuman ? "human" : "ai");

  // console.log("Gladiatoroooo: ", gladiator);

  return (
    <div className="flex items-center relative">
      {/* Attack animation */}
      {showAttackAnimation &&
        renderAttackAnimation(attackAnimationType, isHuman)}

      <Card
        className={`w-full bg-gradient-to-b from-slate-700/80 to-slate-900/80 border-2 border-emerald-600 shadow-lg shadow-emerald-900/20 ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        {isShaking && (
          <div className="absolute inset-0 bg-emerald-500/30 animate-flash z-10"></div>
        )}
        <CardHeader className="text-center border-b border-slate-600 pb-2 pt-3">
          <h3 className="text-xl font-bold tracking-wider text-white">
            {gladiator.name}
          </h3>
        </CardHeader>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex flex-row gap-6 flex-1">
            {/* Gladiator Image */}
            <div className="aspect-square relative bg-slate-900 rounded-md overflow-hidden border border-slate-700">
              <Image
                src={isHuman ? gladiator.image : "/stoicism.png"}
                alt={`${isHuman ? "Human" : "AI"} Gladiator`}
                height={200}
                width={200}
                className="object-cover"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-white">Attack</span>
                <span className="ml-auto text-white">{Math.round(gladiator.attack)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-white">Defense</span>
                <span className="ml-auto">
                  {defenseBonus > 0 ? (
                    <span className="text-emerald-400">
                      {Math.round(gladiator.defense + defenseBonus)}
                    </span>
                  ) : (
                    <span className="text-white">{Math.round(gladiator.defense)}</span>
                  )}
                  {defenseBonusTurns > 0 && defenseBonus > 0 && (
                    <span className="text-xs ml-1 text-emerald-300">
                      ({defenseBonusTurns})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Footprints className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold text-white">Speed</span>
                <span className="ml-auto text-white">{Math.round(gladiator.speed)}</span>
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
                  alt={gladiator.passive.name}
                  width={30}
                  height={30}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block z-20">
                <div className="font-bold">{gladiator.passive.name}</div>
                <div>{gladiator.passive.description}</div>
              </div>
            </div>

            {/* Active Abilities */}
            {gladiator.abilities.map((ability, index) => (
              <div
                key={index}
                className="relative group"
                onClick={() =>
                  canAct && onAbilityClick(gladiator.name, ability.name)
                }
              >
                <div
                  className={`w-12 h-12 rounded-full bg-slate-800 border-2 ${
                    !canAct
                      ? "border-gray-500 opacity-30 cursor-not-allowed"
                      : "border-emerald-500 hover:border-emerald-300 hover:animate-pulse cursor-pointer"
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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded p-2 hidden group-hover:block z-20">
                  <div className="font-bold">{ability.name}</div>
                  <div>{ability.description}</div>
                  {!canAct && (
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
              <Plus className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-xs text-white">
                HP: {displayedHealth}/{gladiator.health}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${(displayedHealth / gladiator.health) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
