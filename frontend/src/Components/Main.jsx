// import React from "react";

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <div className=" flex flex-col items-center w-full h-full max-w-7xl bg-surface-dark sm:px-6 lg:px-8  border border-border-subtle rounded-lg">
        <div className="flex flex-row justify-around w-3/4 h-full gap-4 p-4">
          {/* 1st box */}
          <div className="flex flex-col *:items-center justify-center w-1/2 h-full gap-4 p-2 border border-border-strong">
            {/* 1st row */}
            <div className="flex flex-row *:items-center justify-between w-full h-full gap-4 text-[10px]">
              <div className="text-text-muted font-bold">ISSN 0025-7990</div>
              <div className="border-2 border-cyan-500 text-cyan-200 bg-cyan-500/20 font-sans font-bold  px-2 py-1 uppercase">
                [OK] supports
              </div>
            </div>
            <div className="text-text-muted font-mono text-left w-full">
              Academic Review: Moderate ergogenic benefit in trained cohorts.
            </div>
            <div className="text-cyan-200 font-mono text-left w-full">
              +4.2 % effect size confirmed.
            </div>
          </div>
          {/* 2nd box */}
          <div className="flex flex-col *:items-center justify-center w-1/2 h-full gap-4 p-2 border border-border-strong">
            {/* 1st row */}
            <div className="flex flex-row *:items-center justify-between w-full h-full gap-4 text-[10px]">
              <div className="text-text-muted font-bold">ISSN 0025-7990</div>
              <div className="border-2 border-red-500 text-red-500 bg-red-500/20 font-sans font-bold  px-2 py-1 uppercase">
                [OK] supports
              </div>
            </div>
            {/* 2nd Row */}
            <div className="text-text-muted font-mono text-left w-full">
              Academic Review: Moderate ergogenic benefit in trained cohorts.
            </div>
            {/* 3rd row */}
            <div className="text-cyan-200 font-mono text-left w-full">
              +4.2 % effect size confirmed.
            </div>
          </div>
        </div>
        {/* 3rd box */}
        <div className="flex flex-col *:items-center justify-center w-1/2 h-full gap-4 p-2 border border-lemon">
          {/* 1st row */}
          <div className="flex flex-row *:items-center justify-between w-full h-full gap-4 text-[10px]">
            <div className="text-text-muted font-bold">ISSN 0025-7990</div>
            <div className="border-2 border-cyan-500 text-cyan-200 bg-cyan-500/20 font-sans font-bold  px-2 py-1 uppercase">
              [OK] supports
            </div>
          </div>
          <div className="text-text-muted font-mono text-left w-full">
            Academic Review: Moderate ergogenic benefit in trained cohorts.
          </div>
          <div className="text-cyan-200 font-mono text-left w-full">
            +4.2 % effect size confirmed.
          </div>
        </div>
        <div className="flex flex-row justify-around w-3/4 h-full gap-4 p-4">
          {/* 4th box */}
          <div className="flex flex-col *:items-center justify-center w-1/2 h-full gap-4 p-2 border border-border-strong">
            {/* 1st row */}
            <div className="flex flex-row *:items-center justify-between w-full h-full gap-4 text-[10px]">
              <div className="text-text-muted font-bold">ISSN 0025-7990</div>
              <div className="border-2 border-cyan-500 text-cyan-200 bg-cyan-500/20 font-sans font-bold  px-2 py-1 uppercase">
                [OK] supports
              </div>
            </div>
            <div className="text-text-muted font-mono text-left w-full">
              Academic Review: Moderate ergogenic benefit in trained cohorts.
            </div>
            <div className="text-cyan-200 font-mono text-left w-full">
              +4.2 % effect size confirmed.
            </div>
          </div>
          {/* 5th box */}
          <div className="flex flex-col *:items-center justify-center w-1/2 h-full gap-4 p-2 border border-border-strong">
            {/* 1st row */}
            <div className="flex flex-row *:items-center justify-between w-full h-full gap-4 text-[10px]">
              <div className="text-text-muted font-bold">ISSN 0025-7990</div>
              <div className="border-2 border-red-500 text-red-500 bg-red-500/20 font-sans font-bold  px-2 py-1 uppercase">
                [OK] supports
              </div>
            </div>
            {/* 2nd Row */}
            <div className="text-text-muted font-mono text-left w-full">
              Academic Review: Moderate ergogenic benefit in trained cohorts.
            </div>
            {/* 3rd row */}
            <div className="text-cyan-200 font-mono text-left w-full">
              +4.2 % effect size confirmed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
