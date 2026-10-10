import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InvestigationGalaxy from "../Components/InvestigationGalaxy";
import { useInvestigationStream } from "../hooks/useInvestigationStream";
import "../styles/investigation-galaxy.css";

const Investigate = () => {
  const [claim, setClaim] = useState("");
  const navigate = useNavigate();
  const {
    stage,
    entities,
    message,
    error,
    isRunning,
    investigation,
    startInvestigation,
    reset,
  } = useInvestigationStream();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!claim.trim() || isRunning) return;

    try {
      await startInvestigation(claim);
    } catch (err) {
      console.error("Investigation failed:", err);
    }
  };

  const handleReset = () => {
    setClaim("");
    reset();
  };

  const handleViewResults = () => {
    const savedInvestigationId = investigation?.investigationId;

    if (!savedInvestigationId) {
      console.error("Saved investigation ID not found:", investigation);
      return;
    }

    navigate(`/results/${savedInvestigationId}`);
  };
  return (
    <main className="bg-grid min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <span className="text-lemon uppercase text-[9px] font-light font-mono">
          ENTER CLAIMS
        </span>

        <div className="max-w-4xl mt-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
            ENTER CLAIMS FOR AUTONOMOUS INVESTIGATION
          </h1>

          <p className="font-body-lg text-body-lg text-text-secondary mt-4">
            Autonomous multi-agent verification crawling cross-domain sources,
            SerpApi indices, and institutional records in real time. Follow the
            evidence as VeriX investigates your claim.
          </p>
        </div>

        {/* CLAIM FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center w-full mt-6 p-4 gap-3 bg-surface border border-border-subtle rounded-2xl"
        >
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="input-verix w-full min-h-12 resize-y"
            placeholder="Enter a claim to investigate..."
            aria-label="Claim to investigate"
            maxLength={2000}
            rows={2}
            required
            disabled={isRunning}
          />

          <button
            type="submit"
            disabled={!claim.trim() || isRunning}
            className="btn-primary px-5! py-3! whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? "Investigating..." : "Start Investigation"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-2 text-xs text-text-secondary font-mono">
          <span>{claim.length}/2000 characters</span>

          {isRunning && (
            <span className="text-lemon animate-pulse">
              LIVE INVESTIGATION IN PROGRESS
            </span>
          )}
        </div>

        {/* LIVE STATUS */}
        <section
          className="mt-8 rounded-2xl border border-border-subtle bg-surface p-4 sm:p-6"
          aria-live="polite"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-lemon uppercase text-[10px] font-mono">
                INVESTIGATION STATUS
              </span>

              <h2 className="text-lg font-semibold text-on-surface mt-1">
                {isRunning
                  ? "Following the evidence..."
                  : stage === "completed"
                    ? "Investigation complete"
                    : stage === "error"
                      ? "Investigation failed"
                      : "Ready to investigate"}
              </h2>

              <p className="text-sm text-text-secondary mt-1">{message}</p>
            </div>

            <span className="font-mono text-xs uppercase text-lemon">
              {stage.replaceAll("_", " ")}
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-4" role="alert">
              {error}
            </p>
          )}
        </section>

        {/* GALAXY ANIMATION */}
        <section className="mt-6">
          <div className="mb-4">
            <span className="text-lemon uppercase text-[10px] font-mono">
              LIVE EVIDENCE NETWORK
            </span>

            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-2">
              Watch the investigation unfold
            </h2>

            <p className="text-sm text-text-secondary mt-2">
              The galaxy responds to investigation events from your backend.
              Search activity and evidence will appear as the agent progresses.
            </p>
          </div>

          <InvestigationGalaxy
            stage={stage}
            entities={entities}
            eventMessage={message}
            intensity={isRunning ? 1.25 : 0.65}
            showLabels={entities.length <= 12}
            onRetry={
              stage === "error"
                ? () => startInvestigation(claim).catch(console.error)
                : undefined
            }
          />
        </section>

        {/* COMPLETED INVESTIGATION */}
        {stage === "completed" && (
          <section className="mt-6 p-5 rounded-2xl border border-border-subtle bg-surface">
            <span className="text-lemon uppercase text-[10px] font-mono">
              INVESTIGATION FINISHED
            </span>

            <h2 className="text-xl font-bold text-on-surface mt-2">
              Your evidence trail is ready
            </h2>

            <div className="mt-6 flex justify-around">
              <button
                onClick={handleViewResults}
                className="btn-primary rounded-xl px-5! py-3! mt-5 font-semibold"
              >
                View Investigation Results
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn-primary px-5! py-3! mt-5"
              >
                Investigate Another Claim
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Investigate;
