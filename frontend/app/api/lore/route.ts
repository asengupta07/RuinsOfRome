import { NextRequest, NextResponse } from "next/server";
import { generate, generateImage } from "@/functions/generate";
import connectToDatabase from "@/lib/db/mongodb";
import { Schema, model, models } from "mongoose";
import { parseUntilJson } from "@/functions/parseUntilJson";

interface Celestial {
    name: string
    type: "god" | "titan"
    tier: number
    description: string
    buffs: Record<string, number>
    spells: Record<string, number>
}


const BattleStorySchema = new Schema({
    address: {
        type: String,
        required: true
    },
    chapter: {
        type: Number,
        required: true
    },
    chapterName: {
        type: String,
        required: true
    },
    chapterContent: {
        type: String,
        required: true
    },
    illustration: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const BattleStory = models.BattleStory || model("BattleStory", BattleStorySchema);

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();
        const { address, logs, winner, humanName, aiName, humanCelestials, aiCelestials } = await request.json();

        const prompt = `You are a lore crafter for a game about gladiators based on Roman mythology.
    You are given a list of logs from a battle between a human and an ai.
    You are also given the winner of the battle, the human's name, and the ai's name.
    You need to craft a lore for the battle based on the logs.
    Make the lore sound like an epic tale from Roman mythology.

    The lore should be sufficiently big to be one chapter of a book.
    
    Return the output in the following JSON format:
    {
        "chapterName": "<Chapter Name>",
        "chapterContent": "<Chapter Content>"
    }
    
    Return ONLY the JSON, there should be no other text before or after the JSON.

    Winner: ${winner}
    Human Name: ${humanName}
    AI Name: ${aiName}

    Celestials who favoured the human: ${humanCelestials.map((celestial: Celestial) => celestial.name).join(", ")}
    Celestials who favoured the ai: ${aiCelestials.map((celestial: Celestial) => celestial.name).join(", ")}

    Battle Logs: \n${logs}
    `

        const response = await generate(prompt)

        const {
            chapterName,
            chapterContent
        } = parseUntilJson(response)

        const imagePrompt = `You are an ancient roman illustrator tasked with creating a scene from an epic battle.
        You are given a chapter of a book describing a gladiatorial battle.
        Create an illustration that captures a pivotal moment from this battle.
        The illustration should be in the style of ancient Roman frescoes and mosaics, with:
        - Classical Roman architectural elements
        - Dramatic lighting and composition
        - Generic, idealized faces similar to Roman sculptures (avoid specific facial features)
        - Traditional Roman clothing and armor
        - Mythological elements and divine interventions
        - Rich, earthy color palette typical of Roman art
        
        Focus on the action and drama while maintaining historical authenticity.
        The faces should be idealized and generic, like those found in Roman busts and reliefs.

        Chapter: ${chapterContent}
        `

        const imageResponse = await generateImage(imagePrompt)

        const chapters = await BattleStory.find({ address })


        const chapterNumber = chapters ? chapters.length + 1 : 1

        const battleStory = new BattleStory({
            address,
            chapter: chapterNumber,
            chapterName: chapterName,
            chapterContent: chapterContent,
            illustration: imageResponse
        })

        await battleStory.save()


        return NextResponse.json({ message: "Lore generated successfully", success: true });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to generate lore", success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');
        if (!address) {
            return NextResponse.json({ message: "Address is required", success: false }, { status: 400 })
        }
        const chapters = await BattleStory.find({ address })
        const chaptersWithIllustration = chapters.map((chapter) => ({
            title: chapter.chapterName,
            content: chapter.chapterContent,
            illustration: chapter.illustration
        }))
        const epic = {
            title: "The Gladiators of Fallen Rome",
            author: "Faunus, the Roman God of Lore",
            chapters: chaptersWithIllustration
        }
        return NextResponse.json({ epic, success: true });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to get lore", success: false, error: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 })
    }

}