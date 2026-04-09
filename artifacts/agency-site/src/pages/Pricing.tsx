import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { usePageTitle } from "@/hooks/usePageTitle";

type Feature = { text: string; highlight?: boolean };

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    label: "Get found online",
    features: [
      { text: "Custom-designed website (up to 5 pages)" },
      { text: "Mobile-first, pixel-perfect build" },
      { text: "Hosting, SSL & 99.9% uptime included" },
      { text: "On-page SEO — titles, meta, schema markup" },
      { text: "Contact form with instant lead email alerts" },
      { text: "GreyWhale client portal — view every lead, request changes" },
      { text: "1 revision round per month" },
      { text: "48-hour support response" },
    ] as Feature[],
    nudge: { text: "Want booking, a CRM & full local SEO?", link: "See Professional →", target: "professional" },
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$149",
    label: "Turn visitors into customers",
    features: [
      { text: "Everything in Starter" },
      { text: "Up to 10 pages", highlight: true },
      { text: "Online booking or scheduling integration", highlight: true },
      { text: "Lead capture forms with CRM auto-import", highlight: true },
      { text: "GreyWhale CRM dashboard — pipeline view, lead history & follow-up tracking", highlight: true },
      { text: "Google Analytics 4 + heatmap setup", highlight: true },
      { text: "Google Business Profile optimisation", highlight: true },
      { text: "Full local SEO: schema, FAQ rich results, structured data, geo-targeting", highlight: true },
      { text: "Self-service content edits via client portal", highlight: true },
      { text: "2 revision rounds per month", highlight: true },
      { text: "24-hour priority support", highlight: true },
      { text: "Monthly performance check-in call", highlight: true },
    ] as Feature[],
    nudge: { text: "Need e-commerce or advanced automations?", link: "See Business →", target: "business" },
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$249",
    label: "Scale without limits",
    features: [
      { text: "Everything in Professional" },
      { text: "Up to 20 pages", highlight: true },
      { text: "E-commerce — product pages, cart, checkout & inventory", highlight: true },
      { text: "Advanced CRM — pipeline stages, lead scoring, automated follow-up sequences", highlight: true },
      { text: "Custom API integrations (Zapier, webhooks, third-party tools)", highlight: true },
      { text: "Blog & full content management system", highlight: true },
      { text: "Monthly performance report with ranking data & conversion metrics", highlight: true },
      { text: "Core Web Vitals & speed optimisation", highlight: true },
      { text: "Quarterly conversion rate audit", highlight: true },
      { text: "Unlimited revision rounds", highlight: true },
      { text: "Same-day support response", highlight: true },
      { text: "Dedicated account manager", highlight: true },
      { text: "White-glove onboarding & setup", highlight: true },
      { text: "Quarterly strategy session with growth roadmap", highlight: true },
    ] as Feature[],
    popular: false,
  },
];

const comparisonRows: { label: string; diy: string; freelancer: string; agency: string; gw: string }[] = [
  { label: "Upfront cost", diy: "$0", freelancer: "$1,500–$5,000", agency: "$4,000–$10,000", gw: "$0" },
  { label: "Monthly cost", diy: "$16–$39", freelancer: "$0–$100", agency: "$200–$2,000", gw: "$49" },
  { label: "Year 1 total", diy: "$192–$468", freelancer: "$1,500–$6,200", agency: "$6,400–$34,000", gw: "$588" },
  { label: "Custom design", diy: "no", freelancer: "yes", agency: "yes", gw: "yes" },
  { label: "You build it", diy: "Yes", freelancer: "No", agency: "No", gw: "No" },
  { label: "Hosting included", diy: "yes", freelancer: "Rarely", agency: "Sometimes", gw: "yes" },
  { label: "SEO setup", diy: "Basic", freelancer: "Varies", agency: "yes", gw: "yes" },
  { label: "Client CRM included", diy: "no", freelancer: "no", agency: "no", gw: "yes" },
  { label: "Lead tracking", diy: "no", freelancer: "no", agency: "Extra cost", gw: "yes" },
  { label: "Self-service edits", diy: "yes", freelancer: "no", agency: "Sometimes", gw: "yes" },
  { label: "Turnaround", diy: "DIY", freelancer: "4–8 weeks", agency: "6–12 weeks", gw: "14 days" },
  { label: "Contract lock-in", diy: "Monthly/annual", freelancer: "Per project", agency: "6–12 months", gw: "Cancel anytime" },
  { label: "Ongoing support", diy: "Help docs", freelancer: "Extra cost", agency: "Retainer", gw: "Included" },
];

const faqs = [
  {
    q: "Which plan is right for me?",
    a: "Starter gets you a fast, beautiful site that shows up on Google and converts visitors. Professional is our most popular — it adds a CRM, booking integration, full local SEO, and Google Analytics so your site actively brings in new customers every month. Business is for companies that need e-commerce, custom tool integrations, or a larger multi-page presence with a dedicated account manager.",
  },
  {
    q: "What is the GreyWhale CRM?",
    a: "It's a private dashboard we build and hand you alongside your website. Every lead that fills out a form, calls through your site, or books an appointment lands automatically in your CRM. You get a pipeline view, full lead history, and (on Business) automated follow-up sequences — so no enquiry ever falls through the cracks.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. You can move up to a higher plan anytime. We layer the new features directly onto your existing site — no rebuild, no downtime, and your SEO progress stays intact.",
  },
  {
    q: "Is there a contract?",
    a: "No. All plans are month-to-month. Cancel anytime — and if you leave, you take your site and all your data with you.",
  },
  {
    q: "What does a revision round include?",
    a: "Anything beyond simple text and image swaps — new sections, layout changes, additional pages, design tweaks. Starter includes 1 round/month, Professional includes 2, and Business is unlimited. Most clients use far fewer than they expect because we get it right the first time.",
  },
  {
    q: "Do I own my website?",
    a: "Yes — fully. Your site is custom-built code that belongs to you. If you ever leave GreyWhale, we hand over the full codebase, CRM data export, and domain transfer at no charge.",
  },
];

function Check({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CellValue({ value, bold }: { value: string; bold?: boolean }) {
  const lower = value.toLowerCase();
  if (lower === "yes") return (
    <div className="flex justify-center items-center">
      <Check className={bold ? "text-green-600" : "text-green-500"} />
    </div>
  );
  if (lower === "no") return (
    <div className="flex justify-center items-center">
      <XIcon className={bold ? "text-red-500" : "text-red-400"} />
    </div>
  );
  return <span className={bold ? "font-semibold text-black" : "text-gray-600"}>{value}</span>;
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Pricing() {
  usePageTitle("Pricing | Sacramento Web Design — GreyWhale");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <Layout>
      <section className="pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors cursor-pointer tracking-wide">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </Link>
        </div>
      </section>

      <section className="px-6 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black tracking-tight leading-tight">
            Agency-quality websites.<br className="hidden md:block" /> No agency price tag.
          </h1>
          <p className="mt-5 text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Custom-designed, fully managed websites for local businesses. No upfront cost. Cancel anytime.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              id={tier.id}
              className={`relative rounded-2xl p-7 flex flex-col ${
                tier.popular
                  ? "border-2 border-black order-first md:order-none -mt-4 md:-mt-6"
                  : "border border-gray-200"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold tracking-wide">
                    Most popular
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-400 tracking-wide uppercase mb-3 mt-1">{tier.label}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-black">{tier.price}</span>
                <span className="text-base text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">No upfront cost</p>

              <ul className="space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    <Check className="text-gray-400 mt-0.5" />
                    <span className={`text-sm ${f.highlight ? "font-medium text-black" : "text-gray-600"}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {tier.nudge && (
                <p className="text-xs text-gray-400 mt-4 mb-6">
                  {tier.nudge.text}{" "}
                  <span
                    onClick={() => scrollTo(tier.nudge!.target)}
                    className="underline cursor-pointer hover:text-black transition-colors"
                  >
                    {tier.nudge.link}
                  </span>
                </p>
              )}

              <div className={tier.nudge ? "" : "mt-6"}>
                {tier.popular ? (
                  <Link href="/" className="block w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:opacity-80 transition-opacity text-center">
                    <span className="inline-flex items-center gap-2">Get Started <Arrow /></span>
                  </Link>
                ) : (
                  <Link href="/" className="block w-full border border-gray-300 text-black text-sm font-medium py-3 rounded-full hover:bg-gray-50 transition-colors text-center">
                    <span className="inline-flex items-center gap-2">Get Started <Arrow /></span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">How we compare</h2>
            <p className="mt-3 text-gray-400 text-sm md:text-base">
              See how GreyWhale stacks up against common alternatives for local businesses.
            </p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 font-normal text-gray-400 w-[180px]"></th>
                  <th className="text-center py-3 px-3 font-normal text-gray-400">DIY Builders</th>
                  <th className="text-center py-3 px-3 font-normal text-gray-400">Freelancer</th>
                  <th className="text-center py-3 px-3 font-normal text-gray-400">Agency</th>
                  <th className="text-center py-3 px-3 font-semibold text-black bg-gray-50 rounded-t-lg">GreyWhale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i < comparisonRows.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-3 pr-4 text-gray-600 font-medium">{row.label}</td>
                    <td className="py-3 px-3 text-center"><CellValue value={row.diy} /></td>
                    <td className="py-3 px-3 text-center"><CellValue value={row.freelancer} /></td>
                    <td className="py-3 px-3 text-center"><CellValue value={row.agency} /></td>
                    <td className="py-3 px-3 text-center bg-gray-50"><CellValue value={row.gw} bold /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q}>
                  <button
                    className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-black text-sm md:text-base">{faq.q}</span>
                    <Chevron open={isOpen} />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}
                  >
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Ready to get started?</h2>
          <p className="mt-3 text-gray-400 text-sm md:text-base mb-8">
            No upfront cost. Live in 14 days. Cancel anytime.
          </p>
          <Link href="/" className="bg-black text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-80 transition-opacity inline-flex items-center gap-2">
            Get Started <Arrow />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
