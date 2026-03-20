import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { apiPost } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = { label: string; value: string };

// ─── Plan data (for sentence builder modal — unchanged) ───────────────────────

const plans = [
  {
    name: "Essential",
    monthly: "$149/month",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
    bestFor: "Barbershops, cafes, food trucks, solo shops",
    dark: true,
  },
  {
    name: "Growth",
    monthly: "$249/month",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
    bestFor: "Tattoo shops, dental, auto shops, studios",
    recommended: true,
  },
  {
    name: "Premium",
    monthly: "$349/month",
    features: ["Up to 20 pages", "Everything in Growth", "E-commerce", "Custom integrations", "Advanced SEO"],
    bestFor: "Med spas, multi-location, dealerships",
    bordered: true,
  },
];

// ─── Modals / Dropdowns (UNCHANGED) ──────────────────────────────────────────

function SlideUpModal({ onClose, children, className }: { onClose: () => void; children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);
  const isMd = typeof window !== "undefined" && window.innerWidth >= 768;

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
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <div
        className={`relative bg-white rounded-t-3xl md:rounded-3xl w-full ${className || "md:max-w-lg"} shadow-2xl max-h-[90vh] overflow-y-auto transition-[transform,opacity] duration-300 ease-out`}
        style={{
          transform: visible ? "translateY(0)" : isMd ? "translateY(12px)" : "translateY(100%)",
          opacity: visible ? 1 : isMd ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PlanModal({ value, onChange, onClose, excludeEssential }: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  excludeEssential?: boolean;
}) {
  return (
    <SlideUpModal onClose={onClose} className="md:max-w-4xl">
      <div className="p-6 pb-10">
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mb-6 md:hidden" />
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-5" style={{ letterSpacing: "0.12em" }}>Choose your plan</p>
        {excludeEssential && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4">
            E-commerce and booking sites require Growth or Premium.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.filter((p) => !(excludeEssential && p.dark)).map((plan) => {
            if (plan.bordered) {
              return (
                <div key={plan.name} className="animated-border-wrapper">
                  <button
                    onClick={() => { onChange(plan.name.toLowerCase()); onClose(); }}
                    className="animated-border-inner w-full text-left p-4"
                  >
                    <p className="font-semibold text-lg text-black tracking-wide">{plan.name}</p>
                    <p className="text-xs mt-0.5 text-gray-400">{plan.monthly}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 my-3">
                      {plan.features.map((f) => (
                        <span key={f} className="text-xs flex items-center gap-1 text-gray-500">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Best for: {plan.bestFor}</p>
                  </button>
                </div>
              );
            }
            return (
              <button
                key={plan.name}
                onClick={() => { onChange(plan.name.toLowerCase()); onClose(); }}
                className={`w-full text-left rounded-2xl p-4 relative transition-all duration-150 ${
                  plan.dark ? "bg-black text-white" : "bg-white border border-gray-200"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 right-4 bg-black text-white text-xs font-medium px-3 py-1 rounded-full tracking-wide">
                    RECOMMENDED
                  </span>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-semibold text-lg tracking-wide ${plan.dark ? "text-white" : "text-black"}`}>{plan.name}</p>
                    <p className="text-xs mt-0.5 text-gray-400">{plan.monthly}</p>
                  </div>
                  {plan.dark && (
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                  {plan.features.map((f) => (
                    <span key={f} className={`text-xs flex items-center gap-1 ${plan.dark ? "text-gray-300" : "text-gray-500"}`}>
                      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>
                <p className={`text-xs ${plan.dark ? "text-gray-500" : "text-gray-400"}`}>
                  Best for: {plan.bestFor}
                </p>
              </button>
            );
          })}

          <button
            onClick={() => { onChange("bespoke"); onClose(); }}
            className="w-full text-left rounded-2xl p-4 border border-dashed border-gray-300 hover:border-gray-400 transition-colors md:col-span-3"
          >
            <p className="font-semibold text-lg text-black tracking-wide">Bespoke</p>
            <p className="text-xs mt-0.5 text-gray-400">Custom quote</p>
            <p className="text-xs text-gray-400 mt-2">Need something more tailored? Let's talk about your project.</p>
          </button>
        </div>
      </div>
    </SlideUpModal>
  );
}

function OptionSheet({ options, value, onChange, onClose }: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  function submitCustom() {
    const trimmed = customText.trim();
    if (trimmed) { onChange(trimmed); onClose(); }
  }

  return (
    <SlideUpModal onClose={onClose}>
      <div className="pb-8 pt-1">
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mt-3 mb-4" />
        <div className="px-2">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); onClose(); }}
                className={`w-full text-left px-4 py-4 text-base font-medium flex items-center justify-between transition-colors rounded-xl mx-0 ${
                  isSelected ? "bg-black text-white" : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {opt.label}
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
          {customMode ? (
            <div className="px-3 py-3 flex items-center gap-2">
              <input
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitCustom(); if (e.key === "Escape") { setCustomMode(false); setCustomText(""); } }}
                placeholder="Type your own…"
                className="flex-1 border-b border-gray-300 focus:border-black outline-none py-1 text-base text-gray-900 bg-transparent"
              />
              <button
                onClick={submitCustom}
                className="text-sm font-medium text-black px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCustomMode(true)}
              className="w-full text-left px-4 py-4 text-base text-gray-400 flex items-center gap-2 hover:bg-gray-50 transition-colors rounded-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Other...
            </button>
          )}
        </div>
      </div>
    </SlideUpModal>
  );
}

function DesktopDropdown({ options, value, onChange, onClose }: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function submitCustom() {
    const trimmed = customText.trim();
    if (trimmed) { onChange(trimmed); onClose(); }
  }

  return (
    <span
      className="absolute top-full left-0 mt-2 z-50 min-w-[200px] rounded-xl bg-white border border-gray-100 overflow-hidden transition-all duration-200 origin-top"
      style={{
        boxShadow: "0 12px 40px rgba(0,0,0,0.13)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scaleY(1) translateY(0)" : "scaleY(0.9) translateY(-8px)",
      }}
    >
      <div className="p-1.5">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); onClose(); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors rounded-lg ${
                isSelected ? "font-semibold text-black bg-gray-50" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
              {isSelected && (
                <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {customMode ? (
        <div className="px-3 py-2.5 flex items-center gap-2 border-t border-gray-50">
          <input
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitCustom(); if (e.key === "Escape") { setCustomMode(false); setCustomText(""); } }}
            placeholder="Type your own…"
            className="flex-1 text-sm outline-none border-b border-gray-200 focus:border-black py-0.5 bg-transparent text-gray-900"
          />
          <button
            onClick={submitCustom}
            className="text-xs font-medium bg-black text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ↵
          </button>
        </div>
      ) : (
        <div className="px-1.5 pb-1.5">
          <button
            onClick={() => setCustomMode(true)}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-400 flex items-center gap-1.5 hover:bg-gray-50 border-t border-gray-50 transition-colors rounded-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Other...
          </button>
        </div>
      )}
    </span>
  );
}

function InlineDropdown({ options, value, onChange, isPlan, excludeEssential }: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  isPlan?: boolean;
  excludeEssential?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const displayLabel = isPlan
    ? (plans.find((p) => p.name.toLowerCase() === value)?.name ?? value)
    : (options.find((o) => o.value === value)?.label ?? value);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || isMobile || isPlan) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile, isPlan]);

  return (
    <>
      <span ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1 font-semibold text-black border-b-2 border-black cursor-pointer hover:opacity-70 transition-opacity focus:outline-none"
        >
          {displayLabel}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && !isPlan && (
          <span className="hidden md:block">
            <DesktopDropdown options={options} value={value} onChange={onChange} onClose={close} />
          </span>
        )}
      </span>

      {open && !isPlan && (
        <span className="md:hidden">
          <OptionSheet options={options} value={value} onChange={onChange} onClose={close} />
        </span>
      )}

      {open && isPlan && (
        <PlanModal value={value} onChange={onChange} onClose={close} excludeEssential={excludeEssential} />
      )}
    </>
  );
}

// ─── Options (UNCHANGED) ─────────────────────────────────────────────────────

const roleOptions: Option[] = [
  { label: "business owner", value: "business owner" },
  { label: "restaurant owner", value: "restaurant owner" },
  { label: "dentist", value: "dentist" },
  { label: "salon owner", value: "salon owner" },
  { label: "realtor", value: "realtor" },
  { label: "contractor", value: "contractor" },
];

const siteOptions: Option[] = [
  { label: "website", value: "website" },
  { label: "brand identity", value: "branding" },
  { label: "e-commerce store", value: "ecommerce" },
  { label: "booking site", value: "booking" },
  { label: "social media presence", value: "social" },
];

const locationOptions: Option[] = [
  { label: "Sacramento", value: "sacramento" },
  { label: "Elk Grove", value: "elk-grove" },
  { label: "Folsom", value: "folsom" },
  { label: "Roseville", value: "roseville" },
  { label: "Davis", value: "davis" },
  { label: "Rocklin", value: "rocklin" },
];

const planOptions: Option[] = [
  { label: "Essential", value: "essential" },
  { label: "Growth", value: "growth" },
  { label: "Premium", value: "premium" },
  { label: "Bespoke", value: "bespoke" },
];

const COMPLEX_SITES = ["ecommerce", "booking"];

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Homepage Data ────────────────────────────────────────────────────────────

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

// ─── Browser Card (for Work section) ─────────────────────────────────────────

function BrowserCard({ project }: { project: typeof homeProjects[0] }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 ${project.isDark ? "bg-zinc-800" : "bg-white"} border-b ${project.isDark ? "border-zinc-700" : "border-gray-100"}`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs rounded-md px-3 py-1.5 ${project.isDark ? "bg-zinc-700 text-zinc-400" : "bg-gray-100 text-gray-400"}`}
        >
          <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="tracking-wide">{project.url}</span>
        </div>
      </div>
      <div
        className={`flex items-center justify-center h-64 md:h-80 bg-gradient-to-br ${project.gradient}`}
      >
        <span
          className="text-2xl md:text-3xl tracking-tight"
          style={{
            color: project.cardTextColor,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 600,
          }}
        >
          {project.name}
        </span>
      </div>
      <div className={`px-5 py-4 ${project.isDark ? "bg-zinc-900" : "bg-white"} border-t ${project.isDark ? "border-zinc-800" : "border-gray-50"}`}>
        <p className={`font-semibold text-base ${project.isDark ? "text-white" : "text-black"}`}>{project.name}</p>
        <p className={`text-sm mt-0.5 ${project.isDark ? "text-zinc-400" : "text-gray-400"}`}>{project.meta}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [role, setRole] = useState("business owner");
  const [site, setSite] = useState("website");
  const [location, setLocation] = useState("sacramento");
  const [plan, setPlan] = useState("essential");
  const [, navigate] = useLocation();
  const [starting, setStarting] = useState(false);

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

  function handleSiteChange(v: string) {
    setSite(v);
    if (COMPLEX_SITES.includes(v) && plan === "essential") {
      setPlan("growth");
    }
  }

  const excludeEssential = COMPLEX_SITES.includes(site);

  async function handleGetStarted() {
    setStarting(true);
    try {
      const { id } = await apiPost("/leads", { role, service: site, location, plan });
      const contactParams = `lead=${id}&plan=${plan}&role=${encodeURIComponent(role)}&service=${encodeURIComponent(site)}&location=${encodeURIComponent(location)}`;

      if (plan === "bespoke") {
        navigate(`/contact?${contactParams}`);
        return;
      }

      const base = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
      const successUrl = `${base}/checkout/success?lead=${id}`;
      const cancelUrl = window.location.href;

      const { url } = await apiPost("/stripe/checkout", {
        leadId: id,
        plan,
        successUrl,
        cancelUrl,
      }) as { url: string };

      if (url) {
        window.location.href = url;
      } else {
        navigate(`/checkout?${contactParams}`);
      }
    } catch {
      navigate(`/checkout?plan=${plan}&role=${encodeURIComponent(role)}&service=${encodeURIComponent(site)}&location=${encodeURIComponent(location)}`);
    } finally {
      setStarting(false);
    }
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
                      tier.popular
                        ? "bg-black text-white hover:opacity-80"
                        : "border border-gray-300 text-black hover:bg-gray-50"
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
        <div ref={builderRef} className="max-w-4xl mx-auto">
          <Reveal>
            <h2
              className="font-bold text-black tracking-tight text-center mb-16"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              Let's build yours.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div>
              {/* Desktop: 3 centered lines */}
              <div
                className="hidden md:block text-center w-full text-[2.5rem]"
                style={{ color: "#c0c0c0", lineHeight: 1.5, letterSpacing: "0.005em" }}
              >
                {"I'm a "}
                <InlineDropdown options={roleOptions} value={role} onChange={setRole} />
                {" looking for a new"}
                <br />
                <InlineDropdown options={siteOptions} value={site} onChange={handleSiteChange} />
                {" located in "}
                <InlineDropdown options={locationOptions} value={location} onChange={setLocation} />
                <br />
                {"interested in a "}
                <InlineDropdown options={planOptions} value={plan} onChange={setPlan} isPlan excludeEssential={excludeEssential} />
                {" plan."}
              </div>

              {/* Mobile: stacked layout, left-aligned */}
              <div
                className="md:hidden text-left w-full text-[2rem]"
                style={{ color: "#c0c0c0", lineHeight: 1.6, letterSpacing: "0.005em" }}
              >
                {"I'm a "}
                <InlineDropdown options={roleOptions} value={role} onChange={setRole} />
                <br />
                {"looking for a new"}
                <br />
                <InlineDropdown options={siteOptions} value={site} onChange={handleSiteChange} />
                <br />
                {"located in"}
                <br />
                <InlineDropdown options={locationOptions} value={location} onChange={setLocation} />
                <br />
                {"interested in a"}
                <br />
                <InlineDropdown options={planOptions} value={plan} onChange={setPlan} isPlan excludeEssential={excludeEssential} />
                {" plan."}
              </div>

              <div className="mt-10 text-center md:text-center">
                <button
                  onClick={handleGetStarted}
                  disabled={starting}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide disabled:opacity-50"
                >
                  {starting ? "Creating…" : "Get Started"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6 tracking-wide">
                No upfront cost. Live in 14 days. Cancel anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

    </Layout>
  );
}
