import express from "express";
import {
  createInvestigation,
  getInvestigations,
  getInvestigationById,
} from "../controllers/investigate.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";

const router = express.Router();

router.post("/", asyncHandler(createInvestigation));

router.get("/", asyncHandler(getInvestigations));

router.get("/:id", asyncHandler(getInvestigationById));

export default router;
