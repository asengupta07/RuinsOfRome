"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bolt, Shield, Skull, Sparkles, Sword, Zap } from "lucide-react";

type GodTier = 1 | 2 | 3;

interface Spell {
  name: string;
  description: string;
  cooldown: string;
  icon: React.ReactNode;
}

interface Buff {
  name: string;
  description: string;
  value: string;
  icon: React.ReactNode;
}

interface God {
  id: number;
  name: string;
  description: string;
  tier: GodTier;
  image: string;
  spells: Spell[];
  buffs: Buff[];
}

// Hardcoded gods data
const godsData: God[] = [
  {
    id: 1,
    name: "Mars",
    description: "God of War and Guardian of Agriculture",
    tier: 1,
    image: "/gods/mars.webp",
    spells: [
      {
        name: "War Cry",
        description:
          "Your gladiator unleashes a mighty roar, intimidating opponents and increasing attack power.",
        cooldown: "3 Turns",
        icon: <Skull className="h-5 w-5" />,
      },
      {
        name: "Shield Wall",
        description:
          "Call upon Mars to strengthen your defenses, reducing incoming damage.",
        cooldown: "2 Turns",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
    buffs: [
      {
        name: "Warrior's Spirit",
        description: "Permanent increase to attack power",
        value: "+15%",
        icon: <Sword className="h-5 w-5" />,
      },
      {
        name: "Battle Hardened",
        description: "Chance to resist stun effects",
        value: "+20%",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    id: 2,
    name: "Minerva",
    description: "Goddess of Wisdom, War, Art, and Strategy",
    tier: 2,
    image: "/gods/minerva.jpg",
    spells: [
      {
        name: "Strategic Insight",
        description:
          "Analyze your opponent's next move, giving you a tactical advantage.",
        cooldown: "4 Turns",
        icon: <Sparkles className="h-5 w-5" />,
      },
      {
        name: "Divine Wisdom",
        description:
          "Minerva blesses you with wisdom, increasing critical hit chance.",
        cooldown: "3 Turns",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
    buffs: [
      {
        name: "Tactical Mind",
        description: "Chance to counter-attack when dodging",
        value: "+25%",
        icon: <Bolt className="h-5 w-5" />,
      },
      {
        name: "Wisdom's Protection",
        description: "Reduces magic damage taken",
        value: "-20%",
        icon: <Shield className="h-5 w-5" />,
      },
    ],
  },
  {
    id: 3,
    name: "Jupiter",
    description: "King of the Gods, God of Sky and Thunder",
    tier: 3,
    image: "/gods/jupiter.jpg",
    spells: [
      {
        name: "Thunderbolt",
        description:
          "Call down a powerful bolt of lightning to strike your enemy.",
        cooldown: "5 Turns",
        icon: <Bolt className="h-5 w-5" />,
      },
      {
        name: "Divine Authority",
        description:
          "Assert Jupiter's authority, stunning your opponent for 1 turn.",
        cooldown: "6 Turns",
        icon: <Sparkles className="h-5 w-5" />,
      },
    ],
    buffs: [
      {
        name: "King's Blessing",
        description: "All stats increased",
        value: "+10%",
        icon: <Sparkles className="h-5 w-5" />,
      },
      {
        name: "Thunder's Might",
        description: "Chance to deal lightning damage on hit",
        value: "+15%",
        icon: <Bolt className="h-5 w-5" />,
      },
    ],
  },
];

// Helper function to get glow color based on tier
function getGlowColor(tier: GodTier) {
  switch (tier) {
    case 1:
      return "from-orange-500/30 to-orange-700/30";
    case 2:
      return "from-purple-500/30 to-purple-700/30";
    case 3:
      return "from-blue-500/30 to-blue-700/30";
    default:
      return "";
  }
}

// Helper function to get border color based on tier
function getBorderColor(tier: GodTier) {
  switch (tier) {
    case 1:
      return "border-orange-500";
    case 2:
      return "border-purple-500";
    case 3:
      return "border-blue-500";
    default:
      return "";
  }
}

// Helper function to get text color based on tier
function getTextColor(tier: GodTier) {
  switch (tier) {
    case 1:
      return "text-orange-400";
    case 2:
      return "text-purple-400";
    case 3:
      return "text-blue-400";
    default:
      return "";
  }
}

export default function GodsPage() {
  const [selectedGod, setSelectedGod] = useState<God | null>(godsData[0]);
  const [displayedGod, setDisplayedGod] = useState<God | null>(godsData[0]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  // Handle god selection and transition
  const handleGodSelection = (god: God) => {
    if (god.id === displayedGod?.id) return; // Skip if the same god is selected

    // Step 1: Start fade out
    setIsFadingOut(true);

    // Step 2: After fade out completes, update the displayed god and start fade in
    setTimeout(() => {
      setDisplayedGod(god);
      setSelectedGod(god);
      setIsFadingOut(false);
      setIsFadingIn(true);

      // Step 3: After fade in completes, reset the fade in state
      setTimeout(() => {
        setIsFadingIn(false);
      }, 500);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b060a] text-teal-100 pb-20 relative">
      {/* Background Image with Transition */}
      {displayedGod && (
        <div
          className={`fixed inset-0 z-0 transition-opacity duration-500 ${
            isFadingOut ? "opacity-0" : isFadingIn ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${displayedGod.image})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11, 6, 10, 0.4) 0%, rgba(11, 6, 10, 0.6) 60%, rgba(11, 6, 10, 1) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content (with higher z-index) */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-20 pb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-300 mb-4 tracking-wide">
            YOUR DIVINE PATRONS
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            The gods favor your gladiator and grant their divine powers. Choose
            wisely which deity to call upon in battle.
          </p>
        </div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          {/* Left side - God selection */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">Your Gods</h2>
            <div className="space-y-4">
              {godsData.map((god) => (
                <div
                  key={god.id}
                  onClick={() => handleGodSelection(god)}
                  className={`cursor-pointer transition-all duration-300 
                    ${
                      selectedGod?.id === god.id
                        ? "scale-105"
                        : "scale-100 opacity-80"
                    }`}
                >
                  <Card
                    className={`border-2 ${getBorderColor(
                      god.tier
                    )} bg-stone-900/80 hover:bg-stone-800/80 backdrop-blur-sm`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className={`${getTextColor(god.tier)}`}>
                          {god.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`${getTextColor(
                            god.tier
                          )} ${getBorderColor(god.tier)}`}
                        >
                          Tier {god.tier}
                        </Badge>
                      </div>
                      <CardDescription className="text-teal-100/70">
                        {god.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Selected god details */}
          {selectedGod && (
            <div className="lg:col-span-2">
              <div
                className={`relative rounded-lg overflow-hidden border-2 ${getBorderColor(
                  selectedGod.tier
                )} bg-stone-900/80 backdrop-blur-sm h-full`}
              >
                {/* God image with gradient overlay */}
                <div className="relative h-80 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-top"
                    style={{ backgroundImage: `url(${selectedGod.image})` }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${getGlowColor(
                      selectedGod.tier
                    )}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2
                      className={`text-4xl font-bold ${getTextColor(
                        selectedGod.tier
                      )}`}
                    >
                      {selectedGod.name}
                    </h2>
                    <p className="text-teal-100 text-lg mt-2">
                      {selectedGod.description}
                    </p>
                  </div>
                </div>

                {/* God powers section */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Divine Spells section */}
                    <div>
                      <h3 className="text-2xl font-bold text-teal-300 mb-4 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-teal-500" />
                        Divine Spells
                      </h3>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {selectedGod.spells.map((spell, index) => (
                            <Card
                              key={index}
                              className="bg-stone-800/60 border-teal-700/40 backdrop-blur-sm"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-teal-200 text-lg flex items-center">
                                    {spell.icon}
                                    <span className="ml-2">{spell.name}</span>
                                  </CardTitle>
                                  <Badge
                                    variant="outline"
                                    className="text-teal-300 border-teal-700"
                                  >
                                    {spell.cooldown}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-teal-100/80">
                                  {spell.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Divine Buffs section */}
                    <div>
                      <h3 className="text-2xl font-bold text-teal-300 mb-4 flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-teal-500" />
                        Divine Buffs
                      </h3>
                      <ScrollArea className="h-64">
                        <div className="space-y-4">
                          {selectedGod.buffs.map((buff, index) => (
                            <Card
                              key={index}
                              className="bg-stone-800/60 border-teal-700/40 backdrop-blur-sm"
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-teal-200 text-lg flex items-center">
                                    {buff.icon}
                                    <span className="ml-2">{buff.name}</span>
                                  </CardTitle>
                                  <Badge
                                    className={`${getTextColor(
                                      selectedGod.tier
                                    )}`}
                                  >
                                    {buff.value}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-teal-100/80">
                                  {buff.description}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
