import { NextRequest, NextResponse } from "next/server";
import {
  saveBattleStory,
  getAllBattleStories,
} from "@/lib/services/battleStoryService";
import { BattleData } from "@/lib/services/groqService";

/**
 * POST /api/battle-stories
 * Generates and saves a battle story based on battle data
 */
export async function POST(request: NextRequest) {
  try {
    const battleData: BattleData = await request.json();

    // Validate required fields
    if (
      !battleData.yourGladiator ||
      !battleData.opponentGladiator ||
      !battleData.winner
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: yourGladiator, opponentGladiator, or winner",
        },
        { status: 400 }
      );
    }

    // Ensure the gods arrays exist
    battleData.yourGods = battleData.yourGods || [];
    battleData.opponentGods = battleData.opponentGods || [];
    battleData.battleLogs = battleData.battleLogs || [];

    // Generate and save battle story
    const battleStory = await saveBattleStory(battleData);

    return NextResponse.json(battleStory, { status: 201 });
  } catch (error: any) {
    console.error("Error in battle stories POST endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate battle story" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/battle-stories
 * Retrieves all battle stories
 */
export async function GET() {
  try {
    const stories = await getAllBattleStories();
    return NextResponse.json(stories);
  } catch (error: any) {
    console.error("Error in battle stories GET endpoint:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve battle stories" },
      { status: 500 }
    );
  }
}
