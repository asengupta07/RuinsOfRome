/**
 * Service for interacting with the Groq API to generate battle stories
 */

// In a real app, use environment variables for the API key
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface BattleData {
  yourGods: Array<{
    name: string;
    icon?: string;
    rarity?: string;
  }>;
  opponentGods: Array<{
    name: string;
    icon?: string;
    rarity?: string;
  }>;
  yourGladiator: string;
  opponentGladiator: string;
  battleLogs: string[];
  winner: string;
}

export interface StoryResponse {
  chapter: number;
  story: string;
}

/**
 * Generates a battle story using the Groq API
 */
export async function generateBattleStory(
  battleData: BattleData
): Promise<StoryResponse> {
  if (!GROQ_API_KEY) {
    throw new Error(
      "Groq API key is missing. Please set the GROQ_API_KEY environment variable."
    );
  }

  try {
    // Create the prompt for the Groq API
    const prompt = `
      Generate a one-paragraph epic story about a gladiatorial battle in ancient Rome, with mythological elements.
      
      Battle Details:
      - Player Gladiator: ${battleData.yourGladiator}
      - Opponent Gladiator: ${battleData.opponentGladiator}
      - Player's Gods: ${battleData.yourGods.map((god) => god.name).join(", ")}
      - Opponent's Gods: ${battleData.opponentGods.map((god) => god.name).join(", ")}
      - Victor: ${battleData.winner}
      
      Battle Logs (key moments):
      ${battleData.battleLogs.join("\n")}
      
      Please craft a dramatic, historically-inspired story that incorporates the gods' influences on the battle and explains how ${battleData.winner} emerged victorious. 
      Make it sound like an epic tale from Roman mythology. Be concise but dramatic.
      Return ONLY the story text, nothing else.
    `;

    // Call the Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an expert storyteller specializing in ancient Roman mythology and gladiatorial combat. Write dramatic, engaging tales based on the provided battle information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Groq API error: ${error.message || response.statusText}`
      );
    }

    const data = await response.json();
    const story = data.choices[0].message.content.trim();

    // Get the next chapter number
    // In a real app, this would be fetched from the database
    const chapter = Math.floor(Math.random() * 1000) + 1;

    return {
      chapter,
      story,
    };
  } catch (error) {
    console.error("Error generating battle story:", error);
    throw error;
  }
}
