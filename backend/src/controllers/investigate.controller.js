import asyncHandler from "../middleware/asyncHandler.middleware.js";
import ApiError from "../utils/ApiError.js";
import successResponse from "../utils/ApiResponse.js";
import agentService from "../services/agent.service.js";

// POST /api/investigations
export const createInvestigation = asyncHandler(async (req, res) => {
  const { claim } = req.body;

  if (typeof claim !== "string" || !claim.trim()) {
    throw new ApiError(400, "Claim is required.");
  }

  const result = await agentService.investigateClaim(claim);

  return successResponse({
    res,

    statusCode: 201,

    message: "Investigation completed successfully.",

    data: {
      summary: result.summary,

      investigation: result.full,
    },
  });
});

// GET /api/investigations
export const getInvestigations = asyncHandler(async (req, res) => {
  const result = await agentService.getInvestigations({
    page: req.query.page,

    limit: req.query.limit,
  });

  return successResponse({
    res,

    message: "Investigations fetched successfully.",

    data: result,
  });
});

// GET /api/investigations/:id
export const getInvestigationById = asyncHandler(async (req, res) => {
  const investigation = await agentService.getInvestigationById(req.params.id);

  return successResponse({
    res,

    message: "Investigation fetched successfully.",

    data: investigation,
  });
});
