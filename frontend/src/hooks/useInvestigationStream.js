import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

const EVENT_TO_STAGE = {
  CLAIM_RECEIVED: "claim_received",

  CLAIM_DECOMPOSED: "claim_decomposed",
  SUBCLAIMS_GENERATED: "claim_decomposed",

  SEARCH_PLANNED: "search_started",
  CYCLE_STARTED: "search_started",
  SEARCH_STARTED: "search_started",

  SEARCH_COMPLETED: "search_completed",
  SEARCH_RESULTS: "search_completed",

  EVIDENCE_ANALYSIS: "analysis_started",
  EVIDENCE_ANALYZED: "analysis_started",
  EVIDENCE_FOUND: "analysis_started",
  ANALYSIS_STARTED: "analysis_started",

  EVIDENCE_INSUFFICIENT: "evidence_insufficient",

  PLAN_FALLBACK: "additional_search",
  ADDITIONAL_SEARCH: "additional_search",

  EVIDENCE_SUFFICIENT: "comparison_started",
  MAX_CYCLES_REACHED: "comparison_started",
  COMPARISON_STARTED: "comparison_started",

  FINAL_ANALYSIS: "synthesis_started",
  GRAPH_BUILT: "synthesis_started",
  SYNTHESIS_STARTED: "synthesis_started",

  INVESTIGATION_SAVED: "completed",
  COMPLETED: "completed",

  INVESTIGATION_ERROR: "error",
  ERROR: "error",
};

const asArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];

const clamp01 = (n, fallback) =>
  Number.isFinite(Number(n)) ? Math.max(0, Math.min(1, Number(n))) : fallback;

/**
 * Builds entities in the shape your OrbitingEntities component reads.
 *
 * It colours by `status || relationship || type` (looking for the substrings
 * "support", "contradict", "partial", "uncertain") and labels from
 * `title || name || type`. So every entity below carries BOTH a readable
 * `title` and a `status` string — otherwise the labels come out as raw type
 * constants and every node is the same purple.
 */
function entitiesFromEvent(type, event) {
  const out = [];
  const stamp = event.id || event.timestamp || Date.now();

  const push = (entity) => out.push({ ...entity, name: entity.title });

  // claim fragments
  asArray(event.subclaims || event.terms).forEach((item, i) => {
    const title = typeof item === "string" ? item : item.text || item.label;
    if (!title) return;
    push({
      id: `claim-${item.id ?? i}`,
      title,
      type: "CLAIM_PART",
      status: item.status || "claim",
      importance: 0.9,
    });
  });

  // queries
  asArray(event.queries || event.query || event.searchQuery).forEach((q, i) => {
    const title = typeof q === "string" ? q : q.query || q.text;
    if (!title) return;
    push({
      id: `query-${stamp}-${i}`,
      title,
      type: "SEARCH_QUERY",
      status: "query",
      importance: 0.8,
    });
  });

  // search results and their sources
  asArray(event.results || event.searchResults).forEach((r, i) => {
    const title = r.title || r.snippet || r.url;
    if (!title) return;
    push({
      id: `result-${r.id ?? r.url ?? `${stamp}-${i}`}`,
      title,
      url: r.url,
      source: r.source,
      type: "SEARCH_RESULT",
      status: "source",
      importance: clamp01(r.relevance ?? r.score, 0.55),
    });
  });

  // analysed evidence — status drives the colour
  asArray(event.evidence).forEach((item, i) => {
    const title = item.title || item.summary || item.text || item.url;
    if (!title) return;
    const relationship = String(
      item.relationship || item.stance || "UNCERTAIN",
    ).toUpperCase();
    push({
      id: `evidence-${item.id ?? item.url ?? `${stamp}-${i}`}`,
      title,
      url: item.url,
      source: item.source,
      type: "EVIDENCE",
      relationship,
      status: relationship,
      importance: clamp01(item.weight ?? item.confidence, 0.6),
    });
  });

  // the agent's own reasoning when it decides evidence is thin
  if (
    (type === "EVIDENCE_INSUFFICIENT" || type === "PLAN_FALLBACK") &&
    (event.reason || event.message)
  ) {
    push({
      id: `reasoning-${stamp}`,
      title: event.reason || event.message,
      type: "REASONING",
      status: "uncertain",
      importance: 0.7,
    });
  }

  return out;
}

/**
 * Starts a backend investigation and listens to its SSE event stream.
 *   POST /api/investigations/live  -> { runId, eventsUrl }
 *   GET  <eventsUrl>               -> text/event-stream
 */
export function useInvestigationStream({
  onCompleted,
  onError,
  apiBase = API_BASE,
  debug = true,
} = {}) {
  const [stage, setStage] = useState("idle");
  const [entities, setEntities] = useState([]);
  const [investigation, setInvestigation] = useState(null);
  const [message, setMessage] = useState(
    "Enter a claim to begin a live investigation.",
  );
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const sourceRef = useRef(null);
  const completedRef = useRef(false);
  const seenRef = useRef(new Set());

  const closeStream = useCallback(() => {
    sourceRef.current?.close();
    sourceRef.current = null;
  }, []);

  useEffect(() => () => closeStream(), [closeStream]);

  const startInvestigation = useCallback(
    async (claim, extra = {}) => {
      const cleanClaim = String(claim || "").trim();
      if (!cleanClaim) {
        throw new Error("Enter a claim before starting the investigation.");
      }

      closeStream();
      completedRef.current = false;
      seenRef.current = new Set();

      setStage("claim_received");
      setEntities([]);
      setInvestigation(null);
      setError("");
      setMessage("Claim received by the investigation service.");
      setIsRunning(true);

      try {
        const response = await fetch(`${apiBase}/investigations/live`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(extra.headers || {}),
          },
          credentials: "include",
          body: JSON.stringify({ claim: cleanClaim, ...extra.body }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            payload.message ||
              payload.error ||
              "Could not start investigation.",
          );
        }
        if (!payload.runId) {
          throw new Error("The server did not return a runId.");
        }

        setInvestigation(payload);

        const streamUrl = payload.eventsUrl
          ? new URL(payload.eventsUrl, `${apiBase}/`).toString()
          : `${apiBase}/investigations/live/${encodeURIComponent(payload.runId)}/events`;

        const source = new EventSource(streamUrl, { withCredentials: true });
        sourceRef.current = source;

        const handle = (raw) => {
          let event;
          try {
            event = JSON.parse(raw.data);
          } catch {
            return;
          }

          // A frame can arrive twice if it matches a named listener AND the
          // default channel. Dedupe on the server-assigned id.
          if (event.id) {
            if (seenRef.current.has(event.id)) return;
            seenRef.current.add(event.id);
          }

          const type = String(event.type || raw.type || "").toUpperCase();
          const nextStage = EVENT_TO_STAGE[type];

          if (debug) {
            console.log(
              "[stream]",
              type,
              "->",
              nextStage ?? "(UNMAPPED)",
              event,
            );
          }

          if (nextStage) setStage(nextStage);
          if (event.message) setMessage(event.message);

          const incoming = entitiesFromEvent(type, event);
          if (incoming.length) {
            setEntities((previous) => {
              const map = new Map(previous.map((item) => [item.id, item]));
              incoming.forEach((item) =>
                map.set(item.id, { ...map.get(item.id), ...item }),
              );
              return [...map.values()];
            });
          }

          const incomingInvestigation =
            event.investigation || event.result || event.summary;

          if (incomingInvestigation) {
            setInvestigation((previous) => ({
              ...previous,
              ...incomingInvestigation,
            }));
          }

          if (type === "COMPLETED" || type === "INVESTIGATION_SAVED") {
            completedRef.current = true;
            setStage("completed");
            setIsRunning(false);
            setMessage(
              event.message ||
                "Investigation complete. Your evidence trail is ready.",
            );
            closeStream();
            onCompleted?.(incomingInvestigation || event);
          } else if (type === "ERROR" || type === "INVESTIGATION_ERROR") {
            const msg = event.message || "The investigation failed.";
            setStage("error");
            setError(msg);
            setMessage(msg);
            setIsRunning(false);
            closeStream();
            onError?.(new Error(msg));
          }
        };

        // Default channel — works once the server stops writing an `event:`
        // line. Everything arrives here, including names nobody mapped yet.
        source.addEventListener("message", handle);

        // Belt and braces for known names if you keep named events server-side.
        // Duplicates are filtered by the id check above.
        Object.keys(EVENT_TO_STAGE).forEach((name) =>
          source.addEventListener(name, handle),
        );

        source.onerror = () => {
          if (completedRef.current) return;
          setMessage(
            (current) =>
              current || "Reconnecting to the live investigation stream…",
          );
        };
      } catch (err) {
        setStage("error");
        setError(err.message || "Unable to start investigation.");
        setMessage(err.message || "Unable to start investigation.");
        setIsRunning(false);
        onError?.(err);
        throw err;
      }
    },
    [apiBase, closeStream, debug, onCompleted, onError],
  );

  const reset = useCallback(() => {
    closeStream();
    completedRef.current = false;
    seenRef.current = new Set();
    setStage("idle");
    setEntities([]);
    setInvestigation(null);
    setError("");
    setMessage("Enter a claim to begin a live investigation.");
    setIsRunning(false);
  }, [closeStream]);

  return {
    stage,
    entities,
    investigation,
    message,
    error,
    isRunning,
    startInvestigation,
    reset,
    closeStream,
  };
}
