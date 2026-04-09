import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

type Option = { label: string; value: string };

const plans = [
  {
    id: "essential",
    name: "Essential",
    monthly: "$49/month",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
    bestFor: "Barbershops, cafes, food trucks, solo shops",
    subtext: "Best for solo shops & new businesses",
  },
  {
    id: "growth",
    name: "Pro",
    monthly: "$149/month",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
    bestFor: "Tattoo shops, dental, auto shops, studios",
    recommended: true,
    subtext: "Most popular with Sacramento service businesses",
    urgency: "Limited spots this month",
    meshAccess: true,
  },
  {
    id: "premium",
    name: "Ultra",
    monthly: "$249/month",
    features: ["Up to 20 pages", "Everything in Pro", "E-commerce", "Custom integrations", "Advanced SEO"],
    bestFor: "Med spas, multi-location, dealerships",
    bordered: true,
    subtext: "Best for multi-location & e-commerce",
    meshAccess: true,
  },
];

type ModalPhase = "entering" | "open" | "leaving";

function SlideUpModal({ onClose, children, className }: { onClose: () => void; children: React.ReactNode; className?: string }) {
  const [phase, setPhase] = useState<ModalPhase>("entering");
  const isMd = useRef(typeof window !== "undefined" && window.innerWidth >= 768).current;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    setPhase("leaving");
    setTimeout(onClose, isMd ? 220 : 340);
  }

  const isOpen = phase === "open";
  const isLeaving = phase === "leaving";

  const modalTransform = isMd
    ? isOpen ? "scale(1)" : "scale(0.96)"
    : isOpen ? "translateY(0)" : "translateY(100%)";

  const modalOpacity = isMd ? (isOpen ? 1 : 0) : 1;

  const modalTransition = isMd
    ? isLeaving
      ? "transform 200ms ease, opacity 200ms ease"
      : "transform 320ms cubic-bezier(0.22,1,0.36,1), opacity 240ms ease"
    : isLeaving
      ? "transform 340ms cubic-bezier(0.4,0,1,1)"
      : "transform 380ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(8,8,8,0.62)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 260ms ease",
        }}
        onClick={close}
      />
      <div
        className={`relative bg-white w-full ${className || "md:max-w-lg"} flex flex-col`}
        style={{
          borderRadius: isMd ? "28px" : "26px 26px 0 0",
          maxHeight: isMd ? "min(760px, calc(100vh - 80px))" : "92dvh",
          margin: isMd ? "0 20px" : "0",
          boxShadow: isMd ? "0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)" : "none",
          transform: modalTransform,
          opacity: modalOpacity,
          transition: modalTransition,
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
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <SlideUpModal onClose={onClose} className="md:max-w-4xl">
      <div className="overflow-y-auto overscroll-contain flex-1 p-6" style={{ paddingBottom: "max(2.5rem, calc(env(safe-area-inset-bottom) + 5rem))" }}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6 md:hidden" />
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-5" style={{ letterSpacing: "0.14em" }}>Choose your plan</p>
        {excludeEssential && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4">
            E-commerce and booking sites require Pro or Ultra.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {plans.filter((p) => !(excludeEssential && p.id === "essential")).map((plan) => {
            const isSelected = plan.id === value;
            const isHovered = hovered === plan.id && !isSelected;
            const dark = isSelected;

            const cardBg = dark ? "#111" : isHovered ? "#f5f5f5" : "#fff";
            const subColor = dark ? "rgba(255,255,255,0.45)" : "#9ca3af";
            const featColor = dark ? "rgba(255,255,255,0.65)" : "#6b7280";
            const iconColor = dark ? "rgba(255,255,255,0.45)" : "#9ca3af";
            const bestForColor = dark ? "rgba(255,255,255,0.35)" : "#9ca3af";

            const planNameEl = plan.id === "growth"
              ? <span className="pro-orange-text" style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", display: "block" }}>{plan.name}</span>
              : plan.id === "premium"
                ? <span className="ultra-apple-text" style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", display: "block" }}>{plan.name}</span>
                : <span style={{ fontWeight: 700, fontSize: 17, color: dark ? "#fff" : "#111", letterSpacing: "-0.01em", display: "block" }}>{plan.name}</span>;

            const cardContent = (
              <>
                {plan.recommended && !dark && (
                  <span style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "#111", color: "#fff",
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                    padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap",
                  }}>
                    RECOMMENDED
                  </span>
                )}
                {planNameEl}
                <p style={{ fontSize: 12, color: subColor, marginTop: 2 }}>{plan.monthly}</p>
                <p style={{ fontSize: 11, color: subColor, marginTop: 3, lineHeight: 1.4 }}>{plan.subtext}</p>
                {plan.urgency && (
                  <p style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.25)" : "#d1d5db", fontStyle: "italic", marginTop: 3 }}>{plan.urgency}</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "12px 0 10px" }}>
                  {plan.meshAccess && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#f97316", fontWeight: 500 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Access to our backlink mesh network
                    </span>
                  )}
                  {plan.features.map((f) => (
                    <span key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: featColor }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: bestForColor }}>Best for: {plan.bestFor}</p>
              </>
            );

            return (
              <button
                key={plan.id}
                onClick={() => { onChange(plan.id); onClose(); }}
                className="w-full text-left relative"
                style={{
                  borderRadius: 18,
                  border: dark ? "2px solid #111" : `1.5px solid ${isHovered ? "#d1d5db" : "#e5e7eb"}`,
                  background: cardBg,
                  boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.15)" : isHovered ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
                  transition: "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
                  padding: 18,
                }}
                onMouseEnter={() => setHovered(plan.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {cardContent}
              </button>
            );
          })}
          <button
            onClick={() => { onChange("bespoke"); onClose(); }}
            onMouseEnter={() => setHovered("bespoke")}
            onMouseLeave={() => setHovered(null)}
            className="w-full text-left rounded-2xl p-4 md:col-span-3"
            style={{
              border: value === "bespoke" ? "2px solid #111" : `1.5px dashed ${hovered === "bespoke" ? "#9ca3af" : "#d1d5db"}`,
              background: value === "bespoke" ? "#111" : hovered === "bespoke" ? "#f5f5f5" : "#fff",
              transition: "background 140ms ease, border-color 140ms ease",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontWeight: 600, fontSize: 18, color: value === "bespoke" ? "#fff" : "#111", letterSpacing: "-0.01em" }}>Bespoke</p>
                <p style={{ fontSize: 12, color: value === "bespoke" ? "rgba(255,255,255,0.5)" : "#9ca3af", marginTop: 2 }}>Custom quote</p>
                <p style={{ fontSize: 12, color: value === "bespoke" ? "rgba(255,255,255,0.4)" : "#9ca3af", marginTop: 6 }}>Need something more tailored? Let's talk about your project.</p>
              </div>
            </div>
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
      <div className="flex-1 overflow-y-auto overscroll-contain pb-8 pt-1">
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
              <button onClick={submitCustom} className="text-sm font-medium text-black px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">Done</button>
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

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

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
          <button onClick={submitCustom} className="text-xs font-medium bg-black text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">↵</button>
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
    ? (plans.find((p) => p.id === value)?.name ?? value)
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
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
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

export const roleOptions: Option[] = [
  { label: "business owner", value: "business owner" },
  { label: "restaurant owner", value: "restaurant owner" },
  { label: "dentist", value: "dentist" },
  { label: "salon owner", value: "salon owner" },
  { label: "realtor", value: "realtor" },
  { label: "contractor", value: "contractor" },
];

export const siteOptions: Option[] = [
  { label: "website", value: "website" },
  { label: "brand identity", value: "branding" },
  { label: "e-commerce store", value: "ecommerce" },
  { label: "booking site", value: "booking" },
  { label: "social media presence", value: "social" },
];

export const locationOptions: Option[] = [
  { label: "Sacramento", value: "sacramento" },
  { label: "Elk Grove", value: "elk-grove" },
  { label: "Folsom", value: "folsom" },
  { label: "Roseville", value: "roseville" },
  { label: "Davis", value: "davis" },
  { label: "Rocklin", value: "rocklin" },
];

export const planOptions: Option[] = [
  { label: "Essential", value: "essential" },
  { label: "Pro", value: "growth" },
  { label: "Ultra", value: "premium" },
  { label: "Bespoke", value: "bespoke" },
];

const COMPLEX_SITES = ["ecommerce", "booking"];

export default function SentenceBuilder({ initialRole = "business owner" }: { initialRole?: string }) {
  const [role, setRole] = useState(initialRole);
  const [site, setSite] = useState("website");
  const [location, setLocation] = useState("sacramento");
  const [plan, setPlan] = useState("essential");
  const [, navigate] = useLocation();

  function handleSiteChange(v: string) {
    setSite(v);
    if (COMPLEX_SITES.includes(v) && plan === "essential") setPlan("growth");
  }

  const excludeEssential = COMPLEX_SITES.includes(site);

  function handleGetStarted() {
    const params = `plan=${plan}&role=${encodeURIComponent(role)}&service=${encodeURIComponent(site)}&location=${encodeURIComponent(location)}`;
    if (plan === "bespoke") {
      navigate(`/contact?${params}`);
    } else {
      navigate(`/checkout?${params}`);
    }
  }

  return (
    <>
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

      <div className="mt-10 text-center">
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide"
        >
          Get Started
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-6 tracking-wide">
        No upfront cost. Live in 14 days. Cancel anytime.
      </p>
    </>
  );
}
