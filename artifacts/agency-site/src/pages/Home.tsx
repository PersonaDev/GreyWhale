import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";

type Option = { label: string; value: string };

function InlineDropdown({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 font-bold text-black border-b-2 border-black cursor-pointer hover:opacity-70 transition-opacity focus:outline-none"
      >
        {selected.label}
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <span
          className="absolute top-full left-0 mt-2 z-50 min-w-[200px] rounded-xl shadow-2xl border border-gray-100 bg-white overflow-hidden"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-base transition-colors hover:bg-gray-50 ${
                opt.value === value ? "font-bold text-black" : "font-normal text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

const roleOptions: Option[] = [
  { label: "retailer", value: "retailer" },
  { label: "restaurant owner", value: "restaurant-owner" },
  { label: "dentist", value: "dentist" },
  { label: "realtor", value: "realtor" },
  { label: "studio owner", value: "studio-owner" },
  { label: "startup founder", value: "startup-founder" },
  { label: "freelancer", value: "freelancer" },
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
      {/* Hero — interactive sentence */}
      <section className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6">
        <p
          className="text-center leading-tight font-bold select-none"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", lineHeight: 1.25, color: "#c0c0c0" }}
        >
          {"I'm a "}
          <InlineDropdown options={roleOptions} value={role} onChange={setRole} />
          {" looking for a new"}
          <br />
          <InlineDropdown options={siteOptions} value={site} onChange={setSite} />
          {" located in "}
          <InlineDropdown options={locationOptions} value={location} onChange={setLocation} />
          <br />
          {"interested in a "}
          <InlineDropdown options={planOptions} value={plan} onChange={setPlan} />
          {" plan."}
        </p>

        <div className="mt-12">
          <Link href="/pricing">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* Process section */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Process</p>
            <h2 className="font-bold text-black leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              From first call<br />
              to deployed in<br />
              <span className="text-gray-300">14 days, avg.</span>
            </h2>
            <p className="mt-6 text-sm text-gray-400 max-w-xs leading-relaxed">
              We keep it lean. No bloated timelines, no 47-page proposals. Discovery, design, build, ship. That's it.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-400 font-mono">greywhale — zsh</span>
            </div>
            <div className="p-5 font-mono text-sm text-gray-700 leading-relaxed">
              <p className="mb-3 text-gray-500"><span className="text-gray-300">$</span> greywhale init --project "your-business"</p>
              <p className="text-green-600">✓ Discovery call completed</p>
              <p className="text-green-600">✓ Wireframes approved</p>
              <p className="text-green-600">✓ Design system created</p>
              <p className="text-green-600">✓ Development started</p>
              <p className="text-green-600">✓ Client review & revisions</p>
              <p className="text-green-600">✓ Performance audit passed (98/100)</p>
              <p className="text-green-600">✓ Deployed to production</p>
              <p className="mt-3 text-gray-500"><span className="text-gray-300">$</span> echo "Your site is live."</p>
              <p className="text-gray-700">Your site is live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Principles</p>
          <h2 className="font-bold text-black text-4xl mb-12">What we believe</h2>
          <div className="divide-y divide-gray-100">
            {[
              { n: "01", title: "Craft Over Templates", desc: "Hand-built. Every time." },
              { n: "02", title: "Local First", desc: "We know Sacramento." },
              { n: "03", title: "Speed Matters", desc: "Fast sites, fast delivery." },
              { n: "04", title: "Honest Pricing", desc: "No surprises. Ever." },
            ].map((p) => (
              <div key={p.n} className="flex items-center justify-between py-5 group cursor-default">
                <div className="flex items-center gap-6">
                  <span className="text-xs text-gray-300 font-mono w-6">{p.n}</span>
                  <span className="font-bold text-black text-xl">{p.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{p.desc}</span>
                  <span className="text-gray-300 group-hover:text-black transition-colors text-xl leading-none">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog */}
      <section className="border-t border-gray-100 px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Changelog</p>
            <h2 className="font-bold text-black leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Just getting<br />
              <span className="text-gray-300">started.</span>
            </h2>
            <p className="mt-6 text-sm text-gray-400 max-w-xs leading-relaxed">
              We don't have a decade of history. We have momentum, standards, and something to prove.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 font-mono text-sm leading-relaxed space-y-4">
              {[
                { hash: "a1b2c3d", date: "Jan 2025", msg: "init: greywhale.dev registered, first designs sketched out" },
                { hash: "e4f5g6h", date: "Feb 2025", msg: "feat: first client signed — Blue Oak Dental, Folsom" },
                { hash: "i7j8k9l", date: "Mar 2025", msg: "ship: blueoakdental.com deployed, site live in 12 days" },
                { hash: "m0n1o2p", date: "Now", msg: "wip: taking on new clients, building the portfolio" },
              ].map((entry) => (
                <div key={entry.hash} className="flex gap-3">
                  <span className="text-amber-500 shrink-0">{entry.hash}</span>
                  <span className="text-gray-400 shrink-0">({entry.date})</span>
                  <span className="text-gray-700">{entry.msg}</span>
                </div>
              ))}
              <div className="flex gap-2 text-gray-400 pt-1">
                <span className="text-gray-300">$</span>
                <span>git log --oneline --author=greywhale<span className="animate-pulse">█</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 px-6 py-32 flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">Next Step</p>
        <h2 className="font-bold leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
          <span className="text-black">Be one of our</span>
          <br />
          <span className="text-gray-300">first clients.</span>
        </h2>
        <p className="mt-6 text-gray-400 text-base max-w-sm leading-relaxed">
          Early clients get our full attention, best pricing, and a team that's genuinely excited to earn your trust.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/pricing">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Get in touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
          <Link href="/portfolio">
            <button className="px-8 py-4 rounded-full text-black text-base font-medium border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer bg-white">
              See our work
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
