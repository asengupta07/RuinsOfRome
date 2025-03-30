import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const { celestial1, celestial2, celestial3 } = body;
    
    // 50% chance no celestial wants to help
    const willHelp = Math.random() >= 0.5;
    
    if (!willHelp) {
        return NextResponse.json({
            success: false,
            message: "No celestial wishes to aid you at this time"
        });
    }

    // Randomly choose one of the three celestials
    const celestials = [celestial1, celestial2, celestial3];
    const chosenCelestial = celestials[Math.floor(Math.random() * celestials.length)];
    // Get all attributes that are either buffs or spells (excluding Type and Tier)
    const powers = chosenCelestial.attributes.filter((attr: {trait_type: string}) => 
        attr.trait_type !== "Type" && 
        attr.trait_type !== "Tier"
    );

    // Randomly choose one power to bestow
    const chosenPower = powers[Math.floor(Math.random() * powers.length)];

    return NextResponse.json({
        success: true,
        celestial: chosenCelestial.name,
        blessing: {
            type: chosenPower.trait_type.toLowerCase(),
            value: chosenPower.value
        },
        message: `${chosenCelestial.name} has chosen to bestow their ${chosenPower.trait_type.toLowerCase()} blessing upon you`
    });
    
}