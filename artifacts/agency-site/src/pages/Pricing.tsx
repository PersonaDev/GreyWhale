import { Link } from "wouter";
import Layout from "@/components/Layout";

type Feature = { text: string; highlight?: boolean };

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "$149",
    label: "Get online",
    features: [
      { text: "Custom designed website" },
      { text: "Up to 5 pages" },
      { text: "Mobile responsive" },
      { text: "Basic SEO (meta tags, sitemap)" },
      { text: "Hosting & SSL included" },
      { text: "Contact form" },
      { text: "Edit your own text and images anytime" },
      { text: "1 round of revisions per month" },
      { text: "48-hour support response time" },
    ] as Feature[],
    nudge: { text: "Want analytics and booking?", link: "See Professional", target: "professional" },
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$249",
    label: "Grow your business",
    features: [
      { text: "Everything in Starter" },
      { text: "Up to 10 pages", highlight: true },
      { text: "Google Analytics setup", highlight: true },
      { text: "Google Business Profile optimization", highlight: true },
      { text: "Booking or scheduling integration", highlight: true },
      { text: "Contact forms with lead notifications", highlight: true },
      { text: "Advanced SEO (local schema, FAQ markup, structured data)", highlight: true },
      { text: "2 rounds of revisions per month", highlight: true },
      { text: "24-hour priority support response", highlight: true },
    ] as Feature[],
    nudge: { text: "Need e-commerce?", link: "See Business", target: "business" },
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$349",
    label: "Scale & sell",
    features: [
      { text: "Everything in Professional" },
      { text: "Up to 20 pages", highlight: true },
      { text: "E-commerce (product pages, cart, checkout)", highlight: true },
      { text: "Custom integrations (API connections, third-party tools)", highlight: true },
      { text: "Blog setup and management", highlight: true },
      { text: "Monthly performance report", highlight: true },
      { text: "Unlimited revisions", highlight: true },
      { text: "Same-day priority support", highlight: true },
    ] as Feature[],
    popular: false,
  },
];

const comparisonRows: { label: string; diy: string; freelancer: string; agency: string; gw: string }[] = [
  { label: "Upfront cost", diy: "$0", freelancer: "$1,500–$5,000", agency: "$4,000–$10,000", gw: "$0" },
  { label: "Monthly cost", diy: "$16–$39", freelancer: "$0–$100", agency: "$200–$2,000", gw: "$149" },
  { label: "Year 1 total", diy: "$192–$468", freelancer: "$1,500–$6,200", agency: "$6,400–$34,000", gw: "$1,788" },
  { label: "Custom design", diy: "no", freelancer: "yes", agency: "yes", gw: "yes" },
  { label: "You build it", diy: "Yes", freelancer: "No", agency: "No", gw: "No" },
  { label: "Hosting included", diy: "yes", freelancer: "Rarely", agency: "Sometimes", gw: "yes" },
  { label: "SEO setup", diy: "Basic", freelancer: "Varies", agency: "yes", gw: "yes" },
  { label: "Self-service edits", diy: "yes", freelancer: "no", agency: "Sometimes", gw: "yes" },
  { label: "Turnaround", diy: "DIY", freelancer: "4–8 weeks", agency: "6–12 weeks", gw: "14 days" },
  { label: "Contract lock-in", diy: "Monthly/annual", freelancer: "Per project", agency: "6–12 months", gw: "Cancel anytime" },
  { label: "Ongoing support", diy: "Help docs", freelancer: "Extra cost", agency: "Retainer", gw: "Included" },
];

const vsCards = [
  {
    title: "vs. Squarespace",
    body: "You get custom design instead of a template everyone uses. We build it for you. Your site doesn't look like 10,000 other Squarespace sites. For $149/mo you get a fully managed site — no learning curve, no drag-and-drop frustration.",
  },
  {
    title: "vs. Freelancers",
    body: "No $3,000–5,000 upfront gamble. No ghosting after launch. No hunting for someone new when you need updates. GreyWhale is ongoing — your site stays current, supported, and maintained as long as you're a member.",
  },
  {
    title: "vs. Agencies",
    body: "Same quality, fraction of the cost. Agencies charge $4,000–10,000 upfront then $200–2,000/mo for maintenance. With GreyWhale your year 1 total is $1,788. That's less than most agencies charge just to start.",
  },
  {
    title: "vs. Niche agencies",
    body: "Specialty agencies charge $300–500/mo with contracts and cookie-cutter templates branded as 'custom.' Same layout, different logo. GreyWhale builds each site from scratch — no two sites look alike.",
  },
];

const faqs = [
  {
    q: "Which plan is right for me?",
    a: "Starter is perfect if you just need a clean, professional website to establish your online presence. Professional is our most popular plan — it adds analytics, booking integration, and advanced SEO so your site actually brings in new customers. Business is for companies that need e-commerce, custom integrations, or a larger web presence.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. You can move up to a higher plan anytime. We'll add the new features to your existing site — no rebuild required.",
  },
  {
    q: "Is there a contract?",
    a: "No. All plans are month-to-month. Cancel anytime.",
  },
  {
    q: "What does 'rounds of revisions' mean?",
    a: "A revision is any change you want us to make that goes beyond basic text and image edits — things like layout changes, new sections, adding a page, or design tweaks. Starter includes 1 per month, Professional includes 2, and Business includes unlimited.",
  },
  {
    q: "Do I own my website?",
    a: "Yes. Your site is built on code we deliver to you. If you ever leave, you take everything with you.",
  },
];

function Check({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className || ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CellValue({ value, bold }: { value: string; bold?: boolean }) {
  const lower = value.toLowerCase();
  if (lower === "yes") return <Check className={bold ? "text-green-600" : "text-green-500"} />;
  if (lower === "no") return <X className={bold ? "text-red-500" : "text-red-400"} />;
  return <span className={bold ? "font-semibold text-black" : "text-gray-600"}>{value}</span>;
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export default function Pricing() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <Layout>
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20">
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
                <p className="text-xs text-gray-400 mt-5">
                  {tier.nudge.text}{" "}
                  <button
                    onClick={() => scrollTo(tier.nudge!.target)}
                    className="underline text-gray-500 hover:text-black transition-colors cursor-pointer"
                  >
                    {tier.nudge.link} →
                  </button>
                </p>
              )}

              <div className="mt-6">
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {vsCards.map((card) => (
            <div key={card.title} className="bg-gray-50 rounded-2xl p-7">
              <h3 className="font-bold text-black mb-3">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-black mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
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
