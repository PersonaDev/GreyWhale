import { useState } from "react";
import { Link } from "wouter";
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

function BrowserCard({ project, active }: { project: Project; active: boolean }) {
  return (
    <div
      className={`shrink-0 w-[85vw] md:w-80 rounded-xl overflow-hidden border shadow-md bg-white transition-all duration-300 ${
        active ? "border-gray-300 shadow-xl" : "border-gray-200 opacity-60"
      }`}
    >
      {/* Browser chrome */}
      <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="flex-1 mx-2">
          <div className="bg-white rounded px-2 py-0.5 text-xs text-gray-400 font-mono text-center border border-gray-200 truncate">
            {project.url}
          </div>
        </div>
      </div>
      {/* Fake website content */}
      <div className="h-44 flex items-center justify-center" style={{ backgroundColor: project.imgBg }}>
        <div className="w-full px-6 py-4">
          <div className="w-2/3 h-2 rounded-full bg-black/10 mb-2" />
          <div className="w-1/2 h-2 rounded-full bg-black/7 mb-4" />
          <div className="flex gap-2">
            <div className="w-16 h-6 rounded-full bg-black/15" />
            <div className="w-12 h-6 rounded-full bg-black/7" />
          </div>
        </div>
      </div>
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
      <div className="px-6 pt-10 pb-24">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        <div className="flex items-start justify-between mb-4">
          <h1 className="font-bold text-black text-4xl">Selected Work</h1>
          <p className="text-xs text-gray-400 text-right hidden md:block leading-relaxed">
            5 sample sites for local businesses.<br />Hover to explore.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-5 mb-10 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-sm font-medium cursor-pointer transition-colors whitespace-nowrap ${
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

        {/* Horizontal file-stack carousel */}
        <div className="relative">
          {/* Desktop: overlapping stack with click-to-advance */}
          <div className="hidden md:flex items-center justify-center" style={{ height: 300 }}>
            <div className="relative" style={{ width: 340 * Math.min(filtered.length, 3) + 80 }}>
              {filtered.map((project, i) => {
                const offset = i - activeIndex;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={project.name}
                    onClick={() => setActiveIndex(i)}
                    className="absolute top-0 cursor-pointer transition-all duration-300"
                    style={{
                      left: `${i * 40}px`,
                      zIndex: isActive ? filtered.length + 10 : filtered.length - Math.abs(offset),
                      transform: `translateX(${isActive ? 20 : 0}px) scale(${isActive ? 1.02 : 0.97})`,
                      width: 320,
                    }}
                  >
                    <BrowserCard project={project} active={isActive} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: scroll-snap horizontal carousel */}
          <div className="md:hidden">
            <div
              className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const cardWidth = el.scrollWidth / filtered.length;
                const idx = Math.round(el.scrollLeft / cardWidth);
                setActiveIndex(Math.min(idx, filtered.length - 1));
              }}
            >
              {/* Leading spacer */}
              <div className="shrink-0 w-[7.5vw]" />
              {filtered.map((project, i) => (
                <div key={project.name} className="snap-center shrink-0">
                  <BrowserCard project={project} active={i === activeIndex} />
                </div>
              ))}
              {/* Trailing spacer */}
              <div className="shrink-0 w-[7.5vw]" />
            </div>
          </div>
        </div>

        {/* Dot indicators */}
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
              <h3 className="font-bold text-black text-xl">{activeProject.name}</h3>
              <p className="text-gray-400 text-sm mt-1">
                {activeProject.category} · {activeProject.location} · {activeProject.year}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {activeProject.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-300 text-sm">Hover to explore projects</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
