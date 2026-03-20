import { useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import { niches } from "@/pages/niche/data";

export default function NicheHub() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Industries We Serve | GreyWhale";
    return () => { document.title = prev; };
  }, []);

  return (
    <Layout>
      <section className="px-6 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-8 tracking-wide">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <h1
              className="font-bold text-black tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Websites built for your industry.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
              We design custom sites for local businesses across Sacramento. Choose your industry to see how we can help.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            {niches.map((niche, i) => (
              <Reveal key={niche.slug} delay={i * 50}>
                <Link href={`/for/${niche.slug}`}>
                  <div className="bg-white p-8 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-black text-lg tracking-tight group-hover:underline decoration-1 underline-offset-2">
                          {niche.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{niche.hubDesc}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={600}>
            <div className="mt-16 pt-12 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-sm mb-4 tracking-wide">Don't see your industry?</p>
              <Link href="/">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer tracking-wide">
                  Tell us about your business
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
