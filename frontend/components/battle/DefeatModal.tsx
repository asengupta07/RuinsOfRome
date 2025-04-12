import { Shield, X, Zap, Book, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Gladiator } from "@/lib/battle/types";
import { useState, useEffect } from "react";
import { generateBattleHistory } from "@/lib/battle/battleHistoryUtils";

interface DefeatModalProps {
  showDefeatModal: boolean;
  setShowDefeatModal: (value: boolean) => void;
  humanGladiator: Gladiator;
  aiGladiator: Gladiator;
  aiHealth: number;
  currentPlayerExp: number;
  playerLevel: number;
  expProgress: number;
  expToNextLevel: number;
}

export const DefeatModal = ({
  showDefeatModal,
  setShowDefeatModal,
  humanGladiator,
  aiGladiator,
  aiHealth,
  currentPlayerExp,
  playerLevel,
  expProgress,
  expToNextLevel,
}: DefeatModalProps) => {
  const [battleStory, setBattleStory] = useState<{
    chapter: number;
    story: string;
  } | null>(null);
  const [showStory, setShowStory] = useState(false);

  // Generate battle story when the defeat modal is shown
  useEffect(() => {
    if (showDefeatModal && !battleStory) {
      const fetchBattleStory = async () => {
        // Generate battle logs based on the battle outcome
        const battleLogs = [
          `${humanGladiator.name} entered the Colosseum to face their challenger.`,
          `${aiGladiator.name} stood ready, a formidable opponent with fierce determination.`,
          `The battle was intense, but ${aiGladiator.name} proved too strong.`,
          `${aiGladiator.name} survived with ${aiHealth} health remaining.`,
          `The crowd watched in silence as ${humanGladiator.name} was defeated.`,
        ];

        // Generate the battle story
        const story = await generateBattleHistory(
          humanGladiator,
          aiGladiator,
          aiGladiator.name, // The winner is the AI gladiator
          battleLogs
        );

        setBattleStory(story);
      };

      fetchBattleStory();
    }
  }, [showDefeatModal, humanGladiator, aiGladiator, aiHealth, battleStory]);

  if (!showDefeatModal) return null;

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
          setShowDefeatModal(false);
        }
      }}
    >
      <div className="animate-in zoom-in-95 duration-300 ease-out bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-emerald-600 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Modal header */}
        <div className="bg-emerald-900/30 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
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
          {showStory ? (
            // Battle Story View
            <div className="bg-slate-700/50 rounded-lg p-5 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-red-500">
                  Chapter {battleStory?.chapter || "?"}
                </h3>
              </div>
              <div className="text-white bg-slate-900/80 p-4 rounded-md border border-red-800/50 mb-4">
                {battleStory ? (
                  <p className="italic font-serif leading-relaxed">
                    {battleStory.story}
                  </p>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                    <span className="ml-2">Recording your defeat...</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <Button size="sm" onClick={toggleStory}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Battle Results
                </Button>
                <Button size="sm" onClick={goToChronicles}>
                  <Book className="mr-2 h-4 w-4" />
                  View All Chronicles
                </Button>
              </div>
            </div>
          ) : (
            // Standard Defeat View
            <>
              <div className="flex gap-4 items-center mb-8">
                <div className="relative flex-shrink-0 w-20 h-20 bg-slate-700 rounded-full border-4 border-emerald-600 p-1 overflow-hidden">
                  <Image
                    src="/marcus.png"
                    alt="Human Gladiator"
                    width={80}
                    height={80}
                    className="object-cover rounded-full opacity-50 grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-2 bg-emerald-600 rotate-45 rounded-full"></div>
                    <div className="w-12 h-2 bg-emerald-600 -rotate-45 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {humanGladiator.name}
                    </h3>
                    <span className="text-sm text-emerald-400">DEFEATED</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">
                    Slain by {aiGladiator.name} with {aiHealth} HP remaining
                  </p>

                  <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-slate-700"></div>
                    <div
                      className="absolute h-full bg-emerald-500 transition-all duration-500 ease-out"
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
                <h3 className="text-lg font-semibold text-center mb-4 text-emerald-400">
                  The Emperor is Disappointed
                </h3>

                <div className="space-y-3">
                  <div className="text-center text-slate-300">
                    <p className="mb-2">
                      Train harder and return to the arena when you&apos;re ready.
                    </p>
                    <p className="text-sm text-slate-400">
                      Hint: Perhaps try a different strategy or improve your
                      armor first.
                    </p>
                  </div>

                  <div className="animate-pulse flex justify-center mt-4">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">No rewards earned</span>
                      <Zap className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Battle Story button - changed to redirect to chronicles page */}
              {battleStory && (
                <div className="flex justify-center mb-4">
                  <Button
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
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};
