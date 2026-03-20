import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import SentenceBuilder from "@/components/SentenceBuilder";

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
  {
    name: "Valley Roots Cafe",
    meta: "Food & Drink · Davis, CA",
    url: "valleyrootscafe.com",
    gradient: "from-amber-100 via-orange-50 to-yellow-50",
    cardTextColor: "#1a3c2a",
    isDark: false,
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

// ─── Terminal window with typing animation ────────────────────────────────────

function CodeWindow() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [finishedLines, setFinishedLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= CODE_LINES.length) {
      setDone(true);
      return;
    }
    const line = CODE_LINES[lineIdx];
    if (charIdx >= line.length) {
      const delay = line === "" ? 80 : line.startsWith("$") ? 350 : 180;
      const t = setTimeout(() => {
        setFinishedLines((p) => [...p, line]);
        setLineIdx((p) => p + 1);
        setCharIdx(0);
      }, delay);
      return () => clearTimeout(t);
    }
    const speed = line.startsWith("✓") ? 18 : line.startsWith("$") ? 55 : 30;
    const t = setTimeout(() => setCharIdx((p) => p + 1), speed);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, done]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [finishedLines, charIdx]);

  function lineColor(line: string) {
    if (line.startsWith("✓")) return "#4ade80";
    if (line.startsWith("$")) return "#ffffff";
    return "#52525b";
  }

  const currentLine = !done && lineIdx < CODE_LINES.length ? CODE_LINES[lineIdx] : null;

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700/60 shadow-2xl">
      <div className="bg-zinc-800 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-zinc-500 text-xs font-mono ml-1 tracking-wide">greywhale — terminal</span>
      </div>
      <div
        className="bg-zinc-950 px-5 py-5 font-mono text-xs md:text-sm leading-7 overflow-hidden"
        style={{ minHeight: "22rem" }}
      >
        {finishedLines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line) }}>
            {line || "\u00A0"}
          </div>
        ))}
        {currentLine !== null && (
          <div style={{ color: lineColor(currentLine) }}>
            {currentLine.slice(0, charIdx)}
            <span className="text-zinc-400" style={{ animation: "none", opacity: 1 }}>█</span>
          </div>
        )}
        {done && (
          <div className="mt-2 text-zinc-600 text-xs">_</div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Before / After slider ────────────────────────────────────────────────────

function BeforeAfterSlider() {
  const [pct, setPct] = useState(42);
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
        className="relative overflow-hidden rounded-2xl select-none cursor-col-resize border border-gray-100"
        style={{ height: "20rem" }}
        onMouseDown={(e) => { dragging.current = true; updatePct(e.clientX); }}
        onTouchStart={(e) => updatePct(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); updatePct(e.touches[0].clientX); }}
      >
        {/* Template side */}
        <div className="absolute inset-0 bg-zinc-50 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 border-b border-zinc-200">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            </div>
            <div className="flex-1 mx-3 h-5 bg-zinc-200 rounded flex items-center px-2">
              <span className="text-xs text-zinc-400 font-mono">genericbusiness.squarespace.com</span>
            </div>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 mb-1">
              <div className="w-20 h-3.5 bg-zinc-300 rounded" />
              <div className="flex gap-4">
                {["Home", "About", "Contact"].map((l) => (
                  <span key={l} className="text-xs text-zinc-400">{l}</span>
                ))}
              </div>
            </div>
            <div className="h-5 w-56 bg-zinc-300 rounded" />
            <div className="h-3.5 w-full bg-zinc-200 rounded" />
            <div className="h-3.5 w-3/4 bg-zinc-200 rounded" />
            <div className="h-3.5 w-5/6 bg-zinc-200 rounded" />
            <div className="h-9 w-32 bg-zinc-300 rounded-full mt-1" />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1,2,3].map((n) => (
                <div key={n} className="h-14 bg-zinc-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="absolute top-14 left-3 px-2 py-0.5 bg-zinc-500/70 text-white text-xs rounded font-medium tracking-wider">
            Template
          </div>
        </div>

        {/* Bespoke side — clipped from left */}
        <div
          className="absolute inset-0 bg-zinc-950 flex flex-col"
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 border-b border-zinc-700">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-3 h-5 bg-zinc-700 rounded flex items-center px-2">
              <span className="text-xs text-zinc-400 font-mono">heritageoakdental.com</span>
            </div>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-1">
              <div className="w-20 h-3.5 bg-white/25 rounded" />
              <div className="flex gap-4">
                {["Home", "Services", "Patients", "Book"].map((l) => (
                  <span key={l} className="text-xs text-zinc-500">{l}</span>
                ))}
              </div>
            </div>
            <div className="h-5 w-56 bg-white/20 rounded" />
            <div className="h-3.5 w-full bg-white/10 rounded" />
            <div className="h-3.5 w-3/4 bg-white/10 rounded" />
            <div className="h-3.5 w-5/6 bg-white/10 rounded" />
            <div className="h-9 w-32 bg-white/80 rounded-full mt-1" />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1,2,3].map((n) => (
                <div key={n} className="h-14 bg-white/8 rounded-lg border border-white/10" />
              ))}
            </div>
          </div>
          <div className="absolute top-14 right-3 px-2 py-0.5 bg-white/15 text-white text-xs rounded font-medium tracking-wider">
            Bespoke
          </div>
        </div>

        {/* Divider + handle */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{ left: `${pct}%` }}
        >
          <div className="absolute inset-y-0 -translate-x-px w-0.5 bg-white/90" />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 tracking-wide">← Drag to compare →</p>
    </div>
  );
}

// ─── Browser card ─────────────────────────────────────────────────────────────

function BrowserCard({ project }: { project: typeof homeProjects[0] }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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
      <div className={`flex items-center justify-center h-64 md:h-80 bg-gradient-to-br ${project.gradient}`}>
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
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Home() {
  const builderRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);

  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const heroStyle = (delay: number): React.CSSProperties => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  });

  function scrollToBuilder() {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToWork() {
    workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Layout>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-14 pb-16 md:pt-20 md:pb-20 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">

            {/* Left — text */}
            <div className="w-full md:w-[55%] text-center md:text-left">
              <div style={heroStyle(0)}>
                <h1
                  className="font-bold text-black tracking-tight leading-none"
                  style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)", letterSpacing: "-0.03em" }}
                >
                  We don't build websites.
                  <br />
                  <span style={{ WebkitTextStroke: "2px black", color: "transparent" }}>
                    We 10x your business.
                  </span>
                </h1>
              </div>

              <div style={heroStyle(200)}>
                <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                  Bespoke websites engineered to dominate local search. More visibility. More customers. More revenue. Every site we build is hand-coded, SEO-loaded, and designed to make your phone ring.
                </p>
              </div>

              <div style={heroStyle(400)} className="mt-8 flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
                <button
                  onClick={scrollToBuilder}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide"
                >
                  Get Started →
                </button>
                <button
                  onClick={scrollToWork}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all cursor-pointer tracking-wide"
                >
                  See Our Work →
                </button>
              </div>

              <div style={heroStyle(550)}>
                <p className="mt-5 text-xs text-gray-400 tracking-widest" style={{ letterSpacing: "0.1em" }}>
                  No upfront cost · Live in 14 days · Cancel anytime
                </p>
              </div>
            </div>

            {/* Right — code window */}
            <div className="w-full md:w-[45%]" style={heroStyle(300)}>
              <CodeWindow />
            </div>
          </div>
        </div>

        {/* Scroll nudge */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 justify-center" style={heroStyle(800)}>
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
              Most agencies hand you a pretty site and call it a day. We build you a machine that climbs Google rankings, captures local searches, and sends real customers to your door. Design is the surface. Visibility is the engine.
            </p>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-100 mb-16">
            {[
              { stat: "97%", label: "of consumers search online before visiting a local business" },
              { stat: "75%", label: "of users never scroll past the first page of Google" },
              { stat: "46%", label: "of all Google searches are looking for local businesses" },
            ].map((item, i) => (
              <Reveal key={item.stat} delay={i * 100}>
                <div className={`p-8 md:p-10 text-center ${i < 2 ? "border-b md:border-b-0 md:border-r border-gray-100" : ""}`}>
                  <p
                    className="font-bold text-black mb-3"
                    style={{ fontSize: "clamp(2.8rem, 6vw, 4rem)", letterSpacing: "-0.04em" }}
                  >
                    {item.stat}
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
                  Every site we build includes structured data markup, local schema, Google Business Profile optimization, meta tags targeting your city and services, XML sitemaps, and mobile-first indexing. This isn't an add-on. It's the foundation.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-white p-8">
                <p className="font-bold text-black text-lg mb-4 tracking-tight">Our Backlink Mesh Network</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every GreyWhale client is part of something bigger. When we build your site, we connect it to a growing network of real, local business websites — all linking to each other. Every new client makes YOUR site rank higher. Your SEO doesn't just start strong. It gets stronger every month.
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
              Every single site is coded by hand, designed from a blank canvas, and built around YOUR brand, YOUR customers, and YOUR goals. No two GreyWhale sites look alike. Ever. Because no two businesses are alike.
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
            <p className="text-center text-sm text-gray-500 mt-10 leading-relaxed max-w-2xl mx-auto italic">
              "One-time builds decay. GreyWhale sites compound. That's why you pay monthly — because your site should get better every month, not worse."
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: SELECTED WORK ────────────────────────────────────── */}
      <div ref={workRef} />
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

          <div className="space-y-8">
            {homeProjects.map((project, i) => (
              <Reveal key={project.name} delay={i * 120}>
                <BrowserCard project={project} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="mt-12 text-center">
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
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              How we stack up.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-200">
            <Reveal className="border-b md:border-b-0 md:border-r border-gray-200 p-8">
              <p className="font-semibold text-gray-500 text-base mb-1">DIY Builders</p>
              <p className="text-xs text-gray-400 mb-6">Squarespace, Wix, etc.</p>
              {["$16–39/month", "You build it yourself", "Template design", "You handle SEO", "Basic support docs"].map((item) => (
                <p key={item} className="text-sm text-gray-500 py-2.5 border-b border-gray-100 last:border-0 tracking-wide">{item}</p>
              ))}
            </Reveal>

            <Reveal delay={120} className="border-b md:border-b-0 md:border-r border-gray-200 p-8">
              <p className="font-semibold text-gray-500 text-base mb-1">Traditional Agency</p>
              <p className="text-xs text-gray-400 mb-6">Full-service studios</p>
              {["$4,000–10,000 upfront", "6–12 week timeline", "Contract lock-in", "Maintenance costs extra", "$200–2,000/month"].map((item) => (
                <p key={item} className="text-sm text-gray-500 py-2.5 border-b border-gray-100 last:border-0 tracking-wide">{item}</p>
              ))}
            </Reveal>

            <Reveal delay={240} className="p-8 bg-black">
              <p className="font-semibold text-white text-base mb-1">GreyWhale</p>
              <p className="text-xs text-gray-500 mb-6">Sacramento's new studio</p>
              {["$149/month, no upfront", "Custom design, not a template", "Live in 14 days", "SEO built in", "Cancel anytime"].map((item) => (
                <p key={item} className="text-sm text-gray-300 py-2.5 border-b border-white/10 last:border-0 tracking-wide">{item}</p>
              ))}
            </Reveal>
          </div>

          <Reveal delay={350}>
            <p className="text-center text-sm text-gray-400 mt-8 tracking-wide">
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
                body: "Your customers are already searching. 'Dentist near me.' 'Best barbershop Sacramento.' 'Auto repair Roseville.' We engineer your site to own those searches. First page of Google. Every time.",
              },
              {
                n: "02",
                title: "Get Chosen",
                body: "A bespoke, lightning-fast, mobile-perfect site builds trust in seconds. When a customer lands on your site, they decide instantly whether you're legit. We make sure you look like the only option.",
              },
              {
                n: "03",
                title: "Get Booked",
                body: "Click-to-call. Online booking. Contact forms that actually notify you. Google Maps. Every site is built to turn a visitor into a customer — not just an impression on a screen.",
              },
            ].map((card, i) => (
              <Reveal key={card.n} delay={i * 100}>
                <div className="border border-gray-100 rounded-2xl p-8 flex flex-col gap-4 h-full">
                  <span
                    className="text-gray-200 font-bold text-3xl"
                    style={{ letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}
                  >
                    {card.n}
                  </span>
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
                    tier.popular ? "border-2 border-black -mt-0 md:-mt-4 shadow-lg" : "border border-gray-200"
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
                  <button
                    onClick={scrollToBuilder}
                    className={`w-full py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular ? "bg-black text-white hover:opacity-80" : "border border-gray-300 text-black hover:bg-gray-50"
                    }`}
                  >
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
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

      {/* ── SECTION 9: SENTENCE BUILDER ─────────────────────────────────── */}
      <section id="builder-section" className="border-t border-gray-100 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              Let's build yours.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div ref={builderRef}>
              <SentenceBuilder />
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
}
