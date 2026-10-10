import express from "express";
import {
  createInvestigation,
  getInvestigations,
  getInvestigationById,
} from "../controllers/investigate.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import {
  startLiveInvestigation,
  streamLiveInvestigation,
} from "../controllers/liveInvestigation.controller.js";

const router = express.Router();

// Live investigation routes
router.post("/live", startLiveInvestigation);
router.get("/live/:runId/events", streamLiveInvestigation);

// Existing investigation routes
router.post("/", asyncHandler(createInvestigation));
router.get("/", asyncHandler(getInvestigations));
router.get("/:id", asyncHandler(getInvestigationById));

export default router;
