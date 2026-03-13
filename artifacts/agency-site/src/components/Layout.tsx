import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <Link href="/">
          <span className="font-bold text-base text-black tracking-tight cursor-pointer">GreyWhale</span>
        </Link>
        <div className="flex items-center gap-8">
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
      </nav>

      <main className="flex-1 pt-[57px]">
        {children}
      </main>

      <footer className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-black">GreyWhale</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-400">Greater Sacramento Area</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/portfolio">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors">Portfolio</span>
          </Link>
          <Link href="/about">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors">About</span>
          </Link>
          <span className="text-sm text-gray-300">© 2026 GreyWhale</span>
        </div>
      </footer>
    </div>
  );
}
