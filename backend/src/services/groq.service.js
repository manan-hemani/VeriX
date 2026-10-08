import Groq from "groq-sdk";
import ApiError from "../utils/ApiError.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

//  Converts Gemini's responseSchema format
//  into standard JSON Schema format expected by Groq.
const convertGeminiSchemaToGroq = (schema) => {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  const type = schema.type?.toString().toUpperCase();

  // OBJECT
  if (type === "OBJECT") {
    const properties = {};

    for (const [key, value] of Object.entries(schema.properties || {})) {
      properties[key] = convertGeminiSchemaToGroq(value);
    }

    return {
      type: "object",
      properties,
      required: schema.required || Object.keys(properties),
      additionalProperties: false,
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // ARRAY
  if (type === "ARRAY") {
    return {
      type: "array",
      items: convertGeminiSchemaToGroq(
        schema.items || {
          type: "STRING",
        },
      ),
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // STRING
  if (type === "STRING") {
    return {
      type: "string",
      ...(schema.enum && {
        enum: schema.enum,
      }),
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // NUMBER
  if (type === "NUMBER") {
    return {
      type: "number",
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // INTEGER
  if (type === "INTEGER") {
    return {
      type: "integer",
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // BOOLEAN
  if (type === "BOOLEAN") {
    return {
      type: "boolean",
      ...(schema.description && {
        description: schema.description,
      }),
    };
  }

  // Fallback
  return schema;
};

const generateJSON = async (prompt, schema, options = {}) => {
  console.log("[Groq] Prompt:", prompt);
  console.log("[Groq] Schema:", schema);
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Groq prompt cannot be empty");
  }

  if (!schema) {
    throw new ApiError(400, "Groq response schema is required");
  }

  try {
    const groqSchema = convertGeminiSchemaToGroq(schema);
    console.log("[Groq] Converted Schema:", groqSchema);
    console.log("[Groq] Using model:", MODEL);

    const response = await groq.chat.completions.create({
      model: MODEL,

      messages: [
        ...(options.systemInstruction
          ? [
              {
                role: "system",
                content: options.systemInstruction,
              },
            ]
          : []),

        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: options.temperature ?? 0.1,

      max_tokens: 4096,

      response_format: {
        type: "json_schema",

        json_schema: {
          name: options.schemaName || "truthtrail_response",

          strict: true,

          schema: groqSchema,
        },
      },
    });

    const text = response.choices?.[0]?.message?.content;

    console.log("[Groq] Raw Response:", text);

    if (!text) {
      throw new ApiError(502, "Groq returned an empty JSON response");
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("[Groq] JSON Parse Error:", parseError.message);

      throw new ApiError(502, "Groq returned invalid JSON", {
        rawResponse: process.env.NODE_ENV !== "production" ? text : undefined,
      });
    }

    console.log("[Groq] JSON Parse Result:", parsed);

    return {
      data: parsed,
      raw: response,

      provider: "Groq",
      model: MODEL,
      fallbackUsed: true,
    };
  } catch (error) {
    console.error("[Groq] Structured API Error:", error.message);

    console.error("[Groq] Cause:", error.cause);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "Failed to generate structured Groq response", {
      provider: "Groq",

      originalError:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

export default {
  generateJSON,
};
