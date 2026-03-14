import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, animate } from "framer-motion";
import Layout from "@/components/Layout";

type Project = {
  name: string;
  category: string;
  location: string;
  year: number;
  tags: string[];
  url: string;
  imgBg: string;
  gradient: string;
};

const projects: Project[] = [
  {
    name: "Blue Oak Dental",
    category: "Healthcare",
    location: "Folsom, CA",
    year: 2025,
    tags: ["Web Design", "Forms", "SEO"],
    url: "blueoakdental.com",
    imgBg: "#e8e2d9",
    gradient: "from-stone-200 via-stone-100 to-amber-50",
  },
  {
    name: "Maison Caldo",
    category: "E-commerce",
    location: "Sacramento, CA",
    year: 2025,
    tags: ["E-commerce", "Shopify", "Branding"],
    url: "maisoncaldo.com",
    imgBg: "#1a1a1a",
    gradient: "from-neutral-900 via-neutral-800 to-zinc-900",
  },
  {
    name: "Valley Roots Cafe",
    category: "Food & Drink",
    location: "Davis, CA",
    year: 2025,
    tags: ["Web Design", "Menu", "SEO"],
    url: "valleyrootscafe.com",
    imgBg: "#f5ede0",
    gradient: "from-amber-100 via-orange-50 to-yellow-50",
  },
  {
    name: "Peak Performance PT",
    category: "Healthcare",
    location: "Elk Grove, CA",
    year: 2025,
    tags: ["Booking", "Forms", "Web Design"],
    url: "peakperformancept.com",
    imgBg: "#dce8f5",
    gradient: "from-blue-100 via-sky-50 to-indigo-50",
  },
  {
    name: "Sunrise Plumbing",
    category: "Service",
    location: "Roseville, CA",
    year: 2025,
    tags: ["Web Design", "SEO", "GMB"],
    url: "sunriseplumbing.com",
    imgBg: "#fde8d8",
    gradient: "from-orange-100 via-amber-50 to-yellow-50",
  },
];

const categories = ["All", "Healthcare", "Service", "Food & Drink", "E-commerce"];

function BrowserChrome({ url, isDark }: { url: string; isDark: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-t-2xl ${isDark ? "bg-zinc-800/80" : "bg-white/70"} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div
        className={`flex-1 flex items-center justify-center gap-1.5 text-xs rounded-md px-3 py-1.5 ${isDark ? "bg-zinc-700/60 text-zinc-400" : "bg-black/6 text-black/40"}`}
      >
        <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="tracking-wide">{url}</span>
      </div>
    </div>
  );
}

function CardContent({ project, isDark }: { project: Project; isDark: boolean }) {
  return (
    <div className={`flex-1 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
        <div className={`w-3/5 h-2.5 rounded-full ${isDark ? "bg-white/12" : "bg-black/10"}`} />
        <div className={`w-2/5 h-2 rounded-full ${isDark ? "bg-white/7" : "bg-black/6"}`} />
        <div className="flex gap-2 mt-2">
          <div className={`w-16 h-7 rounded-lg ${isDark ? "bg-white/15" : "bg-black/10"}`} />
          <div className={`w-12 h-7 rounded-lg ${isDark ? "bg-white/8" : "bg-black/6"}`} />
        </div>
        <div className={`w-full mt-2 h-px ${isDark ? "bg-white/8" : "bg-black/6"}`} />
        <div className="flex items-start gap-3 w-full">
          <div className={`w-8 h-8 rounded-lg shrink-0 ${isDark ? "bg-white/10" : "bg-black/8"}`} />
          <div className="flex-1 space-y-1.5">
            <div className={`h-2 rounded-full ${isDark ? "bg-white/12" : "bg-black/10"} w-full`} />
            <div className={`h-2 rounded-full ${isDark ? "bg-white/7" : "bg-black/6"} w-4/5`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, active }: { project: Project; active: boolean }) {
  const isDark = project.imgBg === "#1a1a1a";
  return (
    <div
      className={`block shrink-0 rounded-2xl overflow-hidden flex flex-col ${
        active ? "shadow-xl" : ""
      }`}
      style={{ height: "100%", width: "100%" }}
    >
      <BrowserChrome url={project.url} isDark={isDark} />
      <CardContent project={project} isDark={isDark} />
    </div>
  );
}

const CARD_GAP = 16;
const CARD_H = 240;

function useCardWidth() {
  const [cardWidth, setCardWidth] = useState(420);
  useEffect(() => {
    function measure() {
      const vw = window.innerWidth;
      setCardWidth(vw < 768 ? Math.round(vw * 0.82) : 420);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return cardWidth;
}

function getOpacityForDistance(distance: number): number {
  const abs = Math.abs(distance);
  if (abs === 0) return 1;
  if (abs === 1) return 0.5;
  return 0;
}

function PeekCarousel({
  filtered,
  activeIndex,
  setActiveIndex,
}: {
  filtered: Project[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}) {
  const x = useMotionValue(0);
  const cardWidth = useCardWidth();
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const stepSize = cardWidth + CARD_GAP;

  useEffect(() => {
    if (!isDragging.current && cardWidth > 0) {
      animate(x, -activeIndex * stepSize, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [activeIndex, cardWidth, stepSize]);

  useEffect(() => {
    setActiveIndex(0);
    if (cardWidth > 0) {
      x.set(0);
    }
  }, [filtered.length]);

  const getActiveFromX = useCallback(
    (xVal: number) => {
      if (stepSize <= 0) return 0;
      const raw = Math.round(-xVal / stepSize);
      return Math.max(0, Math.min(raw, filtered.length - 1));
    },
    [stepSize, filtered.length]
  );

  useEffect(() => {
    const unsub = x.on("change", (latest) => {
      if (isDragging.current) {
        const idx = getActiveFromX(latest);
        setActiveIndex(idx);
      }
    });
    return unsub;
  }, [x, getActiveFromX, setActiveIndex]);

  const minX = -(filtered.length - 1) * stepSize;
  const maxContainerWidth = 900;
  const sideInset = (maxContainerWidth - cardWidth) / 2;
  const pad = cardWidth > 0 ? `calc(max((100vw - ${maxContainerWidth}px) / 2 + ${sideInset}px, (100vw - ${cardWidth}px) / 2))` : "9vw";

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex items-center"
        style={{
          x,
          gap: `${CARD_GAP}px`,
          paddingLeft: pad,
          paddingRight: pad,
          height: CARD_H,
        }}
        drag="x"
        dragConstraints={{ left: minX, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => { isDragging.current = true; hasDragged.current = true; }}
        onDragEnd={(_, info) => {
          isDragging.current = false;
          const velocity = info.velocity.x;
          const currentX = x.get();
          const projected = currentX + velocity * 0.25;
          let idx = Math.round(-projected / stepSize);
          idx = Math.max(0, Math.min(idx, filtered.length - 1));
          setActiveIndex(idx);
          animate(x, -idx * stepSize, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
          setTimeout(() => { hasDragged.current = false; }, 300);
        }}
      >
        {filtered.map((project, i) => {
          const distance = i - activeIndex;
          const opacity = getOpacityForDistance(distance);
          const isActive = i === activeIndex;
          return (
            <motion.div
              key={project.name}
              role="button"
              tabIndex={0}
              aria-label={isActive ? `Open ${project.name} website` : `View ${project.name}`}
              className="shrink-0 cursor-pointer"
              style={{ width: cardWidth, height: CARD_H }}
              animate={{ opacity }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={() => {
                if (hasDragged.current) {
                  hasDragged.current = false;
                  return;
                }
                if (isActive) {
                  window.open(`https://${project.url}`, "_blank", "noopener,noreferrer");
                } else {
                  setActiveIndex(i);
                  animate(x, -i * stepSize, {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (isActive) {
                    window.open(`https://${project.url}`, "_blank", "noopener,noreferrer");
                  } else {
                    setActiveIndex(i);
                    animate(x, -i * stepSize, {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    });
                  }
                }
              }}
            >
              <ProjectCard project={project} active={isActive} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const activeProject = filtered[activeIndex] || filtered[0];

  const categoryCounts: Record<string, number> = { All: projects.length };
  categories.slice(1).forEach((c) => {
    categoryCounts[c] = projects.filter((p) => p.category === c).length;
  });

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setActiveIndex(0);
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-5 pt-10 pb-24">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-8 tracking-wide">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        <div className="flex items-start justify-between mb-4">
          <h1 className="font-bold text-black text-4xl tracking-tight">Selected Work</h1>
          <p className="text-xs text-gray-400 text-right hidden md:block leading-relaxed tracking-wide">
            5 sample sites for local businesses.<br />Click or swipe to explore.
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-5 mb-10 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs md:text-sm font-medium cursor-pointer transition-colors whitespace-nowrap tracking-wide ${
                activeCategory === cat ? "text-black" : "text-gray-300 hover:text-gray-500"
              }`}
            >
              {cat}
              {categoryCounts[cat] ? (
                <span className="ml-1 text-xs">{categoryCounts[cat]}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <PeekCarousel
        filtered={filtered}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <div className="max-w-7xl mx-auto px-5 pb-24">
        <div className="flex items-center justify-center gap-2 mt-6">
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex ? "bg-black w-5 h-2" : "bg-gray-300 w-2 h-2"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col items-center mt-6 text-center min-h-[80px]">
          {activeProject ? (
            <>
              <h3 className="font-bold text-black text-xl tracking-tight">{activeProject.name}</h3>
              <p className="text-gray-400 text-sm mt-1 tracking-wide">
                {activeProject.category} · {activeProject.location} · {activeProject.year}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {activeProject.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500 tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-300 text-sm tracking-wide">Click or swipe to explore projects</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
