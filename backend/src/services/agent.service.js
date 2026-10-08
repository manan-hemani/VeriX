import crypto from "crypto";
// import geminiService from "./gemini.service.js";
import aiService from "./ai.service.js";
import serpApiService from "./serpApi.service.js";
import Investigation from "../models/invsetigationHistory.model.js";
import ApiError from "../utils/ApiError.js";

// CONFIGURATION
const MAX_CYCLES = Number(process.env.AGENT_MAX_CYCLES || 5);
const MIN_RELEVANT_EVIDENCE = Number(
  process.env.AGENT_MIN_RELEVANT_EVIDENCE || 3,
);
const MAX_SEARCH_RESULTS_PER_CYCLE = Number(
  process.env.AGENT_MAX_SEARCH_RESULTS || 8,
);

// ENUMS

const STATUS = {
  SUPPORTED: "SUPPORTED",
  CONTRADICTED: "CONTRADICTED",
  PARTIALLY_SUPPORTED: "PARTIALLY_SUPPORTED",
  UNCERTAIN: "UNCERTAIN",
  UNVERIFIED: "UNVERIFIED",
};

const RELATIONSHIP = {
  SUPPORTS: "SUPPORTS",
  CONTRADICTS: "CONTRADICTS",
  PARTIALLY_SUPPORTS: "PARTIALLY_SUPPORTS",
  UNCERTAIN: "UNCERTAIN",
  IRRELEVANT: "IRRELEVANT",
};

const ACTION = {
  SEARCH_WEB: "SEARCH_WEB",
  SEARCH_SUPPORTING: "SEARCH_SUPPORTING",
  SEARCH_CONTRADICTORY: "SEARCH_CONTRADICTORY",
  SEARCH_ACADEMIC: "SEARCH_ACADEMIC",
  SEARCH_NEWS: "SEARCH_NEWS",
  FINISH: "FINISH",
};

// UTILITY HELPERS
function generateId(prefix = "") {
  const id = crypto.randomUUID();

  return prefix ? `${prefix}-${id}` : id;
}

function cleanText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStatus(status) {
  if (!status) {
    return STATUS.UNCERTAIN;
  }

  const normalized = String(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (Object.values(STATUS).includes(normalized)) {
    return normalized;
  }

  return STATUS.UNCERTAIN;
}

function normalizeRelationship(relationship) {
  if (!relationship) {
    return RELATIONSHIP.UNCERTAIN;
  }

  const normalized = String(relationship)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (Object.values(RELATIONSHIP).includes(normalized)) {
    return normalized;
  }

  return RELATIONSHIP.UNCERTAIN;
}

function normalizeAction(action) {
  if (!action) {
    return ACTION.SEARCH_WEB;
  }

  const normalized = String(action)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (Object.values(ACTION).includes(normalized)) {
    return normalized;
  }

  return ACTION.SEARCH_WEB;
}

function normalizeQuery(query) {
  return cleanText(query).replace(/\s+/g, " ").trim();
}

function calculateCycleString(current, max) {
  return `${String(current).padStart(2, "0")}/${String(max).padStart(2, "0")}`;
}

function getSearchType(searches) {
  if (!searches.length) {
    return "Single-Hop";
  }

  if (searches.length === 1) {
    return "Single-Hop";
  }

  return "Multi-Hop";
}

function formatInvestigationDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// STRUCTURED OUTPUT SCHEMAS
const SUBCLAIMS_SCHEMA = {
  type: "object",
  properties: {
    subclaims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          text: {
            type: "string",
          },
          evidenceNeeded: {
            type: "string",
          },
        },
        required: ["id", "text", "evidenceNeeded"],
      },
    },
  },
  required: ["subclaims"],
};
const PLANNER_SCHEMA = {
  type: "object",
  properties: {
    action: {
      type: "string",
      enum: [
        "SEARCH_WEB",
        "SEARCH_SUPPORTING",
        "SEARCH_CONTRADICTORY",
        "SEARCH_ACADEMIC",
        "SEARCH_NEWS",
        "FINISH",
      ],
    },

    query: {
      type: "string",
    },

    reason: {
      type: "string",
    },

    focus: {
      type: "string",
      enum: ["SUPPORT", "CONTRADICTION", "ACADEMIC", "NEWS", "GENERAL", "GAP"],
    },
  },

  required: ["action", "query", "reason", "focus"],
};

const SUFFICIENCY_SCHEMA = {
  type: "object",

  properties: {
    enoughEvidence: {
      type: "boolean",
    },

    recommendedAction: {
      type: "string",

      enum: [
        "SEARCH_WEB",
        "SEARCH_SUPPORTING",
        "SEARCH_CONTRADICTORY",
        "SEARCH_ACADEMIC",
        "SEARCH_NEWS",
        "FINISH",
      ],
    },

    reason: {
      type: "string",
    },

    missingEvidence: {
      type: "array",
      items: {
        type: "string",
      },
    },

    contradictionFound: {
      type: "boolean",
    },

    confidence: {
      type: "number",
    },
  },

  required: [
    "enoughEvidence",
    "recommendedAction",
    "reason",
    "missingEvidence",
    "contradictionFound",
    "confidence",
  ],
};

const FINAL_VERDICT_SCHEMA = {
  type: "object",

  properties: {
    status: {
      type: "string",

      enum: [
        "SUPPORTED",
        "CONTRADICTED",
        "PARTIALLY_SUPPORTED",
        "UNCERTAIN",
        "UNVERIFIED",
      ],
    },

    confidence: {
      type: "number",
    },

    confidenceLabel: {
      type: "string",
    },

    evidenceSummary: {
      type: "string",
    },

    contradictions: {
      type: "array",

      items: {
        type: "object",

        properties: {
          description: {
            type: "string",
          },

          evidenceIds: {
            type: "array",

            items: {
              type: "string",
            },
          },
        },

        required: ["description", "evidenceIds"],
      },
    },

    evidenceGaps: {
      type: "array",

      items: {
        type: "string",
      },
    },

    tags: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "status",
    "confidence",
    "confidenceLabel",
    "evidenceSummary",
    "contradictions",
    "evidenceGaps",
    "tags",
  ],
};

// INITIAL INVESTIGATION STATE
function createInitialState(claim) {
  return {
    claim,

    subclaims: [],

    evidence: [],

    searches: [],

    contradictions: [],

    evidenceGaps: [],

    activity: [],

    currentCycle: 0,

    maxCycles: MAX_CYCLES,

    status: STATUS.UNCERTAIN,

    confidence: 0,

    confidenceLabel: "Evidence Pending",

    evidenceSummary: "",

    tags: [],

    finished: false,

    finishReason: "",
  };
}

// ACTIVITY TRACKING
function addActivity(state, activity) {
  state.activity.push({
    id: generateId("activity"),

    cycle: state.currentCycle,

    timestamp: new Date(),

    ...activity,
  });
}

// CLAIM DECOMPOSITION
async function decomposeClaim(claim, state) {
  addActivity(state, {
    type: "CLAIM_RECEIVED",

    action: "CLAIM_DECOMPOSITION",

    message: "Claim received and sent for decomposition.",
  });

  // const result = await geminiService.analyzeClaim(claim);
  const result = await aiService.generateJSON(claim, SUBCLAIMS_SCHEMA);

  const rawSubclaims =
    result?.subclaims || result?.claims || result?.components || [];

  state.subclaims = normalizeArray(rawSubclaims)
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: generateId(`subclaim-${index + 1}`),

          text: item,

          status: STATUS.UNCERTAIN,
        };
      }

      return {
        id: item.id || generateId(`subclaim-${index + 1}`),

        text:
          cleanText(item.text) ||
          cleanText(item.claim) ||
          cleanText(item.description),

        status: normalizeStatus(item.status),
      };
    })
    .filter((item) => item.text);

  if (!state.subclaims.length) {
    state.subclaims = [
      {
        id: generateId("subclaim-1"),

        text: claim,

        status: STATUS.UNCERTAIN,
      },
    ];
  }

  addActivity(state, {
    type: "CLAIM_DECOMPOSED",

    action: "DECOMPOSE_CLAIM",

    message: `Claim decomposed into ${state.subclaims.length} subclaim(s).`,

    details: {
      subclaimsCount: state.subclaims.length,
    },
  });

  return result;
}

// SEARCH PLANNER
async function createInitialSearchPlan(claim, state) {
  const subclaimsText = state.subclaims
    .map((subclaim, index) => {
      return `${index + 1}. ${subclaim.text}`;
    })
    .join("\n");

  const prompt = `
You are the investigation planner for VeriX.

Your job is NOT to decide whether the claim is true.

Your job is to decide the best FIRST web investigation action.

CLAIM:
${claim}

SUBCLAIMS:
${subclaimsText}

The investigation uses SerpApi.

Available actions:

SEARCH_WEB
SEARCH_SUPPORTING
SEARCH_CONTRADICTORY
SEARCH_ACADEMIC
SEARCH_NEWS
FINISH

Rules:

1. Start with a search unless the claim clearly cannot be investigated.
2. Prefer SEARCH_ACADEMIC for scientific, medical, technical, or research claims.
3. Prefer SEARCH_SUPPORTING when the claim needs direct evidence supporting it.
4. Prefer SEARCH_CONTRADICTORY when the claim contains absolute wording or potentially controversial assertions.
5. Prefer SEARCH_NEWS for recent events or time-sensitive claims.
6. Use concise, high-value search queries.
7. Never claim the statement is true or false at this planning stage.
8. The query should be directly usable by a search engine.
9. Return only the requested structured JSON.

Choose the best initial action.
`;

  // const plan = await geminiService.generateJSON(prompt, PLANNER_SCHEMA, {
  //   temperature: 0.2,
  //   maxOutputTokens: 500,
  // });
  const plan = await aiService.generateJSON(prompt, PLANNER_SCHEMA, {
    temperature: 0.2,
    maxOutputTokens: 500,
  });

  const normalizedPlan = {
    action: normalizeAction(plan?.action),

    query: normalizeQuery(plan?.query) || claim,

    reason: cleanText(plan?.reason) || "Initial evidence search is required.",

    focus: cleanText(plan?.focus, "GENERAL").toUpperCase(),
  };

  addActivity(state, {
    type: "SEARCH_PLANNED",

    action: normalizedPlan.action,

    message: normalizedPlan.reason,

    details: {
      query: normalizedPlan.query,

      focus: normalizedPlan.focus,
    },
  });

  return normalizedPlan;
}

// NEXT ACTION PLANNER
async function decideNextAction(state) {
  const evidenceSummary = state.evidence
    .map((evidence) => {
      return `
Evidence ID: ${evidence.id}
Source: ${evidence.source}
Relationship: ${evidence.relationship}
Title: ${evidence.title}
Summary: ${evidence.summary}
Limitations: ${evidence.limitations}
`;
    })
    .join("\n");

  const searchesSummary = state.searches
    .map((search) => {
      return `
Query: ${search.query}
Type: ${search.type}
Results found: ${search.resultsFound}
`;
    })
    .join("\n");

  const subclaimsSummary = state.subclaims
    .map((subclaim) => {
      return `${subclaim.text} → ${subclaim.status}`;
    })
    .join("\n");

  const prompt = `
You are the decision-making agent inside VeriX.

You are investigating this claim:

"${state.claim}"

SUBCLAIMS:
${subclaimsSummary}

SEARCHES ALREADY PERFORMED:
${searchesSummary || "None"}

EVIDENCE COLLECTED:
${evidenceSummary || "None"}

CURRENT CYCLE:
${state.currentCycle}

MAXIMUM CYCLES:
${state.maxCycles}

Your job is to decide the NEXT investigation action.

Available actions:

SEARCH_WEB
SEARCH_SUPPORTING
SEARCH_CONTRADICTORY
SEARCH_ACADEMIC
SEARCH_NEWS
FINISH

IMPORTANT:

- Do not repeat an already-used search query.
- If supporting evidence exists but contradiction has not been investigated, search for contradictory evidence.
- If evidence is mostly weak or general, search for stronger/academic evidence.
- If sources disagree, investigate the disagreement.
- If there is enough high-quality evidence to reasonably classify the claim, FINISH.
- If evidence gaps remain but another useful search can address them, continue.
- Do not search indefinitely.
- Never return hidden reasoning or chain-of-thought.
- Return only a concise reason describing the next action.

Choose a useful search query if another search is required.
`;

  // return geminiService.generateJSON(prompt, PLANNER_SCHEMA, {
  //   temperature: 0.2,
  //   maxOutputTokens: 500,
  // });
  return aiService.generateJSON(prompt, PLANNER_SCHEMA, {
    temperature: 0.2,
    maxOutputTokens: 500,
  });
}

// EXECUTE SERPAPI ACTION
async function executeSearchAction({ action, query, state }) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    throw new ApiError(400, "Agent generated an empty search query.");
  }

  let results;

  switch (action) {
    case ACTION.SEARCH_SUPPORTING:
      results = await serpApiService.searchSupporting(normalizedQuery, {
        numResults: MAX_SEARCH_RESULTS_PER_CYCLE,
      });
      break;

    case ACTION.SEARCH_CONTRADICTORY:
      results = await serpApiService.searchContradictory(normalizedQuery, {
        numResults: MAX_SEARCH_RESULTS_PER_CYCLE,
      });
      break;

    case ACTION.SEARCH_ACADEMIC:
      results = await serpApiService.searchAcademic(normalizedQuery, {
        numResults: MAX_SEARCH_RESULTS_PER_CYCLE,
      });
      break;

    case ACTION.SEARCH_NEWS:
      results = await serpApiService.searchNews(normalizedQuery, {
        numResults: MAX_SEARCH_RESULTS_PER_CYCLE,
      });
      break;

    case ACTION.SEARCH_WEB:
    default:
      results = await serpApiService.searchWeb(normalizedQuery, {
        numResults: MAX_SEARCH_RESULTS_PER_CYCLE,
      });
      break;
  }

  const normalizedResults = normalizeSearchResults(results);

  state.searches.push({
    query: normalizedQuery,

    type: action,

    resultsFound: normalizedResults.length,

    timestamp: new Date(),
  });

  addActivity(state, {
    type: "SEARCH_COMPLETED",

    action,

    message: `${normalizedResults.length} search result(s) found.`,

    details: {
      query: normalizedQuery,

      resultsFound: normalizedResults.length,
    },
  });

  return normalizedResults;
}

// SEARCH RESULT NORMALIZATION
function normalizeSearchResults(results) {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.results)) {
    return results.results;
  }

  if (Array.isArray(results?.organicResults)) {
    return results.organicResults;
  }

  if (Array.isArray(results?.organic_results)) {
    return results.organic_results;
  }

  if (results && typeof results === "object") {
    return Object.values(results).filter((item) => {
      return (
        item &&
        typeof item === "object" &&
        (item.title || item.link || item.snippet)
      );
    });
  }

  return [];
}

// EVIDENCE ANALYSIS
async function analyzeSearchResults({ claim, state, searchResults, query }) {
  if (!searchResults.length) {
    addActivity(state, {
      type: "EVIDENCE_ANALYSIS",

      action: "NO_EVIDENCE",

      message: "No usable search results were returned for this search.",
    });

    return {
      evidence: [],
    };
  }

  const primarySubclaim =
    state.subclaims[state.currentCycle % state.subclaims.length];

  addActivity(state, {
    type: "EVIDENCE_ANALYSIS",

    action: "ANALYZE_EVIDENCE",

    message: "Gemini is analyzing the retrieved sources.",
  });

  // const result = await geminiService.analyzeEvidence({
  //   claim,

  //   subclaim: primarySubclaim?.text || claim,

  //   searchResults,
  // });
  const result = await aiService.analyzeEvidence({
    claim,

    subclaim: primarySubclaim?.text || claim,

    searchResults,
  });

  const analyzedEvidence =
    result?.evidence || result?.sources || result?.analyses || [];

  const evidence = mapAnalyzedEvidence(analyzedEvidence, searchResults, query);

  state.evidence.push(...evidence);

  // Update subclaim status using evidence associated with
  // the current cycle.
  updateSubclaimStatus(state, evidence);

  addActivity(state, {
    type: "EVIDENCE_ANALYZED",

    action: "CLASSIFY_SOURCES",

    message: `${evidence.length} evidence item(s) classified.`,

    details: {
      evidenceCount: evidence.length,
    },
  });

  return {
    raw: result,

    evidence,
  };
}

// MAP GEMINI ANALYSIS → DATABASE EVIDENCE
function mapAnalyzedEvidence(analyzedEvidence, searchResults, query) {
  const normalizedAnalysis = normalizeArray(analyzedEvidence);

  return normalizedAnalysis
    .map((analysis, index) => {
      const searchResult = findMatchingSearchResult(
        analysis,
        searchResults,
        index,
      );

      if (!searchResult) {
        return null;
      }

      const relationship = normalizeRelationship(
        analysis.relationship || analysis.relation || analysis.classification,
      );

      const summary =
        cleanText(analysis.summary || analysis.evidence || analysis.reason) ||
        cleanText(searchResult.snippet);

      const limitations = cleanText(
        analysis.limitations || analysis.limitation,
      );

      return {
        id: generateId("evidence"),

        title: cleanText(searchResult.title) || "Untitled source",

        source:
          cleanText(searchResult.source || searchResult.displayedLink) ||
          extractDomain(searchResult.link),

        url: cleanText(searchResult.link || searchResult.url),

        publishedDate: cleanText(
          searchResult.date || searchResult.publishedDate,
        ),

        relationship,

        summary,

        limitations,

        query,
      };
    })
    .filter(Boolean);
}

// MATCH GEMINI EVIDENCE TO SERP RESULT
function findMatchingSearchResult(analysis, searchResults, index) {
  const url = cleanText(analysis.url || analysis.link || analysis.sourceUrl);

  if (url) {
    const exactMatch = searchResults.find((result) => {
      const resultUrl = cleanText(result.link || result.url);

      return resultUrl === url;
    });

    if (exactMatch) {
      return exactMatch;
    }
  }

  const title = cleanText(analysis.title || analysis.sourceTitle).toLowerCase();

  if (title) {
    const titleMatch = searchResults.find((result) => {
      return cleanText(result.title).toLowerCase() === title;
    });

    if (titleMatch) {
      return titleMatch;
    }
  }

  return searchResults[index] || null;
}

// UPDATE SUBCLAIM STATUS
function updateSubclaimStatus(state, evidence) {
  if (!evidence.length || !state.subclaims.length) {
    return;
  }

  const relationshipScore = {
    [RELATIONSHIP.SUPPORTS]: 1,

    [RELATIONSHIP.PARTIALLY_SUPPORTS]: 0.5,

    [RELATIONSHIP.CONTRADICTS]: -1,

    [RELATIONSHIP.UNCERTAIN]: 0,

    [RELATIONSHIP.IRRELEVANT]: 0,
  };

  const score = evidence.reduce((total, item) => {
    return total + (relationshipScore[item.relationship] || 0);
  }, 0);

  const currentSubclaim =
    state.subclaims[state.currentCycle % state.subclaims.length];

  if (!currentSubclaim) {
    return;
  }

  if (score >= 1.5) {
    currentSubclaim.status = STATUS.SUPPORTED;

    return;
  }

  if (score <= -1.5) {
    currentSubclaim.status = STATUS.CONTRADICTED;

    return;
  }

  if (score !== 0) {
    currentSubclaim.status = STATUS.PARTIALLY_SUPPORTED;

    return;
  }

  currentSubclaim.status = STATUS.UNCERTAIN;
}

// EVIDENCE SUFFICIENCY CHECK
async function evaluateEvidenceSufficiency(state) {
  const evidenceText = state.evidence
    .map((evidence) => {
      return `
ID: ${evidence.id}
TITLE: ${evidence.title}
SOURCE: ${evidence.source}
RELATIONSHIP: ${evidence.relationship}
SUMMARY: ${evidence.summary}
LIMITATIONS: ${evidence.limitations}
`;
    })
    .join("\n");

  const prompt = `
You are the evidence sufficiency evaluator for VeriX.

CLAIM:
${state.claim}

SUBCLAIMS:
${state.subclaims.map((item) => `${item.text} → ${item.status}`).join("\n")}

EVIDENCE:
${evidenceText || "No evidence yet."}

SEARCHES PERFORMED:
${state.searches.length}

CURRENT CYCLE:
${state.currentCycle}

MAX CYCLES:
${state.maxCycles}

Determine whether the investigation has enough evidence to produce a responsible verdict.

Important rules:

1. Do not require absolute certainty.
2. A claim may be SUPPORTED even when limitations exist.
3. A claim may be PARTIALLY_SUPPORTED when evidence supports part of it but not all of it.
4. CONTRADICTED requires meaningful evidence against the claim.
5. UNCERTAIN should be used when evidence is insufficient or conflicting.
6. UNVERIFIED should be used when practically no useful evidence exists.
7. If supporting evidence exists but contradictory evidence has not been adequately checked, recommend a contradictory search.
8. If evidence conflicts, investigate the conflict when another useful search is possible.
9. Stop when additional searches are unlikely to materially change the result.
10. Never provide hidden chain-of-thought. Return only the requested structured result.

Choose the next action if more investigation is required.
`;

  // return geminiService.generateJSON(prompt, SUFFICIENCY_SCHEMA, {
  //   temperature: 0.1,
  //   maxOutputTokens: 500,
  // });
  return aiService.generateJSON(prompt, SUFFICIENCY_SCHEMA, {
    temperature: 0.1,
    maxOutputTokens: 500,
  });
}

// FINAL VERDICT
async function generateFinalVerdict(state) {
  const evidenceText = state.evidence
    .map((evidence) => {
      return `
Evidence ID: ${evidence.id}
Title: ${evidence.title}
Source: ${evidence.source}
URL: ${evidence.url}
Relationship: ${evidence.relationship}
Summary: ${evidence.summary}
Limitations: ${evidence.limitations}
`;
    })
    .join("\n");

  const prompt = `
You are the final evidence evaluator for VeriX.

You must produce a responsible classification of the following claim.

CLAIM:
${state.claim}

SUBCLAIMS:
${state.subclaims
  .map((item) => {
    return `${item.id}: ${item.text} → ${item.status}`;
  })
  .join("\n")}

EVIDENCE:
${evidenceText || "No useful evidence was collected."}

SEARCHES:
${state.searches
  .map((search) => {
    return `${search.type}: ${search.query}`;
  })
  .join("\n")}

Classify the claim using exactly one:

SUPPORTED
CONTRADICTED
PARTIALLY_SUPPORTED
UNCERTAIN
UNVERIFIED

Rules:

SUPPORTED:
Evidence substantially supports the claim.

CONTRADICTED:
Credible evidence substantially conflicts with the claim.

PARTIALLY_SUPPORTED:
Some important parts are supported but the complete claim is too broad, conditional, or partly contradicted.

UNCERTAIN:
Evidence exists but does not allow a reliable classification.

UNVERIFIED:
There is not enough usable evidence to meaningfully evaluate the claim.

Confidence must be between 0 and 100.

The evidence summary must be concise and explain the main reason for the classification.

Evidence gaps must describe what remains unknown.

Tags should be short topic labels such as:
#ClimateScience
#Medicine
#Exercise
#Technology

Do not invent evidence, sources, studies, or URLs.

Do not reveal chain-of-thought.
Return only the requested JSON.
`;

  // const verdict = await geminiService.generateJSON(
  //   prompt,
  //   FINAL_VERDICT_SCHEMA,
  //   {
  //     temperature: 0.1,
  //     maxOutputTokens: 1000,
  //   },
  // );
  const verdict = await aiService.generateJSON(prompt, FINAL_VERDICT_SCHEMA, {
    temperature: 0.1,
    maxOutputTokens: 1000,
  });

  return {
    status: normalizeStatus(verdict?.status),

    confidence: clampConfidence(verdict?.confidence),

    confidenceLabel:
      cleanText(verdict?.confidenceLabel) || "Evidence Assessment",

    evidenceSummary:
      cleanText(verdict?.evidenceSummary) ||
      "The investigation completed without a detailed evidence summary.",

    contradictions: normalizeArray(verdict?.contradictions).map((item) => ({
      description: cleanText(item?.description),

      evidenceIds: normalizeArray(item?.evidenceIds).map(String),
    })),

    evidenceGaps: normalizeArray(verdict?.evidenceGaps)
      .map((gap) => cleanText(gap))
      .filter(Boolean),

    tags: normalizeArray(verdict?.tags)
      .map((tag) => cleanText(tag))
      .filter(Boolean),
  };
}

// CONFIDENCE
function clampConfidence(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
}

// BUILD CONTRADICTIONS
function buildContradictions(state, verdict) {
  const contradictions = normalizeArray(verdict.contradictions);

  const contradictionEvidence = state.evidence.filter((evidence) => {
    return evidence.relationship === RELATIONSHIP.CONTRADICTS;
  });

  // If Gemini explicitly identified contradictions,
  // preserve them.
  if (contradictions.length) {
    return contradictions;
  }

  // Otherwise create lightweight contradiction
  // records from classified evidence.
  if (contradictionEvidence.length >= 2) {
    return [
      {
        description:
          "Multiple evidence sources contain findings that conflict with the investigated claim or with other evidence.",

        evidenceIds: contradictionEvidence.map((item) => item.id),
      },
    ];
  }

  return [];
}

// BUILD GRAPH
function buildGraph(state) {
  const nodes = [];
  const edges = [];

  // MAIN CLAIM
  const claimNodeId = "claim-main";

  nodes.push({
    id: claimNodeId,

    type: "claim",

    data: {
      label: state.claim,

      status: state.status,

      confidence: state.confidence,
    },

    position: {
      x: 0,

      y: 0,
    },
  });

  // SUBCLAIMS
  state.subclaims.forEach((subclaim, index) => {
    const nodeId = `subclaim-${subclaim.id}`;

    nodes.push({
      id: nodeId,

      type: "subclaim",

      data: {
        label: subclaim.text,

        status: subclaim.status,
      },

      position: {
        x: index * 300 - 300,

        y: 250,
      },
    });

    edges.push({
      id: `edge-${claimNodeId}-${nodeId}`,

      source: claimNodeId,

      target: nodeId,

      type: "smoothstep",

      data: {
        relationship: "HAS_SUBCLAIM",
      },
    });
  });

  // EVIDENCE
  state.evidence.forEach((evidence, index) => {
    const nodeId = `evidence-${evidence.id}`;

    nodes.push({
      id: nodeId,

      type: "evidence",

      data: {
        label: evidence.title,

        source: evidence.source,

        relationship: evidence.relationship,

        url: evidence.url,

        summary: evidence.summary,
      },

      position: {
        x: (index % 3) * 350 - 350,

        y: 550 + Math.floor(index / 3) * 220,
      },
    });

    const subclaim = state.subclaims[index % state.subclaims.length];

    const sourceNodeId = subclaim ? `subclaim-${subclaim.id}` : claimNodeId;

    edges.push({
      id: `edge-${sourceNodeId}-${nodeId}`,

      source: sourceNodeId,

      target: nodeId,

      type: "smoothstep",

      data: {
        relationship: evidence.relationship,
      },
    });
  });

  return {
    nodes,

    edges,
  };
}

// DEDUPLICATE EVIDENCE
function deduplicateEvidence(evidence) {
  const seenUrls = new Set();

  const seenTitles = new Set();

  const result = [];

  for (const item of evidence) {
    const url = cleanText(item.url);

    const title = cleanText(item.title).toLowerCase();

    const urlKey = url;

    const titleKey = title;

    if (urlKey && seenUrls.has(urlKey)) {
      continue;
    }

    if (titleKey && seenTitles.has(titleKey)) {
      continue;
    }

    if (urlKey) {
      seenUrls.add(urlKey);
    }

    if (titleKey) {
      seenTitles.add(titleKey);
    }

    result.push(item);
  }

  return result;
}

// DOMAIN EXTRACTION
function extractDomain(url) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// QUERY DUPLICATION CHECK
function hasAlreadySearched(state, query) {
  const normalized = normalizeQuery(query).toLowerCase();

  return state.searches.some(
    (search) => normalizeQuery(search.query).toLowerCase() === normalized,
  );
}

// FALLBACK SEARCH PLAN
function createFallbackPlan(state) {
  const hasSupport = state.evidence.some(
    (item) =>
      item.relationship === RELATIONSHIP.SUPPORTS ||
      item.relationship === RELATIONSHIP.PARTIALLY_SUPPORTS,
  );

  const hasContradiction = state.evidence.some(
    (item) => item.relationship === RELATIONSHIP.CONTRADICTS,
  );

  if (hasSupport && !hasContradiction) {
    return {
      action: ACTION.SEARCH_CONTRADICTORY,

      query: `${state.claim} evidence against contradictory findings criticism limitations`,

      reason:
        "Supporting evidence exists, but contradictory evidence has not yet been sufficiently investigated.",

      focus: "CONTRADICTION",
    };
  }

  if (!hasSupport && !hasContradiction) {
    return {
      action: ACTION.SEARCH_ACADEMIC,

      query: `${state.claim} systematic review evidence`,

      reason:
        "Current evidence is insufficient, so a stronger evidence source should be investigated.",

      focus: "ACADEMIC",
    };
  }

  return {
    action: ACTION.SEARCH_WEB,

    query: `${state.claim} evidence research findings`,

    reason:
      "Additional general evidence is required to resolve remaining uncertainty.",

    focus: "GENERAL",
  };
}

// BUILD DATABASE DOCUMENT
function buildInvestigationDocument(state, verdict) {
  const graph = buildGraph(state);

  const contradictions = buildContradictions(state, verdict);

  return {
    investigationId: generateInvestigationId(),

    claim: state.claim,

    status: verdict.status,

    confidence: verdict.confidence,

    confidenceLabel: verdict.confidenceLabel,

    evidenceSummary: verdict.evidenceSummary,

    sourcesCount: state.evidence.length,

    subclaimsCount: state.subclaims.length,

    searchesCount: state.searches.length,

    searchType: getSearchType(state.searches),

    tags: verdict.tags,

    cycle: {
      current: state.currentCycle,

      max: state.maxCycles,
    },

    subclaims: state.subclaims,

    evidence: state.evidence,

    searches: state.searches,

    contradictions,

    evidenceGaps: verdict.evidenceGaps,

    graph,

    activity: state.activity,

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}

// INVESTIGATION ID
function generateInvestigationId() {
  const part1 = Math.floor(1000 + Math.random() * 9000);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const part2 = Array.from(
    { length: 3 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");

  return `${part1}-${part2}`;
}

// SAVE INVESTIGATION
async function saveInvestigation(document) {
  const investigation = await Investigation.create(document);

  return investigation;
}

// FRONTEND SUMMARY
function buildFrontendSummary(investigation) {
  return {
    id: investigation.investigationId,

    investigationId: investigation.investigationId,

    status: investigation.status,

    claim: investigation.claim,

    confidence: investigation.confidence,

    confidenceLabel: investigation.confidenceLabel,

    evidenceSummary: investigation.evidenceSummary,

    sources: investigation.sourcesCount,

    subclaims: investigation.subclaimsCount,

    searches: investigation.searchesCount,

    searchType: investigation.searchType,

    tags: investigation.tags,

    date: formatInvestigationDate(investigation.createdAt),

    cycle: calculateCycleString(
      investigation.cycle.current,

      investigation.cycle.max,
    ),
  };
}

// FULL INVESTIGATION
async function investigateClaim(claim, options = {}) {
  const normalizedClaim = cleanText(claim);

  if (!normalizedClaim) {
    throw new ApiError(400, "Claim is required.");
  }

  if (normalizedClaim.length < 5) {
    throw new ApiError(400, "Claim must contain at least 5 characters.");
  }

  if (normalizedClaim.length > 2000) {
    throw new ApiError(400, "Claim must not exceed 2000 characters.");
  }

  const state = createInitialState(normalizedClaim);

  try {
    // STEP 1 — DECOMPOSE CLAIM
    await decomposeClaim(normalizedClaim, state);

    // STEP 2 — INITIAL SEARCH PLAN
    let plan = await createInitialSearchPlan(normalizedClaim, state);
    // STEP 3 — AGENT LOOP

    while (!state.finished && state.currentCycle < state.maxCycles) {
      state.currentCycle += 1;

      addActivity(state, {
        type: "CYCLE_STARTED",

        action: "INVESTIGATION_CYCLE",

        message: `Investigation cycle ${state.currentCycle}/${state.maxCycles} started.`,
      });

      let action = normalizeAction(plan?.action);

      let query = normalizeQuery(plan?.query);

      // SAFETY: FINISH ACTION

      if (action === ACTION.FINISH) {
        state.finished = true;

        state.finishReason =
          cleanText(plan?.reason) ||
          "The agent determined that enough evidence had been collected.";

        addActivity(state, {
          type: "INVESTIGATION_FINISHED",

          action: ACTION.FINISH,

          message: state.finishReason,
        });

        break;
      }

      // FALLBACK IF GEMINI DID NOT PRODUCE A GOOD QUERY

      if (!query || hasAlreadySearched(state, query)) {
        const fallback = createFallbackPlan(state);

        action = fallback.action;

        query = fallback.query;

        addActivity(state, {
          type: "PLAN_FALLBACK",

          action,

          message:
            "A fallback search strategy was selected because the planned query was empty or already used.",
        });
      }

      // RECORD PLANNED SEARCH

      addActivity(state, {
        type: "SEARCH_STARTED",

        action,

        message: plan?.reason || "Searching for additional evidence.",

        details: {
          query,
        },
      });

      // SERPAPI

      const searchResults = await executeSearchAction({
        action,

        query,

        state,
      });

      // GEMINI EVIDENCE ANALYSIS

      await analyzeSearchResults({
        claim: normalizedClaim,

        state,

        searchResults,

        query,
      });

      // REMOVE DUPLICATE SOURCES

      state.evidence = deduplicateEvidence(state.evidence);

      // STOP IF MAX CYCLES REACHED

      if (state.currentCycle >= state.maxCycles) {
        addActivity(state, {
          type: "MAX_CYCLES_REACHED",

          action: "FINISH",

          message: "Maximum investigation cycles reached.",
        });

        break;
      }

      // EVALUATE WHETHER MORE EVIDENCE IS REQUIRED

      const sufficiency = await evaluateEvidenceSufficiency(state);

      if (sufficiency?.enoughEvidence === true) {
        state.finished = true;

        state.finishReason =
          cleanText(sufficiency.reason) ||
          "Evidence is sufficient for a final assessment.";

        addActivity(state, {
          type: "EVIDENCE_SUFFICIENT",

          action: ACTION.FINISH,

          message: state.finishReason,
        });

        break;
      }

      // COLLECT EVIDENCE GAPS

      const missingEvidence = normalizeArray(sufficiency?.missingEvidence)
        .map((item) => cleanText(item))
        .filter(Boolean);

      state.evidenceGaps = Array.from(
        new Set([...state.evidenceGaps, ...missingEvidence]),
      );

      // NEXT ACTION

      let nextPlan = sufficiency?.recommendedAction
        ? {
            action: sufficiency.recommendedAction,

            query: "",

            reason: sufficiency.reason || "Additional evidence is required.",

            focus: sufficiency.contradictionFound ? "CONTRADICTION" : "GAP",
          }
        : null;

      // If the sufficiency evaluator says
      // "search" but gives no query, let the
      // dedicated planner generate one.
      if (!nextPlan || !nextPlan.action) {
        nextPlan = await decideNextAction(state);
      }

      // ASK FULL PLANNER FOR A QUERY

      if (
        nextPlan.action !== ACTION.FINISH &&
        !normalizeQuery(nextPlan.query)
      ) {
        const planner = await decideNextAction(state);

        nextPlan = {
          ...nextPlan,

          ...planner,
        };
      }

      // FALLBACK AGAIN IF NECESSARY

      if (nextPlan.action === ACTION.FINISH) {
        state.finished = true;

        state.finishReason =
          cleanText(nextPlan.reason) ||
          "The agent determined that the available evidence is sufficient.";

        break;
      }

      if (
        !normalizeQuery(nextPlan.query) ||
        hasAlreadySearched(state, nextPlan.query)
      ) {
        nextPlan = createFallbackPlan(state);
      }

      plan = nextPlan;
    }

    // STEP 4 — FINAL VERDICT

    addActivity(state, {
      type: "FINAL_ANALYSIS",

      action: "FINAL_VERDICT",

      message: "Generating final investigation verdict.",
    });

    const verdict = await generateFinalVerdict(state);

    state.status = verdict.status;

    state.confidence = verdict.confidence;

    state.confidenceLabel = verdict.confidenceLabel;

    state.evidenceSummary = verdict.evidenceSummary;

    state.contradictions = buildContradictions(state, verdict);

    state.evidenceGaps = Array.from(
      new Set([...state.evidenceGaps, ...verdict.evidenceGaps]),
    );

    state.tags = verdict.tags;

    // STEP 5 — BUILD GRAPH

    addActivity(state, {
      type: "GRAPH_BUILT",

      action: "BUILD_EVIDENCE_GRAPH",

      message: "Evidence graph generated from the investigation state.",
    });

    // STEP 6 — SAVE

    const document = buildInvestigationDocument(state, verdict);

    const savedInvestigation = await saveInvestigation(document);

    // STEP 7 — COMPLETE

    addActivity(state, {
      type: "INVESTIGATION_SAVED",

      action: "SAVE_INVESTIGATION",

      message: "Investigation saved successfully.",
    });

    // The activity generated after build/save is not
    // currently persisted because the document was
    // already created. This is intentionally kept
    // lightweight for the MVP.

    return {
      investigation: savedInvestigation,

      summary: buildFrontendSummary(savedInvestigation),

      full: savedInvestigation.toObject
        ? savedInvestigation.toObject()
        : savedInvestigation,
    };
  } catch (error) {
    addActivity(state, {
      type: "INVESTIGATION_ERROR",

      action: "ERROR",

      message: cleanText(error?.message) || "Investigation failed.",
    });

    throw error;
  }
}

// GET INVESTIGATION BY ID

async function getInvestigationById(investigationId) {
  const investigation = await Investigation.findOne({
    investigationId,
  }).lean();

  if (!investigation) {
    throw new ApiError(404, "Investigation not found.");
  }

  return investigation;
}

// GET INVESTIGATION LIST

async function getInvestigations(options = {}) {
  const limit = Math.min(Number(options.limit) || 20, 100);

  const page = Math.max(Number(options.page) || 1, 1);

  const skip = (page - 1) * limit;

  const investigations = await Investigation.find({})
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Investigation.countDocuments();

  return {
    investigations: investigations.map(buildFrontendSummary),

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
}

// EXPORT

export default {
  investigateClaim,

  getInvestigationById,

  getInvestigations,

  // Exported for testing/debugging.
  buildGraph,

  buildFrontendSummary,
};
