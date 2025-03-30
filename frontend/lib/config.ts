export const config = {
    "buffs": [
        {
            "name": "attack",
            "description": "Increase attack damage"
        },
        {
            "name": "defense",
            "description": "Increase defense"
        },
        {
            "name": "speed",
            "description": "Increase speed"
        },
        {
            "name": "heal",
            "description": "Heal some percentage of your current health"
        },
        {
            "name": "shield",
            "description": "Convert current health into a protective shield"
        },
        {
            "name": "stealth",
            "description": "Chance to dodge incoming attacks"
        },
        {
            "name": "fury",
            "description": "Boosts damage significantly when health is low"
        },
        {
            "name": "divine_protection",
            "description": "Reduce damage taken from dark and underworld spells"
        },
        {
            "name": "wisdom",
            "description": "Increase spell power and mana efficiency"
        },
        {
            "name": "curse_resistance",
            "description": "Decrease negative effects from enemy spells"
        },
        {
            "name": "fortune",
            "description": "Increase luck and chance-based effects"
        }
    ],
    "spells": [
        {
            "name": "fireball",
            "description": "Launch a devastating fireball"
        },
        {
            "name": "inferno",
            "description": "Unleash a raging inferno"
        },
        {
            "name": "icebolt",
            "description": "Fire a freezing bolt of ice"
        },
        {
            "name": "lightning",
            "description": "Strike with electric energy"
        },
        {
            "name": "poison",
            "description": "Inflict toxic damage over time"
        },
        {
            "name": "stun",
            "description": "Temporarily immobilize the enemy"
        },
        {
            "name": "whirlpool",
            "description": "Create a destructive vortex of water"
        },
        {
            "name": "earthquake",
            "description": "Shake the ground with seismic force"
        },
        {
            "name": "meteor",
            "description": "Call down a devastating meteor strike"
        },
        {
            "name": "wrath",
            "description": "Channel pure destructive energy"
        },
        {
            "name": "smite",
            "description": "Deliver divine punishment"
        },
        {
            "name": "rewind",
            "description": "Rewind time a turn back"
        },
        {
            "name": "necrotic_touch",
            "description": "Drain life force from the target"
        },
        {
            "name": "aether_blast",
            "description": "Unleash celestial energy upon foes"
        },
        {
            "name": "abyssal_chain",
            "description": "Bind the enemy with chains from the underworld"
        },
        {
            "name": "tempest",
            "description": "Summon a devastating storm"
        }
    ],
    "celestials": [
        {
            "name": "jupiter",
            "type": "god",
            "tier": 1,
            "description": "King of the gods, ruler of the heavens.",
            "buffs": {
                "attack": 10,
                "defense": 8,
                "speed": 7
            },
            "spells": {
                "lightning": 12,
                "smite": 10,
                "tempest": 9
            }
        },
        {
            "name": "neptune",
            "type": "god",
            "tier": 1,
            "description": "God of the sea, earthquakes, and storms.",
            "buffs": {
                "defense": 9,
                "wisdom": 7,
                "curse_resistance": 8
            },
            "spells": {
                "whirlpool": 11,
                "earthquake": 10,
                "aether_blast": 9
            }
        },
        {
            "name": "pluto",
            "type": "god",
            "tier": 1,
            "description": "God of the underworld and wealth.",
            "buffs": {
                "stealth": 8,
                "shield": 7,
                "fury": 9
            },
            "spells": {
                "necrotic_touch": 12,
                "abyssal_chain": 10,
                "poison": 9
            }
        },
        {
            "name": "juno",
            "type": "god",
            "tier": 2,
            "description": "Queen of the gods, protector of marriage.",
            "buffs": {
                "divine_protection": 9,
                "heal": 8
            },
            "spells": {
                "smite": 9,
                "aether_blast": 8
            }
        },
        {
            "name": "mars",
            "type": "god",
            "tier": 2,
            "description": "God of war and destruction.",
            "buffs": {
                "attack": 12,
                "fury": 10
            },
            "spells": {
                "wrath": 10,
                "smite": 9
            }
        },
        {
            "name": "minerva",
            "type": "god",
            "tier": 2,
            "description": "Goddess of wisdom and strategy.",
            "buffs": {
                "wisdom": 9,
                "divine_protection": 7
            },
            "spells": {
                "rewind": 10,
                "aether_blast": 8
            }
        },
        {
            "name": "apollo",
            "type": "god",
            "tier": 2,
            "description": "God of the sun, prophecy, and healing.",
            "buffs": {
                "heal": 10,
                "wisdom": 8
            },
            "spells": {
                "smite": 10,
                "aether_blast": 9
            }
        },
        {
            "name": "diana",
            "type": "god",
            "tier": 2,
            "description": "Goddess of the hunt and the moon.",
            "buffs": {
                "stealth": 9,
                "speed": 8
            },
            "spells": {
                "icebolt": 10,
                "abyssal_chain": 7
            }
        },
        {
            "name": "mercury",
            "type": "god",
            "tier": 2,
            "description": "Messenger of the gods, patron of travelers.",
            "buffs": {
                "speed": 11,
                "stealth": 8
            },
            "spells": {
                "lightning": 10,
                "rewind": 8
            }
        },
        {
            "name": "vulcan",
            "type": "god",
            "tier": 2,
            "description": "God of fire and blacksmiths.",
            "buffs": {
                "defense": 10,
                "fury": 7
            },
            "spells": {
                "fireball": 11,
                "inferno": 9
            }
        },
        {
            "name": "ceres",
            "type": "god",
            "tier": 2,
            "description": "Goddess of agriculture and harvest.",
            "buffs": {
                "heal": 9,
                "shield": 7
            },
            "spells": {
                "earthquake": 9,
                "poison": 8
            }
        },
        {
            "name": "vesta",
            "type": "god",
            "tier": 2,
            "description": "Goddess of the hearth and sacred fire.",
            "buffs": {
                "shield": 10,
                "divine_protection": 8
            },
            "spells": {
                "aether_blast": 9,
                "fireball": 7
            }
        },
        {
            "name": "venus",
            "type": "god",
            "tier": 3,
            "description": "Goddess of love and beauty.",
            "buffs": {
                "stealth": 7
            },
            "spells": {
                "poison": 7
            }
        },
        {
            "name": "janus",
            "type": "god",
            "tier": 3,
            "description": "God of beginnings and doorways.",
            "buffs": {
                "wisdom": 7
            },
            "spells": {
                "rewind": 8
            }
        },
        {
            "name": "flora",
            "type": "god",
            "tier": 3,
            "description": "Goddess of flowers and spring.",
            "buffs": {
                "heal": 7
            },
            "spells": {
                "poison": 7
            }
        },
        {
            "name": "fortuna",
            "type": "god",
            "tier": 3,
            "description": "Goddess of luck and fortune.",
            "buffs": {
                "fortune": 9
            },
            "spells": {
                "tempest": 7
            }
        },
        {
            "name": "proserpina",
            "type": "god",
            "tier": 3,
            "description": "Queen of the underworld.",
            "buffs": {
                "stealth": 7
            },
            "spells": {
                "necrotic_touch": 6
            }
        },
        {
            "name": "bacchus",
            "type": "god",
            "tier": 3,
            "description": "God of wine and madness.",
            "buffs": {
                "fury": 8
            },
            "spells": {
                "wrath": 7
            }
        },
        {
            "name": "bellona",
            "type": "god",
            "tier": 3,
            "description": "Goddess of war.",
            "buffs": {
                "attack": 8
            },
            "spells": {
                "smite": 6
            }
        },
        {
            "name": "saturn",
            "type": "god",
            "tier": 3,
            "description": "God of time and agriculture.",
            "buffs": {
                "wisdom": 8
            },
            "spells": {
                "rewind": 7
            }
        },
        {
            "name": "saturn",
            "type": "titan",
            "tier": 1,
            "description": "King of the Titans, god of time and harvest.",
            "buffs": {
                "attack": 11,
                "wisdom": 9,
                "fury": 10
            },
            "spells": {
                "rewind": 12,
                "earthquake": 10,
                "meteor": 9
            }
        },
        {
            "name": "ops",
            "type": "titan",
            "tier": 1,
            "description": "Titaness of abundance and Saturn's consort.",
            "buffs": {
                "heal": 10,
                "shield": 9,
                "fortune": 8
            },
            "spells": {
                "aether_blast": 11,
                "poison": 9,
                "tempest": 8
            }
        },
        {
            "name": "oceanus",
            "type": "titan",
            "tier": 2,
            "description": "Titan of the world-encircling river.",
            "buffs": {
                "defense": 10,
                "curse_resistance": 8
            },
            "spells": {
                "whirlpool": 11,
                "tempest": 9
            }
        },
        {
            "name": "hyperion",
            "type": "titan",
            "tier": 2,
            "description": "Titan of celestial light and the sun.",
            "buffs": {
                "attack": 9,
                "speed": 8
            },
            "spells": {
                "fireball": 10,
                "lightning": 9
            }
        },
        {
            "name": "iapetus",
            "type": "titan",
            "tier": 2,
            "description": "Titan of mortality and father of Prometheus.",
            "buffs": {
                "defense": 9,
                "fury": 8
            },
            "spells": {
                "wrath": 9,
                "smite": 8
            }
        },
        {
            "name": "themis",
            "type": "titan",
            "tier": 3,
            "description": "Titaness of divine law and order.",
            "buffs": {
                "wisdom": 8
            },
            "spells": {
                "rewind": 7
            }
        },
        {
            "name": "rhea",
            "type": "titan",
            "tier": 3,
            "description": "Mother of the gods, Titaness of fertility.",
            "buffs": {
                "heal": 8
            },
            "spells": {
                "aether_blast": 7
            }
        },
        {
            "name": "mnemosyne",
            "type": "titan",
            "tier": 3,
            "description": "Titaness of memory and language.",
            "buffs": {
                "wisdom": 9
            },
            "spells": {
                "rewind": 8
            }
        },
        {
            "name": "crius",
            "type": "titan",
            "tier": 3,
            "description": "Titan of constellations and celestial cycles.",
            "buffs": {
                "speed": 7
            },
            "spells": {
                "lightning": 7
            }
        }
    ],
    "moves": [
        {
            "name": "melee",
            "type": "attack",
            "description": "Melee attack"
        },
        {
            "name": "ranged",
            "type": "attack",
            "description": "Ranged attack"
        },
        {
            "name": "fortify",
            "type": "defense",
            "description": "Fortify your defenses"
        },
        {
            "name": "heal",
            "type": "defense",
            "description": "Heal yourself"
        },
        {
            "name": "nightcrawler",
            "type": "passive",
            "description": "You have buffs when it's dark"
        },
        {
            "name": "daywalker",
            "type": "passive",
            "description": "You have buffs when it's light"
        },
        {
            "name": "berserk",
            "type": "passive",
            "description": "You have buffs when you have low health"
        },
        {
            "name": "berserk",
            "type": "passive",
            "description": "You have buffs when you have low health"
        },
        {
            "name": "tank",
            "type": "passive",
            "description": "You have defense buffs"
        },
        {
            "name": "glass_cannon",
            "type": "passive",
            "description": "You have attack buffs"
        }
    ]
}