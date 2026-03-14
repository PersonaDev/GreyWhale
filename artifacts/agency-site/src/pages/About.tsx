import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      {/* Hero — asymmetric: headline left-anchored, description offset right */}
      <section className="px-5 md:px-12 pt-16 pb-20">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-12 tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        <div className="max-w-5xl mx-auto">
          <h1
            className="font-semibold leading-tight mb-10"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            <span className="text-black">We're new here.</span>
            <br />
            <span className="text-gray-300">And that's exactly why</span>
            <br />
            <span className="text-black">we outwork everyone.</span>
          </h1>

          <div className="md:flex md:justify-end">
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed tracking-wide md:text-right">
              GreyWhale is a creative agency founded in 2025 in Sacramento. Local businesses deserve real design and real craft — not templates. We're small on purpose and hungry to prove it.
            </p>
          </div>
        </div>
      </section>

      {/* Process — two-column: label left, terminal right */}
      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_1.5fr] md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0 md:sticky md:top-24">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Process</p>
            <h2 className="font-semibold text-black leading-tight" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", letterSpacing: "-0.01em" }}>
              First call to live site
              <br />
              <span className="text-gray-300">in 14 days, avg.</span>
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400 font-mono">greywhale — zsh</span>
            </div>
            <div className="p-5 font-mono text-sm text-gray-700 leading-loose">
              <p className="text-gray-400 mb-2"><span className="text-gray-300">$</span> greywhale start --client "your-business"</p>
              <p className="text-green-600">✓ Discovery call</p>
              <p className="text-green-600">✓ Wireframes approved</p>
              <p className="text-green-600">✓ Design system built</p>
              <p className="text-green-600">✓ Development done</p>
              <p className="text-green-600">✓ Revisions completed</p>
              <p className="text-green-600">✓ Performance audit 98/100</p>
              <p className="text-green-600">✓ Deployed to production</p>
              <p className="text-gray-400 mt-2"><span className="text-gray-300">$</span> <span className="text-gray-700">Your site is live.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles — asymmetric: numbered list offset left with descriptions right */}
      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_1.5fr] md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Principles</p>
            <h2 className="font-semibold text-black text-3xl" style={{ letterSpacing: "-0.01em" }}>What we believe</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { n: "01", title: "Craft Over Templates", desc: "Hand-built, every time." },
              { n: "02", title: "Local First", desc: "We know Sacramento." },
              { n: "03", title: "Speed Matters", desc: "Fast sites, fast delivery." },
              { n: "04", title: "Honest Pricing", desc: "No surprises. Ever." },
              { n: "05", title: "Long-term Partners", desc: "Not a one-time vendor." },
            ].map((p) => (
              <div key={p.n} className="flex items-center justify-between py-5 group cursor-default">
                <div className="flex items-center gap-5">
                  <span className="text-xs text-gray-300 font-mono w-5 shrink-0">{p.n}</span>
                  <span className="font-semibold text-black text-base tracking-tight">{p.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 hidden sm:block tracking-wide">{p.desc}</span>
                  <span className="text-gray-300 group-hover:text-black transition-colors text-lg leading-none">+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog — terminal card right-aligned on desktop */}
      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_1.5fr] md:gap-16 md:items-start">
          <div className="mb-8 md:mb-0">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Changelog</p>
            <h2 className="font-semibold text-black leading-tight" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", letterSpacing: "-0.01em" }}>
              Just getting <span className="text-gray-300">started.</span>
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
            <div className="p-5 font-mono text-sm leading-relaxed space-y-4">
              {[
                { hash: "a1b2c3d", date: "Jan 2025", msg: "init: greywhale.dev registered, first designs sketched" },
                { hash: "e4f5g6h", date: "Feb 2025", msg: "feat: first client signed — Blue Oak Dental, Folsom" },
                { hash: "i7j8k9l", date: "Mar 2025", msg: "ship: blueoakdental.com live in 12 days" },
                { hash: "m0n1o2p", date: "Now", msg: "wip: taking new clients, building the portfolio" },
              ].map((entry) => (
                <div key={entry.hash} className="flex flex-wrap gap-x-2 gap-y-0.5">
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

      {/* CTA — headline left, buttons right on desktop */}
      <section className="border-t border-gray-100 px-5 md:px-12 py-20">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-16 md:items-center">
          <div className="mb-8 md:mb-0">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-5" style={{ letterSpacing: "0.12em" }}>Ready?</p>
            <h2 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
              <span className="text-black">Be one of our</span>
              <br />
              <span className="text-gray-300">first clients.</span>
            </h2>
          </div>
          <div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8 tracking-wide">
              Early clients get our full attention, best pricing, and a team that's genuinely excited to earn your trust.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link href="/">
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer tracking-wide">
                  Get started
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="px-8 py-4 rounded-full text-black text-base font-medium border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer bg-white tracking-wide">
                  See our work
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
