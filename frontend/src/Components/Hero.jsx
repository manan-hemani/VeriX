import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded border border-border-strong">
          <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          <span class="text-lemon uppercase text-sm font-light tracking-widest font-mono">
            AUTONOMOUS EVIDENCE INVESTIGATION PLATFORM
          </span>
        </div>
      </div>
      <div class="text-center max-w-4xl mx-auto space-y-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-headline-lg font-bold text-on-surface">
          DON'T JUST ASK IF IT'S TRUE. <br class="hidden sm:inline" />
          <span class="text-lemon underline decoration-primary-container/40 decoration-wavy underline-offset-8 ">
            INVESTIGATE IT.
          </span>
        </h1>
        <br />
        <p class="font-body-lg text-body-lg text-text-secondary max-w-3xl mx-auto">
          RealityCheck AI investigates claims using live web evidence and AI
          reasoning, revealing supporting evidence, contradictions, uncertainty,
          and what remains unknown.
        </p>
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            class="w-full sm:w-auto px-6 py-3.5 rounded bg-lemon text-blueberry font-headline-md text-body-lg font-bold hover:bg-lemon/90 transition-all duration-150 flex items-center justify-center gap-2"
            to="/investigate"
          >
            <span>START INVESTIGATION</span>
          </Link>
          <Link
            class="w-full sm:w-auto px-6 py-3.5 rounded bg-surface-container-low/60 hover:bg-surface-container border border-primary/20 hover:border-lemon-dark transition-all duration-150 flex items-center justify-center gap-2 font-headline-md text-body-lg font-bold"
            to="/how-it-works"
          >
            <span>SEE HOW IT WORKS</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
