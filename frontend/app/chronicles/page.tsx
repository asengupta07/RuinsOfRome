"use client";

import { useState, useEffect } from "react";
import { BookText, ChevronLeft, ChevronRight, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBattleStories } from "@/lib/battle/battleHistoryUtils";

interface BattleStory {
  _id: string;
  chapter: number;
  story: string;
  playerGladiator: string;
  opponentGladiator: string;
  winner: string;
  createdAt: string;
}

export default function ChroniclesPage() {
  const [stories, setStories] = useState<BattleStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const response = await fetch("/api/battle-stories");
        if (!response.ok) {
          throw new Error("Failed to fetch battle chronicles");
        }
        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Error fetching battle stories:", err);
        setError("Failed to load battle chronicles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  const currentStory = stories[currentChapterIndex];
  const totalStories = stories.length;

  const goToNextStory = () => {
    if (currentChapterIndex < totalStories - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStory = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-500 mb-3">
            Battle Chronicles
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            The epic tales of glory and defeat in the Colosseum, as witnessed by
            the gods themselves. Each chapter tells the story of a legendary
            battle between gladiators.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <Card className="bg-slate-800 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardFooter>
          </Card>
        ) : stories.length === 0 ? (
          <Card className="bg-slate-800 border-emerald-700">
            <CardHeader>
              <CardTitle className="text-emerald-500">
                No Chronicles Yet
              </CardTitle>
              <CardDescription className="text-slate-300">
                Complete battles to create your legend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Scroll className="h-16 w-16 text-slate-500 mb-4" />
                <p className="text-slate-300 mb-2">
                  Your battle chronicles will appear here after you've completed
                  battles in the Colosseum.
                </p>
                <p className="text-slate-400 text-sm">
                  Each victory and defeat creates a new chapter in your legend.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-900/20"
                onClick={() => (window.location.href = "/battle")}
              >
                Return to Colosseum
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="bg-slate-800/90 border-2 border-emerald-700 rounded-lg p-6 mb-8 shadow-lg shadow-emerald-900/20">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-emerald-900/60 px-4 py-1 rounded-full">
                  <span className="text-emerald-400 text-sm font-semibold">
                    Chapter {currentStory.chapter}
                  </span>
                </div>
                <div className="text-slate-400 text-sm">
                  {formatDate(currentStory.createdAt)}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-emerald-500 mb-4">
                {currentStory.playerGladiator} vs{" "}
                {currentStory.opponentGladiator}
              </h2>

              <div className="text-slate-300 leading-relaxed mb-6 p-4 bg-slate-900/70 rounded border border-emerald-900/40 font-serif">
                <BookText className="inline-block text-emerald-400 mr-2 mb-2 float-left h-10 w-10" />
                <p className="italic first-letter:text-3xl first-letter:font-bold first-letter:text-emerald-400 first-letter:mr-1 first-letter:float-left first-line:uppercase">
                  {currentStory.story}
                </p>
              </div>

              <div className="flex justify-between text-slate-300 text-sm">
                <span>
                  Victor:{" "}
                  <span className="text-emerald-400 font-semibold">
                    {currentStory.winner}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
                onClick={goToPreviousStory}
                disabled={currentChapterIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Button>

              <div className="text-slate-300">
                {currentChapterIndex + 1} of {totalStories}
              </div>

              <Button
                className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
                onClick={goToNextStory}
                disabled={currentChapterIndex === totalStories - 1}
              >
                Next Chapter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        <div className="mt-16 text-center">
          <Button
            className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
            onClick={() => (window.location.href = "/battle")}
          >
            Return to Colosseum
          </Button>
        </div>
      </div>
    </div>
  );
}
