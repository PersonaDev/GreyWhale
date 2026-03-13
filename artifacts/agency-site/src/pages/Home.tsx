import { useState, useRef, useEffect } from "react";

type DropdownOption = {
  label: string;
  value: string;
};

type InlineDropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  color: string;
};

function InlineDropdown({ options, value, onChange, color }: InlineDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 font-semibold border-b-2 cursor-pointer transition-all duration-150 hover:opacity-80 focus:outline-none pb-0.5"
        style={{ color, borderColor: color }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <span
          role="listbox"
          className="absolute top-full left-0 mt-2 z-50 min-w-[180px] rounded-xl shadow-xl border border-gray-100 bg-white overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${
                opt.value === value
                  ? "font-semibold bg-gray-50"
                  : "font-normal hover:bg-gray-50"
              } text-gray-800`}
            >
              {opt.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

const roleOptions: DropdownOption[] = [
  { label: "business owner", value: "business-owner" },
  { label: "startup founder", value: "startup-founder" },
  { label: "freelancer", value: "freelancer" },
  { label: "restaurant owner", value: "restaurant-owner" },
  { label: "real estate agent", value: "real-estate-agent" },
  { label: "creative professional", value: "creative-professional" },
];

const siteOptions: DropdownOption[] = [
  { label: "website", value: "website" },
  { label: "e-commerce store", value: "ecommerce" },
  { label: "portfolio site", value: "portfolio" },
  { label: "booking platform", value: "booking" },
  { label: "landing page", value: "landing" },
  { label: "blog", value: "blog" },
];

const locationOptions: DropdownOption[] = [
  { label: "London", value: "london" },
  { label: "New York", value: "new-york" },
  { label: "Los Angeles", value: "los-angeles" },
  { label: "Toronto", value: "toronto" },
  { label: "Sydney", value: "sydney" },
  { label: "Dubai", value: "dubai" },
  { label: "anywhere", value: "anywhere" },
];

const planOptions: DropdownOption[] = [
  { label: "Starter – $799 + $80/m", value: "starter" },
  { label: "Growth – $1,499 + $120/m", value: "growth" },
  { label: "Pro – $2,999 + $180/m", value: "pro" },
  { label: "Custom – let's talk", value: "custom" },
];

export default function Home() {
  const [role, setRole] = useState("business-owner");
  const [site, setSite] = useState("website");
  const [location, setLocation] = useState("london");
  const [plan, setPlan] = useState("starter");
  const [submitted, setSubmitted] = useState(false);

  const planLabel = planOptions.find((p) => p.value === plan)?.label || "";
  const planPrice = planLabel.split(" – ")[1] || "";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="w-full px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight text-gray-900">studio.</span>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Work</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">About</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Pricing</a>
          <a
            href="#contact"
            className="text-sm font-medium px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32">
        <div className="max-w-4xl w-full mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">Web Design Agency</p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            We build websites
            <br className="hidden md:block" /> that actually work.
          </h1>

          <p className="text-gray-400 text-lg mb-16 max-w-xl mx-auto">
            Tell us about yourself and we'll build something you'll love.
          </p>

          {/* Interactive sentence */}
          {!submitted ? (
            <div className="bg-gray-50 rounded-2xl px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto text-left">
              <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
                {"I'm a "}
                <InlineDropdown
                  options={roleOptions}
                  value={role}
                  onChange={setRole}
                  color="#7c3aed"
                />
                {" looking for a new "}
                <InlineDropdown
                  options={siteOptions}
                  value={site}
                  onChange={setSite}
                  color="#0891b2"
                />
                {" located in "}
                <InlineDropdown
                  options={locationOptions}
                  value={location}
                  onChange={setLocation}
                  color="#059669"
                />
                {" and I'd like the "}
                <InlineDropdown
                  options={planOptions}
                  value={plan}
                  onChange={setPlan}
                  color="#d97706"
                />
                {" plan."}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Send my enquiry →
                </button>
                <p className="text-sm text-gray-400">No commitment · We'll reply within 24 hours</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl px-6 py-10 md:px-10 max-w-3xl mx-auto text-center">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks! We'll be in touch.</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                We've received your enquiry for a <strong>{planPrice}</strong> plan and will reach out within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Social proof strip */}
      <section className="border-t border-gray-100 px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <p className="text-3xl font-bold text-gray-900">120+</p>
            <p className="text-sm text-gray-500 mt-1">Projects delivered</p>
          </div>
          <div className="h-px md:h-8 w-full md:w-px bg-gray-100" />
          <div>
            <p className="text-3xl font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-500 mt-1">Client satisfaction</p>
          </div>
          <div className="h-px md:h-8 w-full md:w-px bg-gray-100" />
          <div>
            <p className="text-3xl font-bold text-gray-900">7 days</p>
            <p className="text-sm text-gray-500 mt-1">Average turnaround</p>
          </div>
          <div className="h-px md:h-8 w-full md:w-px bg-gray-100" />
          <div>
            <p className="text-3xl font-bold text-gray-900">$799</p>
            <p className="text-sm text-gray-500 mt-1">Starting price</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold tracking-tight text-gray-400">studio.</span>
        <p className="text-xs text-gray-400">© 2025 Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
