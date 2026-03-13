import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="px-6 pt-16 pb-20 flex flex-col items-center text-center">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-12">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        <h1
          className="font-bold leading-tight mb-6 max-w-3xl"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)", lineHeight: 1.05 }}
        >
          <span className="text-black">We're new here.</span>
          <br />
          <span className="text-gray-300">And that's exactly why</span>
          <br />
          <span className="text-black">we outwork everyone.</span>
        </h1>

        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
          GreyWhale is a creative agency founded in 2025 in Sacramento. Local businesses deserve real design and real craft — not templates. We're small on purpose and hungry to prove it.
        </p>
      </section>

      {/* Process */}
      <section className="border-t border-gray-100 px-6 py-16 flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Process</p>
        <h2 className="font-bold text-black leading-tight mb-10" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>
          First call to live site
          <br />
          <span className="text-gray-300">in 14 days, avg.</span>
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full max-w-md text-left">
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
      </section>

      {/* Principles */}
      <section className="border-t border-gray-100 px-6 py-16 flex flex-col items-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Principles</p>
        <h2 className="font-bold text-black text-3xl mb-10 text-center">What we believe</h2>
        <div className="divide-y divide-gray-100 w-full max-w-xl">
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
                <span className="font-bold text-black text-base">{p.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:block">{p.desc}</span>
                <span className="text-gray-300 group-hover:text-black transition-colors text-lg leading-none">+</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Changelog */}
      <section className="border-t border-gray-100 px-6 py-16 flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Changelog</p>
        <h2 className="font-bold text-black leading-tight mb-10" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>
          Just getting <span className="text-gray-300">started.</span>
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full max-w-md text-left">
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
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 px-6 py-20 flex flex-col items-center text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5">Ready?</p>
        <h2 className="font-bold leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          <span className="text-black">Be one of our</span>
          <br />
          <span className="text-gray-300">first clients.</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
          Early clients get our full attention, best pricing, and a team that's genuinely excited to earn your trust.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Get started
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
