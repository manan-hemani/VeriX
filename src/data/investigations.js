const investigations = [
  {
    id: "9984-CDF",
    status: "PARTIALLY_SUPPORTED",

    claim: "Drinking coffee before exercise improves athletic performance.",

    confidence: 68.4,
    confidenceLabel: "High Empirical Split",

    evidenceSummary:
      "Acute ingestion (3–6 mg/kg) reliably increases peak muscular force (3–7%), but claims of zero cardiovascular strain are contradicted by hemodynamic trials in hypertensive cohorts.",

    sources: 13,
    subclaims: 4,
    searches: 5,

    searchType: "Multi-Hop",

    tags: ["#Biomedical", "#Ergogenics", "#PubMed", "#SerpApi"],

    date: "28 Sep 2026",
    cycle: "05/05",
  },

  {
    id: "8812-GED",
    status: "CONTRADICTED",

    claim:
      "Stratospheric aerosol injection reliably stabilizes global temperatures without triggering monsoon disruption.",

    confidence: 91.2,
    confidenceLabel: "Contradiction Weight",

    evidenceSummary:
      "While radiative forcing models show mean global cooling, high-resolution regional climate models identify substantial probability of devastating shifts in South Asian monsoon precipitation patterns.",

    sources: 28,
    subclaims: 6,
    searches: 9,

    searchType: "Multi-Hop",

    tags: ["#ClimateScience", "#AerosolScience", "#Geoengineering"],

    date: "25 Sep 2026",
    cycle: "04/04",
  },

  {
    id: "7431-CWI",
    status: "SUPPORTED",

    claim:
      "Cold water immersion immediately following resistance training blunts muscular hypertrophy.",

    confidence: 84.8,
    confidenceLabel: "Verification Weight",

    evidenceSummary:
      "Consistently corroborated across multiple clinical trials: post-exercise cold immersion attenuates muscle protein synthesis and satellite cell proliferation, diminishing 8-week hypertrophy gains by approximately 3–5%.",

    sources: 19,
    subclaims: 3,
    searches: 4,

    searchType: "Multi-Hop",

    tags: ["#SportsPhysiology", "#Hypertrophy", "#ClinicalCohort"],

    date: "21 Sep 2026",
    cycle: "03/03",
  },

  {
    id: "6199-FAST",
    status: "UNCERTAIN",

    claim:
      "Intermittent fasting confers cellular longevity benefits independent of caloric restriction.",

    confidence: 42.1,
    confidenceLabel: "Evidence Gap",

    evidenceSummary:
      "Robust rodent autophagy data exists, but human-isocaloric trials remain statistically inconclusive due to methodological variance and insufficient biomarker longitudinal tracking.",

    sources: 22,
    subclaims: 5,
    searches: 8,

    searchType: "Multi-Hop",

    tags: ["#Metabolism", "#Autophagy", "#Longevity", "#ClinicalStudy"],

    date: "20 Sep 2026",
    cycle: "05/05",
  },

  {
    id: "5022-RF",
    status: "CONTRADICTED",

    claim:
      "5G millimeter wave radiation causes adverse cellular DNA strand breaks.",

    confidence: 98.6,
    confidenceLabel: "Verification Weight",

    evidenceSummary:
      "Non-ionizing photon energy in 24–100 GHz is physically incapable of breaking covalent molecular bonds; no thermal or non-thermal genotoxicity mechanism has been established.",

    sources: 34,
    subclaims: 4,
    searches: 7,

    searchType: "Multi-Hop",

    tags: ["#BioPhysics", "#Telecommunications", "#RadiationSafety"],

    date: "18 Sep 2026",
    cycle: "04/04",
  },

  {
    id: "4198-CR",
    status: "SUPPORTED",

    claim:
      "Creatine monohydrate supplementation enhances cognitive function during sleep deprivation.",

    confidence: 88.3,
    confidenceLabel: "Verification Weight",

    evidenceSummary:
      "Brain phosphocreatine replenishment during acute metabolic stress significantly reduces cognitive fatigue and executive function decline in double-blind placebo-controlled studies.",

    sources: 16,
    subclaims: 3,
    searches: 5,

    searchType: "Multi-Hop",

    tags: ["#Neuroscience", "#CognitiveResilience", "#DoubleBlind"],

    date: "16 Sep 2026",
    cycle: "03/03",
  },
];

export default investigations;
