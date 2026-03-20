import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setVisible(true));
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <div
        className="relative bg-white rounded-t-3xl shadow-2xl pb-10 transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mt-3 mb-2" />

        <div className="px-4 py-3 mx-2">
          <Link href="/start">
            <button
              onClick={close}
              className="w-full py-3.5 rounded-2xl bg-black text-white text-base font-medium text-center cursor-pointer tracking-wide"
            >
              Start Your Site →
            </button>
          </Link>
        </div>

        <div className="h-px bg-gray-100 mx-6 my-2" />

        <Link href="/portfolio">
          <button onClick={close} className={`w-full text-left px-6 py-5 text-lg font-normal mx-2 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-colors ${location === "/portfolio" ? "text-gray-600" : "text-black"}`} style={{ width: "calc(100% - 16px)" }}>
            Portfolio
          </button>
        </Link>
        <Link href="/pricing">
          <button onClick={close} className={`w-full text-left px-6 py-5 text-lg font-normal mx-2 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-colors ${location === "/pricing" ? "text-gray-600" : "text-black"}`} style={{ width: "calc(100% - 16px)" }}>
            Pricing
          </button>
        </Link>
        <Link href="/about">
          <button onClick={close} className={`w-full text-left px-6 py-5 text-lg font-normal mx-2 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-colors ${location === "/about" ? "text-gray-600" : "text-black"}`} style={{ width: "calc(100% - 16px)" }}>
            About
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 90);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <span className="font-bold text-xl text-black cursor-pointer" style={{ letterSpacing: "-0.02em" }}>GreyWhale</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link href="/portfolio">
              <span className={`text-sm font-normal cursor-pointer transition-colors tracking-wide ${location === "/portfolio" ? "text-gray-500" : "text-black hover:text-gray-500"}`}>Portfolio</span>
            </Link>
            <Link href="/pricing">
              <span className={`text-sm font-normal cursor-pointer transition-colors tracking-wide ${location === "/pricing" ? "text-gray-500" : "text-black hover:text-gray-500"}`}>Pricing</span>
            </Link>
            <Link href="/about">
              <span className={`text-sm font-normal cursor-pointer transition-colors tracking-wide ${location === "/about" ? "text-gray-500" : "text-black hover:text-gray-500"}`}>About</span>
            </Link>
            <Link href="/start">
              <button className="nav-cta-pulse inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide">
                Start Your Site →
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              className="flex flex-col justify-center items-center w-8 h-8 gap-0 cursor-pointer"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className="block h-0.5 bg-black origin-center transition-all duration-300 ease-in-out" style={{ width: 20, transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none" }} />
              <span className="block h-0.5 bg-black transition-all duration-300 ease-in-out mt-[5px]" style={{ width: 20, opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "scaleX(1)" }} />
              <span className="block h-0.5 bg-black origin-center transition-all duration-300 ease-in-out mt-[5px]" style={{ width: 20, transform: menuOpen ? "translateY(-11px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

      <main className="flex-1 pt-[57px]">
        {children}
      </main>

      <footer className="border-t border-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <span className="font-bold text-base text-black" style={{ letterSpacing: "-0.02em" }}>GreyWhale</span>

            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-4" style={{ letterSpacing: "0.12em" }}>Pages</p>
                <div className="flex flex-col gap-3">
                  <Link href="/portfolio"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Portfolio</span></Link>
                  <Link href="/pricing"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Pricing</span></Link>
                  <Link href="/about"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">About</span></Link>
                  <Link href="/start"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Get Started</span></Link>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-4" style={{ letterSpacing: "0.12em" }}>Industries</p>
                <div className="flex flex-col gap-3">
                  <Link href="/for/dentists"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Dentists</span></Link>
                  <Link href="/for/barbershops"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Barbershops</span></Link>
                  <Link href="/for/restaurants"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Restaurants</span></Link>
                  <Link href="/for/plumbers"><span className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer">Plumbers</span></Link>
                  <Link href="/for"><span className="text-sm text-gray-400 hover:text-black transition-colors cursor-pointer">View all →</span></Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 tracking-wide">© 2026 GreyWhale. Sacramento, CA.</span>
            <Link href="/for">
              <span className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer tracking-wide">All Industries →</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
