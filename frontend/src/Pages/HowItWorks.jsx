// import React from 'react'

const HowItWorks = () => {
  return (
    <>
      {/* HERO */}
      <div className="bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-lemon uppercase text-[9px] font-light font-mono">
            AUTONOMOUS REASONING ARCHITECTURE FOR EVIDENCE INVESTIGATION
          </span>
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
              HOW REALITY CHECK
              <span className="ml-2 text-lemon decoration-primary-container/40 decoration-wavy underline-offset-8 ">
                INVESTIGATES
              </span>
            </h1>
            <br />
            <p className="font-body-lg text-body-lg text-text-secondary max-w-3xl ">
              An Al agent that doesn't stop at the first search result. Built
              for forensic claim decomposition, dynamic hypothesis
              counter-testing, and epistemic sufficiency proofing.
            </p>
          </div>

          {/* PIPELINE */}
          <div className="flex flex-col items-center justify-center w-full h-full mt-10">
            <div className="flex flex-col items-start w-full h-full max-w-7xl  sm:px-6 lg:px-0 font-mono text-lemon uppercase trailing-widest text-sm">
              [core protocol pipeline]
            </div>
            <div className="flex flex-col items-start justify-center w-full h-full max-w-7xl sm:px-6 lg:px-0 font-sans font-bold text-2xl uppercase">
              10-Stage Autonomous Verification Pipeline
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full mt-4">
            <div className=" flex flex-col w-full h-full max-w-7xl bg-blueberry-dark sm:px-6 lg:px-8  border border-border-strong">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 p-2 w-full">
                {/* 1 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    01
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l text-center">
                    ENTER CLAIM
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      User submits an assertion, biomedical hypothesis, or any
                      other claim for verification
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    QUERY
                  </div>
                </div>

                {/* 2 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    02
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    DECOMPOSE
                    <div className="font-mono text-text-muted font-light text-left  sm:text-sm">
                      Gemini decomposes the input into atomic, testable
                      evidentiary hypotheses.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    CLAIMS TO SUB-CLAIMS
                  </div>
                </div>

                {/* 3 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    03
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l text-center">
                    PLAN
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      The Al constructs directed query vectors across targeted
                      domain registries.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    QUERY PLAN
                  </div>
                </div>

                {/* 4 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    04
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l text-center">
                    SEARCH
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      SerpApi executes parallel scrapes across live web, Google
                      Scholar, and arXiv.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    SERPAPI
                  </div>
                </div>

                {/* 5 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    05
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    ANALYZE
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      Gemini parses methodology, sample size (n=), confidence p-
                      values, and source credibility.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    AI CORE
                  </div>
                </div>

                {/* 6 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    06
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    CHALLENGE
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      Adversarial counter-query engine hunts specifically for
                      refutation and publication bias.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    PROBE
                  </div>
                </div>

                {/* 7 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    07
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    CHECK GAPS
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      Scans for unaddressed confounding variables, demographic
                      absence, or conflict of interest.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    GAP DETECTED
                  </div>
                </div>

                {/* 8 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    08
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    DECIDE
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      Calculates Sufficiency Index (≥85%). If NO -+loops to
                      Stage 04. If YES - synthesizes graph.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    85% SUFFICIENCY
                  </div>
                </div>

                {/* 9 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    09
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    GRAPH SYNTHESIS
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      Constructs force-directed network linking claims, evidence
                      nodes, and citations.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    NODES AND EDGES
                  </div>
                </div>

                {/* 10 */}
                <div className="flex h-58.75 min-w-0 w-full flex-col items-center justify-between  bg-surface-dark px-2 py-3 border border-border-subtle hover:border-lemon transition-all duration-300">
                  <div className=" text-lemon font-sans uppercase tracking-widest text-xs bg-blueberry-dark p-1 border border-border-lemon  sm:text-sm whitespace-nowrap">
                    10
                  </div>
                  <div className="font-mono font-bold text-base sm:text-l  text-center">
                    REPORT RESULTS
                    <div className="font-mono text-text-muted font-light text-left sm:text-sm">
                      User receives the results of the verification process with
                      confidence scores, contradictory proof, and source hashes.
                    </div>
                  </div>
                  <div className="font-sans text-cyan-500 font-bold leading-tight text-xs sm:text-sm text-center">
                    VERDICT
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STACK */}
          <div className="flex flex-col items-center justify-center w-full h-full mt-20 ">
            <div className="flex flex-col items-start w-full h-full max-w-7xl  sm:px-6 lg:px-0 font-mono text-lemon uppercase trailing-widest text-sm">
              [system architecture]
            </div>
            <div className="flex flex-col items-start justify-center w-full h-full max-w-7xl sm:px-6 lg:px-0 font-sans font-bold text-2xl uppercase">
              Hight throughput intelligence stack
            </div>
          </div>
          <p class="font-body-lg text-body-lg text-text-secondary max-w-3xl text-left">
            An Al agent that doesn't stop at the first search result. Built for
            forensic claim decomposition, dynamic hypothesis counter-testing,
            and epistemic sufficiency proofing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-2 w-full">
            {/* CARD 1 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                FRONTEND
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                React 18
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    High-performance interactive canvas, real-time telemetry
                    streams, and dynamic data filtering with zero cognitive
                    latency.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">rendering</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  Virtual DOM
                </p>
              </div>
            </div>
            {/* CARD 2 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                REASONING CORE
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                Gemini ""
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    Multi-hop reasoning engine that orchestrates semantic claim
                    decomposition, citation synthesis, and adversarial probe
                    generation.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">context window</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  Tokens
                </p>
              </div>
            </div>
            {/* CARD 3 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                RETRIEVAL
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                SerpApi Cluster
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    Real-time multi-hop retrieval executing concurrent queries
                    across Google Scholar, PubMed, arXiv, and the live global
                    index.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">scrape latency</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  100ms Distributed
                </p>
              </div>
            </div>
            {/* CARD 4 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                RUNTIME
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                Node + Express
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    Agent runtime environment orchestrating asynchronous tool
                    execution, rate limiting, and persistent session streaming
                    via SSE.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">concurrency</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  Non-blocking Event Loops
                </p>
              </div>
            </div>
            {/* CARD 5 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                TOPOLOGY
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                React Flow
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    Dynamic force-directed node visualization mapping claims,
                    citations, contradictory edges, and empirical veracity
                    relationships.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">graph pipeline</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  DAG Graph Assembly
                </p>
              </div>
            </div>
            {/* CARD 6 */}
            <div className="card flex flex-col gap-2 p-2 w-full h-full bg-surface-dark border border-border-subtle">
              <div className="text-lemon-dark font-mono font-bold text-center uppercase text-xs sm:text-sm">
                STORAGE
              </div>
              <div className="font-sans font-bold text-base sm:text-lg">
                MONGO DB ATLAS
                <div className="font-mono text-text-muted font-light text-left sm:text-xs mt-2">
                  <p>
                    Stores immutable evidence dossiers, graph edge weights, DOI
                    hashes, and cryptographically verified investigator audit
                    logs.
                  </p>
                </div>
              </div>
              <hr className="border-border-strong" />
              <div className="font-mono flex flex-row items-center justify-between gap-2 text-text-muted font-light text-left sm:text-sm">
                <p className="uppercase">data integrity</p>
                <p className="text-cyan-500 font-sans font-bold text-[0.6rem] sm:text-[0.75rem]">
                  Encrypted Document Storage
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center w-full h-full mt-10 border border-lemon-dark rounded-lg p-4 gap-4 ">
            <p className="text-center">Ready to get started?</p>
            <h1 className="font-sans text-3xl">
              SEE THE EVIDENCE. UNDERSTAND THE UNCERTAINITY
            </h1>
            <p className="font-mono text-text-muted font-light text-sm max-w-3xl text-center">
              Deploy the autonomous verification agent on any assertion,
              biomedical claim, financial disclosure, or policy statement.
            </p>
            <div className="flex flex-row items-center justify-center gap-4">
              <button class="btn-primary">Start Investigation</button>
              <button class="btn-secondary">View History</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
