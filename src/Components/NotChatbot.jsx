// import React from "react";

const NotChatbot = () => {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-background px-4 py-20 text-text-primary">
        {/* Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
            linear-gradient(rgba(43, 53, 101, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 53, 101, 0.25) 1px, transparent 1px)
          `,
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/*HEADER*/}
          <div className="mx-auto max-w-3xl text-center">
            {/* System Label */}
            <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.25em] text-lemon sm:text-[9px]">
              [ SYSTEM // INVESTIGATION ]
            </div>

            {/* Heading */}
            <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              NOT A CHATBOT.
              <br />
              <span className="text-text-primary">AN INVESTIGATION AGENT.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl font-mono text-[9px] leading-relaxed text-text-muted sm:text-[10px]">
              LLM chatbots parrot consensus and hallucinate confidence.
              <span className="text-text-secondary">
                {" "}
                TruthTrail deploys autonomous
              </span>
              <br className="hidden sm:block" />
              agents that execute live searches, isolate conflicting claims, and
              challenge assumptions.
            </p>
          </div>

          {/*  PANELS */}
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {/*LEFT — STANDARD AI CHATBOT */}
            <div className="overflow-hidden border border-border-subtle bg-surface-dark shadow-panel">
              {/* Header */}
              <div className="flex h-8 items-center justify-between border-b border-border-subtle px-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] text-text-secondary">
                    Standard AI Chatbot
                  </span>
                </div>

                <span className="font-mono text-[6px] uppercase tracking-wider text-text-disabled">
                  [ SHALLOW PARSING ]
                </span>
              </div>

              {/* Body */}
              <div className="p-3">
                {/* Prompt */}
                <div className="mb-3">
                  <div className="mb-1 font-mono text-[6px] uppercase tracking-widest text-text-disabled">
                    Prompt
                  </div>

                  <div className="border border-border-subtle bg-surface-soft px-3 py-2 font-mono text-[8px] italic text-text-muted">
                    "Does caffeine boost maximum strength?"
                  </div>
                </div>

                {/* Response */}
                <div>
                  <div className="mb-1 font-mono text-[6px] uppercase tracking-widest text-text-disabled">
                    Response
                  </div>

                  <div className="border border-border-subtle bg-surface-soft p-3">
                    <p className="font-mono text-[7px] leading-[1.7] text-text-muted">
                      Yes! Caffeine may increase exercise performance in
                      resistance training. Many studies conclude...
                    </p>

                    <div className="mt-2 space-y-1 font-mono text-[6px] leading-relaxed text-text-disabled">
                      <p>• Generalized claim without source verification</p>

                      <p>• No exploration of contradictory evidence</p>

                      <p>• No distinction between correlation and causation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border-subtle px-3 py-2">
                <span className="font-mono text-[6px] text-text-disabled">
                  Mechanism: Static token prediction without verification loop.
                </span>
              </div>
            </div>

            {/* RIGHT — TRUTHTRAIL AGENT*/}
            <div className="overflow-hidden border border-lemon bg-surface-dark shadow-accent">
              {/* Header */}
              <div className="flex h-8 items-center justify-between border-b border-border-subtle px-3">
                <div className="flex items-center gap-2">
                  {/* Status Indicator */}
                  <span className="h-1.5 w-1.5 rounded-full bg-lemon" />

                  <span className="font-mono text-[8px] uppercase text-lemon">
                    TruthTrail Agent Stream
                  </span>
                </div>

                {/* Status */}
                <span className="border border-lemon-dark px-1.5 py-0.5 font-mono text-[5px] uppercase tracking-wider text-lemon">
                  Autonomous Runner
                </span>
              </div>

              {/* Agent Stream */}
              <div className="space-y-2 p-3">
                {/* INIT */}
                <div className="grid grid-cols-[45px_55px_1fr] gap-2 font-mono text-[6px] leading-relaxed">
                  <span className="text-text-disabled">00:00:01</span>

                  <span className="text-text-secondary">INIT</span>

                  <span className="text-text-muted">
                    Agent initialized with claim:
                    <span className="text-lemon">
                      “Caffeine boosts max strength.”
                    </span>
                  </span>
                </div>

                {/* SEARCH */}
                <div className="grid grid-cols-[45px_55px_1fr] gap-2 font-mono text-[6px] leading-relaxed">
                  <span className="text-text-disabled">00:00:03</span>

                  <span className="text-lemon">SEARCH</span>

                  <span className="text-text-secondary">
                    SerpApi query:
                    <span className="text-lemon">
                      caffeine resistance training maximum strength
                    </span>
                  </span>
                </div>

                {/* ANALYZE */}
                <div className="grid grid-cols-[45px_55px_1fr] gap-2 font-mono text-[6px] leading-relaxed">
                  <span className="text-text-disabled">00:00:07</span>

                  <span className="text-lemon">ANALYZE</span>

                  <span className="text-text-secondary">
                    Retrieved 12 relevant sources. 8 support the claim, 4
                    provide contradictory evidence.
                  </span>
                </div>

                {/* PROBE */}
                <div className="grid grid-cols-[45px_55px_1fr] gap-2 font-mono text-[6px] leading-relaxed">
                  <span className="text-text-disabled">00:00:11</span>

                  <span className="text-lemon">PROBE</span>

                  <span className="text-text-secondary">
                    Challenge hypothesis: Does effect vary by training status,
                    dosage, or exercise type?
                  </span>
                </div>

                {/* SYNTHESIS */}
                <div className="grid grid-cols-[45px_55px_1fr] gap-2 font-mono text-[6px] leading-relaxed">
                  <span className="text-text-disabled">00:00:15</span>

                  <span className="text-lemon">SYNTHESIS</span>

                  <span className="text-text-secondary">
                    Generating topology with
                    <span className="text-lemon">
                      {" "}
                      2 SUPPORTS, 1 CONTRADICTS,
                    </span>{" "}
                    1 UNCERTAIN node.
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border-subtle px-3 py-2">
                <span className="font-mono text-[6px] text-lemon">
                  SUFFICIENCY SCORE: 84.2%
                </span>
                <span className="font-mono text-[6px] text-text-disabled">
                  SOURCES INGESTED: 12
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotChatbot;
