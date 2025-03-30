import { Trophy, X, Book, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Gladiator } from "@/lib/battle/types";
import { useState, useEffect } from "react";
import { generateBattleHistory } from "@/lib/battle/battleHistoryUtils";

interface VictoryModalProps {
  showVictoryModal: boolean;
  setShowVictoryModal: (value: boolean) => void;
  humanGladiator: Gladiator;
  aiGladiator: Gladiator;
  humanHealth: number;
  currentPlayerExp: number;
  playerLevel: number;
  earnedExp: number;
  showExpAnimation: boolean;
  expProgress: number;
  expToNextLevel: number;
  newLevel: number;
  levelUp: boolean;
  newTotalExp: number;
}

export const VictoryModal = ({
  showVictoryModal,
  setShowVictoryModal,
  humanGladiator,
  aiGladiator,
  humanHealth,
  currentPlayerExp,
  playerLevel,
  earnedExp,
  showExpAnimation,
  expProgress,
  expToNextLevel,
  newLevel,
  levelUp,
  newTotalExp,
}: VictoryModalProps) => {
  const [battleStory, setBattleStory] = useState<{
    chapter: number;
    story: string;
  } | null>(null);
  const [showStory, setShowStory] = useState(false);

  // Generate battle story when the victory modal is shown
  useEffect(() => {
    if (showVictoryModal && !battleStory) {
      const fetchBattleStory = async () => {
        // Generate battle logs based on the battle outcome
        const battleLogs = [
          `${humanGladiator.name} entered the Colosseum to thunderous applause, wielding their mighty weapons.`,
          `${aiGladiator.name} stood tall, confident in their strength and skills.`,
          `The battle was fierce, with ${humanGladiator.name} striking decisive blows.`,
          `${humanGladiator.name} survived with ${humanHealth} health remaining.`,
          `The crowd erupted in cheers as ${humanGladiator.name} claimed victory!`,
        ];

        // Generate the battle story
        const story = await generateBattleHistory(
          humanGladiator,
          aiGladiator,
          humanGladiator.name, // The winner is the human gladiator
          battleLogs
        );

        setBattleStory(story);
      };

      fetchBattleStory();
    }
  }, [showVictoryModal, humanGladiator, aiGladiator, humanHealth, battleStory]);

  if (!showVictoryModal) return null;

  // Toggle story view
  const toggleStory = () => {
    setShowStory(!showStory);
  };

  // Navigate to chronicles page
  const goToChronicles = () => {
    window.location.href = "/chronicles";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          setShowVictoryModal(false);
        }
      }}
    >
      <div className="animate-in zoom-in-95 duration-300 ease-out bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-emerald-500 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal header */}
        <div className="bg-emerald-600/30 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
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
          {showStory ? (
            // Story view
            <div className="bg-slate-700/50 rounded-lg p-5 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-emerald-500">
                  Chapter {battleStory?.chapter || "?"}
                </h3>
              </div>
              <div className="text-white bg-slate-900/80 p-4 rounded-md border border-emerald-800 mb-4">
                {battleStory ? (
                  <p className="italic font-serif leading-relaxed">
                    {battleStory.story}
                  </p>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    <span className="ml-2">Chronicling your victory...</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={toggleStory}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Rewards
                </Button>
                <Button variant="outline" size="sm" onClick={goToChronicles}>
                  <Book className="mr-2 h-4 w-4" />
                  View All Chronicles
                </Button>
              </div>
            </div>
          ) : (
            // Standard Victory View
            <>
              <div className="flex gap-4 items-center mb-8">
                <div className="flex-shrink-0 w-20 h-20 bg-slate-700 rounded-full border-4 border-emerald-600 p-1 overflow-hidden">
                  <Image
                    src={humanGladiator.image}
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
                    <span className="text-sm text-emerald-400">VICTORIOUS</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">
                    Defeated {aiGladiator.name} with {humanHealth} HP remaining
                  </p>

                  <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-slate-700"></div>
                    <div
                      className="absolute h-full bg-emerald-500 transition-all duration-1000 ease-out"
                      style={{ width: `${expProgress}%` }}
                    ></div>
                    <div
                      className={`absolute h-full bg-emerald-300 transition-all duration-1000 ease-out ${
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
                      <span className="text-emerald-400 animate-pulse">
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
                <h3 className="text-lg font-semibold text-center mb-4 text-emerald-400">
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
                          <span className="text-lg font-bold text-emerald-400 animate-in slide-in-from-bottom-3 fade-in duration-500">
                            {earnedExp}
                          </span>
                          <span className="text-white mx-1">=</span>
                          <span className="text-lg font-bold text-emerald-400 animate-in slide-in-from-right-3 fade-in duration-700 delay-300">
                            {newTotalExp}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {levelUp && showExpAnimation && (
                    <div className="bg-emerald-500/20 p-3 rounded-md text-center animate-in slide-in-from-bottom-5 fade-in duration-700 delay-500">
                      <span className="text-lg font-bold text-emerald-400">
                        LEVEL UP!
                      </span>
                      <div className="text-sm text-slate-300">
                        Your gladiator has reached level {newLevel}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Glory Points:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      +25
                    </span>
                  </div>
                </div>
              </div>

              {/* Battle Story button */}
              {battleStory && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="outline"
                    className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/60 flex items-center gap-2"
                    onClick={goToChronicles}
                  >
                    <Book className="h-4 w-4" />
                    Read Battle Chronicles
                  </Button>
                </div>
              )}
            </>
          )}

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3"
            onClick={() => window.location.reload()}
          >
            Fight Again
          </Button>
        </div>
      </div>
    </div>
  );
};
