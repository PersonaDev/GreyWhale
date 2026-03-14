import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { apiPost } from "@/lib/api";

type Option = { label: string; value: string };

const plans = [
  {
    name: "Essential",
    price: "$499",
    monthly: "$69/month",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
    bestFor: "Barbershops, cafes, food trucks, solo shops",
    dark: true,
  },
  {
    name: "Growth",
    price: "$999",
    monthly: "$99/month",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
    bestFor: "Tattoo shops, dental, auto shops, studios",
    recommended: true,
  },
  {
    name: "Premium",
    price: "$2,499",
    monthly: "$149/month",
    features: ["Up to 15 pages", "Everything in Growth", "E-commerce", "Custom integrations", "Advanced SEO"],
    bestFor: "Med spas, multi-location, dealerships",
    bordered: true,
  },
];

function SlideUpModal({ onClose, children, className }: { onClose: () => void; children: React.ReactNode; className?: string }) {
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
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />
      <div
        className={`relative bg-white rounded-t-3xl md:rounded-3xl w-full ${className || "md:max-w-lg"} shadow-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out`}
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
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
                    <p className="text-xs mt-0.5 text-gray-400">{plan.price} + {plan.monthly}</p>
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
                    <p className="text-xs mt-0.5 text-gray-400">{plan.price} + {plan.monthly}</p>
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

export default function Home() {
  const [role, setRole] = useState("business owner");
  const [site, setSite] = useState("website");
  const [location, setLocation] = useState("sacramento");
  const [plan, setPlan] = useState("essential");
  const [, navigate] = useLocation();
  const [starting, setStarting] = useState(false);

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

  return (
    <Layout>
      <section className="min-h-[calc(100vh-57px)] flex flex-col items-start justify-center px-5 md:items-center md:text-center">
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

        <div className="mt-10">
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
      </section>
    </Layout>
  );
}
