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

function ProjectCard({ project, active, hovered }: { project: Project; active: boolean; hovered?: boolean }) {
  const isDark = project.imgBg === "#1a1a1a";
  return (
    <a
      href={`https://${project.url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block shrink-0 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col ${
        hovered ? "shadow-2xl" : active ? "shadow-xl" : "opacity-55"
      }`}
      style={{ textDecoration: "none", height: "100%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <BrowserChrome url={project.url} isDark={isDark} />
      <CardContent project={project} isDark={isDark} />
    </a>
  );
}

const CARD_W = 320;
const CARD_H = 220;
const CARD_GAP = 12;

function getScaleForDistance(distance: number): number {
  if (distance === 0) return 1.0;
  if (Math.abs(distance) === 1) return 0.82;
  return 0.65;
}

function MobileDockCarousel({
  filtered,
  activeIndex,
  setActiveIndex,
}: {
  filtered: Project[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}) {
  const x = useMotionValue(0);
  const [cardPx, setCardPx] = useState(0);
  const isDragging = useRef(false);

  useEffect(() => {
    function measure() {
      const vw = window.innerWidth;
      setCardPx(Math.round(vw * 0.82));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const stepSize = cardPx + CARD_GAP;

  useEffect(() => {
    if (!isDragging.current && cardPx > 0) {
      animate(x, -activeIndex * stepSize, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [activeIndex, cardPx, stepSize]);

  useEffect(() => {
    setActiveIndex(0);
    if (cardPx > 0) {
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
  const pad = cardPx > 0 ? `calc((100vw - ${cardPx}px) / 2)` : "9vw";

  return (
    <div className="md:hidden overflow-hidden">
      <motion.div
        className="flex"
        style={{
          x,
          gap: `${CARD_GAP}px`,
          paddingLeft: pad,
          paddingRight: pad,
        }}
        drag="x"
        dragConstraints={{ left: minX, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => { isDragging.current = true; }}
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
        }}
      >
        {filtered.map((project, i) => {
          const distance = i - activeIndex;
          const scale = getScaleForDistance(distance);
          return (
            <motion.div
              key={project.name}
              className="shrink-0"
              style={{ width: cardPx > 0 ? cardPx : "82vw", height: 220 }}
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => {
                if (!isDragging.current) {
                  setActiveIndex(i);
                  animate(x, -i * stepSize, {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  });
                }
              }}
            >
              <ProjectCard project={project} active={i === activeIndex} />
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
            5 sample sites for local businesses.<br />Hover to explore.
          </p>
        </div>

        <div className="flex items-center gap-5 mb-10 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-sm font-medium cursor-pointer transition-colors whitespace-nowrap tracking-wide ${
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

        {/* Desktop stacked fan */}
        {(() => {
          const step = 44;
          const n = filtered.length;
          const totalW = CARD_W + (n - 1) * step;
          return (
            <div className="hidden md:flex justify-center" style={{ height: CARD_H + 60, paddingTop: 40 }}>
              <div className="relative" style={{ width: totalW, height: CARD_H }}>
                {filtered.map((project, i) => {
                  const offset = i - activeIndex;
                  const isActive = i === activeIndex;
                  const isHovered = hoveredIndex === i;
                  return (
                    <div
                      key={project.name}
                      onClick={() => setActiveIndex(i)}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="absolute top-0 cursor-pointer transition-all duration-200"
                      style={{
                        left: `${i * step}px`,
                        zIndex: isHovered ? n + 20 : isActive ? n + 10 : n - Math.abs(offset),
                        transform: `translateX(${isActive ? 8 : 0}px) scale(${isHovered ? 1.04 : isActive ? 1.02 : 0.97})`,
                        width: CARD_W,
                        height: CARD_H,
                      }}
                    >
                      <ProjectCard project={project} active={isActive} hovered={isHovered} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Mobile dock carousel */}
        <MobileDockCarousel
          filtered={filtered}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        {/* Dots */}
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

        {/* Project info */}
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
            <p className="text-gray-300 text-sm tracking-wide">Hover to explore projects</p>
          )}
        </div>

      </div>
    </Layout>
  );
}
