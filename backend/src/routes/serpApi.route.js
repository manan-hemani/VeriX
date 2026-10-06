import express from "express";
import {
  searchWeb,
  searchNews,
  searchAcademic,
  searchSupporting,
  searchContradictory,
} from "../controllers/serpapi.controller.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";

const router = express.Router();

router.post("/web", asyncHandler(searchWeb));

router.post("/news", asyncHandler(searchNews));

router.post("/academic", asyncHandler(searchAcademic));

router.post("/supporting", asyncHandler(searchSupporting));

router.post("/contradictory", asyncHandler(searchContradictory));

export default router;
