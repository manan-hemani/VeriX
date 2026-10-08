import geminiService from "./gemini.service.js";
import groqService from "./groq.service.js";
import ApiError from "../utils/ApiError.js";

const GEMINI_RETRIES = Number(process.env.AI_GEMINI_RETRIES || 2);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//  Determines whether a Gemini error is worth retrying.
const isRetryableGeminiError = (error) => {
  const message = error?.message?.toLowerCase() || "";

  const cause = error?.cause?.message?.toLowerCase() || "";

  const combined = `${message} ${cause}`;

  return (
    combined.includes("503") ||
    combined.includes("unavailable") ||
    combined.includes("high demand") ||
    combined.includes("429") ||
    combined.includes("resource_exhausted") ||
    combined.includes("fetch failed") ||
    combined.includes("timeout") ||
    combined.includes("timed out") ||
    combined.includes("econnreset") ||
    combined.includes("etimedout")
  );
};

//  Calls Gemini with retry logic.
const generateWithGemini = async (prompt, schema, options) => {
  let lastError = null;

  for (let attempt = 1; attempt <= GEMINI_RETRIES + 1; attempt++) {
    try {
      console.log(`[AI] Gemini attempt ${attempt}/${GEMINI_RETRIES + 1}`);

      const result = await geminiService.generateJSON(prompt, schema, options);

      return {
        ...result,

        provider: "Gemini",
        model: process.env.GEMINI_MODEL,
        fallbackUsed: false,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;

      console.error(`[AI] Gemini attempt ${attempt} failed:`, error.message);

      //  If the error isn't transient,
      //  don't waste time retrying.
      if (!isRetryableGeminiError(error)) {
        throw error;
      }

      //  Don't sleep after the final attempt.
      if (attempt <= GEMINI_RETRIES) {
        const delay = 1000 * Math.pow(2, attempt - 1);

        console.log(`[AI] Waiting ${delay}ms before Gemini retry...`);

        await sleep(delay);
      }
    }
  }

  throw lastError;
};

//  Main AI entry point.
//  Gemini → Groq
const generateJSON = async (prompt, schema, options = {}) => {
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "AI prompt cannot be empty");
  }

  if (!schema) {
    throw new ApiError(400, "AI response schema is required");
  }

  //   GEMINI
  try {
    const result = await generateWithGemini(prompt, schema, options);

    console.log("[AI] Gemini succeeded.");

    return result;
  } catch (geminiError) {
    console.error("[AI] GEMINI FAILED");

    console.error("Message:", geminiError.message);

    console.error("Cause:", geminiError.cause);

    console.error("Switching to Groq...");

    console.error("================================\n");
  }

  // GROQ
  try {
    const result = await groqService.generateJSON(prompt, schema, options);
    console.log(result);
    console.log("[AI] Groq fallback succeeded.");

    return result;
  } catch (groqError) {
    console.error("[AI] GROQ FALLBACK FAILED");

    console.error("Message:", groqError.message);

    console.error("================================\n");

    throw new ApiError(502, "All AI providers failed", {
      providers: ["Gemini", "Groq"],

      lastProvider: "Groq",

      originalError:
        process.env.NODE_ENV !== "production" ? groqError.message : undefined,
    });
  }
};

// Analyze evidence
const analyzeEvidence = async ({ claim, subclaim, searchResults }) => {
  if (!claim || !claim.trim()) {
    throw new ApiError(400, "Claim is required");
  }

  if (!subclaim || !subclaim.trim()) {
    throw new ApiError(400, "Subclaim is required");
  }

  const prompt = `
You are an evidence analysis component
inside TruthTrail.

Main claim:
"${claim}"

Subclaim:
"${subclaim}"

Search results:
${JSON.stringify(searchResults, null, 2)}

Analyze the search results.

For each relevant source determine:

- relationship
- relevance
- evidence summary
- limitations

Possible relationship values:

SUPPORTS
CONTRADICTS
PARTIALLY_SUPPORTS
UNCERTAIN
IRRELEVANT

Do not invent information that is not present
in the search results.

Return only JSON.
`;

  const schema = {
    type: "object",

    properties: {
      evidence: {
        type: "array",

        items: {
          type: "object",

          properties: {
            source: {
              type: "string",
            },

            url: {
              type: "string",
            },

            relationship: {
              type: "string",

              enum: [
                "SUPPORTS",
                "CONTRADICTS",
                "PARTIALLY_SUPPORTS",
                "UNCERTAIN",
                "IRRELEVANT",
              ],
            },

            relevance: {
              type: "string",

              enum: ["HIGH", "MEDIUM", "LOW"],
            },

            summary: {
              type: "string",
            },

            limitations: {
              type: "string",
            },
          },

          required: [
            "source",
            "url",
            "relationship",
            "relevance",
            "summary",
            "limitations",
          ],
        },
      },
    },

    required: ["evidence"],
  };

  const result = await generateJSON(prompt, schema);

  return result.data;
};

export default {
  generateJSON,
  analyzeEvidence,
};
