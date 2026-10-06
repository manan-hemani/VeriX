import express from "express";
import {
  testGemini,
  analyzeClaim,
  analyzeEvidence,
} from "../controllers/gemini.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";

const router = express.Router();

router.post("/test", asyncHandler(testGemini));

router.post("/analyze-claim", asyncHandler(analyzeClaim));

router.post("/analyze-evidence", asyncHandler(analyzeEvidence));

export default router;
