import crypto from "crypto";
import agentService from "../services/agent.service.js";
import {
  createInvestigationStream,
  publishInvestigationEvent,
  attachInvestigationClient,
  removeInvestigationStream,
} from "../utils/investigationEventBus.js";

export async function startLiveInvestigation(req, res, next) {
  try {
    const claim = String(req.body?.claim || "").trim();

    if (claim.length < 5) {
      return res.status(400).json({
        message: "Claim must contain at least 5 characters.",
      });
    }

    if (claim.length > 2000) {
      return res.status(400).json({
        message: "Claim must not exceed 2000 characters.",
      });
    }

    const runId = crypto.randomUUID();

    createInvestigationStream(runId);

    // Respond before doing expensive AI and search work.
    res.status(202).json({
      runId,
      eventsUrl: `/api/investigations/live/${runId}/events`,
    });

    // The browser can connect using the runId returned above.
    void (async () => {
      const emit = (event) => {
        publishInvestigationEvent(runId, event.type || "ACTIVITY", event);
      };

      try {
        const result = await agentService.investigateClaim(claim, {
          onEvent: emit,
        });

        publishInvestigationEvent(runId, "COMPLETED", {
          message: "Investigation complete.",
          investigationId: result.summary.investigationId || result.summary.id,
          summary: result.summary,
        });
      } catch (error) {
        console.error("Live investigation failed:", error);

        publishInvestigationEvent(runId, "ERROR", {
          message: error.message || "Investigation failed.",
        });
      }

      // Keep the buffered history available for reconnects.
      // Add a bounded TTL cleanup policy in production.
    })();
  } catch (error) {
    next(error);
  }
}

export function streamLiveInvestigation(req, res, next) {
  try {
    const connected = attachInvestigationClient(
      req.params.runId,
      res,
      req.get("Last-Event-ID"),
    );

    if (!connected) {
      return res.status(404).json({
        message: "Investigation stream not found or expired.",
      });
    }
  } catch (error) {
    if (!res.headersSent) return next(error);
    res.end();
  }
}
