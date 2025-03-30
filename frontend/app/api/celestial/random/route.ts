import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { generate, generateImage } from "@/functions/generate";
export async function GET(request: NextRequest) {
    const celestials = config.celestials;
    // Generate random number between 0-100
    const roll = Math.random() * 100;
    
    let randomCelestial;
    if (roll < 2) { // 2% chance for tier 1
        const tier1Celestials = celestials.filter(c => c.tier === 1);
        randomCelestial = tier1Celestials[Math.floor(Math.random() * tier1Celestials.length)];
    } else if (roll < 35) { // 33% chance for tier 2
        const tier2Celestials = celestials.filter(c => c.tier === 2);
        randomCelestial = tier2Celestials[Math.floor(Math.random() * tier2Celestials.length)];
    } else { // 65% chance for tier 3
        const tier3Celestials = celestials.filter(c => c.tier === 3);
        randomCelestial = tier3Celestials[Math.floor(Math.random() * tier3Celestials.length)];
    }
    const descriptionPrompt = `Create a vivid and unique description of ${randomCelestial.name}, a ${randomCelestial.type} in ancient mythology.
    Include details about their appearance, powers (${Object.keys(randomCelestial.spells).join(", ")}), 
    and special abilities (${Object.keys(randomCelestial.buffs).join(", ")}).
    Place them in an epic and memorable scene that captures their essence.`;
    const generatedDescription = await generate(descriptionPrompt);
    const imagePrompt = `Create a majestic and ethereal illustration of a mythological deity:
    
    Character: ${randomCelestial.name}, ${randomCelestial.type} of ${randomCelestial.description}
    Scene Description: ${generatedDescription}
    
    Art Style Requirements:
    - Divine and otherworldly atmosphere
    - Dramatic lighting with celestial glow
    - Intricate details showing their divine nature
    - Classical mythological art style
    - Background should reflect their domain and powers
    - Epic scale and composition`;
    const imageUrl = await generateImage(imagePrompt);
    return NextResponse.json({
        name: randomCelestial.name,
        description: randomCelestial.description,
        image: imageUrl,
        attributes: [
            {
                trait_type: "Type",
                value: randomCelestial.type
            },
            {
                trait_type: "Tier",
                value: randomCelestial.tier
            },
            ...Object.entries(randomCelestial.buffs).map(([name, value]) => ({
                trait_type: name,
                value: value
            })),
            ...Object.entries(randomCelestial.spells).map(([name, value]) => ({
                trait_type: name,
                value: value
            }))
        ],
        properties: {
            category: "celestial",
            rarity_score: randomCelestial.tier === 1 ? 90 + Math.floor(Math.random() * 10) : randomCelestial.tier === 2 ? 60 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 10)
        }
    });
}