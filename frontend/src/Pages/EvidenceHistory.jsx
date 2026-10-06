// import React from "react";
import InvestigationGrid from "../Components/InvsetigationGrid";
import investigations from "../data/investigations";

const EvidenceHistory = () => {
  const handleOpenInvestigation = (investigation) => {
    console.log("Opening investigation:", investigation.id);

    // Later:
    // navigate(`/investigation/${investigation.id}`);
  };
  return (
    <>
      <div className="bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* HERO */}
          <span className="text-lemon uppercase text-[9px] font-light font-mono">
            VERIFICATION VAULT
          </span>
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
              INVESTIAGTION HISTORY
            </h1>
            <br />
            <p className="font-body-lg text-body-lg text-text-secondary flex-1">
              An AI agent that doesn't stop at the first search result. Built
              for forensic claim decomposition, dynamic hypothesis
              counter-testing, and epistemic sufficiency proofing.
            </p>
          </div>

          {/* Summarized Details */}
          <div className="grid *:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Panel 1 */}
            <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
              <p className="font-mono font-body-lg text-body-lg text-text-muted uppercase">
                Total Investigations
              </p>
              <p className="font-sans text-2xl font-bold">24</p>
              <p className="font-mono font-body-lg text-body-lg text-text-secondary">
                Logs of Investigations
              </p>
            </div>
            {/* Panel 2 */}
            <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
              <p className="font-mono font-body-lg text-body-lg text-text-muted uppercase">
                Source Analyzed
              </p>
              <p className="font-sans text-2xl font-bold text-cyan-500">314</p>
              <p className="font-mono font-body-lg text-body-lg text-text-secondary">
                SerpApi Multi-Hop
              </p>
            </div>
            {/* Panel 3 */}
            <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
              <p className="font-mono font-body-lg text-body-lg text-text-muted uppercase">
                Claims Investigated
              </p>
              <p className="font-sans text-2xl font-bold">24</p>
              <p className="font-mono font-body-lg text-body-lg text-text-secondary">
                Biomedical, Political, Scientific, and more
              </p>
            </div>
            {/* Panel 4 */}
            <div className="panel p-4 flex flex-col items-start gap-2 hover:border-lemon transition-all duration-300">
              <p className="font-mono font-body-lg text-body-lg text-text-muted uppercase">
                Evidence Sufficency
              </p>
              <p className="font-sans text-2xl font-bold text-green-500">
                89.4%
              </p>
              <p className="font-mono font-body-lg text-body-lg text-text-secondary">
                Mean topological sufficiency
              </p>
            </div>
          </div>
          <p className="font-mono font-body-lg text-body-lg text-text-secondary mt-2">
            NOTE: Not Actual Data
          </p>

          {/* All Evidence */}
          <InvestigationGrid
            investigations={investigations}
            onOpen={handleOpenInvestigation}
          />
        </div>
      </div>
    </>
  );
};

export default EvidenceHistory;
