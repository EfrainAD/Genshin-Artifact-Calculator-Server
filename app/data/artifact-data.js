/*
  This file contains all the numerical and probability values for potential
  substat rolls, organized into js objects. All information here was obtained
  from several sources:
    - the old Artifact Analysis spreadsheet (https://docs.google.com/spreadsheets/d/e/2PACX-1vQdCZN4lM23LNfSU36-zEKXC7sXBzeywSGhT1JW9SlqytYXHHFNVXos1yI0UPMqSyTU7KOe36mtjK9d/pubhtml)
    - the Artifacts pages on the Genshin Impact wiki (https://genshin-impact.fandom.com/wiki/Artifacts and all associated pages)

  The data for all of these sources ultimately comes from Dimbreath's Genshin
  Impact datamine, which can be found at https://github.com/Dimbreath/GenshinData.

  For the purposes of our analysis, the main stat of an artifact does not matter;
  it is assumed that users will only level up artifacts whose main stats they are
  actually interested in. Artifact main stats *do* affect our calculations in
  two places by slightly changing probability distributions, however, so it is
  still important for us to take them into account.
*/

/* this raw data is here if we happen to need it in the future, but it's
    commented out for now!

equip_list_artifact_parse_descriptions = [
  "Name",
  "Slot",
  "Main Stat",
  "Main Stat Value",
  "Artifact Level",
  "Sub Stat",
  "Sub Stat",
  "Sub Stat",
  "Sub Stat"
]

equip_list_artifacts_stats = {
  "flower": [
      "hp"
  ],
  "feather": [
      "atk"
  ],
  "sands": [
      "atk%",
      "hp%",
      "def%",
      "elemastery",
      "recharge"
  ],
  "goblet": [
      "atk%",
      "hp%",
      "def%",
      "elemastery",
      "physical",
      "anemo",
      "cryo",
      "electro",
      "geo",
      "hydro",
      "pyro"
  ],
  "circlet": [
      "atk%",
      "hp%",
      "def%",
      "elemastery",
      "crit",
      "critdmg",
      "healing"
  ]
}

equip_list_artifacts_name = [
  "flower",
  "feather",
  "sands",
  "goblet",
  "circlet"
] */

const MAIN_STAT_PROGRESSION = {
  "hp": [717, 920, 1123, 1326, 1530, 1733, 1936, 2139, 2342, 2545, 2749, 2952, 3155, 3358, 3561, 3764, 3967, 4171, 4374, 4577, 4780],
  "atk": [47, 60, 73, 86, 100, 113, 126, 139, 152, 166, 179, 192, 205, 219, 232, 245, 258, 272, 285, 298, 311],
  "atk%": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "hp%": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "def%": [8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31, 33.5, 36, 38.5, 40.9, 43.4, 45.9, 48.4, 50.8, 53.3, 55.8, 58.3],
  "elemastery": [28, 36, 44, 52, 60, 68, 76, 84, 91, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 179, 187],
  "recharge": [7.8, 10, 12.2, 14.4, 16.6, 18.8, 21, 23.2, 25.4, 27.6, 29.8, 32, 34.2, 36.4, 38.6, 40.8, 43, 45.2, 47.4, 49.6, 51.8],
  "physical": [8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31, 33.5, 36, 38.5, 40.9, 43.4, 45.9, 48.4, 50.8, 53.3, 55.8, 58.3],
  "anemo": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "cryo": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "electro": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "geo": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "hydro": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "pyro": [7, 9, 11, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
  "crit": [4.7, 6, 7.3, 8.6, 9.9, 11.3, 12.6, 13.9, 15.2, 16.6, 17.9, 19.2, 20.5, 21.8, 23.2, 24.5, 25.8, 27.1, 28.4, 29.8, 31.1],
  "critdmg": [9.3, 12, 14.6, 17.3, 19.9, 22.5, 25.2, 27.8, 30.5, 33.1, 35.7, 38.4, 41, 43.7, 46.3, 49, 51.6, 54.2, 56.9, 59.5, 62.2],
  "healing": [5.4, 6.9, 8.4, 10, 11.5, 13, 14.5, 16.1, 17.6, 19.1, 20.6, 22.2, 23.7, 25.2, 26.7, 28.3, 29.8, 31.3, 32.8, 34.4, 35.9]
}

const POSSIBLE_SUBSTAT_ROLLS = {
"atk": [13.62,15.56,17.51,19.45],
"atk%": [4.08,4.66,5.25,5.83],
"hp": [209.13,239,269.88,299.75],
"hp%": [4.08, 4.66, 5.25, 5.83],
"def": [16.2,18.52,20.83,23.15],
"def%": [5.1,5.83,6.56,7.29],
"crit": [2.72,3.11,3.5,3.89],
"critdmg": [5.44,6.22,6.99,7.77],
"elemastery": [16.32,18.65,20.98,23.31],
"recharge": [4.53,5.18,5.83,6.48]
}

const ARTIFACT_SETS = [
  {
    "id": 0,
    "name": "None",
    "set_bonus": [],
    "flower": "None",
    "feather": "None",
    "sands": "None",
    "goblet": "None",
    "circlet": "None"
  },
  {
    "id": 1,
    "name": "Gladiator's Finale",
    "scanner_key": "GladiatorsFinale",
    "set_bonus": [
        {
            "stat": "atk%",
            "value": 18,
            "req": 2
        },
        {
            "stat": "If the wielder of this artifact set uses a Sword, Claymore, or Polearm, increases their Normal Attack DMG by 35%.",
            "value": 0,
            "req": 4,
            "apply": { "id": 95, "option": 0 }
        }
    ],
    "flower": "Gladiator's Nostalgia",
    "feather": "Gladiator's Destiny",
    "sands": "Gladiator's Longing",
    "goblet": "Gladiator's Intoxication",
    "circlet": "Gladiator's Triumphus"
  },
  {
    "id": 2,
    "name": "Maiden Beloved",
    "scanner_key": "MaidenBeloved",
    "set_bonus": [
        {
            "stat": "healing",
            "value": 15,
            "req": 2
        },
        {
            "stat": "Using an Elemental Skill or Elemental Burst increase healing received by all party member by 20% for 10s.",
            "value": 0,
            "req": 4,
            "apply": { "id": 94, "option": 0 }
        }
    ],
    "flower": "Maiden's Distant Love",
    "feather": "Maiden's Heart-stricken Infatuation",
    "sands": "Maiden's Passing Youth",
    "goblet": "Maiden's Fleeting Leisure",
    "circlet": "Maiden's Fading Beauty"
  },
  {
    "id": 3,
    "name": "Noblesse Oblige",
    "scanner_key": "NoblesseOblige",
    "set_bonus": [
        {
            "stat": "burst",
            "value": 20,
            "req": 2
        },
        {
            "stat": "Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.",
            "value": 0,
            "req": 4,
            "apply": { "id": 93, "option": 0 }
        }
    ],
    "flower": "Royal Flora",
    "feather": "Royal Plume",
    "sands": "Royal Pocket Watch",
    "goblet": "Royal Silver Urn",
    "circlet": "Royal Masque"
  },
  {
    "id": 4,
    "name": "Bloodstained Chivalry",
    "scanner_key": "BloodstainedChivalry",
    "set_bonus": [
        {
            "stat": "physical",
            "value": 25,
            "req": 2
        },
        {
            "stat": "After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.",
            "value": 0,
            "req": 4,
            "apply": { "id": 92, "option": 0 }
        }
    ],
    "flower": "Bloodstained Flower of Iron",
    "feather": "Bloodstained Black Plume",
    "sands": "Bloodstained Final Hour",
    "goblet": "Bloodstained Chevalier's Goblet",
    "circlet": "Bloodstained Iron Mask"
  },
  {
    "id": 5,
    "name": "Wanderer's Troupe",
    "scanner_key": "WanderersTroupe",
    "set_bonus": [
        {
            "stat": "elemastery",
            "value": 80,
            "req": 2
        },
        {
            "stat": "Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.",
            "value": 0,
            "req": 4,
            "apply": { "id": 91, "option": 0 }
        }
    ],
    "flower": "Troupe's Dawnlight",
    "feather": "Bard's Arrow Feather",
    "sands": "Concert's Final Hour",
    "goblet": "Wanderer's String Kettle",
    "circlet": "Conductor's Top Hat"
  },
  {
    "id": 6,
    "name": "Viridescent Venerer",
    "scanner_key": "ViridescentVenerer",
    "set_bonus": [
        {
            "stat": "anemo",
            "value": 15,
            "req": 2
        },
        {
            "stat": "swirl",
            "value": 60,
            "req": 4
        },
        {
            "stat": "Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s.",
            "value": 0,
            "req": 4,
            "apply": { "id": 83, "option": 0 }
        }
    ],
    "flower": "In Remembrance of Viridescent Fields",
    "feather": "Viridescent Arrow Feather",
    "sands": "Viridescent Venerer's Determination",
    "goblet": "Viridescent Venerer's Vessel",
    "circlet": "Viridescent Venerer's Diadem"
  },
  {
    "id": 7,
    "name": "Thundering Fury",
    "scanner_key": "ThunderingFury",
    "set_bonus": [
        {
            "stat": "electro",
            "value": 15,
            "req": 2
        },
        {
            "stat": "overload",
            "value": 40,
            "req": 4
        },
        {
            "stat": "electrocharged",
            "value": 40,
            "req": 4
        },
        {
            "stat": "superconduct",
            "value": 40,
            "req": 4
        },
        {
            "stat": "Triggering Overloaded, Electro-Charged or Superconduct decreases Elemental Skill CD by 1s.Can only occur once every 0.8s.",
            "value": 0,
            "req": 4
        }
    ],
    "flower": "Thunderbird's Mercy",
    "feather": "Survivor of Catastrophe",
    "sands": "Hourglass of Thunder",
    "goblet": "Omen of Thunderstorm",
    "circlet": "Thunder Summoner's Crown"
  },
  {
    "id": 8,
    "name": "Thundersoother",
    "scanner_key": "Thundersoother",
    "set_bonus": [
        {
            "stat": "electrores",
            "value": 40,
            "req": 2
        },
        {
            "stat": "Increase DMG against enemies affected by Electro by 35%.",
            "value": 0,
            "req": 4,
            "apply": { "id": 90, "option": 0 }
        }
    ],
    "flower": "Thundersoother's Heart",
    "feather": "Thundersoother's Plume",
    "sands": "Hour of Soothing Thunder",
    "goblet": "Thundersoother's Goblet",
    "circlet": "Thundersoother's Diadem"
  },
  {
    "id": 9,
    "name": "Crimson Witch of Flames",
    "scanner_key": "CrimsonWitchOfFlames",
    "set_bonus": [
        {
            "stat": "pyro",
            "value": 15,
            "req": 2
        },
        {
            "stat": "overload",
            "value": 40,
            "req": 4
        },
        {
            "stat": "burning",
            "value": 40,
            "req": 4
        },
        {
            "stat": "vaporize",
            "value": 15,
            "req": 4
        },
        {
            "stat": "melt",
            "value": 15,
            "req": 4
        },
        {
            "stat": "Using an Elemental Skill increases 2-Piece Set effects by 50% for 10s. Max 3 stacks.",
            "value": 0,
            "req": 4,
            "apply": { "id": 89, "option": 0 }
        }
    ],
    "flower": "Witch's Flower of Blaze",
    "feather": "Witch's Ever-Burning Plume",
    "sands": "Witch's End Time",
    "goblet": "Witch's Heart Flames",
    "circlet": "Witch's Scorching Hat"
  },
  {
    "id": 10,
    "name": "Lavawalker",
    "scanner_key": "Lavawalker",
    "set_bonus": [
        {
            "stat": "pyrores",
            "value": 40,
            "req": 2
        },
        {
            "stat": "Increases DMG against enemies affected by Pryo by 35%",
            "value": 0,
            "req": 4,
            "apply": { "id": 88, "option": 0 }
        }
    ],
    "flower": "Lavawalker's Resolution",
    "feather": "Lavawalker's Salvation",
    "sands": "Lavawalker's Torment",
    "goblet": "Lavawalker's Epiphany",
    "circlet": "Lavawalker's Wisdom"
  },
  {
    "id": 11,
    "name": "Archaic Petra",
    "scanner_key": "ArchaicPetra",
    "set_bonus": [
        {
            "stat": "geo",
            "value": 15,
            "req": 2
        },
        {
            "stat": "Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain 35% DMG to that particular element for 10s. Only one form of Elemental DMG can be gained in this manner at any one time.",
            "value": 0,
            "req": 4,
            "apply": { "id": 87, "option": 0 }
        }
    ],
    "flower": "Flower of Creviced Cliff",
    "feather": "Feather of Jagged Peaks",
    "sands": "Sundial of Enduring Jade",
    "goblet": "Goblet of Chiseled Crag",
    "circlet": "Mask of Solitude Basalt"
  },
  {
    "id": 12,
    "name": "Retracing Bolide",
    "scanner_key": "RetracingBolide",
    "set_bonus": [
        {
            "stat": "shield",
            "value": 35,
            "req": 2
        },
        {
            "stat": "While protected by a Shield, gain 40% Normal and Charged Attack DMG.",
            "value": 0,
            "req": 4,
            "apply": { "id": 86, "option": 0 }
        }
    ],
    "flower": "Summer Night's Bloom",
    "feather": "Summer Night's Finale",
    "sands": "Summer Night's Moment",
    "goblet": "Summer Night's Waterballoon",
    "circlet": "Summer Night's Mask"
  },
  {
    "id": 13,
    "name": "Blizzard Strayer",
    "scanner_key": "BlizzardStrayer",
    "set_bonus": [
        {
            "stat": "cryo",
            "value": 15,
            "req": 2
        },
        {
            "stat": "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.",
            "value": 0,
            "req": 4,
            "apply": { "id": 81, "option": 0 }
        }
    ],
    "flower": "Snowswept Memory",
    "feather": "Icebreaker's Resolve",
    "sands": "Frozen Homeland's Demise",
    "goblet": "Frost-Weaved Dignity",
    "circlet": "Broken Rime's Echo"
  },
  {
    "id": 14,
    "name": "Heart of Depth",
    "scanner_key": "HeartOfDepth",
    "set_bonus": [
        {
            "stat": "hydro",
            "value": 15,
            "req": 2
        },
        {
            "stat": "After using Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for 15s.",
            "value": 0,
            "req": 4,
            "apply": { "id": 80, "option": 0 }
        }
    ],
    "flower": "Gilded Corsage",
    "feather": "Gust of Nostalgia",
    "sands": "Copper Compass",
    "goblet": "Goblet of Thundering Deep",
    "circlet": "Wine-Stained Tricorne"
    
  },
  {
    "id": 15,
    "name": "Pale Flame",
    "scanner_key": "PaleFlame",
    "set_bonus": [
        {
            "stat": "physical",
            "value": 25,
            "req": 2
        },
        {
            "stat": "When an Elemental Skill hits an opponent, ATK is increased by 9% for 7s.This effect stacks up to 2 times and can be triggered once every 0.3s.Once 2 stacks are reached, the 2-set effect is increased by 100%.",
            "value": 0,
            "req": 4,
            "apply": { "id": 380, "option": 0 }
        }
    ],
    "flower": "Stainless Bloom",
    "feather": "Wise Doctor's Pinion",
    "sands": "Moment of Cessation",
    "goblet": "Surpassing Cup",
    "circlet": "Mocking Mask"
  },
  {
    "id": 16,
    "name": "Tenacity of the Millelith",
    "scanner_key": "TenacityOfTheMillelith",
    "set_bonus": [
        {
            "stat": "hp%",
            "value": 20,
            "req": 2
        },
        {
            "stat": "When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s.This effect can be triggered once every 0.5s.This effect can still be triggered even when the character who is using this artifact set is not on the field.",
            "value": 0,
            "req": 4,
            "apply": { "id": 379, "option": 0 }
        }
    ],
    "flower": "Flower of Accolades",
    "feather": "Ceremonial War-Plume",
    "sands": "Orichalceous Time-Dial",
    "goblet": "Noble's Pledging Vessel",
    "circlet": "General's Ancient Helm"
  },
  {
    "id": 17,
    "name": "Shimenawa's Reminiscence",
    "scanner_key": "ShimenawasReminiscence",
    "set_bonus": [
        {
            "stat": "atk%",
            "value": 18,
            "req": 2
        },
        {
            "stat": "When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/ Plunging Attack DMG is increased by 50% for 10s.",
            "value": 0,
            "req": 4,
            "apply": { "id": 418, "option": 0 }
        }
    ],
    "flower": "Entangling Bloom",
    "feather": "Shaft of Remembrance",
    "sands": "Morning Dew's Moment",
    "goblet": "Hopeful Heart",
    "circlet": "Capricious Visage"
  },
  {
    "id": 18,
    "name": "Emblem of Severed Fate",
    "scanner_key": "EmblemOfSeveredFate",
    "set_bonus": [
        {
            "stat": "recharge",
            "value": 20,
            "req": 2
        },
        {
            "stat": "Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.",
            "value": 0,
            "req": 4,
            "apply": { "id": 419, "option": 0 }
        }
    ],
    "flower": "Magnificent Tsuba",
    "feather": "Sundered Feather",
    "sands": "Storm Cage",
    "goblet": "Scarlet Vessel",
    "circlet": "Ornate Kabuto"
  },
  {
    "id": 19,
    "name": "Husk of Opulent Dreams",
    "scanner_key": "HuskOfOpulentDreams",
    "set_bonus": [
        {
            "stat": "def%",
            "value": 30,
            "req": 2
        },
        {
            "stat": "On field, Geo damage grants 6% DEF and 6% Geo DMG. Off field, stack is gained every 3sec. Max 4 stacks.",
            "value": 0,
            "req": 4,
            "apply": { "id": 493, "option": 0 }
        }
    ],
    "flower": "Bloom Times",
    "feather": "Plume of Luxury",
    "sands": "Song of Life",
    "goblet": "Calabash of Awakening",
    "circlet": "Skeletal Hat"
  },
  {
    "id": 20,
    "name": "Ocean-Hued Clam",
    "scanner_key": "OceanHuedClam",
    "set_bonus": [
        {
            "stat": "healing",
            "value": 15,
            "req": 2
        },
        {
            "stat": "Healing accumulates Stacks. After 3s, heals for 50% and damages for 90% of Stacks.",
            "value": 0,
            "req": 4
        }
    ],
    "flower": "Sea-Dyed Blossom",
    "feather": "Deep Palace's Plume",
    "sands": "Cowry of Parting",
    "goblet": "Pearl Cage",
    "circlet": "Crown of Watatsumi"
  },
  {
    "id": 21,
    "name": "Vermillion Hereafter",
    "scanner_key": "VermillionHereafter",
    "set_bonus": [
        {
            "stat": "atk%",
            "value": 18,
            "req": 2
        },
        {
            "stat": "Using Elemental Burst increases attack by 8% and additional 10% every time Hp decreases. Max 4 stacks.",
            "value": 0,
            "req": 4,
            "apply": { "id": 536, "option": 0 }
        }
    ],
    "flower": "Flowering Life",
    "feather": "Feather of Nascent Light",
    "sands": "Solar Relic",
    "goblet": "Moment of the Pact",
    "circlet": "Thundering Poise"
  },
  {
    "id": 22,
    "name": "Echoes of an Offering",
    "scanner_key": "EchoesOfAnOffering",
    "set_bonus": [
        {
            "stat": "atk%",
            "value": 18,
            "req": 2
        },
        {
            "stat": "36% chance to increase Normal Attack DMG by 60% of ATK. Chance increases by 20% until triggered.",
            "value": 0,
            "req": 4,
            "apply": { "id": 537, "option": 0 }
        }
    ],
    "flower": "Soulscent Bloom",
    "feather": "Jade Leaf",
    "sands": "Symbol of Felicitation",
    "goblet": "Chalice of the Font",
    "circlet": "Flowing Rings"
  },
]

module.exports = {
  MAIN_STAT_PROGRESSION,
  POSSIBLE_SUBSTAT_ROLLS,
  ARTIFACT_SETS
};