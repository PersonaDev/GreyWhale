import { useEffect } from "react";
import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import SentenceBuilder from "@/components/SentenceBuilder";

export default function Start() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const initialRole = params.get("role") || "business owner";

  useEffect(() => {
    document.title = "Get Started | GreyWhale";
    let noindex = document.querySelector('meta[name="robots"][data-start]');
    if (!noindex) {
      noindex = document.createElement("meta");
      noindex.setAttribute("name", "robots");
      noindex.setAttribute("data-start", "true");
      document.head.appendChild(noindex);
    }
    noindex.setAttribute("content", "noindex, nofollow");
    return () => {
      noindex?.parentNode?.removeChild(noindex);
    };
  }, []);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full">
          <Reveal>
            <h1
              className="font-bold text-black text-center mb-14"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}
            >
              Let's build yours.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <SentenceBuilder initialRole={initialRole} />
          </Reveal>

        </div>
      </div>
    </Layout>
  );
}
