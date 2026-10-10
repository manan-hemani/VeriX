import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import InvestigationGrid from "../Components/InvsetigationGrid";
import { getInvestigations } from "../Services/investigationApi";

const EvidenceHistory = () => {
  const navigate = useNavigate();

  const [investigations, setInvestigations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch investigation history from the backend
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const result = await getInvestigations();

        if (cancelled) return;

        const records = Array.isArray(result.investigations)
          ? result.investigations
          : [];

        setInvestigations(records);
        setTotal(
          typeof result.total === "number" ? result.total : records.length,
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load investigation history.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // Open the selected investigation's results page
  const handleOpenInvestigation = (investigation) => {
    const id = investigation.investigationId || investigation.id;

    if (!id) {
      setError("Investigation ID is missing. Unable to open results.");
      return;
    }

    navigate(`/results/${encodeURIComponent(id)}`);
  };

  // Calculate statistics from the records currently returned by the API
  const totalSources = investigations.reduce(
    (sum, investigation) => sum + (Number(investigation.sourcesCount) || 0),
    0,
  );

  const resolvedCount = investigations.filter((investigation) =>
    ["SUPPORTED", "CONTRADICTED", "PARTIALLY_SUPPORTED"].includes(
      investigation.status,
    ),
  ).length;

  const resolvedRate =
    investigations.length > 0
      ? `${((resolvedCount / investigations.length) * 100).toFixed(1)}%`
      : "—";

  return (
    <div className="bg-grid min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <span className="text-lemon uppercase text-[9px] font-light font-mono">
          VERIFICATION VAULT
        </span>

        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
            INVESTIGATION HISTORY
          </h1>

          <br />

          <p className="font-body-lg text-body-lg text-text-secondary">
            An AI agent that doesn't stop at the first search result. Built for
            forensic claim decomposition, dynamic hypothesis counter-testing,
            and evidence sufficiency assessment.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Total investigations */}
          <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
            <p className="font-mono text-body-lg text-text-muted uppercase">
              Total Investigations
            </p>

            <p className="font-sans text-2xl font-bold">
              {loading ? "..." : total}
            </p>

            <p className="font-mono text-body-lg text-text-secondary">
              Saved investigation records
            </p>
          </div>

          {/* Sources analyzed */}
          <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
            <p className="font-mono text-body-lg text-text-muted uppercase">
              Sources Analyzed
            </p>

            <p className="font-sans text-2xl font-bold text-cyan-500">
              {loading ? "..." : totalSources}
            </p>

            <p className="font-mono text-body-lg text-text-secondary">
              Across loaded investigations
            </p>
          </div>

          {/* Claims investigated */}
          <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
            <p className="font-mono text-body-lg text-text-muted uppercase">
              Claims Investigated
            </p>

            <p className="font-sans text-2xl font-bold">
              {loading ? "..." : investigations.length}
            </p>

            <p className="font-mono text-body-lg text-text-secondary">
              Claims returned by the API
            </p>
          </div>

          {/* Resolved verdict rate */}
          <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
            <p className="font-mono text-body-lg text-text-muted uppercase">
              Classified Verdicts
            </p>

            <p className="font-sans text-2xl font-bold text-green-500">
              {loading ? "..." : resolvedRate}
            </p>

            <p className="font-mono text-body-lg text-text-secondary">
              Not marked uncertain or unverified
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-400"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 underline underline-offset-4"
            >
              Reload page
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center">
            <p className="font-mono text-text-secondary">
              Loading investigation history...
            </p>
          </div>
        )}

        {/* Investigation history */}
        {!loading && !error && (
          <div className="mt-8">
            <InvestigationGrid
              investigations={investigations}
              onOpen={handleOpenInvestigation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceHistory;
