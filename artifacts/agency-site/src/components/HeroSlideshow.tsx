import { useState, useEffect } from "react";

const SLIDES = [
  "/hero-slide-1.png",
  "/hero-slide-2.png",
  "/hero-slide-3.png",
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Client website showcase"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: i === current ? "block" : "none",
          }}
        />
      ))}
    </div>
  );
}
