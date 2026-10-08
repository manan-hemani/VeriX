import geminiService from "../services/gemini.service.js";
import { successResponse } from "../utils/ApiResponse.js";

//  POST /api/gemini/test
export const testGemini = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      message: "prompt is required and must be a string",
    });
  }

  const result = await geminiService.generateText(prompt);

  return successResponse({
    res,

    message: "Gemini response generated successfully",

    data: {
      text: result.text,
    },
  });
};

//  POST /api/gemini/analyze-claim
export const analyzeClaim = async (req, res) => {
  const { claim } = req.body;

  const result = await geminiService.analyzeClaim(claim);
  console.log("Analyze Claim Result CONTROLLER:", result);
  return successResponse({
    res,

    message: "Claim analyzed successfully",

    data: result,
  });
};

//  POST /api/gemini/analyze-evidence
export const analyzeEvidence = async (req, res) => {
  const { claim, subclaim, searchResults } = req.body;

  if (!claim || !subclaim || !Array.isArray(searchResults)) {
    return res.status(400).json({
      success: false,
      message: "claim, subclaim and searchResults are required",
    });
  }

  const result = await geminiService.analyzeEvidence({
    claim,
    subclaim,
    searchResults,
  });

  return successResponse({
    res,

    message: "Evidence analyzed successfully",

    data: result,
  });
};
