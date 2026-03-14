import { Link } from "wouter";
import Layout from "@/components/Layout";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FadeInItem({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

interface TypingLine {
  text: string;
  className?: string;
}

function useTypingAnimation(lines: TypingLine[], isActive: boolean, charDelay = 25, lineDelay = 200) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [currentChar, setCurrentChar] = useState(0);
  const startedRef = useRef(false);
  const transitionRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const done = currentLine >= lines.length;

  useEffect(() => {
    if (!isActive || startedRef.current) return;
    startedRef.current = true;
    timeoutRef.current = setTimeout(() => {
      setCurrentLine(0);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (currentLine < 0 || currentLine >= lines.length || transitionRef.current) return;

    const line = lines[currentLine];
    if (currentChar < line.text.length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, charDelay);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      transitionRef.current = true;
      timeoutRef.current = setTimeout(() => {
        transitionRef.current = false;
        setCurrentChar(0);
        setCurrentLine((l) => l + 1);
      }, lineDelay);
    }
  }, [currentLine, currentChar, lines.length, charDelay, lineDelay]);

  return { currentLine, currentChar, done };
}

function ProcessTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const lines: TypingLine[] = [
    { text: '$ greywhale start --client "your-business"', className: "text-gray-400" },
    { text: "✓ Discovery call", className: "text-green-600" },
    { text: "✓ Wireframes approved", className: "text-green-600" },
    { text: "✓ Design system built", className: "text-green-600" },
    { text: "✓ Development done", className: "text-green-600" },
    { text: "✓ Revisions completed", className: "text-green-600" },
    { text: "✓ Performance audit 98/100", className: "text-green-600" },
    { text: "✓ Deployed to production", className: "text-green-600" },
    { text: "$ Your site is live.", className: "text-gray-400" },
  ];

  const { currentLine, currentChar, done } = useTypingAnimation(lines, inView, 20, 150);

  const renderLine = (idx: number) => {
    const line = lines[idx];
    if (idx === 0) {
      return (
        <p className="text-gray-400 mb-2">
          <span className="text-gray-300">$</span> greywhale start --client "your-business"
        </p>
      );
    }
    if (idx === lines.length - 1) {
      return (
        <p className="text-gray-400 mt-2">
          <span className="text-gray-300">$</span> <span className="text-gray-700">Your site is live.</span>
        </p>
      );
    }
    return <p className={line.className}>{line.text}</p>;
  };

  const renderActiveLine = () => {
    if (currentLine < 0 || currentLine >= lines.length) return null;
    const line = lines[currentLine];
    const visibleText = line.text.substring(0, currentChar);

    if (currentLine === 0) {
      const fullPrefix = '$ greywhale start --client "your-business"';
      const visible = fullPrefix.substring(0, currentChar);
      const dollarEnd = Math.min(currentChar, 1);
      return (
        <p className="text-gray-400 mb-2">
          {dollarEnd > 0 && <span className="text-gray-300">$</span>}
          {currentChar > 1 && <span>{visible.substring(1)}</span>}
          <span className="animate-pulse">█</span>
        </p>
      );
    }

    if (currentLine === lines.length - 1) {
      const fullText = "$ Your site is live.";
      const visible = fullText.substring(0, currentChar);
      const dollarEnd = Math.min(currentChar, 1);
      return (
        <p className="text-gray-400 mt-2">
          {dollarEnd > 0 && <span className="text-gray-300">$</span>}
          {currentChar > 1 && (
            <span>
              {" "}
              <span className="text-gray-700">{visible.substring(2)}</span>
            </span>
          )}
          <span className="animate-pulse">█</span>
        </p>
      );
    }

    return (
      <p className={line.className}>
        {visibleText}
        <span className="animate-pulse">█</span>
      </p>
    );
  };

  return (
    <div ref={ref} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-gray-400 font-mono">greywhale — zsh</span>
      </div>
      <div className="p-5 font-mono text-sm text-gray-700 leading-loose" style={{ minHeight: "280px" }}>
        {lines.map((_, idx) => {
          if (idx < currentLine) {
            return <div key={idx}>{renderLine(idx)}</div>;
          }
          return null;
        })}
        {!done && renderActiveLine()}
        {done && (
          <p className="text-gray-400 mt-0">
            <span className="text-gray-300">$</span> <span className="animate-pulse">█</span>
          </p>
        )}
      </div>
    </div>
  );
}

function ChangelogTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const entries = [
    { hash: "a1b2c3d", date: "Jan 2025", msg: "init: greywhale.dev registered, first designs sketched" },
    { hash: "e4f5g6h", date: "Feb 2025", msg: "feat: first client signed — Blue Oak Dental, Folsom" },
    { hash: "i7j8k9l", date: "Mar 2025", msg: "ship: blueoakdental.com live in 12 days" },
    { hash: "m0n1o2p", date: "Now", msg: "wip: taking new clients, building the portfolio" },
  ];

  const lines: TypingLine[] = entries.map((e) => ({
    text: `${e.hash} (${e.date}) ${e.msg}`,
    className: "",
  }));

  const { currentLine, currentChar, done } = useTypingAnimation(lines, inView, 15, 250);

  return (
    <div ref={ref} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
      <div className="p-5 font-mono text-sm leading-relaxed space-y-4" style={{ minHeight: "220px" }}>
        {entries.map((entry, idx) => {
          if (idx < currentLine) {
            return (
              <div key={entry.hash} className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span className="text-amber-500 shrink-0">{entry.hash}</span>
                <span className="text-gray-400 shrink-0">({entry.date})</span>
                <span className="text-gray-700">{entry.msg}</span>
              </div>
            );
          }
          return null;
        })}
        {!done && currentLine >= 0 && currentLine < entries.length && (() => {
          const entry = entries[currentLine];
          const fullText = `${entry.hash} (${entry.date}) ${entry.msg}`;
          const visible = fullText.substring(0, currentChar);

          const hashLen = entry.hash.length;
          const dateStr = `(${entry.date})`;
          const dateEnd = hashLen + 1 + dateStr.length;

          return (
            <div key={`active-${currentLine}`} className="flex flex-wrap gap-x-2 gap-y-0.5">
              {currentChar <= hashLen ? (
                <span className="text-amber-500 shrink-0">
                  {visible}
                  <span className="animate-pulse">█</span>
                </span>
              ) : currentChar <= dateEnd ? (
                <>
                  <span className="text-amber-500 shrink-0">{entry.hash}</span>
                  <span className="text-gray-400 shrink-0">
                    {visible.substring(hashLen + 1)}
                    <span className="animate-pulse">█</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-amber-500 shrink-0">{entry.hash}</span>
                  <span className="text-gray-400 shrink-0">{dateStr}</span>
                  <span className="text-gray-700">
                    {visible.substring(dateEnd + 1)}
                    <span className="animate-pulse">█</span>
                  </span>
                </>
              )}
            </div>
          );
        })()}
        {done && (
          <div className="flex gap-2 text-gray-400 pt-1">
            <span className="text-gray-300">$</span>
            <span>git log --oneline --author=greywhale<span className="animate-pulse">█</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Layout>
      <section className="px-5 md:px-12 pt-16 pb-20">
        <FadeInSection>
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-12 tracking-wide">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </Link>
        </FadeInSection>

        <div className="max-w-5xl mx-auto">
          <FadeInSection>
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
          </FadeInSection>

          <FadeInSection delay={0.4}>
            <div className="md:flex md:justify-end">
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed tracking-wide md:text-right">
                GreyWhale is a creative agency founded in 2025 in Sacramento. Local businesses deserve real design and real craft — not templates. We're small on purpose and hungry to prove it.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_1.5fr] md:gap-16 md:items-start">
          <FadeInSection>
            <div className="mb-8 md:mb-0 md:sticky md:top-24">
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Process</p>
              <h2 className="font-semibold text-black leading-tight" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", letterSpacing: "-0.01em" }}>
                First call to live site
                <br />
                <span className="text-gray-300">in 14 days, avg.</span>
              </h2>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <ProcessTerminal />
          </FadeInSection>
        </div>
      </section>

      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1.5fr_1fr] md:gap-16 md:items-start">
          <FadeInSection>
            <div className="mb-8 md:mb-0 md:order-2">
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Principles</p>
              <h2 className="font-semibold text-black text-3xl" style={{ letterSpacing: "-0.01em" }}>What we believe</h2>
            </div>
          </FadeInSection>
          <div className="divide-y divide-gray-100 md:order-1">
            {[
              { n: "01", title: "Craft Over Templates", desc: "Hand-built, every time." },
              { n: "02", title: "Local First", desc: "We know Sacramento." },
              { n: "03", title: "Speed Matters", desc: "Fast sites, fast delivery." },
              { n: "04", title: "Honest Pricing", desc: "No surprises. Ever." },
              { n: "05", title: "Long-term Partners", desc: "Not a one-time vendor." },
            ].map((p, i) => (
              <FadeInItem key={p.n} delay={0.08 * i}>
                <div className="flex items-center justify-between py-5 group cursor-default">
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-gray-300 font-mono w-5 shrink-0">{p.n}</span>
                    <span className="font-semibold text-black text-base tracking-tight">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 hidden sm:block tracking-wide">{p.desc}</span>
                    <span className="text-gray-300 group-hover:text-black transition-colors text-lg leading-none">+</span>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 px-5 md:px-12 py-16">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_1.5fr] md:gap-16 md:items-start">
          <FadeInSection>
            <div className="mb-8 md:mb-0">
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3" style={{ letterSpacing: "0.12em" }}>Changelog</p>
              <h2 className="font-semibold text-black leading-tight" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", letterSpacing: "-0.01em" }}>
                Just getting <span className="text-gray-300">started.</span>
              </h2>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <ChangelogTerminal />
          </FadeInSection>
        </div>
      </section>

      <section className="border-t border-gray-100 px-5 md:px-12 py-20">
        <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-16 md:items-center">
          <FadeInSection>
            <div className="mb-8 md:mb-0">
              <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-5" style={{ letterSpacing: "0.12em" }}>Ready?</p>
              <h2 className="font-semibold leading-tight" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}>
                <span className="text-black">Let's build</span>
                <br />
                <span className="text-gray-300">something great.</span>
              </h2>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.15}>
            <div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8 tracking-wide">
                Every project gets our full attention, transparent pricing, and a team that's genuinely invested in your success.
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
          </FadeInSection>
        </div>
      </section>
    </Layout>
  );
}
