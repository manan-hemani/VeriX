import crypto from "crypto";

const streams = new Map();
const MAX_HISTORY = 250;
const HEARTBEAT_MS = 20000;

export function createInvestigationStream(runId = crypto.randomUUID()) {
  if (streams.has(runId)) {
    throw new Error("Investigation stream already exists.");
  }

  streams.set(runId, {
    clients: new Set(),
    history: [],
    terminal: false,
  });

  return runId;
}

function toFrame(event) {
  return `id: ${event.id}\n` + `data: ${JSON.stringify(event)}\n\n`;
}

export function publishInvestigationEvent(runId, type, payload = {}) {
  const stream = streams.get(runId);

  if (!stream || stream.terminal) return null;

  const event = {
    ...payload,
    id: crypto.randomUUID(),
    type: String(type).toUpperCase(),
    timestamp: new Date().toISOString(),
  };

  // Temporary: confirm what your agent service actually emits, then remove.
  console.log("[SSE emit]", event.type);

  stream.history.push(event);

  if (stream.history.length > MAX_HISTORY) {
    stream.history.splice(0, stream.history.length - MAX_HISTORY);
  }

  const frame = toFrame(event);

  for (const client of stream.clients) {
    try {
      client.write(frame);
    } catch {
      stream.clients.delete(client);
    }
  }

  if (["COMPLETED", "ERROR"].includes(event.type)) {
    stream.terminal = true;

    for (const client of stream.clients) {
      try {
        client.end();
      } catch {
        // Client may already be disconnected.
      }
    }

    stream.clients.clear();
  }

  return event;
}

export function attachInvestigationClient(runId, res, lastEventId) {
  const stream = streams.get(runId);

  if (!stream) return false;

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  res.write(": TruthTrail stream connected\n\n");

  let startIndex = 0;

  if (lastEventId) {
    const index = stream.history.findIndex((event) => event.id === lastEventId);

    if (index !== -1) {
      startIndex = index + 1;
    }
  }

  // Replay is what saves you from the race below: the POST returns 202 and the
  // agent starts working immediately, but the browser needs a round trip to
  // open the stream. Everything emitted in that gap is in `history`.
  for (const event of stream.history.slice(startIndex)) {
    res.write(toFrame(event));
  }

  if (stream.terminal) {
    res.end();
    return true;
  }

  stream.clients.add(res);

  const heartbeat = setInterval(() => {
    if (!res.destroyed && !res.writableEnded) {
      res.write(": heartbeat\n\n");
    }
  }, HEARTBEAT_MS);

  res.on("close", () => {
    clearInterval(heartbeat);
    stream.clients.delete(res);
  });

  return true;
}

export function removeInvestigationStream(runId) {
  const stream = streams.get(runId);

  if (!stream) return;

  for (const client of stream.clients) {
    try {
      client.end();
    } catch {
      // Ignore already-closed connections.
    }
  }

  streams.delete(runId);
}
