import {ClassFeatures} from "./classFeatures.js"

// Namespace Configuration Values
export const DNG = {};


/**
 * The set of Ability Scores used within the system
 * @type {Object}
 */
DNG.abilities = {
  "str": "DNG.AbilityStr",
  "dex": "DNG.AbilityDex",
  "mag": "DNG.AbilityMag",
  "int": "DNG.AbilityInt",
  "wis": "DNG.AbilityWis",
  "cha": "DNG.AbilityCha"
};

DNG.abilityAbbreviations = {
  "str": "DNG.AbilityStrAbbr",
  "dex": "DNG.AbilityDexAbbr",
  "mag": "DNG.AbilityMagAbbr",
  "int": "DNG.AbilityIntAbbr",
  "wis": "DNG.AbilityWisAbbr",
  "cha": "DNG.AbilityChaAbbr"
};

/* -------------------------------------------- */

/**
 * Character alignment options
 * @type {Object}
 */
DNG.alignments = {
  'lg': "DNG.AlignmentLG",
  'ng': "DNG.AlignmentNG",
  'cg': "DNG.AlignmentCG",
  'ln': "DNG.AlignmentLN",
  'tn': "DNG.AlignmentTN",
  'cn': "DNG.AlignmentCN",
  'le': "DNG.AlignmentLE",
  'ne': "DNG.AlignmentNE",
  'ce': "DNG.AlignmentCE"
};


DNG.weaponProficiencies = {
  "sim": "DNG.WeaponSimpleProficiency",
  "mar": "DNG.WeaponMartialProficiency"
};

DNG.toolProficiencies = {
  "art": "DNG.ToolArtisans",
  "disg": "DNG.ToolDisguiseKit",
  "forg": "DNG.ToolForgeryKit",
  "game": "DNG.ToolGamingSet",
  "herb": "DNG.ToolHerbalismKit",
  "music": "DNG.ToolMusicalInstrument",
  "navg": "DNG.ToolNavigators",
  "pois": "DNG.ToolPoisonersKit",
  "thief": "DNG.ToolThieves",
  "vehicle": "DNG.ToolVehicle"
};


/* -------------------------------------------- */

/**
 * This Object defines the various lengths of time which can occur
 * @type {Object}
 */
DNG.timePeriods = {
  "inst": "DNG.TimeInst",
  "turn": "DNG.TimeTurn",
  "round": "DNG.TimeRound",
  "minute": "DNG.TimeMinute",
  "hour": "DNG.TimeHour",
  "day": "DNG.TimeDay",
  "month": "DNG.TimeMonth",
  "year": "DNG.TimeYear",
  "perm": "DNG.TimePerm",
  "spec": "DNG.Special"
};


/* -------------------------------------------- */

/**
 * This describes the ways that an ability can be activated
 * @type {Object}
 */
DNG.abilityActivationTypes = {
  "none": "DNG.None",
  "action": "DNG.Action",
  "bonus": "DNG.BonusAction",
  "reaction": "DNG.Reaction",
  "minute": DNG.timePeriods.minute,
  "hour": DNG.timePeriods.hour,
  "day": DNG.timePeriods.day,
  "special": DNG.timePeriods.spec,
  "legendary": "DNG.LegAct",
  "lair": "DNG.LairAct",
  "crew": "DNG.VehicleCrewAction"
};

/* -------------------------------------------- */


DNG.abilityConsumptionTypes = {
  "ammo": "DNG.ConsumeAmmunition",
  "attribute": "DNG.ConsumeAttribute",
  "material": "DNG.ConsumeMaterial",
  "charges": "DNG.ConsumeCharges"
};


/* -------------------------------------------- */

// Creature Sizes
DNG.actorSizes = {
  "tiny": "DNG.SizeTiny",
  "sm": "DNG.SizeSmall",
  "med": "DNG.SizeMedium",
  "lg": "DNG.SizeLarge",
  "huge": "DNG.SizeHuge",
  "grg": "DNG.SizeGargantuan"
};

DNG.tokenSizes = {
  "tiny": 1,
  "sm": 1,
  "med": 1,
  "lg": 2,
  "huge": 3,
  "grg": 4
};

/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
DNG.itemActionTypes = {
  "mwak": "DNG.ActionMWAK",
  "rwak": "DNG.ActionRWAK",
  "msak": "DNG.ActionMSAK",
  "rsak": "DNG.ActionRSAK",
  "save": "DNG.ActionSave",
  "heal": "DNG.ActionHeal",
  "abil": "DNG.ActionAbil",
  "util": "DNG.ActionUtil",
  "other": "DNG.ActionOther"
};

/* -------------------------------------------- */

DNG.itemCapacityTypes = {
  "items": "DNG.ItemContainerCapacityItems",
  "weight": "DNG.ItemContainerCapacityWeight"
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability
 * @type {Object}
 */
DNG.limitedUsePeriods = {
  "sr": "DNG.ShortRest",
  "lr": "DNG.LongRest",
  "day": "DNG.Day",
  "charges": "DNG.Charges"
};


/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can ber worn by the character
 * @type {Object}
 */
DNG.equipmentTypes = {
  "light": "DNG.EquipmentLight",
  "medium": "DNG.EquipmentMedium",
  "heavy": "DNG.EquipmentHeavy",
  "bonus": "DNG.EquipmentBonus",
  "natural": "DNG.EquipmentNatural",
  "shield": "DNG.EquipmentShield",
  "clothing": "DNG.EquipmentClothing",
  "trinket": "DNG.EquipmentTrinket",
  "vehicle": "DNG.EquipmentVehicle"
};


/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have
 * @type {Object}
 */
DNG.armorProficiencies = {
  "lgt": DNG.equipmentTypes.light,
  "med": DNG.equipmentTypes.medium,
  "hvy": DNG.equipmentTypes.heavy,
  "shl": "DNG.EquipmentShieldProficiency"
};


/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system
 * @type {Object}
 */
DNG.consumableTypes = {
  "ammo": "DNG.ConsumableAmmunition",
  "potion": "DNG.ConsumablePotion",
  "poison": "DNG.ConsumablePoison",
  "food": "DNG.ConsumableFood",
  "scroll": "DNG.ConsumableScroll",
  "wand": "DNG.ConsumableWand",
  "rod": "DNG.ConsumableRod",
  "trinket": "DNG.ConsumableTrinket"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the 5e system
 * @type {Object}
 */
DNG.currencies = {
  "pp": "DNG.CurrencyPP",
  "gp": "DNG.CurrencyGP",
  "ep": "DNG.CurrencyEP",
  "sp": "DNG.CurrencySP",
  "cp": "DNG.CurrencyCP",
};


/**
 * Define the upwards-conversion rules for registered currency types
 * @type {{string, object}}
 */
DNG.currencyConversion = {
  cp: {into: "sp", each: 10},
  sp: {into: "ep", each: 5 },
  ep: {into: "gp", each: 2 },
  gp: {into: "pp", each: 10}
};

/* -------------------------------------------- */


// Damage Types
DNG.damageTypes = {
  "acid": "DNG.DamageAcid",
  "bludgeoning": "DNG.DamageBludgeoning",
  "cold": "DNG.DamageCold",
  "fire": "DNG.DamageFire",
  "force": "DNG.DamageForce",
  "lightning": "DNG.DamageLightning",
  "necrotic": "DNG.DamageNecrotic",
  "piercing": "DNG.DamagePiercing",
  "poison": "DNG.DamagePoison",
  "psychic": "DNG.DamagePsychic",
  "radiant": "DNG.DamageRadiant",
  "slashing": "DNG.DamageSlashing",
  "thunder": "DNG.DamageThunder"
};

// Damage Resistance Types
DNG.damageResistanceTypes = mergeObject(duplicate(DNG.damageTypes), {
  "physical": "DNG.DamagePhysical"
});


/* -------------------------------------------- */


/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
DNG.movementUnits = {
  "ft": "DNG.DistFt",
  "mi": "DNG.DistMi"
}

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from DNG.movementUnits
 * @type {Object<string,string>}
 */
DNG.distanceUnits = {
  "none": "DNG.None",
  "self": "DNG.DistSelf",
  "touch": "DNG.DistTouch",
  "spec": "DNG.Special",
  "any": "DNG.DistAny"
};
for ( let [k, v] of Object.entries(DNG.movementUnits) ) {
  DNG.distanceUnits[k] = v;
}

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
 */
DNG.encumbrance = {
  currencyPerWeight: 50,
  strMultiplier: 15,
  vehicleWeightMultiplier: 2000 // 2000 lbs in a ton
};

/* -------------------------------------------- */

/**
 * This Object defines the types of single or area targets which can be applied
 * @type {Object}
 */
DNG.targetTypes = {
  "none": "DNG.None",
  "self": "DNG.TargetSelf",
  "creature": "DNG.TargetCreature",
  "ally": "DNG.TargetAlly",
  "enemy": "DNG.TargetEnemy",
  "object": "DNG.TargetObject",
  "space": "DNG.TargetSpace",
  "radius": "DNG.TargetRadius",
  "sphere": "DNG.TargetSphere",
  "cylinder": "DNG.TargetCylinder",
  "cone": "DNG.TargetCone",
  "square": "DNG.TargetSquare",
  "cube": "DNG.TargetCube",
  "line": "DNG.TargetLine",
  "wall": "DNG.TargetWall"
};


/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are DNG target types and the values are MeasuredTemplate shape types
 * @type {Object}
 */
DNG.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};


/* -------------------------------------------- */

// Healing Types
DNG.healingTypes = {
  "healing": "DNG.Healing",
  "temphp": "DNG.HealingTemp"
};


/* -------------------------------------------- */


/**
 * Enumerate the denominations of hit dice which can apply to classes
 * @type {Array.<string>}
 */
DNG.hitDieTypes = ["d6", "d8", "d10", "d12"];


/* -------------------------------------------- */

/**
 * Character senses options
 * @type {Object}
 */
DNG.senses = {
  "bs": "DNG.SenseBS",
  "dv": "DNG.SenseDV",
  "ts": "DNG.SenseTS",
  "tr": "DNG.SenseTR"
};


/* -------------------------------------------- */

/**
 * The set of skill which can be trained
 * @type {Object}
 */
DNG.skills = {
  "acr": "DNG.SkillAcr",
  "hak": "DNG.SkillHak",
  "arc": "DNG.SkillArc",
  "ath": "DNG.SkillAth",
  "dec": "DNG.SkillDec",
  "his": "DNG.SkillHis",
  "ins": "DNG.SkillIns",
  "itm": "DNG.SkillItm",
  "inv": "DNG.SkillInv",
  "med": "DNG.SkillMed",
  "nat": "DNG.SkillNat",
  "prc": "DNG.SkillPrc",
  "prf": "DNG.SkillPrf",
  "per": "DNG.SkillPer",
  "eng": "DNG.SkillEng",
  "slt": "DNG.SkillSlt",
  "ste": "DNG.SkillSte",
  "sur": "DNG.SkillSur"
};


/* -------------------------------------------- */

DNG.spellPreparationModes = {
  "prepared": "DNG.SpellPrepPrepared",
  "pact": "DNG.PactMagic",
  "always": "DNG.SpellPrepAlways",
  "atwill": "DNG.SpellPrepAtWill",
  "innate": "DNG.SpellPrepInnate"
};

DNG.spellUpcastModes = ["always", "pact", "prepared"];

DNG.spellProgression = {
  "none": "DNG.SpellNone",
  "full": "DNG.SpellProgFull",
  "half": "DNG.SpellProgHalf",
  "third": "DNG.SpellProgThird",
  "pact": "DNG.SpellProgPact",
  "artificer": "DNG.SpellProgArt"
};

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed
 * @type {Object}
 */
DNG.spellScalingModes = {
  "none": "DNG.SpellNone",
  "cantrip": "DNG.SpellCantrip",
  "level": "DNG.SpellLevel"
};

/* -------------------------------------------- */


/**
 * Define the set of types which a weapon item can take
 * @type {Object}
 */
DNG.weaponTypes = {
  "simpleM": "DNG.WeaponSimpleM",
  "simpleR": "DNG.WeaponSimpleR",
  "martialM": "DNG.WeaponMartialM",
  "martialR": "DNG.WeaponMartialR",
  "natural": "DNG.WeaponNatural",
  "improv": "DNG.WeaponImprov",
  "siege": "DNG.WeaponSiege"
};


/* -------------------------------------------- */

/**
 * Define the set of weapon property flags which can exist on a weapon
 * @type {Object}
 */
DNG.weaponProperties = {
  "amm": "DNG.WeaponPropertiesAmm",
  "hvy": "DNG.WeaponPropertiesHvy",
  "fin": "DNG.WeaponPropertiesFin",
  "fir": "DNG.WeaponPropertiesFir",
  "foc": "DNG.WeaponPropertiesFoc",
  "lgt": "DNG.WeaponPropertiesLgt",
  "lod": "DNG.WeaponPropertiesLod",
  "rch": "DNG.WeaponPropertiesRch",
  "rel": "DNG.WeaponPropertiesRel",
  "ret": "DNG.WeaponPropertiesRet",
  "spc": "DNG.WeaponPropertiesSpc",
  "thr": "DNG.WeaponPropertiesThr",
  "two": "DNG.WeaponPropertiesTwo",
  "ver": "DNG.WeaponPropertiesVer"
};


// Spell Components
DNG.spellComponents = {
  "V": "DNG.ComponentVerbal",
  "S": "DNG.ComponentSomatic",
  "M": "DNG.ComponentMaterial"
};

// Spell Schools
DNG.spellSchools = {
  "abj": "DNG.SchoolAbj",
  "con": "DNG.SchoolCon",
  "div": "DNG.SchoolDiv",
  "enc": "DNG.SchoolEnc",
  "evo": "DNG.SchoolEvo",
  "ill": "DNG.SchoolIll",
  "nec": "DNG.SchoolNec",
  "trs": "DNG.SchoolTrs"
};

// Spell Levels
DNG.spellLevels = {
  0: "DNG.SpellLevel0",
  1: "DNG.SpellLevel1",
  2: "DNG.SpellLevel2",
  3: "DNG.SpellLevel3",
  4: "DNG.SpellLevel4",
  5: "DNG.SpellLevel5",
  6: "DNG.SpellLevel6",
  7: "DNG.SpellLevel7",
  8: "DNG.SpellLevel8",
  9: "DNG.SpellLevel9"
};

// Spell Scroll Compendium UUIDs
DNG.spellScrollIds = {
  0: 'Compendium.dng.items.rQ6sO7HDWzqMhSI3',
  1: 'Compendium.dng.items.9GSfMg0VOA2b4uFN',
  2: 'Compendium.dng.items.XdDp6CKh9qEvPTuS',
  3: 'Compendium.dng.items.hqVKZie7x9w3Kqds',
  4: 'Compendium.dng.items.DM7hzgL836ZyUFB1',
  5: 'Compendium.dng.items.wa1VF8TXHmkrrR35',
  6: 'Compendium.dng.items.tI3rWx4bxefNCexS',
  7: 'Compendium.dng.items.mtyw4NS1s7j2EJaD',
  8: 'Compendium.dng.items.aOrinPg7yuDZEuWr',
  9: 'Compendium.dng.items.O4YbkJkLlnsgUszZ'
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {Array[]}
 */
DNG.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

// Polymorph options.
DNG.polymorphSettings = {
  keepPhysical: 'DNG.PolymorphKeepPhysical',
  keepMental: 'DNG.PolymorphKeepMental',
  keepSaves: 'DNG.PolymorphKeepSaves',
  keepSkills: 'DNG.PolymorphKeepSkills',
  mergeSaves: 'DNG.PolymorphMergeSaves',
  mergeSkills: 'DNG.PolymorphMergeSkills',
  keepClass: 'DNG.PolymorphKeepClass',
  keepFeats: 'DNG.PolymorphKeepFeats',
  keepSpells: 'DNG.PolymorphKeepSpells',
  keepItems: 'DNG.PolymorphKeepItems',
  keepBio: 'DNG.PolymorphKeepBio',
  keepVision: 'DNG.PolymorphKeepVision'
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
DNG.proficiencyLevels = {
  0: "DNG.NotProficient",
  1: "DNG.Proficient",
  0.5: "DNG.HalfProficient",
  2: "DNG.Expertise"
};

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object.
 * In cases where multiple pieces of cover are
 * in play, we take the highest value.
 */
DNG.cover = {
  0: 'DNG.None',
  .5: 'DNG.CoverHalf',
  .75: 'DNG.CoverThreeQuarters',
  1: 'DNG.CoverTotal'
};

/* -------------------------------------------- */


// Condition Types
DNG.conditionTypes = {
  "blinded": "DNG.ConBlinded",
  "charmed": "DNG.ConCharmed",
  "deafened": "DNG.ConDeafened",
  "diseased": "DNG.ConDiseased",
  "exhaustion": "DNG.ConExhaustion",
  "frightened": "DNG.ConFrightened",
  "grappled": "DNG.ConGrappled",
  "incapacitated": "DNG.ConIncapacitated",
  "invisible": "DNG.ConInvisible",
  "paralyzed": "DNG.ConParalyzed",
  "petrified": "DNG.ConPetrified",
  "poisoned": "DNG.ConPoisoned",
  "prone": "DNG.ConProne",
  "restrained": "DNG.ConRestrained",
  "stunned": "DNG.ConStunned",
  "unconscious": "DNG.ConUnconscious"
};

// Languages
DNG.languages = {
  "common": "DNG.LanguagesCommon",
  "aarakocra": "DNG.LanguagesAarakocra",
  "abyssal": "DNG.LanguagesAbyssal",
  "aquan": "DNG.LanguagesAquan",
  "auran": "DNG.LanguagesAuran",
  "celestial": "DNG.LanguagesCelestial",
  "deep": "DNG.LanguagesDeepSpeech",
  "draconic": "DNG.LanguagesDraconic",
  "druidic": "DNG.LanguagesDruidic",
  "dwarvish": "DNG.LanguagesDwarvish",
  "elvish": "DNG.LanguagesElvish",
  "giant": "DNG.LanguagesGiant",
  "gith": "DNG.LanguagesGith",
  "gnomish": "DNG.LanguagesGnomish",
  "goblin": "DNG.LanguagesGoblin",
  "gnoll": "DNG.LanguagesGnoll",
  "halfling": "DNG.LanguagesHalfling",
  "ignan": "DNG.LanguagesIgnan",
  "infernal": "DNG.LanguagesInfernal",
  "orc": "DNG.LanguagesOrc",
  "primordial": "DNG.LanguagesPrimordial",
  "sylvan": "DNG.LanguagesSylvan",
  "terran": "DNG.LanguagesTerran",
  "cant": "DNG.LanguagesThievesCant",
  "undercommon": "DNG.LanguagesUndercommon"
};

// Character Level XP Requirements
DNG.CHARACTER_EXP_LEVELS =  [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
;

// Challenge Rating XP Levels
DNG.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

// Character Features Per Class And Level
DNG.classFeatures = ClassFeatures;

// Configure Optional Character Flags
DNG.characterFlags = {
  "diamondSoul": {
    name: "DNG.FlagsDiamondSoul",
    hint: "DNG.FlagsDiamondSoulHint",
    section: "Feats",
    type: Boolean
  },
  "elvenAccuracy": {
    name: "DNG.FlagsElvenAccuracy",
    hint: "DNG.FlagsElvenAccuracyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "halflingLucky": {
    name: "DNG.FlagsHalflingLucky",
    hint: "DNG.FlagsHalflingLuckyHint",
    section: "Racial Traits",
    type: Boolean
  },
  "initiativeAdv": {
    name: "DNG.FlagsInitiativeAdv",
    hint: "DNG.FlagsInitiativeAdvHint",
    section: "Feats",
    type: Boolean
  },
  "initiativeAlert": {
    name: "DNG.FlagsAlert",
    hint: "DNG.FlagsAlertHint",
    section: "Feats",
    type: Boolean
  },
  "jackOfAllTrades": {
    name: "DNG.FlagsJOAT",
    hint: "DNG.FlagsJOATHint",
    section: "Feats",
    type: Boolean
  },
  "observantFeat": {
    name: "DNG.FlagsObservant",
    hint: "DNG.FlagsObservantHint",
    skills: ['prc','inv'],
    section: "Feats",
    type: Boolean
  },
  "powerfulBuild": {
    name: "DNG.FlagsPowerfulBuild",
    hint: "DNG.FlagsPowerfulBuildHint",
    section: "Racial Traits",
    type: Boolean
  },
  "reliableTalent": {
    name: "DNG.FlagsReliableTalent",
    hint: "DNG.FlagsReliableTalentHint",
    section: "Feats",
    type: Boolean
  },
  "remarkableAthlete": {
    name: "DNG.FlagsRemarkableAthlete",
    hint: "DNG.FlagsRemarkableAthleteHint",
    abilities: ['str','dex','con'],
    section: "Feats",
    type: Boolean
  },
  "weaponCriticalThreshold": {
    name: "DNG.FlagsWeaponCritThreshold",
    hint: "DNG.FlagsWeaponCritThresholdHint",
    section: "Feats",
    type: Number,
    placeholder: 20
  },
  "spellCriticalThreshold": {
    name: "DNG.FlagsSpellCritThreshold",
    hint: "DNG.FlagsSpellCritThresholdHint",
    section: "Feats",
    type: Number,
    placeholder: 20
  },
  "meleeCriticalDamageDice": {
    name: "DNG.FlagsMeleeCriticalDice",
    hint: "DNG.FlagsMeleeCriticalDiceHint",
    section: "Feats",
    type: Number,
    placeholder: 0
  },
};

// Configure allowed status flags
DNG.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(DNG.characterFlags));
