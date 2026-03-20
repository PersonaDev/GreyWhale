import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const homeProjects = [
  {
    name: "Blue Oak Dental",
    meta: "Healthcare · Folsom, CA",
    url: "blueoakdental.com",
    gradient: "from-stone-200 via-stone-100 to-amber-50",
    cardTextColor: "#1a1a1a",
    isDark: false,
  },
  {
    name: "Maison Caldo",
    meta: "E-commerce · Sacramento, CA",
    url: "maisoncaldo.com",
    gradient: "from-neutral-900 via-neutral-800 to-zinc-900",
    cardTextColor: "#ffffff",
    isDark: true,
  },
];

const homeTiers = [
  {
    id: "essential",
    name: "Starter",
    price: "$149",
    popular: false,
    features: ["Up to 5 pages", "Custom design", "SEO + hosting", "1 revision/month"],
  },
  {
    id: "growth",
    name: "Professional",
    price: "$249",
    popular: true,
    features: ["Up to 10 pages", "Booking + forms", "Advanced SEO", "2 revisions/month"],
  },
  {
    id: "premium",
    name: "Business",
    price: "$349",
    popular: false,
    features: ["Up to 20 pages", "E-commerce", "Custom integrations", "Unlimited revisions"],
  },
];

const CODE_LINES = [
  '$ greywhale build --client "your-business"',
  "",
  "✓ Custom design system created",
  "✓ SEO schema markup injected",
  "✓ Google Business Profile optimized",
  "✓ Backlink mesh network connected",
  "✓ Mobile responsive audit passed",
  "✓ Core Web Vitals: 98/100",
  "✓ Local search ranking: optimizing...",
  "",
  "$ Deploying to production...",
  "$ Your site is live. Customers are coming.",
];

const BACK_LINES = [
  "<!-- index.html — Heritage Oak Dental -->",
  '<meta name="description"',
  '  content="Sacramento dentist near you.">',
  '<script type="application/ld+json">',
  "  { @type: LocalBusiness,",
  '    name: "Heritage Oak Dental",',
  '    address: "Folsom, CA" }',
  "</script>",
  "",
  "/* Core Web Vitals: PASS */",
  "LCP:  1.2s  ✓",
  "FID:  12ms  ✓",
  "CLS:  0.01  ✓",
];

// ─── Count-up stat animation ──────────────────────────────────────────────────

function CountUp({ to, suffix = "%" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1400;
          const t0 = Date.now();
          const frame = () => {
            const p = Math.min((Date.now() - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * to));
            if (p < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Light-mode stacked terminal ──────────────────────────────────────────────

function BackWindow() {
  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 shrink-0 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        </div>
        <span className="text-gray-400 text-xs font-mono ml-1 tracking-wide">heritageoakdental.com — source</span>
      </div>
      <div className="flex-1 px-4 py-4 font-mono text-xs leading-6 overflow-hidden">
        {BACK_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.startsWith("<!--") || line.startsWith("/*") || line.startsWith("*/")
                ? "#6b7280"
                : line.startsWith("✓") || line.startsWith("LCP") || line.startsWith("FID") || line.startsWith("CLS")
                ? "#16a34a"
                : line.startsWith("$") || line.startsWith("//")
                ? "#1e40af"
                : "#374151",
            }}
          >
            {line || "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
}

function FrontWindow() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [finishedLines, setFinishedLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= CODE_LINES.length) { setDone(true); return; }
    const line = CODE_LINES[lineIdx];
    if (charIdx >= line.length) {
      const delay = line === "" ? 80 : line.startsWith("$") ? 360 : 190;
      const t = setTimeout(() => {
        setFinishedLines((p) => [...p, line]);
        setLineIdx((p) => p + 1);
        setCharIdx(0);
      }, delay);
      return () => clearTimeout(t);
    }
    const speed = line.startsWith("✓") ? 18 : line.startsWith("$") ? 52 : 28;
    const t = setTimeout(() => setCharIdx((p) => p + 1), speed);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, done]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [finishedLines]);

  function lineColor(line: string): string {
    if (line.startsWith("✓")) return "#16a34a";
    if (line.startsWith("$")) return "#111827";
    return "#6b7280";
  }

  const currentLine = !done && lineIdx < CODE_LINES.length ? CODE_LINES[lineIdx] : null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white">
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-gray-400 text-xs font-mono ml-1 tracking-wide">greywhale — terminal</span>
      </div>
      <div
        className="bg-white px-5 py-5 font-mono text-xs md:text-sm leading-7 overflow-hidden"
        style={{ minHeight: "20rem" }}
      >
        {finishedLines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line) }}>
            {line || "\u00A0"}
          </div>
        ))}
        {currentLine !== null && (
          <div style={{ color: lineColor(currentLine) }}>
            {currentLine.slice(0, charIdx)}
            <span className="text-gray-300">█</span>
          </div>
        )}
        {done && <div className="text-gray-300 mt-1">_</div>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function CodeWindowStack() {
  return (
    <div className="relative" style={{ paddingTop: "18px", paddingRight: "18px" }}>
      <div
        className="absolute top-0 right-0 rounded-xl overflow-hidden opacity-80"
        style={{ left: "18px", bottom: "18px", zIndex: 0 }}
      >
        <BackWindow />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        <FrontWindow />
      </div>
    </div>
  );
}

// ─── Before / After slider ────────────────────────────────────────────────────

function BeforeAfterSlider() {
  const [pct, setPct] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePct = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    setPct(Math.max(6, Math.min(94, ((clientX - left) / width) * 100)));
  }, []);

  useEffect(() => {
    const onUp = () => { dragging.current = false; };
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePct(e.clientX); };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mousemove", onMove);
    };
  }, [updatePct]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl select-none cursor-col-resize border border-gray-100 shadow-sm"
        style={{ height: "22rem" }}
        onMouseDown={(e) => { dragging.current = true; updatePct(e.clientX); }}
        onTouchStart={(e) => updatePct(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); updatePct(e.touches[0].clientX); }}
      >
        {/* ── Template side (left) — obviously generic ── */}
        <div className="absolute inset-0 flex flex-col" style={{ background: "#f5f0e8" }}>
          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: "#e8e0d4", borderColor: "#d4cabb" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#bbb0a0" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#bbb0a0" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#bbb0a0" }} />
            </div>
            <div className="flex-1 mx-2 h-5 rounded flex items-center px-2" style={{ background: "#ddd8cf" }}>
              <span className="text-xs font-mono" style={{ color: "#a09080" }}>genericbusiness.squarespace.com</span>
            </div>
          </div>
          {/* Nav */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: "#ede7db", borderColor: "#d4cabb" }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#7a6a5a" }}>ACME BUSINESS CO.</span>
            <div className="flex gap-4 text-xs" style={{ color: "#a09080" }}>
              {["Home", "About", "Services", "Contact"].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          {/* Hero content */}
          <div className="flex-1 px-5 py-4 flex flex-col gap-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "#b0a090" }}>Welcome To Our Website</p>
            <p className="font-bold text-lg leading-snug" style={{ color: "#5a4a3a" }}>We Provide Quality<br />Business Services</p>
            <p className="text-xs leading-relaxed mt-1" style={{ color: "#9a8a7a" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />Sed do eiusmod tempor incididunt ut labore.
            </p>
            <div
              className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase mt-2 rounded"
              style={{ background: "#4a90d9", color: "#fff" }}
            >
              LEARN MORE
            </div>
            {/* Grid placeholders */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded flex items-center justify-center" style={{ height: "4rem", background: "#ddd8cf" }}>
                  <svg className="w-6 h-6" style={{ color: "#bbb0a0" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase" style={{ background: "rgba(120,100,80,0.65)", color: "#fff" }}>
            Template
          </div>
        </div>

        {/* ── Bespoke side (right) — obviously premium ── */}
        <div
          className="absolute inset-0 bg-zinc-950 flex flex-col"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        >
          {/* Chrome */}
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-2 h-5 bg-zinc-700 rounded flex items-center px-2">
              <span className="text-xs text-zinc-400 font-mono">heritageoakdental.com</span>
            </div>
          </div>
          {/* Nav */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-white tracking-widest uppercase" style={{ letterSpacing: "0.14em" }}>Heritage Oak</span>
            </div>
            <div className="flex gap-4 text-xs text-zinc-500">
              {["Services", "Patients", "Our Team", "Book Now"].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          {/* Hero content */}
          <div className="flex-1 px-5 py-5 flex flex-col gap-2.5">
            <div className="w-8 h-0.5 bg-emerald-400 mb-1" />
            <p className="font-bold text-white text-xl leading-snug" style={{ letterSpacing: "-0.02em" }}>
              Sacramento's most<br />trusted dental care.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Modern dentistry in a comfortable setting.<br />Family-owned and trusted since 2003.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/30 text-white text-xs rounded-full tracking-wider font-medium mt-1">
              Book an Appointment →
            </div>
            {/* Service cards */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["General\nDentistry", "Cosmetic\nCare", "Emergency\nCare"].map((s) => (
                <div key={s} className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex flex-col gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  <p className="text-white text-[9px] font-semibold leading-tight whitespace-pre-line">{s}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-white/10 text-white rounded text-xs font-semibold tracking-wider uppercase">
            Bespoke
          </div>
        </div>

        {/* Divider + handle */}
        <div className="absolute top-0 bottom-0 pointer-events-none z-20" style={{ left: `${pct}%` }}>
          <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white/80" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100">
            <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 tracking-wide">← Drag to compare →</p>
    </div>
  );
}

// ─── Browser card (compact with hover) ────────────────────────────────────────

function BrowserCard({ project }: { project: typeof homeProjects[0] }) {
  return (
    <Link href="/portfolio">
      <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer">
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${project.isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className={`flex-1 flex items-center justify-center gap-1.5 text-xs rounded-md px-3 py-1.5 ${project.isDark ? "bg-zinc-700 text-zinc-400" : "bg-gray-100 text-gray-400"}`}>
            <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="tracking-wide">{project.url}</span>
          </div>
        </div>
        <div className={`flex items-center justify-center h-48 md:h-56 bg-gradient-to-br ${project.gradient}`}>
          <span
            className="text-2xl md:text-3xl tracking-tight"
            style={{ color: project.cardTextColor, fontFamily: "'Georgia','Times New Roman',serif", fontWeight: 600 }}
          >
            {project.name}
          </span>
        </div>
        <div className={`px-5 py-4 border-t ${project.isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-50"}`}>
          <p className={`font-semibold text-base ${project.isDark ? "text-white" : "text-black"}`}>{project.name}</p>
          <p className={`text-sm mt-0.5 ${project.isDark ? "text-zinc-400" : "text-gray-400"}`}>{project.meta}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

const compFeatures = [
  { label: "Custom design", diy: false, agency: true, gw: true },
  { label: "No upfront cost", diy: true, agency: false, gw: true },
  { label: "SEO built in", diy: false, agency: false, gw: true },
  { label: "Live in 14 days", diy: false, agency: false, gw: true },
  { label: "No contract", diy: true, agency: false, gw: true },
  { label: "Ongoing updates", diy: false, agency: false, gw: true },
  { label: "Direct support", diy: false, agency: false, gw: true },
];

function Check({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="text-emerald-500 font-bold text-base">✓</span>
  ) : (
    <span className="text-gray-300 font-bold text-base">✗</span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const heroStyle = (delay: number): React.CSSProperties => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  });

  return (
    <Layout>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-12 pb-16 md:pt-18 md:pb-24 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">

            {/* Left — text */}
            <div className="w-full md:w-[52%] text-center md:text-left">
              <div style={heroStyle(0)}>
                <h1
                  className="font-bold text-black tracking-tight leading-none"
                  style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
                >
                  Your next customer
                  <br />
                  is Googling you
                  <br />
                  right now.
                </h1>
              </div>

              <div style={heroStyle(180)}>
                <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-400 max-w-lg mx-auto md:mx-0">
                  Let's make sure they find you. Hand-coded, SEO-loaded websites built to rank on Google and turn searchers into paying customers.
                </p>
              </div>

              <div style={heroStyle(360)} className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
                <Link href="/start">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide">
                    Get Started →
                  </button>
                </Link>
                <Link href="/portfolio">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all cursor-pointer tracking-wide">
                    See Our Work →
                  </button>
                </Link>
              </div>

              <div style={heroStyle(520)}>
                <p className="mt-5 text-xs text-gray-400 tracking-widest" style={{ letterSpacing: "0.1em" }}>
                  No upfront cost · Live in 14 days · Cancel anytime
                </p>
              </div>
            </div>

            {/* Right — stacked terminals */}
            <div className="w-full md:w-[48%]" style={heroStyle(260)}>
              <CodeWindowStack />
            </div>
          </div>
        </div>

        {/* Scroll nudge */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 justify-center" style={heroStyle(900)}>
          <svg
            className="w-5 h-5 text-gray-300"
            style={{ animation: "scrollNudge 2.5s ease-in-out infinite" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: VISIBILITY FIRST ─────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-5"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", letterSpacing: "-0.025em" }}
            >
              A gorgeous website means nothing<br className="hidden md:block" /> if nobody sees it.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-center text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-16">
              Other agencies hand you a pretty site and disappear. We build a machine that climbs Google, captures searches, and sends customers through your door.
            </p>
          </Reveal>

          {/* Stats — count-up on scroll */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-100 mb-16">
            {[
              { to: 97, label: "of consumers search online before visiting a local business" },
              { to: 75, label: "of users never scroll past the first page of Google" },
              { to: 46, label: "of all Google searches have local intent" },
            ].map((item, i) => (
              <Reveal key={item.to} delay={i * 80}>
                <div className={`p-8 md:p-10 text-center ${i < 2 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}`}>
                  <p
                    className="font-bold text-black mb-3"
                    style={{ fontSize: "clamp(2.8rem, 6vw, 4rem)", letterSpacing: "-0.04em" }}
                  >
                    <CountUp to={item.to} />
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            <Reveal>
              <div className="bg-white p-8">
                <p className="font-bold text-black text-lg mb-4 tracking-tight">Local SEO Built Into Every Page</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Structured data. Local schema. Google Business Profile optimization. City-targeted meta tags. XML sitemaps. Mobile-first indexing. All standard. All included. All built to get you found.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white p-8">
                <p className="font-bold text-black text-lg mb-4 tracking-tight">Our Backlink Mesh Network</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every GreyWhale client is part of something bigger. We connect your site to a growing network of real local business websites — all linking to each other behind the scenes. Every new client makes YOUR rankings stronger. Your SEO doesn't just start strong. It compounds.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: BESPOKE ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-5"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", letterSpacing: "-0.025em" }}
            >
              Every site is bespoke.<br />Every pixel is intentional.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-center text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
              We don't use templates. We don't use themes. We don't use page builders. Drag the slider to see the difference.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <BeforeAfterSlider />
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-10 text-sm text-gray-500 leading-relaxed text-center max-w-2xl mx-auto">
              Every site is coded by hand, designed from a blank canvas, built around YOUR brand and YOUR customers. No two GreyWhale sites look alike. Ever.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: MONTHLY MODEL JUSTIFICATION ──────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", letterSpacing: "-0.025em" }}
            >
              A website isn't a project.<br />It's a weapon. We keep it sharp.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            <Reveal>
              <div className="bg-white p-8 md:p-10">
                <p className="text-sm text-gray-400 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.12em" }}>
                  The one-time build trap
                </p>
                <div className="space-y-3.5">
                  {[
                    "You pay $5,000–10,000 upfront",
                    "Site launches and immediately starts aging",
                    "No security updates, no SEO adjustments",
                    "Google changes its algorithm — your rankings drop",
                    "Design looks dated within 18 months",
                    "Something breaks and you're hunting for a freelancer",
                    "You're paying for something that's slowly dying",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-gray-300 mt-0.5 shrink-0">✕</span>
                      <p className="text-sm text-gray-400 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-black p-8 md:p-10">
                <p className="text-sm text-zinc-500 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.12em" }}>
                  The GreyWhale way
                </p>
                <div className="space-y-3.5">
                  {[
                    "No upfront cost — ever",
                    "Continuous design updates that keep your site modern",
                    "Ongoing SEO monitoring as Google evolves",
                    "Security patches and maintenance handled automatically",
                    "Your mesh network backlinks grow stronger every month",
                    "Direct support from the people who built your site",
                    "Your site doesn't age — it compounds",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <p className="text-sm text-gray-200 leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={250}>
            <p className="text-center text-base font-semibold text-black mt-10 tracking-tight" style={{ letterSpacing: "-0.01em" }}>
              One-time builds decay. GreyWhale sites compound.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: SELECTED WORK ────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight mb-14"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              Selected Work
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {homeProjects.map((project, i) => (
              <Reveal key={project.name} delay={i * 120}>
                <BrowserCard project={project} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-10 text-left">
              <Link href="/portfolio">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer tracking-wide">
                  View all projects
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 6: COMPARISON ───────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              How we stack up.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="grid grid-cols-4 border-b border-gray-200">
                <div className="p-5 border-r border-gray-200" />
                <div className="p-5 border-r border-gray-200 text-center">
                  <p className="font-semibold text-gray-500 text-sm">DIY Builders</p>
                  <p className="text-xs text-gray-400 mt-0.5">Squarespace, Wix</p>
                </div>
                <div className="p-5 border-r border-gray-200 text-center">
                  <p className="font-semibold text-gray-500 text-sm">Agency</p>
                  <p className="text-xs text-gray-400 mt-0.5">Traditional studio</p>
                </div>
                <div className="p-5 text-center bg-black">
                  <p className="font-semibold text-white text-sm">GreyWhale</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Sacramento's studio</p>
                </div>
              </div>

              {/* Price row */}
              <div className="grid grid-cols-4 border-b border-gray-100">
                <div className="p-4 border-r border-gray-100 text-xs text-gray-500 font-medium flex items-center">Monthly cost</div>
                <div className="p-4 border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">$16–39/mo</div>
                <div className="p-4 border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">$200–2,000/mo</div>
                <div className="p-4 text-center text-sm font-semibold text-white flex items-center justify-center bg-black/95">$149/mo</div>
              </div>
              <div className="grid grid-cols-4 border-b border-gray-100">
                <div className="p-4 border-r border-gray-100 text-xs text-gray-500 font-medium flex items-center">Setup cost</div>
                <div className="p-4 border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">None</div>
                <div className="p-4 border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">$5K–10K</div>
                <div className="p-4 text-center text-xs text-emerald-400 flex items-center justify-center font-semibold bg-black/95">None</div>
              </div>

              {/* Feature rows */}
              {compFeatures.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-4 ${i < compFeatures.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="p-4 border-r border-gray-100 text-xs text-gray-500 font-medium flex items-center">{row.label}</div>
                  <div className="p-4 border-r border-gray-100 flex items-center justify-center"><Check yes={row.diy} /></div>
                  <div className="p-4 border-r border-gray-100 flex items-center justify-center"><Check yes={row.agency} /></div>
                  <div className="p-4 flex items-center justify-center bg-black/95"><span className="text-emerald-400 font-bold text-base">✓</span></div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-sm text-gray-400 mt-7 tracking-wide">
              Same quality as an agency. Simpler than a builder. Fraction of the cost.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 7: CLIENT ACQUISITION ───────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", letterSpacing: "-0.025em" }}
            >
              More calls. More bookings.<br className="hidden md:block" /> More walk-ins. That's the point.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "Get Found",
                body: "Your customers are already searching. 'Dentist near me.' 'Best barbershop Sacramento.' 'Auto repair Roseville.' We engineer your site to own those searches. First page. Every time.",
              },
              {
                n: "02",
                title: "Get Chosen",
                body: "A bespoke, lightning-fast, mobile-perfect site builds trust in seconds. When a customer lands on your page, they decide instantly whether you're legit. We make sure you look like the only option.",
              },
              {
                n: "03",
                title: "Get Booked",
                body: "Click-to-call. Online booking. Contact forms that notify you instantly. Google Maps integration. Every site is built to turn a visitor into a customer — not just an impression.",
              },
            ].map((card, i) => (
              <Reveal key={card.n} delay={i * 100}>
                <div className="border border-gray-100 rounded-2xl p-8 flex flex-col gap-4 h-full">
                  <span className="text-gray-200 font-bold text-3xl" style={{ letterSpacing: "-0.04em" }}>{card.n}</span>
                  <p className="font-bold text-black text-xl tracking-tight">{card.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: PRICING ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              Simple pricing.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {homeTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 100}>
                <div
                  className={`relative rounded-2xl p-7 flex flex-col bg-white ${
                    tier.popular ? "border-2 border-black md:-mt-4 shadow-lg" : "border border-gray-200"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold tracking-wide">
                      Most popular
                    </span>
                  )}
                  <p className="font-bold text-black text-2xl mb-0.5">{tier.name}</p>
                  <p className="text-gray-400 text-sm mb-5">
                    <span className="text-3xl font-bold text-black">{tier.price}</span>/month
                  </p>
                  <ul className="space-y-2 mb-7 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/start">
                    <button
                      className={`w-full py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        tier.popular ? "bg-black text-white hover:opacity-80" : "border border-gray-300 text-black hover:bg-gray-50"
                      }`}
                    >
                      Get Started
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={350}>
            <div className="text-center mt-10 space-y-3">
              <p className="text-sm text-gray-400 tracking-wide">No upfront cost. No contract. Cancel anytime.</p>
              <Link href="/pricing">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer tracking-wide">
                  See full plan details
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 9: CLOSING CTA ──────────────────────────────────────── */}
      <section className="px-6 py-28 md:py-36 text-center">
        <Reveal>
          <h2
            className="font-bold text-black tracking-tight mb-8"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}
          >
            Let's build yours.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <Link href="/start">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide">
              Start Your Site →
            </button>
          </Link>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 text-sm text-gray-400 tracking-wide">
            No upfront cost. Live in 14 days. Cancel anytime.
          </p>
        </Reveal>
      </section>

    </Layout>
  );
}
