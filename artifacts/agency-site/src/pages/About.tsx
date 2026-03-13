import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="px-6 pt-12 pb-24 max-w-6xl mx-auto">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-16">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        {/* Hero headline */}
        <h1
          className="font-bold leading-tight mb-8"
          style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 1.0 }}
        >
          <span className="text-black">We're new here.</span>
          <br />
          <span className="text-gray-200">And that's exactly</span>
          <br />
          <span className="text-gray-200">why we're going to</span>
          <br />
          <span className="text-black">outwork everyone.</span>
        </h1>

        <p className="text-sm text-gray-400 max-w-sm leading-relaxed mt-8">
          GreyWhale is a web agency based in Sacramento, California — founded in 2025 with a simple bet: local businesses deserve the same quality of web design that funded startups get. We're small on purpose, obsessive about craft, and hungry to prove ourselves.
        </p>
      </div>

      {/* Process */}
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
              <p>Your site is live.</p>
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
              { n: "05", title: "Long-term Partners", desc: "Not a one-time vendor." },
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
    </Layout>
  );
}
