import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link href="/">
          <span className="font-bold text-base text-black tracking-tight cursor-pointer">GreyWhale</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/portfolio">
            <span className={`text-sm cursor-pointer transition-colors ${location === "/portfolio" ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}>
              Portfolio
            </span>
          </Link>
          <Link href="/about">
            <span className={`text-sm cursor-pointer transition-colors ${location === "/about" ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}>
              About
            </span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu bottom sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/10" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white rounded-t-3xl shadow-2xl pb-10">
            <div className="w-10 h-1 rounded bg-gray-200 mx-auto mt-3 mb-2" />
            <Link href="/portfolio">
              <button className="w-full text-left px-6 py-5 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                Portfolio
              </button>
            </Link>
            <Link href="/about">
              <button className="w-full text-left px-6 py-5 text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                About
              </button>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 pt-[57px]">
        {children}
      </main>

      <footer className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-black">GreyWhale</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-sm text-gray-400 hidden sm:inline">Sacramento</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/portfolio">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors hidden md:inline">Portfolio</span>
          </Link>
          <Link href="/about">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors hidden md:inline">About</span>
          </Link>
          <span className="text-xs text-gray-300">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
