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
  bgClass: string;
  imgBg: string;
};

const projects: Project[] = [
  {
    name: "Blue Oak Dental",
    category: "Healthcare",
    location: "Folsom, CA",
    year: 2025,
    tags: ["Web Design", "Forms", "SEO"],
    url: "blueoakdental.com",
    bgClass: "bg-stone-100",
    imgBg: "#e8e0d8",
  },
  {
    name: "Maison Caldo",
    category: "E-commerce",
    location: "Sacramento, CA",
    year: 2025,
    tags: ["E-commerce", "Shopify", "Branding"],
    url: "maisoncaldo.com",
    bgClass: "bg-neutral-800",
    imgBg: "#2a2a2a",
  },
  {
    name: "Valley Roots Cafe",
    category: "Food & Drink",
    location: "Davis, CA",
    year: 2025,
    tags: ["Web Design", "Menu", "SEO"],
    url: "valleyrootscafe.com",
    bgClass: "bg-amber-50",
    imgBg: "#fef3c7",
  },
  {
    name: "Peak Performance PT",
    category: "Healthcare",
    location: "Elk Grove, CA",
    year: 2025,
    tags: ["Booking", "Forms", "Web Design"],
    url: "peakperformancept.com",
    bgClass: "bg-blue-50",
    imgBg: "#e0eaff",
  },
  {
    name: "Sunrise Plumbing",
    category: "Service",
    location: "Roseville, CA",
    year: 2025,
    tags: ["Web Design", "SEO", "GMB"],
    url: "sunriseplumbing.com",
    bgClass: "bg-orange-50",
    imgBg: "#fff0e0",
  },
];

const categories = ["All", "Healthcare", "Service", "Food & Drink", "E-commerce"];

function ProjectCard({ project, active, hovered }: { project: Project; active: boolean; hovered?: boolean }) {
  const isDark = project.imgBg === "#2a2a2a";
  return (
    <a
      href={`https://${project.url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block shrink-0 w-[85vw] md:w-80 rounded-2xl overflow-hidden transition-all duration-200 ${
        hovered
          ? "shadow-2xl scale-[1.03] -translate-y-1"
          : active
          ? "shadow-xl"
          : "opacity-50"
      }`}
      style={{ backgroundColor: project.imgBg, textDecoration: "none" }}
    >
      <div className="h-48 flex items-end p-5">
        <div className="w-full">
          <div className={`w-2/3 h-1.5 rounded-full ${isDark ? "bg-white/20" : "bg-black/10"} mb-2`} />
          <div className={`w-1/2 h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/7"} mb-5`} />
          <div className="flex gap-2">
            <div className={`w-16 h-7 rounded-full ${isDark ? "bg-white/15" : "bg-black/10"}`} />
            <div className={`w-12 h-7 rounded-full ${isDark ? "bg-white/8" : "bg-black/5"}`} />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 pt-3 flex items-end justify-between">
        <div>
          <p className={`text-sm font-semibold tracking-tight ${isDark ? "text-white" : "text-black"}`}>{project.name}</p>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-black/35"}`}>{project.category} · {project.location}</p>
        </div>
        <p className={`text-[10px] font-mono tracking-wider ${isDark ? "text-white/30" : "text-black/25"}`}>{project.url}</p>
      </div>
    </a>
  );
}

const CARD_GAP = 12;

function getScaleForDistance(distance: number): number {
  if (distance === 0) return 1.0;
  if (Math.abs(distance) <= 1) return 0.78;
  return 0.62;
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
      setCardPx(vw * 0.85);
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

  return (
    <div className="md:hidden overflow-hidden">
      <motion.div
        className="flex pb-4"
        style={{
          x,
          gap: `${CARD_GAP}px`,
          paddingLeft: `calc((100vw - ${cardPx}px) / 2)`,
          paddingRight: `calc((100vw - ${cardPx}px) / 2)`,
        }}
        drag="x"
        dragConstraints={{ left: minX, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDragEnd={(_, info) => {
          isDragging.current = false;
          const velocity = info.velocity.x;
          const currentX = x.get();
          let projected = currentX + velocity * 0.3;
          let idx = Math.round(-projected / stepSize);
          idx = Math.max(0, Math.min(idx, filtered.length - 1));
          setActiveIndex(idx);
          animate(x, -idx * stepSize, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
        }}
        dragMomentum={false}
      >
        {filtered.map((project, i) => {
          const distance = i - activeIndex;
          const scale = getScaleForDistance(distance);
          return (
            <motion.div
              key={project.name}
              className="shrink-0"
              style={{ width: `85vw` }}
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
          <h1 className="font-semibold text-black text-4xl tracking-tight">Selected Work</h1>
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

        <div className="relative">
          {(() => {
            const cardW = 320;
            const step = 44;
            const n = filtered.length;
            const totalW = cardW + (n - 1) * step;
            return (
              <div className="hidden md:flex justify-center" style={{ height: 300, paddingTop: 40 }}>
                <div
                  className="relative"
                  style={{ width: totalW, height: 260 }}
                >
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
                          zIndex: isHovered
                            ? n + 20
                            : isActive
                            ? n + 10
                            : n - Math.abs(offset),
                          transform: `translateX(${isActive ? 8 : 0}px) scale(${isActive ? 1.02 : 0.97})`,
                          width: cardW,
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

          <MobileDockCarousel
            filtered={filtered}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>

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
              <h3 className="font-semibold text-black text-xl tracking-tight">{activeProject.name}</h3>
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
