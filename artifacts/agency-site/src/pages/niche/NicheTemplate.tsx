import { useRef, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import SentenceBuilder from "@/components/SentenceBuilder";
import type { NicheData } from "./data";
import { niches } from "./data";

// ─── Niche → /start role mapping ─────────────────────────────────────────────

const NICHE_ROLE: Record<string, string> = {
  "dentists": "dentist",
  "restaurants": "restaurant owner",
  "real-estate-agents": "realtor",
  "barbershops": "salon owner",
  "coffee-shops": "restaurant owner",
  "med-spas": "salon owner",
  "tattoo-shops": "salon owner",
  "fitness-studios": "business owner",
  "auto-shops": "contractor",
  "plumbers": "contractor",
};

function nicheStartUrl(slug: string): string {
  const role = NICHE_ROLE[slug] || "business owner";
  return `/start?role=${encodeURIComponent(role)}`;
}

// ─── SEO hook ────────────────────────────────────────────────────────────────

function useSEO(niche: NicheData) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = niche.seoTitle;

    let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = descMeta?.getAttribute("content") ?? "";
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", niche.seoDescription);

    const canonicalHref = `https://greywhale.dev/for/${niche.slug}`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonical?.getAttribute("href") ?? "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.id = `ld-niche-${niche.slug}`;
    ldScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "GreyWhale",
      "description": niche.seoDescription,
      "url": canonicalHref,
      "areaServed": ["Sacramento", "Rocklin", "Roseville", "Folsom", "Granite Bay", "Lincoln", "Citrus Heights", "Elk Grove", "Davis", "Rancho Cordova"],
      "serviceType": `${niche.nameSingular} Website Design`,
      "priceRange": "$149–$349/month",
    });
    document.head.appendChild(ldScript);

    return () => {
      document.title = prevTitle;
      if (descMeta) descMeta.setAttribute("content", prevDesc);
      if (canonical) canonical.setAttribute("href", prevCanonical);
      const s = document.getElementById(`ld-niche-${niche.slug}`);
      if (s) s.remove();
    };
  }, [niche]);
}

// ─── Browser card ─────────────────────────────────────────────────────────────

function BrowserCard({ niche }: { niche: NicheData }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${niche.demoIsDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-100"}`}>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className={`flex-1 flex items-center justify-center gap-1.5 text-xs rounded-md px-3 py-1.5 ${niche.demoIsDark ? "bg-zinc-700 text-zinc-400" : "bg-gray-100 text-gray-400"}`}>
          <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="tracking-wide">{niche.demoUrl}</span>
        </div>
      </div>
      <div className={`flex items-center justify-center h-64 md:h-80 bg-gradient-to-br ${niche.demoGradient}`}>
        <span
          className="text-2xl md:text-3xl tracking-tight"
          style={{ color: niche.demoCardTextColor, fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 600 }}
        >
          {niche.demoName}
        </span>
      </div>
      <div className={`px-5 py-4 border-t ${niche.demoIsDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-50"}`}>
        <p className={`font-semibold text-base ${niche.demoIsDark ? "text-white" : "text-black"}`}>{niche.demoName}</p>
        <p className={`text-sm mt-0.5 ${niche.demoIsDark ? "text-zinc-400" : "text-gray-400"}`}>{niche.demoCity}</p>
      </div>
    </div>
  );
}

// ─── Pricing tiers ────────────────────────────────────────────────────────────

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

// ─── Main template ────────────────────────────────────────────────────────────

export default function NicheTemplate({ niche }: { niche: NicheData }) {
  useSEO(niche);

  const pricingRef = useRef<HTMLDivElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);

  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToBuilder() {
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const relatedNiches = niches.filter((n) => niche.relatedSlugs.includes(n.slug)).slice(0, 5);

  return (
    <Layout>
      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:py-28 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-bold text-black tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            {niche.headline}
          </h1>
          <p className="mt-5 text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {niche.subheadline}
          </p>
          <p className="mt-3 text-xs text-gray-300 tracking-wide">
            Serving Sacramento, Rocklin, Roseville, Folsom, Granite Bay, Lincoln, Citrus Heights, Elk Grove, Davis &amp; Rancho Cordova
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={nicheStartUrl(niche.slug)}>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer tracking-wide">
                Get Started →
              </button>
            </Link>
            <button
              onClick={scrollToPricing}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-300 text-black text-base font-medium hover:bg-gray-50 transition-colors cursor-pointer tracking-wide"
            >
              See Pricing
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ───────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-28">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight mb-12"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
            >
              Your {niche.nameSingular.toLowerCase()} deserves better than a Squarespace template.
            </h2>
          </Reveal>
          <div className="space-y-0">
            {niche.painPoints.map((point, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="flex items-start gap-5 py-6 border-b border-gray-100 last:border-0">
                  <span className="text-gray-200 font-bold text-2xl shrink-0 mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: DEMO SITE ─────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-28 border-t border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight mb-12 text-center"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
            >
              Here's what a {niche.nameSingular.toLowerCase()} site looks like.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <BrowserCard niche={niche} />
          </Reveal>
          <Reveal delay={200}>
            <p className="text-center text-sm text-gray-400 mt-6 tracking-wide">
              A sample site designed for a {niche.nameSingular.toLowerCase()} in the Sacramento area.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: WHAT'S INCLUDED ───────────────────────────────────── */}
      <section className="px-6 py-24 md:py-28 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
            >
              What your {niche.nameSingular.toLowerCase()} website includes.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {niche.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="bg-white p-8">
                  <p className="font-semibold text-black text-base mb-2 tracking-tight">{f.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: COMPARISON ────────────────────────────────────────── */}
      <section className="px-6 py-24 md:py-28 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
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
              <p className="text-xs text-gray-400 mb-6">{niche.agencyComparison}</p>
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

      {/* ── SECTION 6: PRICING ───────────────────────────────────────────── */}
      <div ref={pricingRef} />
      <section className="px-6 py-24 md:py-28 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em" }}
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

      {/* ── SECTION 7: SENTENCE BUILDER ──────────────────────────────────── */}
      <section className="border-t border-gray-100 py-24 md:py-28 px-6">
        <div className="max-w-4xl mx-auto" ref={builderRef}>
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-14"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.03em" }}
            >
              Let's build yours.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <SentenceBuilder initialRole={niche.rolePreset} />
          </Reveal>
        </div>
      </section>

      {/* ── WE ALSO WORK WITH ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-6" style={{ letterSpacing: "0.14em" }}>
              We also work with
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            {relatedNiches.map((related, i) => (
              <Reveal key={related.slug} delay={i * 60}>
                <Link href={`/for/${related.slug}`}>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-black hover:text-black transition-colors cursor-pointer tracking-wide">
                    {related.name}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={relatedNiches.length * 60}>
              <Link href="/for">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-gray-200 text-sm text-gray-400 hover:border-black hover:text-black transition-colors cursor-pointer tracking-wide">
                  View all industries
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

    </Layout>
  );
}
