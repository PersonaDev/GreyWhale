import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false);

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
        <Link href="/portfolio">
          <button onClick={close} className="w-full text-left px-6 py-5 text-lg font-medium text-gray-900 mx-2 rounded-xl hover:bg-gray-50 transition-colors" style={{ width: "calc(100% - 16px)" }}>
            Portfolio
          </button>
        </Link>
        <Link href="/about">
          <button onClick={close} className="w-full text-left px-6 py-5 text-lg font-medium text-gray-900 mx-2 rounded-xl hover:bg-gray-50 transition-colors" style={{ width: "calc(100% - 16px)" }}>
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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link href="/">
          <span className="font-bold text-base text-black tracking-wide cursor-pointer" style={{ letterSpacing: "0.04em" }}>GreyWhale</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/portfolio">
            <span className={`text-sm cursor-pointer transition-colors tracking-wide ${location === "/portfolio" ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}>
              Portfolio
            </span>
          </Link>
          <Link href="/about">
            <span className={`text-sm cursor-pointer transition-colors tracking-wide ${location === "/about" ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}>
              About
            </span>
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-0 cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-0.5 bg-black origin-center transition-all duration-300 ease-in-out"
            style={{
              width: 20,
              transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-0.5 bg-black transition-all duration-300 ease-in-out mt-[5px]"
            style={{
              width: 20,
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
            }}
          />
          <span
            className="block h-0.5 bg-black origin-center transition-all duration-300 ease-in-out mt-[5px]"
            style={{
              width: 20,
              transform: menuOpen ? "translateY(-11px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

      <main className="flex-1 pt-[57px]">
        {children}
      </main>

      <footer className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-black tracking-wide">GreyWhale</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-sm text-gray-400 hidden sm:inline tracking-wide">Sacramento</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/portfolio">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors hidden md:inline tracking-wide">Portfolio</span>
          </Link>
          <Link href="/about">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors hidden md:inline tracking-wide">About</span>
          </Link>
          <span className="text-xs text-gray-300 tracking-wider">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
