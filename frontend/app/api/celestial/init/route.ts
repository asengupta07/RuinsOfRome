import { NextResponse, NextRequest } from "next/server";
import { config } from "@/lib/config";
import { generate, generateImage } from "@/functions/generate";

export async function GET(request: NextRequest) {
  const celestials = config.celestials;
  const initialCelestials = celestials
    .filter((c) => c.tier === 3)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const initCelestials = await Promise.all(
    initialCelestials.map(async (c) => {
      const descriptionPrompt = `Create a vivid and unique description of ${
        c.name
      }, a ${c.type} in ancient mythology.
        Include details about their appearance, powers (${Object.keys(
          c.spells
        ).join(", ")}), 
        and special abilities (${Object.keys(c.buffs).join(", ")}).
        Place them in an epic and memorable scene that captures their essence.`;

      const generatedDescription = await generate(descriptionPrompt);

      const imagePrompt = `Create a majestic and ethereal illustration of a mythological deity:
        
        Character: ${c.name}, ${c.type} of ${c.description}
        Scene Description: ${generatedDescription}
        
        Art Style Requirements:
        - Divine and otherworldly atmosphere
        - Dramatic lighting with celestial glow
        - Intricate details showing their divine nature
        - Classical mythological art style
        - Background should reflect their domain and powers
        - Epic scale and composition`;

      const imageUrl = await generateImage(imagePrompt);

        return {
            name: c.name,
            description: c.description,
            image: imageUrl,
            attributes: [
                {
                    trait_type: "Type",
                    value: c.type
                },
                {
                    trait_type: "Tier",
                    value: c.tier
                },
                ...Object.entries(c.buffs).map(([name, value]) => ({
                    trait_type: name,
                    value: value
                })),
                ...Object.entries(c.spells).map(([name, value]) => ({
                    trait_type: name,
                    value: value
                }))
            ],
            properties: {
                category: "celestial",
                rarity_score: c.tier === 1 ? 90 + Math.floor(Math.random() * 10) : c.tier === 2 ? 60 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 10)
            }
        };
    }));

  return NextResponse.json(initCelestials);
}
