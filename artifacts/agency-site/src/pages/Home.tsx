import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";

type Option = { label: string; value: string };

const plans = [
  {
    name: "Essential",
    price: "$299",
    monthly: "$69/month",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
    bestFor: "Barbershops, cafes, food trucks, solo shops",
    dark: true,
  },
  {
    name: "Growth",
    price: "$749",
    monthly: "$99/month",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
    bestFor: "Tattoo shops, dental, auto shops, studios",
    recommended: true,
  },
  {
    name: "Premium",
    price: "$1,499",
    monthly: "$149/month",
    features: ["Up to 15 pages", "Everything in Growth", "E-commerce", "Custom integrations", "Advanced SEO"],
    bestFor: "Med spas, multi-location, dealerships",
    bordered: true,
  },
];

function PlanModal({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg p-6 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mb-6 md:hidden" />
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5">Choose your plan</p>
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.name}
              onClick={() => { onChange(plan.name.toLowerCase()); onClose(); }}
              className={`w-full text-left rounded-2xl p-4 relative transition-all ${
                plan.dark ? "bg-black text-white" : "bg-white border border-gray-200"
              } ${plan.bordered ? "border-2 border-dashed border-gray-300" : ""}`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 right-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              )}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`font-bold text-lg ${plan.dark ? "text-white" : "text-black"}`}>{plan.name}</p>
                  <p className={`text-xs mt-0.5 ${plan.dark ? "text-gray-400" : "text-gray-400"}`}>
                    {plan.price} + {plan.monthly}
                  </p>
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
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Need something more tailored?{" "}
          <span className="text-black font-medium underline cursor-pointer">Contact us</span>
          {" "}for a custom quote.
        </p>
      </div>
    </div>
  );
}

function DropdownSheet({ options, value, onChange, onClose }: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-sm shadow-2xl overflow-hidden">
        <div className="w-10 h-1 rounded bg-gray-200 mx-auto mt-3 mb-1 md:hidden" />
        <div className="pb-8">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); onClose(); }}
                className={`w-full text-left px-5 py-4 text-base font-medium flex items-center justify-between transition-colors ${
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
          <button className="w-full text-left px-5 py-4 text-base text-gray-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Other...
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineDropdown({ options, value, onChange, isPlan }: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  isPlan?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  const displayLabel = isPlan
    ? (plans.find((p) => p.name.toLowerCase() === value)?.name || selected.label)
    : selected.label;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 font-bold text-black border-b-2 border-black cursor-pointer hover:opacity-70 transition-opacity focus:outline-none"
      >
        {displayLabel}
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && isPlan && (
        <PlanModal value={value} onChange={onChange} onClose={() => setOpen(false)} />
      )}
      {open && !isPlan && (
        <DropdownSheet options={options} value={value} onChange={onChange} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

const roleOptions: Option[] = [
  { label: "retailer", value: "retailer" },
  { label: "dentist", value: "dentist" },
  { label: "tattoo shop", value: "tattoo shop" },
  { label: "restaurant", value: "restaurant" },
  { label: "salon", value: "salon" },
  { label: "gym", value: "gym" },
  { label: "realtor", value: "realtor" },
];

const siteOptions: Option[] = [
  { label: "website", value: "website" },
  { label: "e-commerce store", value: "ecommerce" },
  { label: "booking site", value: "booking" },
  { label: "portfolio", value: "portfolio" },
  { label: "landing page", value: "landing" },
];

const locationOptions: Option[] = [
  { label: "Sacramento", value: "sacramento" },
  { label: "San Francisco", value: "san-francisco" },
  { label: "Los Angeles", value: "los-angeles" },
  { label: "New York", value: "new-york" },
  { label: "London", value: "london" },
  { label: "anywhere", value: "anywhere" },
];

const planOptions: Option[] = [
  { label: "Essential", value: "essential" },
  { label: "Growth", value: "growth" },
  { label: "Premium", value: "premium" },
];

export default function Home() {
  const [role, setRole] = useState("retailer");
  const [site, setSite] = useState("website");
  const [location, setLocation] = useState("sacramento");
  const [plan, setPlan] = useState("essential");

  return (
    <Layout>
      <section className="min-h-[calc(100vh-57px)] flex flex-col items-start justify-center px-6 md:items-center md:text-center">
        <p
          className="font-bold leading-snug text-left md:text-center"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", color: "#c0c0c0" }}
        >
          {"I'm a "}
          <InlineDropdown options={roleOptions} value={role} onChange={setRole} />
          <br className="hidden md:block" />
          {" looking for a new"}
          <br />
          <InlineDropdown options={siteOptions} value={site} onChange={setSite} />
          <br className="hidden md:block" />
          {" located in "}
          <InlineDropdown options={locationOptions} value={location} onChange={setLocation} />
          <br />
          {"interested in a "}
          <InlineDropdown options={planOptions} value={plan} onChange={setPlan} isPlan />
          {" plan."}
        </p>

        <div className="mt-10">
          <Link href="/portfolio">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
