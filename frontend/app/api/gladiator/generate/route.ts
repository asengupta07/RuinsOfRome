import { generate } from "@/functions/generate";
import { parseUntilJson } from "@/functions/parseUntilJson";
import { NextRequest, NextResponse } from "next/server";
import { generateImage as generateImageFunction } from "@/functions/generate";
import { ethers } from "ethers";
import { celestialAbi, celestialAddress } from "@/app/abi";

const COLORS = [
  "blue",
  "green",
  "brown",
  "hazel",
  "gray",
  "amber",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "white",
  "black",
];
const HAIR_LENGTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const HAIR_TYPES = ["straight", "wavy", "curly"];
const FACIAL_HAIR_TYPES = ["beard", "mustache", "none"];
const BODY_TYPES = ["athletic", "average", "stocky"];
const BODY_HEIGHTS = [150, 160, 170, 180, 190, 200];
const BODY_WEIGHTS = [50, 60, 70, 80, 90, 100];
const PERSONALITY_TYPES = [
  "Aggressive by nature, always ready to fight and is not afraid to take risks.",
  "Defensive by nature, always ready to defend themselves and is not afraid to take risks.",
  "Neutral by nature, always ready to fight and is not afraid to take risks.",
  "Offensive by nature, always ready to attack and is not afraid to take risks.",
  "Defensive by nature, always ready to defend themselves and is not afraid to take risks.",
];
const BASE_ATTACK = 60;
const BASE_DEFENCE = 60;
const BASE_SPEED = 60;
const ATTACK_MOVES = ["melee", "ranged"];
const DEFENCE_MOVES = ["fortify", "heal"];
const PASSIVE_MOVES = [
  "nightcrawler",
  "daywalker",
  "berserk",
  "tank",
  "glass_cannon",
];
const facialAttributesGenerator = (gender: "male" | "female") => {
  const randomEyeColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const randomHairColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const randomHairLength =
    HAIR_LENGTHS[Math.floor(Math.random() * HAIR_LENGTHS.length)];
  const randomHairType =
    HAIR_TYPES[Math.floor(Math.random() * HAIR_TYPES.length)];
  const facialFeatures = {
    eyeColor: randomEyeColor,
    hairColor: randomHairColor,
    hairLength: randomHairLength,
    hairType: randomHairType,
  };
  if (gender === "male") {
    const randomFacialHair =
      FACIAL_HAIR_TYPES[Math.floor(Math.random() * FACIAL_HAIR_TYPES.length)];
    const randomFacialHairColor =
      COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      ...facialFeatures,
      facialHair: randomFacialHair,
      facialHairColor: randomFacialHairColor,
    };
  }
  return facialFeatures;
};

const bodyAttributesGenerator = () => {
  const randomBodyType =
    BODY_TYPES[Math.floor(Math.random() * BODY_TYPES.length)];
  const randomBodyHeight =
    BODY_HEIGHTS[Math.floor(Math.random() * BODY_HEIGHTS.length)];
  const randomBodyWeight =
    BODY_WEIGHTS[Math.floor(Math.random() * BODY_WEIGHTS.length)];
  return {
    bodyType: randomBodyType,
    bodyHeight: randomBodyHeight,
    bodyWeight: randomBodyWeight,
  };
};

const personalityAttributesGenerator = () => {
  const randomPersonality =
    PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
  return {
    personality: randomPersonality,
  };
};

const generateImage = async (characterDescription: string) => {
  const prompt = `Create a highly detailed Roman marble sculpture-style illustration of the following gladiator character. 
    The artwork should resemble an ancient Roman statue with classical proportions and styling:

    Character Description: ${characterDescription}

    Art Style Requirements:
    - Picture should be portrait till the knees
    - Gladiator should be wearing a properly covering metal chainlink armor
    - Realistic skin texture with subtle veins and skin imperfections
    - Classical Roman artistic style with accurate anatomy
    - Dramatic lighting as if displayed in a Roman colosseum
    - Determined expression with intense gaze and wrath
    - Weathered battle-hardenedappearance to show age and battle scars
    - Background should be simple and neutral like an ancient Roman gladiator arena

    The sculpture should capture the character's physical attributes exactly as described while maintaining historical accuracy for ancient Roman gladiator representations.`;
  const imageUrl = await generateImageFunction(prompt);
  return imageUrl;
};

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const { gender, name } = body;
  const facialAttributes = facialAttributesGenerator(gender);
  const bodyAttributes = bodyAttributesGenerator();
  const personalityAttributes = personalityAttributesGenerator();
  const prompt = `You are a character generator for a role-playing game.
    You will be given a list of attributes and a prompt.
    You will need to generate a character, who is a Gladiator in the fallen ruins of the city of Rome, that matches the prompt and has the attributes, as well as generate a backstory for the character. However do not name the character. Just describe the character very well and make it very detailed.
    Give the response in JSON format and make sure to properly escape the JSON response.
    For example, there should be no new lines or backticks in the response.
    The attributes are:
    Gender: ${gender}
    Facial Attributes: ${JSON.stringify(facialAttributes)}
    Body Attributes: ${JSON.stringify(bodyAttributes)}
    Personality Attributes: ${JSON.stringify(personalityAttributes)}

    Your response should be in the following JSON format:
    { "description": "string", "backstory": "string" }
    Generate a character description of a Gladiator in the fallen ruins of the city of Rome, that has the attributes, as well as generate a backstory for the character.
    There should be no text before or after the response, only the response.
    `;
  const response = await generate(prompt);
  let characterLore = parseUntilJson(response);
  if (!characterLore.description || !characterLore.backstory) {
    console.log("Failed to generate character, retrying...");
    const retryResponse = await generate(prompt);
    characterLore = parseUntilJson(retryResponse);
    if (!characterLore.description || !characterLore.backstory) {
      return NextResponse.json(
        { error: "Failed to generate character after retry" },
        { status: 500 }
      );
    }
  }
  const moveset = [
    ATTACK_MOVES[Math.floor(Math.random() * ATTACK_MOVES.length)],
    DEFENCE_MOVES[Math.floor(Math.random() * DEFENCE_MOVES.length)],
    PASSIVE_MOVES[Math.floor(Math.random() * PASSIVE_MOVES.length)],
  ];
  const attackValue = BASE_ATTACK + Math.random() * 10;
  const defenceValue = BASE_DEFENCE + Math.random() * 10;
  const speedValue = BASE_SPEED + Math.random() * 10;
  const imageUrl = await generateImage(characterLore.description);

  return NextResponse.json({
    name,
    gender,
    description: characterLore.description,
    backstory: characterLore.backstory,
    moveset,
    attackValue: Math.floor(attackValue),
    defenceValue: Math.floor(defenceValue),
    speedValue: Math.floor(speedValue),
    imageUrl,
    success: true,
  });
}
