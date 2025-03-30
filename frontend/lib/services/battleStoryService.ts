import connectToDatabase from "../db/mongodb";
import BattleStory, { IBattleStory } from "../db/models/BattleStory";
import { BattleData, generateBattleStory } from "./groqService";

/**
 * Save a battle story to the database
 */
export async function saveBattleStory(
  battleData: BattleData
): Promise<IBattleStory> {
  try {
    // Connect to database
    await connectToDatabase();

    // Get the next chapter number
    const latestStory = await BattleStory.findOne().sort("-chapter").exec();
    const nextChapter = latestStory ? latestStory.chapter + 1 : 1;

    // Generate a story using Groq
    const storyResponse = await generateBattleStory(battleData);

    // Override the random chapter with the sequential one
    storyResponse.chapter = nextChapter;

    // Create a new battle story document
    const battleStory = new BattleStory({
      chapter: storyResponse.chapter,
      story: storyResponse.story,
      playerGladiator: battleData.yourGladiator,
      opponentGladiator: battleData.opponentGladiator,
      playerGods: battleData.yourGods,
      opponentGods: battleData.opponentGods,
      battleLogs: battleData.battleLogs,
      winner: battleData.winner,
    });

    // Save to database
    await battleStory.save();
    return battleStory;
  } catch (error) {
    console.error("Error saving battle story:", error);
    throw error;
  }
}

/**
 * Get all battle stories from the database
 */
export async function getAllBattleStories(): Promise<IBattleStory[]> {
  try {
    await connectToDatabase();
    return await BattleStory.find().sort("-chapter").exec();
  } catch (error) {
    console.error("Error getting battle stories:", error);
    throw error;
  }
}

/**
 * Get a battle story by chapter
 */
export async function getBattleStoryByChapter(
  chapter: number
): Promise<IBattleStory | null> {
  try {
    await connectToDatabase();
    return await BattleStory.findOne({ chapter }).exec();
  } catch (error) {
    console.error(`Error getting battle story chapter ${chapter}:`, error);
    throw error;
  }
}

/**
 * Get the latest battle story
 */
export async function getLatestBattleStory(): Promise<IBattleStory | null> {
  try {
    await connectToDatabase();
    return await BattleStory.findOne().sort("-chapter").exec();
  } catch (error) {
    console.error("Error getting latest battle story:", error);
    throw error;
  }
}
