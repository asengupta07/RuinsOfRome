import { Gladiator, God } from "./types";
import { BattleData } from "../services/groqService";

/**
 * Prepares battle data for generating a story
 */
export function prepareBattleStoryData(
  humanGladiator: Gladiator,
  aiGladiator: Gladiator,
  winner: string,
  battleLogs: string[] = []
): BattleData {
  // Default battle logs if none provided
  const defaultBattleLogs = [
    `${humanGladiator.name} enters the arena to thunderous applause.`,
    `${aiGladiator.name} stands ready, weapon in hand.`,
    `The crowd roars as the battle begins.`,
    `${winner} delivers the final blow, claiming victory!`,
  ];

  return {
    yourGladiator: humanGladiator.name,
    opponentGladiator: aiGladiator.name,
    yourGods: humanGladiator.gods || [],
    opponentGods: aiGladiator.gods || [],
    battleLogs: battleLogs.length > 0 ? battleLogs : defaultBattleLogs,
    winner,
  };
}

/**
 * Submits battle data to the API for story generation
 */
export async function generateBattleHistory(
  humanGladiator: Gladiator,
  aiGladiator: Gladiator,
  winner: string,
  battleLogs: string[] = []
): Promise<{ chapter: number; story: string }> {
  try {
    const battleData = prepareBattleStoryData(
      humanGladiator,
      aiGladiator,
      winner,
      battleLogs
    );

    const response = await fetch("/api/battle-stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(battleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate battle history");
    }

    const storyData = await response.json();
    return {
      chapter: storyData.chapter,
      story: storyData.story,
    };
  } catch (error) {
    console.error("Error generating battle history:", error);
    // Return a default story if the API fails
    return {
      chapter: 0,
      story: `The battle between ${humanGladiator.name} and ${aiGladiator.name} was legendary, with ${winner} emerging victorious after a fierce struggle. The gods themselves seemed to favor the champion, blessing their attacks with divine power.`,
    };
  }
}

/**
 * Retrieves all battle stories
 */
export async function getAllBattleStories(): Promise<
  Array<{ chapter: number; story: string }>
> {
  try {
    const response = await fetch("/api/battle-stories");

    if (!response.ok) {
      throw new Error("Failed to retrieve battle stories");
    }

    const stories = await response.json();
    return stories.map((story: any) => ({
      chapter: story.chapter,
      story: story.story,
    }));
  } catch (error) {
    console.error("Error retrieving battle stories:", error);
    return [];
  }
}

/**
 * Retrieves a specific battle story by chapter
 */
export async function getBattleStoryByChapter(
  chapter: number
): Promise<{ chapter: number; story: string } | null> {
  try {
    const response = await fetch(`/api/battle-stories/${chapter}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to retrieve battle story chapter ${chapter}`);
    }

    const story = await response.json();
    return {
      chapter: story.chapter,
      story: story.story,
    };
  } catch (error) {
    console.error(`Error retrieving battle story chapter ${chapter}:`, error);
    return null;
  }
}
