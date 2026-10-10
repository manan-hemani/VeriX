const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createInvestigation = async (claim) => {
  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/investigations`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      claim,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to start investigation");
  }

  return data;
};

export const getInvestigations = async () => {
  const response = await fetch(`${API_BASE_URL}/investigations`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch investigations");
  }

  const payload = data?.data ?? data;

  const investigations = Array.isArray(payload)
    ? payload
    : (payload?.investigations ?? payload?.results ?? []);

  return {
    ...data,
    investigations,
    total:
      payload?.total ?? payload?.totalInvestigations ?? investigations.length,
  };
};

export const getInvestigationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/investigations/${id}`);
  console.log("getInvestigationById response:", response);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch investigation");
  }

  return data;
};

// Start an investigation that publishes live events.
export const startLiveInvestigation = async (claim) => {
  const response = await fetch(`${API_BASE_URL}/investigations/live`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ claim }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to start live investigation");
  }

  // Expected: { runId, eventsUrl } or at least { runId }
  return data;
};

// Subscribe to events from the running investigation.
export const connectToInvestigationEvents = (runId, handlers = {}) => {
  const eventsUrl = `${API_BASE_URL}/investigations/live/${encodeURIComponent(runId)}/events`;

  const eventSource = new EventSource(eventsUrl);

  const liveEventTypes = [
    "CLAIM_RECEIVED",
    "CLAIM_DECOMPOSED",
    "SEARCH_PLANNED",
    "CYCLE_STARTED",
    "SEARCH_STARTED",
    "SEARCH_COMPLETED",
    "EVIDENCE_ANALYSIS",
    "EVIDENCE_ANALYZED",
    "PLAN_FALLBACK",
    "EVIDENCE_SUFFICIENT",
    "MAX_CYCLES_REACHED",
    "FINAL_ANALYSIS",
    "GRAPH_BUILT",
    "INVESTIGATION_SAVED",
    "INVESTIGATION_ERROR",
    "COMPLETED",
    "ERROR",
  ];

  const listeners = [];

  for (const type of liveEventTypes) {
    const listener = (event) => {
      let payload;

      try {
        payload = JSON.parse(event.data);
      } catch {
        payload = { raw: event.data };
      }

      handlers.onEvent?.({ type, ...payload });

      if (type === "COMPLETED") {
        handlers.onComplete?.(payload);
        eventSource.close();
      }

      if (type === "ERROR") {
        handlers.onCompleteError?.(payload);
        eventSource.close();
      }
    };

    eventSource.addEventListener(type, listener);
    listeners.push([type, listener]);
  }

  // This is the browser's connection error, not your custom "ERROR" event.
  eventSource.onerror = () => {
    handlers.onConnectionError?.();
    // EventSource reconnects automatically unless closed.
  };

  return () => {
    for (const [type, listener] of listeners) {
      eventSource.removeEventListener(type, listener);
    }
    eventSource.close();
  };
};
