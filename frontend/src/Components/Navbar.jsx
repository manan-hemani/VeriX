// import {Link} from "react-router-dom";
import verixLogo from "../Assets/verix.png";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-border bg-surface-soft/90 backdrop-blur-xl">
      <div className="container-verix flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <img src={verixLogo} alt="VeriX Logo" className="h-8 w-8" />

          <div>
            <div className="font-sans text-lg font-bold tracking-tight">
              Veri<span className="text-lemon">X</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              Evidence Investigation
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary "
          >
            Home
          </a>

          <a
            href="#graph"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Evidence History
          </a>

          <a
            href="#how-it-works"
            className="font-sans text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            How It Works
          </a>
        </nav>

        <button className="btn-primary px-4! py-2!">New Investigation</button>
      </div>
    </header>
  );
};

export default Navbar;
