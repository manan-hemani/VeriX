// import React from 'react'

const Investigate = () => {
  return (
    <>
      <div className="bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* HERO */}
          <span className="text-lemon uppercase text-[9px] font-light font-mono">
            ENTER CLAIMS
          </span>
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
              ENTER CLAIMS FOR AUTONOMOUS INVESTIGATION
            </h1>
            <br />
            <p className="font-body-lg text-body-lg text-text-secondary flex-1">
              Autonomous multi-agent verification crawling cross-domain peer
              registries, SerpApi indices, and institutional graphs in
              real-time.
            </p>
          </div>
          <div className="flex flex-row items-center justify-center w-full h-full mt-4 p-4 gap-2 bg-surface border border-border-subtle rounded-2xl">
            <input className="input-verix" placeholder="Enter a claim..." />
            <button className="btn-primary px-4! py-1! ">
              Start Investigation
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Investigate;
