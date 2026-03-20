import React, { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const homeProjects = [
  {
    name: "Heritage Oak Dental",
    meta: "Healthcare · Rocklin, CA",
    url: "bluedental.greywhale.dev",
    href: "https://bluedental.greywhale.dev",
    thumbnail: "/work-bluedental.png",
    gradient: "from-stone-200 via-stone-100 to-amber-50",
    cardTextColor: "#1a1a1a",
    isDark: false,
  },
  {
    name: "Maison Caldo",
    meta: "E-commerce · Sacramento, CA",
    url: "maisoncaldo.com",
    href: "/portfolio",
    thumbnail: null,
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
    features: [
      "Up to 5 pages",
      "Custom design",
      "SEO + hosting",
      "1 revision/month",
    ],
  },
  {
    id: "growth",
    name: "Professional",
    price: "$249",
    popular: true,
    features: [
      "Up to 10 pages",
      "Booking + forms",
      "Advanced SEO",
      "2 revisions/month",
    ],
  },
  {
    id: "premium",
    name: "Business",
    price: "$349",
    popular: false,
    features: [
      "Up to 20 pages",
      "E-commerce",
      "Custom integrations",
      "Unlimited revisions",
    ],
  },
];

// ─── Terminal span types ──────────────────────────────────────────────────────

type TSpan = { t: string; c?: string; bold?: boolean; ul?: boolean };
type TLine = TSpan[] | null;

// label + dots = 28 chars each so "done" aligns vertically
const TERMINAL_LINES: TLine[] = [
  [
    { t: "$ ", c: "#6b7280" },
    { t: "gw deploy --production", c: "#111827", bold: true },
  ],
  null,
  [{ t: "pulling config", c: "#6b7280" }, { t: "..............", c: "#d1d5db" }, { t: " done", c: "#22c55e" }],
  [{ t: "compiling routes", c: "#6b7280" }, { t: "............", c: "#d1d5db" }, { t: " done", c: "#22c55e" }],
  [{ t: "schema injection", c: "#6b7280" }, { t: "............", c: "#d1d5db" }, { t: " done", c: "#22c55e" }],
  [{ t: "sitemap gen", c: "#6b7280" }, { t: ".................", c: "#d1d5db" }, { t: " done", c: "#22c55e" }],
  [{ t: "mesh sync ", c: "#6b7280" }, { t: "(14 nodes)", c: "#06b6d4" }, { t: "........", c: "#d1d5db" }, { t: " done", c: "#22c55e" }],
  [{ t: "lighthouse", c: "#6b7280" }, { t: "..................", c: "#d1d5db" }, { t: " 98/100", c: "#22c55e", bold: true }],
  null,
  [{ t: "deployed → ", c: "#6b7280" }, { t: "client.greywhale.dev", c: "#3b82f6", ul: true }],
];

function tFlat(line: TLine): string {
  if (!line) return "";
  return line.map((s) => s.t).join("");
}

function tSpeed(line: TLine, idx: number): number {
  if (!line) return 80;
  let rem = idx;
  for (const span of line) {
    if (rem < span.t.length) {
      if (/^\.+$/.test(span.t)) return 5;
      if (span.c === "#22c55e" || span.c === "#06b6d4") return 16;
      if (span.bold && span.c === "#111827") return 55;
      return 20;
    }
    rem -= span.t.length;
  }
  return 20;
}

function tRender(line: TLine, upTo?: number): React.ReactNode {
  if (!line) return "\u00A0";
  const parts: React.ReactNode[] = [];
  let rem = upTo !== undefined ? upTo : Infinity;
  for (let i = 0; i < line.length; i++) {
    if (rem <= 0) break;
    const span = line[i];
    const visible = upTo !== undefined ? span.t.slice(0, rem) : span.t;
    rem -= span.t.length;
    if (!visible) break;
    parts.push(
      <span
        key={i}
        style={{
          color: span.c,
          fontWeight: span.bold ? "bold" : undefined,
          textDecoration: span.ul ? "underline" : undefined,
        }}
      >
        {visible}
      </span>,
    );
  }
  return <>{parts}</>;
}

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
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
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
        <span className="text-gray-400 text-xs font-mono ml-1 tracking-wide">
          heritageoakdental.com — source
        </span>
      </div>
      <div className="flex-1 px-4 py-4 font-mono text-xs leading-6 overflow-hidden">
        {BACK_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.startsWith("<!--") ||
                line.startsWith("/*") ||
                line.startsWith("*/")
                  ? "#6b7280"
                  : line.startsWith("✓") ||
                      line.startsWith("LCP") ||
                      line.startsWith("FID") ||
                      line.startsWith("CLS")
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
  const [finishedLines, setFinishedLines] = useState<TLine[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= TERMINAL_LINES.length) {
      setDone(true);
      return;
    }
    const line = TERMINAL_LINES[lineIdx];
    const text = tFlat(line);
    if (charIdx >= text.length) {
      const delay = !line ? 80 : text.startsWith("$ ") ? 400 : 180;
      const t = setTimeout(() => {
        setFinishedLines((p) => [...p, line]);
        setLineIdx((p) => p + 1);
        setCharIdx(0);
      }, delay);
      return () => clearTimeout(t);
    }
    const speed = tSpeed(line, charIdx);
    const t = setTimeout(() => setCharIdx((p) => p + 1), speed);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, done]);

  const currentLine =
    !done && lineIdx < TERMINAL_LINES.length ? TERMINAL_LINES[lineIdx] : null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white">
      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-gray-400 text-xs font-mono ml-1 tracking-wide">
          greywhale — terminal
        </span>
      </div>
      <div
        className="bg-white px-5 py-5 text-xs md:text-sm leading-7 overflow-hidden"
        style={{
          minHeight: "20rem",
          fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        {finishedLines.map((line, i) => (
          <div key={i}>{tRender(line)}</div>
        ))}
        {currentLine !== null && (
          <div>
            {tRender(currentLine, charIdx)}
            <span className="text-gray-300">█</span>
          </div>
        )}
        {done && <div className="text-gray-300 mt-1">_</div>}
      </div>
    </div>
  );
}

function CodeWindowStack() {
  return (
    <div
      className="relative"
      style={{ paddingTop: "18px", paddingRight: "18px" }}
    >
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
    const onUp = () => {
      dragging.current = false;
    };
    const onMove = (e: MouseEvent) => {
      if (dragging.current) updatePct(e.clientX);
    };
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
        style={{ aspectRatio: "16/9" }}
        onMouseDown={(e) => {
          dragging.current = true;
          updatePct(e.clientX);
        }}
        onTouchStart={(e) => updatePct(e.touches[0].clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          updatePct(e.touches[0].clientX);
        }}
      >
        {/* ── Bespoke side (left, base) — Heritage Oak Dental new site ── */}
        <div className="absolute inset-0">
          <img
            src="/slider-bespoke.png"
            alt="GreyWhale bespoke website"
            className="w-full h-full object-cover object-top select-none"
            draggable={false}
          />
          <div
            className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase"
            style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
          >
            Bespoke
          </div>
        </div>

        {/* ── Template side (right, clipped) — Heritage Oak old template site ── */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        >
          <img
            src="/slider-template.png"
            alt="Generic template website"
            className="w-full h-full object-cover object-top select-none"
            draggable={false}
          />
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase" style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>
            Template
          </div>
        </div>

        {/* Divider + handle */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{ left: `${pct}%` }}
        >
          <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white/80" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-100">
            <svg
              className="w-4 h-4 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l-3 3 3 3M16 9l3 3-3 3"
              />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 tracking-wide">
        ← Drag to compare →
      </p>
    </div>
  );
}

// ─── Browser card (compact with hover) ────────────────────────────────────────

function BrowserCard({ project }: { project: (typeof homeProjects)[0] }) {
  const isExternal = project.href.startsWith("http");
  const inner = (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer">
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b ${project.isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"}`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs rounded-md px-3 py-1.5 ${project.isDark ? "bg-zinc-700 text-zinc-400" : "bg-gray-100 text-gray-400"}`}
        >
          <svg
            className="w-3 h-3 shrink-0 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="tracking-wide">{project.url}</span>
        </div>
      </div>
      {project.thumbnail ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center aspect-video bg-gradient-to-br ${project.gradient}`}
        >
          <span
            className="text-2xl md:text-3xl tracking-tight"
            style={{
              color: project.cardTextColor,
              fontFamily: "'Georgia','Times New Roman',serif",
              fontWeight: 600,
            }}
          >
            {project.name}
          </span>
        </div>
      )}
        <div
          className={`px-5 py-4 border-t ${project.isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-50"}`}
        >
          <p
            className={`font-semibold text-base ${project.isDark ? "text-white" : "text-black"}`}
          >
            {project.name}
          </p>
          <p
            className={`text-sm mt-0.5 ${project.isDark ? "text-zinc-400" : "text-gray-400"}`}
          >
            {project.meta}
          </p>
        </div>
      </div>
  );
  return isExternal ? (
    <a href={project.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={project.href}>{inner}</Link>
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
                  style={{
                    fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
                    letterSpacing: "-0.03em",
                  }}
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
                  Let's make sure they find you. SEO-loaded, bespoke websites
                  built to rank on Google and turn searchers into paying
                  customers.
                </p>
              </div>

              <div
                style={heroStyle(360)}
                className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start"
              >
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
                <p
                  className="mt-5 text-xs text-gray-400 tracking-widest"
                  style={{ letterSpacing: "0.1em" }}
                >
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
        <div
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 justify-center"
          style={heroStyle(900)}
        >
          <svg
            className="w-5 h-5 text-gray-300"
            style={{ animation: "scrollNudge 2.5s ease-in-out infinite" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: VISIBILITY FIRST ─────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-5"
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              A gorgeous website means nothing
              <br className="hidden md:block" /> if nobody sees it.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-center text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-16">
              Other agencies hand you a pretty site and disappear. We build a
              machine that climbs Google, captures searches, and sends customers
              through your door.
            </p>
          </Reveal>

          {/* Stats — count-up on scroll */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-100 mb-16">
            {[
              {
                to: 97,
                label:
                  "of consumers search online before visiting a local business",
              },
              {
                to: 75,
                label: "of users never scroll past the first page of Google",
              },
              { to: 46, label: "of all Google searches have local intent" },
            ].map((item, i) => (
              <Reveal key={item.to} delay={i * 80}>
                <div
                  className={`p-8 md:p-10 text-center ${i < 2 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}`}
                >
                  <p
                    className="font-bold text-black mb-3"
                    style={{
                      fontSize: "clamp(2.8rem, 6vw, 4rem)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    <CountUp to={item.to} />
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Two columns */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 items-start">
              <Reveal>
                <div className="bg-white p-8">
                  <p className="font-bold text-black text-lg mb-4 tracking-tight">
                    Local SEO Built Into Every Page
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Structured data. Local schema. Google Business Profile
                    optimization. City-targeted meta tags. XML sitemaps.
                    Mobile-first indexing. All standard. All included. All built
                    to get you found.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="bg-white p-8">
                  <p className="font-bold text-black text-lg mb-4 tracking-tight">
                    Every new client makes your site rank higher.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    When Google ranks sites, one of its biggest signals is how
                    many other sites link to yours. Every GreyWhale client gets
                    woven into a private link mesh — invisible to visitors, but
                    Google reads it clearly. Sign a new restaurant down the
                    street and your dental practice climbs. Every new member
                    lifts the whole network.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: BESPOKE ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-5"
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Every site is bespoke.
              <br />
              Every pixel is intentional.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-center text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
              No templates. No themes. No page builders. Drag the slider.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <BeforeAfterSlider />
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-10 text-sm text-gray-500 leading-relaxed text-center max-w-2xl mx-auto">
              Every site is designed from a blank canvas and built around YOUR
              brand, YOUR customers, and YOUR goals. No templates. No themes. No
              cookie-cutter layouts.
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
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              A website isn't a project.
              <br />
              It's a weapon. We keep it sharp.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <Reveal>
              <div
                className="bg-white p-8 md:p-10 rounded-xl border border-gray-200"
                style={{
                  transform: "rotate(-0.5deg)",
                  opacity: 0.72,
                  filter: "saturate(0.7)",
                }}
              >
                <p
                  className="text-sm text-gray-400 tracking-widest uppercase mb-6"
                  style={{ letterSpacing: "0.12em" }}
                >
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
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div
                className="bg-black p-8 md:p-10 rounded-xl"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
              >
                <p
                  className="text-sm text-zinc-500 tracking-widest uppercase mb-6"
                  style={{ letterSpacing: "0.12em" }}
                >
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
                      <span className="text-emerald-400 mt-0.5 shrink-0">
                        ✓
                      </span>
                      <p className="text-sm text-gray-200 leading-relaxed font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={250}>
            <p
              className="text-center text-base font-semibold text-black mt-10 tracking-tight"
              style={{ letterSpacing: "-0.01em" }}
            >
              One-time builds decay. GreyWhale sites compound.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: SELECTED WORK ────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight mb-14"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.025em",
              }}
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
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
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
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              How we stack up.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            {/* ── Mobile: transposed — competitors as rows, features as columns ── */}
            <div className="md:hidden overflow-x-auto -mx-6 rounded-2xl border border-gray-200" style={{ WebkitOverflowScrolling: "touch" }}>
              <table className="border-collapse" style={{ minWidth: "640px" }}>
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-white p-3 border-b border-r border-gray-200 text-left text-[11px] text-gray-400 font-medium min-w-[110px]" />
                    {["Monthly", "Setup", "Custom", "No upfront", "SEO", "14 days", "No contract", "Updates", "Support"].map((col) => (
                      <th key={col} className="p-3 border-b border-r border-gray-200 text-center text-[10px] text-gray-500 font-semibold whitespace-nowrap last:border-r-0 min-w-[72px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* DIY row */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-white p-3 border-b border-r border-gray-100">
                      <p className="font-semibold text-gray-500 text-xs">DIY</p>
                      <p className="text-[10px] text-gray-400 leading-tight">Squarespace, Wix</p>
                    </td>
                    <td className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500">$16–39/mo</td>
                    <td className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500">None</td>
                    {compFeatures.map((f) => (
                      <td key={f.label} className={`p-3 border-b border-r border-gray-100 text-center last:border-r-0 ${!f.diy ? "bg-red-50" : ""}`}>
                        <Check yes={f.diy} />
                      </td>
                    ))}
                  </tr>
                  {/* Agency row */}
                  <tr className="bg-gray-50/60">
                    <td className="sticky left-0 z-10 bg-gray-50 p-3 border-b border-r border-gray-100">
                      <p className="font-semibold text-gray-500 text-xs">Agency</p>
                      <p className="text-[10px] text-gray-400 leading-tight">Traditional studio</p>
                    </td>
                    <td className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500">$200–2k/mo</td>
                    <td className="p-3 border-b border-r border-gray-100 text-center text-xs text-red-400 font-semibold bg-red-50">$5K–10K</td>
                    {compFeatures.map((f) => (
                      <td key={f.label} className={`p-3 border-b border-r border-gray-100 text-center last:border-r-0 ${!f.agency ? "bg-red-50" : "bg-gray-50/60"}`}>
                        <Check yes={f.agency} />
                      </td>
                    ))}
                  </tr>
                  {/* GreyWhale row */}
                  <tr style={{ borderTop: "3px solid #10b981" }}>
                    <td className="sticky left-0 z-10 bg-black p-3 border-r border-zinc-800" style={{ borderTop: "3px solid #10b981" }}>
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest uppercase mb-1">✦ Best</span>
                      <p className="font-bold text-white text-xs">GreyWhale</p>
                      <p className="text-[10px] text-zinc-500 leading-tight">Sacramento</p>
                    </td>
                    <td className="p-3 border-r border-zinc-800 text-center text-sm font-bold text-white bg-black/95">$149/mo</td>
                    <td className="p-3 border-r border-zinc-800 text-center text-xs text-emerald-400 font-semibold bg-black/95">None</td>
                    {compFeatures.map((f) => (
                      <td key={f.label} className="p-3 border-r border-zinc-800 text-center bg-black/95 last:border-r-0">
                        <span className="text-emerald-400 font-bold text-lg">✓</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Desktop: original 4-column grid ── */}
            <div
              className="hidden md:grid rounded-2xl overflow-hidden border border-gray-200"
              style={{
                gridTemplateColumns: "1.4fr 1fr 1fr 1.8fr",
              }}
            >
                {/* Header */}
                <div className="p-4 border-b border-r border-gray-200" />
                <div className="p-4 border-b border-r border-gray-200 text-center">
                  <p className="font-semibold text-gray-500 text-sm">
                    DIY Builders
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Squarespace, Wix</p>
                </div>
                <div className="p-4 border-b border-r border-gray-200 text-center">
                  <p className="font-semibold text-gray-500 text-sm">Agency</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Traditional studio
                  </p>
                </div>
                <div
                  className="py-6 px-4 border-b border-gray-200 text-center bg-black flex flex-col items-center justify-center gap-1"
                  style={{ borderTop: "3px solid #10b981" }}
                >
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-0.5">
                    ✦ Best Value
                  </span>
                  <p className="font-bold text-white text-base">GreyWhale</p>
                  <p className="text-xs text-zinc-500">Sacramento's studio</p>
                </div>

                {/* Price row */}
                <div className="p-3 border-b border-r border-gray-100 text-xs text-gray-600 font-semibold flex items-center">
                  Monthly cost
                </div>
                <div className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">
                  $16–39/mo
                </div>
                <div className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">
                  $200–2,000/mo
                </div>
                <div className="p-3 border-b border-gray-100 text-center text-sm font-bold text-white flex items-center justify-center bg-black/95">
                  $149/mo
                </div>

                <div className="p-3 border-b border-r border-gray-100 text-xs text-gray-600 font-semibold flex items-center">
                  Setup cost
                </div>
                <div className="p-3 border-b border-r border-gray-100 text-center text-xs text-gray-500 flex items-center justify-center">
                  None
                </div>
                <div className="p-3 border-b border-r border-gray-100 text-center text-xs text-red-400 flex items-center justify-center font-semibold bg-red-50">
                  $5K–10K
                </div>
                <div className="p-3 border-b border-gray-100 text-center text-xs text-emerald-500 flex items-center justify-center font-semibold bg-black/95">
                  None
                </div>

                {/* Feature rows */}
                {compFeatures.map((row, i) => {
                  const alt = i % 2 !== 0;
                  const notLast = i < compFeatures.length - 1;
                  return (
                    <Fragment key={row.label}>
                      <div
                        className={`p-3 border-r border-gray-100 text-xs text-gray-700 font-semibold flex items-center ${notLast ? "border-b" : ""} ${alt ? "bg-gray-50/60" : ""}`}
                      >
                        {row.label}
                      </div>
                      <div
                        className={`p-3 border-r border-gray-100 flex items-center justify-center ${notLast ? "border-b" : ""} ${!row.diy ? "bg-red-50" : alt ? "bg-gray-50/60" : ""}`}
                      >
                        <Check yes={row.diy} />
                      </div>
                      <div
                        className={`p-3 border-r border-gray-100 flex items-center justify-center ${notLast ? "border-b" : ""} ${!row.agency ? "bg-red-50" : alt ? "bg-gray-50/60" : ""}`}
                      >
                        <Check yes={row.agency} />
                      </div>
                      <div
                        className={`p-3 flex items-center justify-center bg-black/95 ${notLast ? "border-b border-zinc-800" : ""}`}
                      >
                        <span className="text-emerald-400 font-bold text-xl">
                          ✓
                        </span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-sm font-semibold text-black mt-7 tracking-tight">
              Every check. No upfront. $149/month.
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
              style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                letterSpacing: "-0.025em",
              }}
            >
              More calls. More bookings.
              <br className="hidden md:block" /> More walk-ins. That's the
              point.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {[
              {
                n: "01",
                title: "Get Found",
                body: "Your customers are already searching. 'Dentist near me.' 'Barbershop Sacramento.' We put you at the top of those results. First page. Every time.",
              },
              {
                n: "02",
                title: "Get Chosen",
                body: "Three seconds. That's how long someone takes to decide if your business is legit. A fast, clean, bespoke site makes you the obvious choice.",
              },
              {
                n: "03",
                title: "Get Booked",
                body: "Click-to-call. Online booking. Forms that notify you instantly. Every site is built to turn a visitor into a paying customer.",
              },
            ].map((card, i) => (
              <Reveal key={card.n} delay={i * 100} className="flex">
                <div className="relative border border-gray-100 rounded-2xl p-8 flex flex-col gap-4 flex-1">
                  <span
                    className="font-black text-gray-100 select-none"
                    style={{
                      fontSize: "4.5rem",
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {card.n}
                  </span>
                  <p className="font-bold text-black text-xl tracking-tight">
                    {card.title}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {card.body}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center">
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={350}>
            <p className="text-center text-base font-bold text-black mt-10 tracking-tight">
              That's the entire funnel. We build all of it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 8: PRICING ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Simple pricing.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {homeTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 100}>
                <div
                  className={`relative rounded-2xl p-7 flex flex-col bg-white ${
                    tier.popular
                      ? "border-2 border-black md:-mt-4 shadow-lg"
                      : "border border-gray-200"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold tracking-wide">
                      Most popular
                    </span>
                  )}
                  <p className="font-bold text-black text-2xl mb-0.5">
                    {tier.name}
                  </p>
                  <p className="text-gray-400 text-sm mb-5">
                    <span className="text-3xl font-bold text-black">
                      {tier.price}
                    </span>
                    /month
                  </p>
                  <ul className="space-y-2 mb-7 flex-1">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/start">
                    <button
                      className={`w-full py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        tier.popular
                          ? "bg-black text-white hover:opacity-80"
                          : "border border-gray-300 text-black hover:bg-gray-50"
                      }`}
                    >
                      Get Started
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={350}>
            <div className="text-center mt-10 space-y-3">
              <p className="text-sm text-gray-400 tracking-wide">
                No upfront cost. No contract. Cancel anytime.
              </p>
              <Link href="/pricing">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer tracking-wide">
                  See full plan details
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
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
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              letterSpacing: "-0.03em",
            }}
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
