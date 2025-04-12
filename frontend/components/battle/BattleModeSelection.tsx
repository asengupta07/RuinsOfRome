import { Bot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { startAIBattle, startPlayerMode } from "@/lib/battle/battleHandler";

interface BattleModeSelectionProps {
  setBattleMode: (value: any) => void;
  setPlayerRoomMode: (value: any) => void;
  setBattleStarted: (value: boolean) => void;
  setCurrentTurn: (value: string) => void;
  setHumanHealth: (value: number) => void;
  setAiHealth: (value: number) => void;
  setDisplayedHumanHealth: (value: number) => void;
  setDisplayedAIHealth: (value: number) => void;
  setShowVictoryModal: (value: boolean) => void;
  setShowDefeatModal: (value: boolean) => void;
  setHumanDefenseBonus: (value: number) => void;
  setAiDefenseBonus: (value: number) => void;
  setDefenseBonusTurns: (value: number) => void;
}

export const BattleModeSelection = ({
  setBattleMode,
  setPlayerRoomMode,
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
  setDefenseBonusTurns,
}: BattleModeSelectionProps) => {
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

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-emerald-500">
          Choose Your Battle
        </h1>
        <p className="text-slate-300">
          Select your preferred way to test your gladiator&apos;s skill
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* VS AI Option */}
        <Card
          className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-700 hover:border-emerald-500 transition-all cursor-pointer transform hover:scale-105"
          onClick={handleStartAIBattle}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <div className="bg-emerald-900/60 p-4 rounded-full">
                <Bot className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">VS AI</h2>
            <p className="text-slate-300 text-sm">
              Challenge the computer in a battle of skill and strategy.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-1 pb-4">
            <Button className="bg-emerald-900/60 border-emerald-700 text-emerald-400 hover:bg-emerald-800/60">
              Start AI Battle
            </Button>
          </CardFooter>
        </Card>

        {/* VS Players Option */}
        <Card
          className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-emerald-700 hover:border-emerald-500 transition-all cursor-pointer transform hover:scale-105"
          onClick={handleStartPlayerMode}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <div className="bg-emerald-900/60 p-4 rounded-full">
                <Users className="h-12 w-12 text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center pt-2">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">
              VS Players
            </h2>
            <p className="text-slate-300 text-sm">
              Battle against your friends in real-time gladiatorial combat.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-1 pb-4">
            <Button className="bg-emerald-900/60 border-emerald-700 text-emerald-400 hover:bg-emerald-800/60">
              Battle Friends
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
