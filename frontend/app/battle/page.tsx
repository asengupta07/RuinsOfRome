"use client";

import { useState } from "react";
import { ChevronDown, Swords, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function BattlePage() {
  const [battleStarted, setBattleStarted] = useState(false);

  const humanStats = {
    strength: 85,
    intelligence: 70,
    speed: 65,
    endurance: 75,
    specialAbility: "Creativity",
  };

  const aiStats = {
    strength: 60,
    intelligence: 95,
    speed: 90,
    endurance: 100,
    specialAbility: "Data Processing",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <Navbar />

      {/* Main Battle Area */}
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Human Character Card */}
          <div className="flex flex-col items-center mt-20">
            <Card className="w-full max-w-md bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-red-600 shadow-lg shadow-red-900/20">
              <CardHeader className="text-center border-b border-slate-600 pb-2">
                <h3 className="text-3xl font-bold tracking-wider text-white">
                  HUMAN
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square relative bg-slate-900 mb-6 rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                    <div className="text-center">
                      <Image
                        src="/marcus.png"
                        alt="Human Image"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Strength</span>
                      <span>{humanStats.strength}</span>
                    </div>
                    <Progress
                      value={humanStats.strength}
                      className="h-2 bg-slate-600 indicator:bg-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Intelligence</span>
                      <span>{humanStats.intelligence}</span>
                    </div>
                    <Progress
                      value={humanStats.intelligence}
                      className="bg-blue-500 h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Speed</span>
                      <span>{humanStats.speed}</span>
                    </div>
                    <Progress
                      value={humanStats.speed}
                      className="h-2 bg-slate-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Endurance</span>
                      <span>{humanStats.endurance}</span>
                    </div>
                    <Progress
                      value={humanStats.endurance}
                      className="h-2 bg-slate-600 "
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold">Special Ability</span>
                      <span className="text-red-400">
                        {humanStats.specialAbility}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-900 py-3 flex justify-center">
                <div className="flex items-center gap-2 text-red-500">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">CHAMPION OF HUMANITY</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* AI Character Card */}
          <div className="flex flex-col items-center mt-20">
            <Card className="w-full max-w-md bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-blue-600 shadow-lg shadow-blue-900/20">
              <CardHeader className="text-center border-b border-slate-600 pb-2">
                <h3 className="text-3xl font-bold tracking-wider text-white">
                  AI
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square relative bg-slate-900 mb-6 rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Image
                        src="/stoicism.png"
                        alt="Stoicism Image"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Strength</span>
                      <span>{aiStats.strength}</span>
                    </div>
                    <Progress
                      value={aiStats.strength}
                      className="h-2 bg-slate-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Intelligence</span>
                      <span>{aiStats.intelligence}</span>
                    </div>
                    <Progress
                      value={aiStats.intelligence}
                      className="h-2 bg-slate-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Speed</span>
                      <span>{aiStats.speed}</span>
                    </div>
                    <Progress
                      value={aiStats.speed}
                      className="h-2 bg-slate-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Endurance</span>
                      <span>{aiStats.endurance}</span>
                    </div>
                    <Progress
                      value={aiStats.endurance}
                      className="h-2 bg-slate-600"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold">Special Ability</span>
                      <span className="text-blue-400">
                        {aiStats.specialAbility}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-900 py-3 flex justify-center">
                <div className="flex items-center gap-2 text-blue-500">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">DIGITAL OVERLORD</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Battle Controls */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r bg-black text-white font-bold py-6 px-12 rounded-lg shadow-lg transform transition-transform hover:scale-105"
            onClick={() => setBattleStarted(!battleStarted)}
          >
            <Swords className="mr-2 h-6 w-6" />
            {battleStarted ? "RESET BATTLE" : "START BATTLE"}
          </Button>

          {battleStarted && (
            <div className="mt-8 p-6 bg-slate-800/50 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Battle Log</h3>
              <div className="space-y-2 text-left">
                <p className="text-slate-300">
                  • Human launches a creative attack!
                </p>
                <p className="text-slate-300">
                  • AI counters with data-driven defense
                </p>
                <p className="text-slate-300">
                  • Human uses unpredictable strategy
                </p>
                <p className="text-slate-300">
                  • AI processes all possible outcomes...
                </p>
                <p className="text-slate-300">• Battle continues...</p>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="flex items-center gap-1">
                  Show More <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto py-6 text-center text-slate-400 border-t border-slate-700">
        <p>Epic Battle Simulator • Person vs AI • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
