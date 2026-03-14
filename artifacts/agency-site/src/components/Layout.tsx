import { useState, useEffect } from "react";
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
        <Link href="/portfolio">
          <button onClick={close} className={`w-full text-left px-6 py-5 text-lg font-normal mx-2 rounded-xl hover:text-gray-600 hover:bg-gray-50 transition-colors ${location === "/portfolio" ? "text-gray-600" : "text-black"}`} style={{ width: "calc(100% - 16px)" }}>
            Portfolio
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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/">
            <span className="font-bold text-xl text-black cursor-pointer" style={{ letterSpacing: "-0.02em" }}>GreyWhale</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/portfolio">
              <span className={`text-sm font-normal cursor-pointer transition-colors tracking-wide ${location === "/portfolio" ? "text-gray-600" : "text-black hover:text-gray-600"}`}>
                Portfolio
              </span>
            </Link>
            <Link href="/about">
              <span className={`text-sm font-normal cursor-pointer transition-colors tracking-wide ${location === "/about" ? "text-gray-600" : "text-black hover:text-gray-600"}`}>
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
        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}

      <main className="flex-1 pt-[57px]">
        {children}
      </main>

      <footer className="border-t border-gray-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-sm text-black" style={{ letterSpacing: "-0.02em" }}>GreyWhale</span>
          <span className="text-xs text-gray-400 tracking-wider">© 2026</span>
        </div>
      </footer>
    </div>
  );
}
