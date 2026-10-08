import { GoogleGenAI } from "@google/genai";
import ApiError from "../utils/ApiError.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

//  Generate basic text
const generateText = async (prompt, options = {}) => {
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Gemini prompt cannot be empty");
  }
  try {
    const response = await ai.models.generateContent({
      model: MODEL,

      contents: prompt,

      config: {
        temperature: options.temperature ?? 0.2,

        maxOutputTokens: options.maxOutputTokens ?? 2048,

        ...(options.systemInstruction && {
          systemInstruction: options.systemInstruction,
        }),
      },
    });

    const text = response.text;

    if (!text) {
      throw new ApiError(502, "Gemini returned an empty response");
    }

    return {
      text,
      raw: response,
    };
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "Failed to communicate with Gemini", {
      provider: "Gemini",
      originalError:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

//  Generate structured JSON
const generateJSON = async (prompt, schema, options = {}) => {
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Gemini prompt cannot be empty");
  }

  if (!schema) {
    throw new ApiError(400, "Gemini response schema is required");
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,

      contents: prompt,

      config: {
        temperature: options.temperature ?? 0.1,

        maxOutputTokens: options.maxOutputTokens ?? 4096,

        responseMimeType: "application/json",

        responseSchema: schema,

        ...(options.systemInstruction && {
          systemInstruction: options.systemInstruction,
        }),
      },
    });

    const text = response.text;
    if (!text) {
      throw new ApiError(502, "Gemini returned an empty JSON response");
    }

    try {
      const parsed = JSON.parse(text);
      return {
        data: parsed,
        raw: response,
      };
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError.message);

      throw new ApiError(502, "Gemini returned invalid JSON", {
        rawResponse: process.env.NODE_ENV !== "production" ? text : undefined,
      });
    }
  } catch (error) {
    console.error("Gemini Structured API Error");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Cause:", error.cause);
    console.error("Stack:", error.stack);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "Failed to generate structured Gemini response", {
      provider: "Gemini",
      originalError:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
      cause:
        process.env.NODE_ENV !== "production"
          ? error.cause?.message || String(error.cause)
          : undefined,
    });
  }
};

//  Analyze a claim
const analyzeClaim = async (claim) => {
  if (!claim || !claim.trim()) {
    throw new ApiError(400, "Claim is required");
  }
  const prompt = `
You are VeriX, an AI claim investigation
planning assistant.

Analyze the following claim:

"${claim}"

Break this claim into independently
verifiable subclaims.

For each subclaim determine:
1. What exactly needs to be verified.
2. What kind of evidence would be useful.
3. Whether supporting evidence should be searched.
4. Whether contradictory evidence should be searched.

Do not decide whether the claim is true yet.

Return only structured JSON.
`;

  const schema = {
    type: "object",

    properties: {
      claim: {
        type: "string",
      },

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

            searchSupporting: {
              type: "boolean",
            },

            searchContradictory: {
              type: "boolean",
            },
          },

          required: [
            "id",
            "text",
            "evidenceNeeded",
            "searchSupporting",
            "searchContradictory",
          ],
        },
      },
    },

    required: ["claim", "subclaims"],
  };

  const result = await generateJSON(prompt, schema);

  return result.data;
};

//  Analyze evidence
const analyzeEvidence = async ({ claim, subclaim, searchResults }) => {
  const prompt = `
You are an evidence analysis component
inside VeriX.

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
  generateText,
  generateJSON,
  analyzeClaim,
  analyzeEvidence,
};
