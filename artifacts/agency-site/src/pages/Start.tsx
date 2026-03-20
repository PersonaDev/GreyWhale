import Layout from "@/components/Layout";
import Reveal from "@/components/Reveal";
import SentenceBuilder from "@/components/SentenceBuilder";

export default function Start() {
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
            <SentenceBuilder />
          </Reveal>

        </div>
      </div>
    </Layout>
  );
}
