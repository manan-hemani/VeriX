import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { getInvestigationById } from "../Services/investigationApi";

// STATUS CONFIGURATION
const STATUS = {
  SUPPORTED: {
    label: "SUPPORTED",
    color: "#a8e063",
    className: "status-supported",
  },
  CONTRADICTED: {
    label: "CONTRADICTED",
    color: "#ff7d8a",
    className: "status-contradicted",
  },
  PARTIALLY_SUPPORTED: {
    label: "PARTIALLY SUPPORTED",
    color: "#f5ff67",
    className: "status-partial",
  },
  UNCERTAIN: {
    label: "UNCERTAIN",
    color: "#aeb7e8",
    className: "status-uncertain",
  },
  UNVERIFIED: {
    label: "UNVERIFIED",
    color: "#989db5",
    className: "status-uncertain",
  },
  SUPPORTS: {
    label: "SUPPORTS",
    color: "#a8e063",
    className: "status-supported",
  },
  CONTRADICTS: {
    label: "CONTRADICTS",
    color: "#ff7d8a",
    className: "status-contradicted",
  },
  PARTIALLY_SUPPORTS: {
    label: "PARTIALLY SUPPORTS",
    color: "#f5ff67",
    className: "status-partial",
  },
  IRRELEVANT: {
    label: "IRRELEVANT",
    color: "#989db5",
    className: "status-uncertain",
  },
};

function getStatus(value) {
  return STATUS[String(value || "UNCERTAIN").toUpperCase()] || STATUS.UNCERTAIN;
}

function formatDate(value) {
  if (!value) return "DATE NOT AVAILABLE";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function safeText(value, fallback = "Not provided") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

// PAGE
export default function InvestigationResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const result = await getInvestigationById(id);
        console.log("Investigation result:", result);
        if (!cancelled) {
          setInvestigation(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this investigation.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const evidence = useMemo(
    () => investigation?.evidence ?? [],
    [investigation],
  );

  const subclaims = useMemo(
    () => investigation?.subclaims ?? [],
    [investigation],
  );

  const filteredEvidence = useMemo(() => {
    if (filter === "ALL") return evidence;

    return evidence.filter((item) => {
      const relationship = String(
        item.relationship || "UNCERTAIN",
      ).toUpperCase();

      if (filter === "SUPPORTS") {
        return relationship === "SUPPORTS";
      }

      if (filter === "CONTRADICTS") {
        return relationship === "CONTRADICTS";
      }

      if (filter === "PARTIAL") {
        return relationship === "PARTIALLY_SUPPORTS";
      }

      if (filter === "UNCERTAIN") {
        return ["UNCERTAIN", "IRRELEVANT"].includes(relationship);
      }

      return true;
    });
  }, [evidence, filter]);

  const evidenceCounts = useMemo(() => {
    const counts = {
      ALL: evidence.length,
      SUPPORTS: 0,
      CONTRADICTS: 0,
      PARTIAL: 0,
      UNCERTAIN: 0,
    };

    evidence.forEach((item) => {
      const relationship = String(
        item.relationship || "UNCERTAIN",
      ).toUpperCase();

      if (relationship === "SUPPORTS") counts.SUPPORTS += 1;
      else if (relationship === "CONTRADICTS") counts.CONTRADICTS += 1;
      else if (relationship === "PARTIALLY_SUPPORTS") counts.PARTIAL += 1;
      else counts.UNCERTAIN += 1;
    });

    return counts;
  }, [evidence]);

  const scrollToEvidence = useCallback((evidenceId) => {
    if (!evidenceId) return;

    setSelectedEvidenceId(evidenceId);

    // Allow React to apply the selection before scrolling.
    requestAnimationFrame(() => {
      const element = document.getElementById(
        `evidence-${CSS.escape(String(evidenceId))}`,
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !investigation) {
    return (
      <main className="min-h-screen bg-background bg-grid">
        <div className="container-verix py-16">
          <div className="panel mx-auto max-w-2xl p-8">
            <p className="agent-label text-danger">INVESTIGATION LOAD ERROR</p>

            <h1 className="mt-3 text-2xl font-bold">Unable to load results</h1>

            <p className="mt-3 text-text-muted">
              {error || "The requested investigation was not found."}
            </p>

            <button
              className="btn-secondary mt-6"
              onClick={() => navigate("/history")}
            >
              BACK TO HISTORY
            </button>
          </div>
        </div>
      </main>
    );
  }

  const verdict = getStatus(investigation.status);
  const searches = investigation.searches ?? [];
  const graph = investigation.graph ?? {};

  return (
    <main className="min-h-screen overflow-x-hidden bg-background bg-grid">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="ambient-glow ambient-glow-primary -left-40 top-20 h-96 w-96" />
        <div className="ambient-glow ambient-glow-accent right-45 top-[45%] h-96 w-96" />
      </div>

      <div className="container-verix relative z-10 space-y-8 py-6 md:py-8">
        {/* TOP BAR */}
        <header className="flex flex-col gap-3 border border-border-subtle bg-surface-soft px-4 py-3 md:flex-row md:items-center md:justify-between">
          <button
            className="agent-text w-fit text-text-muted transition hover:text-lemon"
            onClick={() => navigate("/history")}
          >
            ← BACK TO INVESTIGATIONS
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="status-badge status-supported">
              ● INVESTIGATION LOADED
            </span>

            <span className="agent-text text-text-muted">
              DOSSIER #{investigation.investigationId || id}
            </span>
          </div>
        </header>

        {/* PRIMARY RESULT */}
        <section className="panel overflow-hidden">
          <div className="border-b border-border-subtle p-5 md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="agent-label text-lemon">INVESTIGATED PROPOSITION</p>

              <span className={`status-badge ${verdict.className}`}>
                {verdict.label}
              </span>
            </div>

            <h1 className="mt-4 max-w-5xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              “{investigation.claim}”
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-text-secondary">
              {safeText(
                investigation.evidenceSummary,
                "No evidence summary was generated for this investigation.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
            <Metric
              label="CONFIDENCE"
              value={
                Number.isFinite(Number(investigation.confidence))
                  ? `${investigation.confidence}%`
                  : "N/A"
              }
            />

            <Metric label="EVIDENCE SOURCES" value={evidence.length} />

            <Metric label="SUBCLAIMS" value={subclaims.length} />

            <Metric label="SEARCHES" value={searches.length} />

            <Metric
              label="AGENT CYCLES"
              value={`${investigation.cycle?.current ?? 0}/${investigation.cycle?.max ?? 0}`}
            />
          </div>
        </section>

        {/* SUBCLAIM BREAKDOWN */}
        <section>
          <SectionHeading
            eyebrow="CLAIM DECOMPOSITION"
            title="Subclaim Evaluation"
            description="The individual propositions considered during the investigation."
          />

          {subclaims.length === 0 ? (
            <EmptyState message="No subclaims were stored for this investigation." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {subclaims.map((subclaim, index) => {
                const status = getStatus(subclaim.status);

                return (
                  <article key={subclaim.id || index} className="panel p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="agent-label text-text-muted">
                        SUBCLAIM {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-text-secondary">
                      {subclaim.text}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* EVIDENCE LIST */}
        <section id="evidence-section" className="scroll-mt-8">
          <SectionHeading
            eyebrow="SOURCE PROVENANCE"
            title="Evidence Repository"
            description={`${evidence.length} stored evidence records. Inspect a source to open its original publication or webpage.`}
          />

          <div className="mb-5 flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "ALL SOURCES" },
              { key: "SUPPORTS", label: "SUPPORTS" },
              { key: "CONTRADICTS", label: "CONTRADICTS" },
              { key: "PARTIAL", label: "PARTIAL" },
              { key: "UNCERTAIN", label: "UNCERTAIN / OTHER" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`agent-text rounded-md border px-3 py-2 transition ${
                  filter === item.key
                    ? "border-lemon bg-lemon/10 text-lemon"
                    : "border-border-subtle bg-surface-soft text-text-muted hover:border-border-strong hover:text-text-primary"
                }`}
              >
                {item.label}
                <span className="ml-2 opacity-70">
                  {evidenceCounts[item.key]}
                </span>
              </button>
            ))}
          </div>

          {filteredEvidence.length === 0 ? (
            <EmptyState message="No evidence matches this filter." />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filteredEvidence.map((item, index) => (
                <EvidenceCard
                  key={item.id || item.url || index}
                  item={item}
                  index={index}
                  selected={selectedEvidenceId === item.id}
                />
              ))}
            </div>
          )}
        </section>

        {/* GRAPH */}
        <section id="evidence-graph" className="scroll-mt-8">
          <SectionHeading
            eyebrow="TOPOLOGICAL TRUTH GRAPH"
            title="Evidence Graph & Relationship Mapping"
            description="Explore the stored claim, subclaims, sources, and their relationships. Select an evidence node to locate its card in the repository above."
          />

          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
              <span className="agent-label text-text-muted">
                STORED GRAPH DATA
              </span>

              <span className="agent-text text-text-muted">
                {graph.nodes?.length ?? 0} NODES / {graph.edges?.length ?? 0}{" "}
                EDGES
              </span>
            </div>

            {graph.nodes?.length ? (
              <div className="h-140 w-full md:h-170">
                <ReactFlowProvider>
                  <InvestigationGraph
                    graph={graph}
                    evidence={evidence}
                    onEvidenceClick={scrollToEvidence}
                  />
                </ReactFlowProvider>
              </div>
            ) : (
              <div className="p-8">
                <EmptyState message="This investigation does not contain stored graph nodes." />
              </div>
            )}
          </div>
        </section>

        {/* SEARCH TRAIL */}
        <section>
          <SectionHeading
            eyebrow="PROVENANCE TRAJECTORY"
            title="Search History"
            description="The recorded searches that gathered material for this investigation."
          />

          {searches.length === 0 ? (
            <EmptyState message="No search history was stored." />
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {searches.map((search, index) => (
                <article key={`${search.query}-${index}`} className="panel p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="agent-label text-lemon">
                      SEARCH {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="agent-text text-text-muted">
                      {search.type || "SEARCH"}
                    </span>
                  </div>

                  <p className="mt-3 wrap-break-word font-mono text-sm text-text-secondary">
                    {search.query}
                  </p>

                  <p className="mt-3 agent-text text-text-muted">
                    {search.resultsFound ?? 0} RESULTS RECORDED
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CONTRADICTIONS AND GAPS */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="panel p-5">
            <p className="agent-label text-danger">CONTRADICTIONS</p>

            <h2 className="mt-2 text-xl font-bold">Conflicting evidence</h2>

            {investigation.contradictions?.length ? (
              <ul className="mt-4 space-y-3">
                {investigation.contradictions.map((item, index) => (
                  <li
                    key={index}
                    className="border-l-2 border-danger/60 pl-3 text-sm leading-6 text-text-secondary"
                  >
                    {item.description || String(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-text-muted">
                No contradiction records were stored. This does not necessarily
                mean contradictory evidence does not exist.
              </p>
            )}
          </div>

          <div className="panel p-5">
            <p className="agent-label text-warning">EVIDENCE GAPS</p>

            <h2 className="mt-2 text-xl font-bold">Remaining unknowns</h2>

            {investigation.evidenceGaps?.length ? (
              <ul className="mt-4 space-y-3">
                {investigation.evidenceGaps.map((gap, index) => (
                  <li
                    key={index}
                    className="border-l-2 border-warning/60 pl-3 text-sm leading-6 text-text-secondary"
                  >
                    {typeof gap === "string" ? gap : JSON.stringify(gap)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-text-muted">
                No explicit evidence gaps were stored by the investigation.
              </p>
            )}
          </div>
        </section>

        <footer className="border-t border-border-subtle py-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <span className="agent-text text-text-muted">
              VERIX / INVESTIGATION REPORT
            </span>

            <span className="agent-text text-text-muted">
              ID: {investigation.investigationId || id}
              {investigation.createdAt
                ? ` / CREATED ${formatDate(investigation.createdAt)}`
                : ""}
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}

// REUSABLE UI COMPONENTS
function Metric({ label, value }) {
  return (
    <div className="min-w-0 p-4 md:p-5">
      <p className="agent-label text-text-muted">{label}</p>
      <p className="mt-2 wrap-break-word text-2xl font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="agent-label text-lemon">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-4xl text-sm leading-6 text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="border border-dashed border-border-strong bg-surface-soft/60 p-6 text-sm text-text-muted">
      {message}
    </div>
  );
}

function EvidenceCard({ item, index, selected }) {
  const status = getStatus(item.relationship);

  const sourceUrl = (() => {
    try {
      const parsed = new URL(item.url);
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
    } catch {
      return null;
    }
  })();

  return (
    <article
      id={`evidence-${item.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-xl border bg-surface-soft/90 transition duration-300 ${
        selected
          ? "border-lemon shadow-[0_0_28px_rgba(245,255,103,0.13)]"
          : "border-border-subtle hover:border-border-strong"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3">
        <span className="agent-label text-text-muted">
          EVIDENCE NODE / {String(index + 1).padStart(2, "0")}
        </span>

        <span className={`status-badge ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="p-5">
        <h3 className="wrap-break-word text-lg font-bold leading-7">
          {safeText(item.title, "Untitled evidence source")}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="agent-text text-lemon">
            {safeText(item.source, "UNKNOWN SOURCE")}
          </span>

          {item.publishedDate && (
            <>
              <span className="text-text-disabled">/</span>
              <span className="agent-text text-text-muted">
                {formatDate(item.publishedDate)}
              </span>
            </>
          )}
        </div>

        <div className="mt-5">
          <p className="agent-label text-text-muted">EVIDENCE SUMMARY</p>

          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-text-secondary">
            {safeText(item.summary, "No summary was provided.")}
          </p>
        </div>

        <div className="mt-5 border-l-2 border-border-strong pl-3">
          <p className="agent-label text-text-muted">LIMITATIONS</p>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-muted">
            {safeText(item.limitations, "No limitations were recorded.")}
          </p>
        </div>

        {item.url && (
          <div className="mt-5 break-all border border-border-subtle bg-surface-dark p-3">
            <p className="agent-label text-text-muted">SOURCE URL</p>
            <p className="mt-2 font-mono text-xs leading-5 text-text-secondary">
              {item.url}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {sourceUrl ? (
            <a
              className="btn-primary"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              INSPECT SOURCE ↗
            </a>
          ) : (
            <button
              className="btn-secondary"
              disabled
              title="This evidence does not have a valid HTTP or HTTPS URL."
            >
              SOURCE URL UNAVAILABLE
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-background bg-grid">
      <div className="container-verix space-y-5 py-8">
        <div className="flex items-center gap-3 border border-border-subtle bg-surface-soft p-4">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lemon" />
          <span className="agent-text text-text-muted">
            RETRIEVING INVESTIGATION FROM DATABASE...
          </span>
        </div>

        <div className="h-64 animate-pulse rounded-xl border border-border-subtle bg-surface-soft" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-56 animate-pulse rounded-xl border border-border-subtle bg-surface-soft" />
          <div className="h-56 animate-pulse rounded-xl border border-border-subtle bg-surface-soft" />
        </div>
      </div>
    </main>
  );
}

// --------------------------------------------------
// GRAPH DATA NORMALIZATION
// --------------------------------------------------

function findEvidenceForNode(node, evidence) {
  const data = node.data ?? {};

  // Prefer explicit evidence references stored in graph node data.
  const possibleIds = [
    data.evidenceId,
    data.evidence_id,
    data.sourceId,
    data.source_id,
    data.evidence?.id,
    data.id,
    node.id,
  ]
    .filter(Boolean)
    .map(String);

  let match = evidence.find((item) => possibleIds.includes(String(item.id)));

  if (match) return match;

  // Fallback matching for graphs that identify nodes by URL/title.
  const nodeUrl = data.url || data.link || data.evidence?.url;
  if (nodeUrl) {
    match = evidence.find((item) => item.url === nodeUrl);
    if (match) return match;
  }

  const nodeTitle = data.title || data.label || data.evidence?.title;
  if (nodeTitle) {
    match = evidence.find((item) => item.title === nodeTitle);
    if (match) return match;
  }

  return null;
}

function buildGraphNodes(graph, evidence) {
  const rawNodes = Array.isArray(graph.nodes) ? graph.nodes : [];

  return rawNodes.map((node, index) => {
    const matchedEvidence = findEvidenceForNode(node, evidence);
    const rawData = node.data ?? {};
    const relationship =
      matchedEvidence?.relationship ||
      rawData.relationship ||
      rawData.status ||
      "UNCERTAIN";

    const status = getStatus(relationship);
    const originalPosition = node.position ?? {};

    // Keep stored React Flow positions when available.
    // Generate fallback positions only if the stored position is absent.
    const fallbackPosition = {
      x: (index % 3) * 280,
      y: Math.floor(index / 3) * 180,
    };

    const position = {
      x: Number.isFinite(originalPosition.x)
        ? originalPosition.x
        : fallbackPosition.x,
      y: Number.isFinite(originalPosition.y)
        ? originalPosition.y
        : fallbackPosition.y,
    };

    const label =
      rawData.label ||
      rawData.title ||
      matchedEvidence?.title ||
      rawData.text ||
      node.label ||
      (matchedEvidence ? "Evidence source" : "Investigation node");

    return {
      ...node,
      id: String(node.id ?? `node-${index}`),
      position,
      type: "truthTrailNode",
      data: {
        ...rawData,
        label,
        status: relationship,
        statusColor: status.color,
        evidenceId: matchedEvidence?.id ?? rawData.evidenceId ?? null,
        evidenceTitle: matchedEvidence?.title ?? null,
        source: matchedEvidence?.source ?? rawData.source ?? null,
        clickableEvidence: Boolean(matchedEvidence),
      },
    };
  });
}

function buildGraphEdges(graph, nodes) {
  const rawEdges = Array.isArray(graph.edges) ? graph.edges : [];

  const nodeMap = new Map(nodes.map((node) => [String(node.id), node]));

  return rawEdges.map((edge, index) => {
    const relationship = String(
      edge.data?.relationship ?? edge.relationship ?? edge.label ?? "",
    ).toUpperCase();

    const sourceNode = nodeMap.get(String(edge.source));

    const sourceStatus = String(
      sourceNode?.data?.status || "UNCERTAIN",
    ).toUpperCase();

    let color = "#aeb7e8";

    if (
      sourceStatus.includes("UNCERTAIN") ||
      sourceStatus.includes("UNVERIFIED")
    ) {
      color = "#aeb7e8";
    } else if (sourceStatus.includes("PARTIAL")) {
      color = "#f5ff67";
    } else if (sourceStatus.includes("CONTRADICT")) {
      color = "#ff7d8a";
    } else if (relationship.includes("SUPPORT")) {
      color = "#a8e063";
    }

    return {
      ...edge,
      id: String(edge.id ?? `edge-${index}`),
      source: String(edge.source),
      target: String(edge.target),
      type: "smoothstep",

      style: {
        stroke: color,
        strokeWidth: 2,
      },
    };
  });
}

function InvestigationGraph({ graph, evidence, onEvidenceClick }) {
  const nodes = useMemo(
    () => buildGraphNodes(graph, evidence),
    [graph, evidence],
  );
  const edges = useMemo(() => buildGraphEdges(graph, nodes), [graph, nodes]);
  const nodeTypes = useMemo(
    () => ({ truthTrailNode: TruthTrailGraphNode }),
    [],
  );

  const handleNodeClick = useCallback(
    (_event, node) => {
      const evidenceId = node.data?.evidenceId;

      if (evidenceId) {
        onEvidenceClick(evidenceId);
      }
    },
    [onEvidenceClick],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      minZoom={0.35}
      maxZoom={1.7}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: "smoothstep" }}
    >
      <Background color="#3a467b" gap={24} size={1} />

      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

function TruthTrailGraphNode({ data, selected }) {
  const color = data.statusColor || "#aeb7e8";

  return (
    <div
      title={
        data.clickableEvidence
          ? "Click to inspect this evidence below"
          : "Investigation graph node"
      }
      className="min-w-45 max-w-60 rounded-lg border bg-surface-soft px-3 py-3 shadow-lg"
      style={{
        borderColor: selected ? "#f5ff67" : `${color}99`,
        boxShadow: selected
          ? "0 0 20px rgba(245,255,103,0.16)"
          : "0 6px 18px rgba(0,0,0,0.22)",
        cursor: data.clickableEvidence ? "pointer" : "grab",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="border-[#f5ff67]! bg-blueberry!"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="agent-label text-text-muted">
          {data.clickableEvidence ? "EVIDENCE NODE" : "GRAPH NODE"}
        </span>

        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <p className="mt-2 wrap-break-word text-xs font-semibold leading-5 text-text-primary">
        {data.label}
      </p>

      {data.source && (
        <p className="mt-2 truncate agent-text text-text-muted">
          {data.source}
        </p>
      )}

      {data.status && (
        <p className="mt-2 agent-text" style={{ color }}>
          {data.status}
        </p>
      )}

      {data.clickableEvidence && (
        <p className="mt-2 agent-text text-lemon">CLICK TO LOCATE </p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="border-[#f5ff67]! bg-blueberry!"
      />
    </div>
  );
}
