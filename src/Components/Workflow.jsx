// import React from 'react'

const Workflow = () => {
  // const steps = [
  //   {
  //     id: "01 // INGEST",
  //     title: "CLAIM",
  //     subtitle: "User Input",
  //   },
  //   {
  //     id: "02 // PARSE",
  //     title: "DECOMPOSE",
  //     subtitle: "N-SubClaims",
  //   },
  //   {
  //     id: "03 // FETCH",
  //     title: "SEARCH",
  //     subtitle: "SerpApi Multi-Hop",
  //     highlightText: true,
  //   },
  //   {
  //     id: "04 // EXAMINE",
  //     title: "ANALYZE",
  //     subtitle: "Gemini Core",
  //   },
  //   {
  //     id: "05 // ATTACK ▸",
  //     title: "CHALLENGE",
  //     subtitle: "Adversarial Probe",
  //     active: true,
  //   },
  //   {
  //     id: "06 // WEIGH",
  //     title: "VERIFY",
  //     subtitle: "Bayesian Score",
  //   },
  //   {
  //     id: "07 // LINK",
  //     title: "GRAPH",
  //     subtitle: "Dynamic Topology",
  //   },
  //   {
  //     id: "08 // EMIT",
  //     title: "RESULT",
  //     subtitle: "Audit Dossier",
  //     highlight: true,
  //   },
  // ];
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full mt-10">
        <div className="flex flex-col items-start w-full h-full max-w-7xl  sm:px-6 lg:px-0 font-mono text-lemon uppercase trailing-widest text-sm">
          [recursive evidence pipeline]
        </div>
        <div className="flex flex-col items-start justify-center w-full h-full max-w-7xl sm:px-6 lg:px-0 font-sans font-bold text-2xl uppercase">
          AUTONOMOUS VERIFICATION WORKFLOW
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full mt-4">
        <div className=" flex flex-col w-full h-full max-w-7xl bg-blueberry-dark sm:px-6 lg:px-8  border border-border-strong">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 p-2 w-full">
            {/* 1 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                01 // INGEST
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                CLAIM
              </div>
              <div className="font-mono text-cyan-500 leading-tight text-xs sm:text-sm text-center">
                User Input
              </div>
            </div>

            {/* 2 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                02 // PARSE
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                DECOMPOSE
              </div>
              <div className="font-mono text-text-muted leading-tight text-xs sm:text-sm text-center">
                N-SubClaims
              </div>
            </div>

            {/* 3 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                03 // FETCH
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                SEARCH
              </div>
              <div className="font-mono text-lemon leading-tight text-xs sm:text-sm text-center">
                SerpApi Multi-Hop
              </div>
            </div>

            {/* 4 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                04 // EXAMINE
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                ANALYZE
              </div>
              <div className="font-mono text-text-muted leading-tight text-xs sm:text-sm text-center">
                AI Core
              </div>
            </div>

            {/* 5 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                05 // ATTACK
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                CHALLENGE
              </div>
              <div className="font-mono text-lemon leading-tight text-xs sm:text-sm text-center">
                Adversarial Probe
              </div>
            </div>

            {/* 6 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                06 // WEIGH
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                VERIFY
              </div>
              <div className="font-mono text-text-muted leading-tight text-xs sm:text-sm text-center">
                Bayesian Score
              </div>
            </div>

            {/* 7 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                07 // LINK
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                GRAPH
              </div>
              <div className="font-mono text-text-muted leading-tight text-xs sm:text-sm text-center">
                Dynamic Topology
              </div>
            </div>

            {/* 8 */}
            <div className="flex h-28.75 min-w-0 w-full flex-col items-center justify-between gap-2 bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
              <div className="font-mono text-text-muted uppercase tracking-widest text-xs sm:text-sm whitespace-nowrap">
                08 // EMIT
              </div>
              <div className="font-sans font-bold text-base sm:text-lg uppercase">
                RESULT
              </div>
              <div className="font-mono text-cyan-500 leading-tight text-xs sm:text-sm text-center">
                Audit Dossier
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Workflow;
