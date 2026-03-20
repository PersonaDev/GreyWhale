import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import SentenceBuilder from "@/components/SentenceBuilder";

// ─── Homepage data ────────────────────────────────────────────────────────────

const homeProjects = [
  {
    name: "Blue Oak Dental",
    meta: "Healthcare · Folsom, CA",
    url: "blueoakdental.com",
    gradient: "from-stone-200 via-stone-100 to-amber-50",
    cardBg: "#ffffff",
    cardTextColor: "#1a1a1a",
    isDark: false,
  },
  {
    name: "Maison Caldo",
    meta: "E-commerce · Sacramento, CA",
    url: "maisoncaldo.com",
    gradient: "from-neutral-900 via-neutral-800 to-zinc-900",
    cardBg: "#1a1a1a",
    cardTextColor: "#ffffff",
    isDark: true,
  },
  {
    name: "Valley Roots Cafe",
    meta: "Food & Drink · Davis, CA",
    url: "valleyrootscafe.com",
    gradient: "from-amber-100 via-orange-50 to-yellow-50",
    cardBg: "#f5ede0",
    cardTextColor: "#1a3c2a",
    isDark: false,
  },
];

const features = [
  { title: "Custom Design", desc: "Built from scratch for your brand." },
  { title: "Mobile Optimized", desc: "Perfect on every device." },
  { title: "SEO Built In", desc: "Structured to rank locally." },
  { title: "Self-Service Edits", desc: "Update text and images yourself." },
  { title: "Hosting Included", desc: "Fast, secure, always online." },
  { title: "14-Day Launch", desc: "First call to live site in two weeks." },
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
          style={{ color: project.cardTextColor, fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
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
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  function scrollToBuilder() {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToWork() {
    workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const heroStyle = (delay: number): React.CSSProperties => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <Layout>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div style={heroStyle(0)}>
            <h1
              className="font-bold text-black leading-tight tracking-tight"
              style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", letterSpacing: "-0.03em" }}
            >
              We're the new agency in town.
            </h1>
          </div>

          <div style={heroStyle(180)}>
            <p
              className="font-semibold text-gray-300 leading-tight mt-3"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              And that's exactly why we outwork everyone.
            </p>
          </div>

          <div style={heroStyle(350)}>
            <p className="mt-8 text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              GreyWhale is a web design studio for local businesses in Sacramento.
              Custom designed. SEO optimized. Live in 14 days.
            </p>
          </div>

          <div style={heroStyle(500)} className="mt-10">
            <button
              onClick={scrollToWork}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer tracking-wide"
            >
              See what we can do
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ ...heroStyle(700) }}
        >
          <svg
            className="w-5 h-5 text-gray-300"
            style={{ animation: "scrollNudge 2.5s ease-in-out infinite" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: WORK ─────────────────────────────────────────────── */}
      <div ref={workRef} />
      <section className="px-6 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight mb-16"
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

      {/* ── SECTION 3: COMPARISON ───────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
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

      {/* ── SECTION 4: WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              Everything you need.<br className="hidden md:block" />
              <span className="text-gray-300"> Nothing you don't.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="bg-white p-8">
                  <p className="font-semibold text-black text-base mb-2 tracking-tight">{f.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: PRICING ──────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-32 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.025em" }}
            >
              Simple pricing.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {homeTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 100}>
                <div
                  className={`relative rounded-2xl p-7 flex flex-col ${
                    tier.popular ? "border-2 border-black -mt-2 md:-mt-4" : "border border-gray-200"
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

      {/* ── SECTION 6: SENTENCE BUILDER ─────────────────────────────────── */}
      <section className="border-t border-gray-100 py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
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
