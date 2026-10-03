// import React from "react";

const CTA = () => {
  return (
    <>
      <div class="center-glow">
        <div className="flex flex-col items-center justify-center w-full h-full mt-10">
          {/* System Label */}
          <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.25em] text-lemon sm:text-[9px]">
            [ SYSTEM // INVESTIGATION ]
          </div>
          {/* Heading */}
          <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            WHAT SHOULD WE INVESTIGATE?
          </h2>
          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl font-mono text-[10px] leading-relaxed text-text-muted sm:text-[12px] text-center">
            Enter any claim, headline, biomedical assertion, or policy
            hypothesis to deploy the autonomous verification agent.
          </p>
          {/* Input Field */}
          <div className="flex items-center mt-6 w-full max-w-2xl border border-lemon rounded-lg overflow-hidden px-2 min-h-15">
            <span className="px-3 text-xs font-mono text-gray-400">
              QUERY://
            </span>
            <input
              type="text"
              placeholder="Enter a claim to investigate..."
              className="flex-1 px-3 py-2 outline-none bg-transparent"
            />
            <button class="btn-primary">Investigate</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTA;
