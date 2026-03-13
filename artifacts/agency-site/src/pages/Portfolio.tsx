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
  bg: string;
};

const projects: Project[] = [
  {
    name: "Blue Oak Dental",
    category: "Healthcare",
    location: "Folsom, CA",
    year: 2025,
    tags: ["Web Design", "Forms", "SEO"],
    url: "blueoakdental.com",
    bg: "bg-stone-100",
  },
  {
    name: "Maison Caldo",
    category: "E-commerce",
    location: "Sacramento, CA",
    year: 2025,
    tags: ["E-commerce", "Shopify", "Branding"],
    url: "maisoncaldo.com",
    bg: "bg-gray-800",
  },
  {
    name: "Valley Roots Cafe",
    category: "Food & Drink",
    location: "Davis, CA",
    year: 2025,
    tags: ["Web Design", "Menu", "SEO"],
    url: "valleyrootscafe.com",
    bg: "bg-amber-50",
  },
  {
    name: "Peak Performance PT",
    category: "Healthcare",
    location: "Elk Grove, CA",
    year: 2025,
    tags: ["Booking", "Forms", "Web Design"],
    url: "peakperformancept.com",
    bg: "bg-blue-50",
  },
  {
    name: "Sunrise Plumbing Co.",
    category: "Service",
    location: "Roseville, CA",
    year: 2025,
    tags: ["Web Design", "SEO", "GMB"],
    url: "sunriseplumbingco.com",
    bg: "bg-orange-50",
  },
];

const categories = ["All", "Healthcare", "Service", "Food & Drink", "E-commerce"];

const BrowserMockup = ({ project, index, total, hovered }: {
  project: Project;
  index: number;
  total: number;
  hovered: number | null;
}) => {
  const isHovered = hovered === index;
  const offset = index - Math.floor(total / 2);
  const isActive = hovered !== null && hovered !== index;

  const baseX = offset * 32;
  const baseRotate = offset * 3;
  const activeScale = isHovered ? 1.04 : 0.96;
  const activeTranslateX = isHovered ? 0 : baseX + (hovered !== null ? (index < hovered ? -60 : 60) : 0);
  const activeRotate = isHovered ? 0 : baseRotate + (hovered !== null ? (index < hovered ? -5 : 5) : 0);

  return (
    <div
      className="absolute w-96 transition-all duration-300 ease-out cursor-pointer"
      style={{
        transform: `translateX(${isHovered ? 0 : activeTranslateX}px) rotate(${isHovered ? 0 : activeRotate}deg) scale(${isActive ? activeScale : 1})`,
        zIndex: isHovered ? 50 : total - Math.abs(offset),
        left: "50%",
        marginLeft: "-12rem",
      }}
    >
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white">
        {/* Browser chrome */}
        <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="flex-1 mx-3">
            <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono text-center border border-gray-200">
              {project.url}
            </div>
          </div>
        </div>
        {/* Content preview */}
        <div className={`h-52 ${project.bg} flex items-center justify-center`}>
          <div className="text-center p-6">
            <div className="w-16 h-1.5 rounded bg-gray-300 mx-auto mb-3" />
            <div className="w-24 h-1 rounded bg-gray-200 mx-auto mb-2" />
            <div className="w-20 h-1 rounded bg-gray-200 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const categoryCounts: Record<string, number> = { All: projects.length };
  categories.slice(1).forEach((c) => {
    categoryCounts[c] = projects.filter((p) => p.category === c).length;
  });

  const activeProject = hovered !== null ? filtered[hovered] : null;

  return (
    <Layout>
      <div className="px-6 pt-12 pb-24">
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </Link>

        <div className="flex items-start justify-between mb-6">
          <h1 className="font-bold text-black text-4xl">Selected Work</h1>
          <div className="text-right text-sm text-gray-400 hidden md:block">
            <p>5 sample sites for local businesses.</p>
            <p>Hover to explore.</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-6 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setHovered(null); }}
              className={`text-sm font-medium cursor-pointer transition-colors ${
                activeCategory === cat ? "text-black" : "text-gray-300 hover:text-gray-500"
              }`}
            >
              {cat}
              {categoryCounts[cat] > 0 && (
                <span className="ml-1 text-xs">{categoryCounts[cat]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Stacked card viewer */}
        <div
          className="relative flex justify-center"
          style={{ height: "360px" }}
          onMouseLeave={() => setHovered(null)}
        >
          {filtered.map((project, i) => (
            <div
              key={project.name}
              className="absolute"
              style={{
                left: "50%",
                marginLeft: "-12rem",
                width: "24rem",
                zIndex: hovered === i ? 50 : filtered.length - Math.abs(i - Math.floor(filtered.length / 2)),
              }}
              onMouseEnter={() => setHovered(i)}
            >
              <BrowserMockup
                project={project}
                index={i}
                total={filtered.length}
                hovered={hovered}
              />
            </div>
          ))}
        </div>

        {/* Project info */}
        <div className="flex flex-col items-center mt-8 text-center h-24">
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
