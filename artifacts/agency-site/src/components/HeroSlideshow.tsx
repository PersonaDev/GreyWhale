import { useState, useEffect } from "react";

const SLIDES = [
  "/hero-slide-1.png",
  "/hero-slide-2.png",
  "/hero-slide-3.png",
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setVisible(true);
      }, 120);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={SLIDES[current]}
      alt="Client website showcase"
      className="w-full h-auto object-contain"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 0.12s ease-in" : "opacity 0.08s ease-out",
      }}
    />
  );
}
