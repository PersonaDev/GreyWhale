import { useEffect, useState, useRef } from "react";

const ROW_H = 62; // px per result row

interface Result {
  title: string;
  url: string;
  desc: string;
  isYou?: boolean;
}

const RESULTS: Result[] = [
  { title: "Sacramento Web Design Co.", url: "sacwebdesign.com", desc: "Professional websites for local businesses..." },
  { title: "Creative Digital Studio", url: "creativedigital.co", desc: "Award-winning agency serving the region..." },
  { title: "WebPros Sacramento", url: "webpros-sac.com", desc: "Custom solutions for small businesses..." },
  { title: "GreyWhale Web Design", url: "greywhale.dev", desc: "Custom-built, SEO-loaded websites for Sacramento small businesses.", isYou: true },
];

type Phase = "wait" | "rising" | "top" | "reset";

function ResultRow({
  result,
  rank,
  top,
  highlighted,
  showBadge,
}: {
  result: Result;
  rank: number;
  top: number;
  highlighted: boolean;
  showBadge: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: ROW_H - 6,
        transition: "top 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        background: highlighted ? "rgba(16,163,127,0.06)" : "transparent",
        borderRadius: 8,
        border: highlighted ? "1px solid rgba(16,163,127,0.25)" : "1px solid transparent",
        padding: "8px 10px 8px 10px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      {/* Rank badge */}
      <div
        style={{
          minWidth: 26,
          height: 26,
          borderRadius: "50%",
          background: highlighted && rank === 1 ? "#10a37f" : "#e5e7eb",
          color: highlighted && rank === 1 ? "#fff" : "#6b7280",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          marginTop: 1,
          transition: "background 0.4s, color 0.4s",
          flexShrink: 0,
        }}
      >
        {rank}
      </div>

      {/* Text content */}
      <div style={{ minWidth: 0, flex: 1 }}>
        {result.isYou ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1a73e8",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {result.title}
              </span>
              {showBadge && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    background: "#10a37f",
                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: 4,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  YOU
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#188038", marginTop: 1 }}>{result.url}</div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2, lineHeight: 1.4 }}>{result.desc}</div>
          </>
        ) : (
          <>
            <div
              style={{
                height: 11,
                background: "#d1d5db",
                borderRadius: 4,
                width: "60%",
                marginBottom: 4,
              }}
            />
            <div
              style={{
                height: 9,
                background: "#e5e7eb",
                borderRadius: 4,
                width: "35%",
                marginBottom: 4,
              }}
            />
            <div
              style={{
                height: 9,
                background: "#f3f4f6",
                borderRadius: 4,
                width: "80%",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function HeroRankAnimation() {
  const [phase, setPhase] = useState<Phase>("wait");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }

  function startCycle() {
    setPhase("wait");
    schedule(() => setPhase("rising"), 900);
    schedule(() => setPhase("top"), 1700);
    schedule(() => setPhase("reset"), 4200);
    schedule(() => startCycle(), 4800);
  }

  useEffect(() => {
    startCycle();
    return clearTimers;
  }, []);

  // Calculate top positions for each result index
  // In "wait" / "top": order = [0,1,2,3] (GreyWhale at index 3)
  // In "rising" / "top": GreyWhale at index 0, others pushed down
  const youIndex = 3; // GreyWhale starts at position 4

  function topFor(resultIndex: number) {
    if (phase === "rising" || phase === "top") {
      if (resultIndex === youIndex) return 0;
      // Others shift down one slot
      const orig = resultIndex;
      return (orig + 1) * ROW_H;
    }
    return resultIndex * ROW_H;
  }

  function rankFor(resultIndex: number) {
    if (phase === "rising" || phase === "top") {
      if (resultIndex === youIndex) return 1;
      return resultIndex + 2;
    }
    return resultIndex + 1;
  }

  const containerH = RESULTS.length * ROW_H + 8;
  const isAtTop = phase === "rising" || phase === "top";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      {/* Chrome-style card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 4px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            background: "#f8f8f8",
            borderBottom: "1px solid #e5e7eb",
            padding: "10px 14px 10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 5 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>

          {/* Search bar */}
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 12, color: "#374151", letterSpacing: "-0.01em" }}>
              web design sacramento
            </span>
          </div>
        </div>

        {/* SERP body */}
        <div style={{ padding: "12px 14px 14px" }}>
          {/* "About X results" line */}
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10, letterSpacing: "0.01em" }}>
            About 4,820,000 results
          </div>

          {/* Results list */}
          <div style={{ position: "relative", height: containerH }}>
            {RESULTS.map((result, i) => (
              <ResultRow
                key={result.url}
                result={result}
                rank={rankFor(i)}
                top={topFor(i)}
                highlighted={result.isYou === true}
                showBadge={result.isYou === true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status label below the card */}
      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: isAtTop ? "#10a37f" : "#9ca3af",
          transition: "color 0.5s",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {isAtTop ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            Ranked #1 on Google
          </span>
        ) : (
          "Climbing the rankings..."
        )}
      </div>
    </div>
  );
}
