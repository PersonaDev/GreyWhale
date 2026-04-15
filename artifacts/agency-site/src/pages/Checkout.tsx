import { useEffect, useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiPost, apiPatch } from "@/lib/api";

const PLAN_INFO: Record<string, { name: string; monthly: string; features: string[] }> = {
  essential: {
    name: "Essential",
    monthly: "$49/mo",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
  },
  growth: {
    name: "Growth",
    monthly: "$149/mo",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
  },
  premium: {
    name: "Premium",
    monthly: "$249/mo",
    features: ["Up to 20 pages", "Everything in Growth", "E-commerce ready", "Custom integrations", "Advanced SEO", "Dedicated support"],
  },
};

export default function Checkout() {
  usePageTitle(
    "Get Started | GreyWhale Web Design Sacramento",
    "Start your GreyWhale website today. No upfront cost, no contracts. Custom-built and live in 14 days."
  );
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);

  const leadId = params.get("lead");
  const plan = params.get("plan") || "essential";
  const role = params.get("role") || "";
  const service = params.get("service") || "";
  const location_ = params.get("location") || "";

  const info = PLAN_INFO[plan] || PLAN_INFO.essential;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resolvedLeadId = useRef<string | null>(leadId);

  useEffect(() => {
    resolvedLeadId.current = leadId;
  }, [leadId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError("");

    try {
      let currentLeadId = resolvedLeadId.current;

      if (currentLeadId) {
        await apiPatch(`/leads/${currentLeadId}`, { name: name.trim(), email: email.trim(), phone: phone.trim() || undefined });
      } else {
        const leadPayload: Record<string, string> = {
          plan,
          name: name.trim(),
          email: email.trim(),
        };
        if (role) leadPayload.role = role;
        if (service) leadPayload.service = service;
        if (location_) leadPayload.location = location_;
        if (phone.trim()) leadPayload.phone = phone.trim();

        const res = await apiPost("/leads", leadPayload) as { id: number };
        currentLeadId = String(res.id);
        resolvedLeadId.current = currentLeadId;
      }

      const base = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
      const successUrl = `${base}/checkout/success?lead=${currentLeadId}`;
      const cancelUrl = window.location.href;

      const { url } = await apiPost("/stripe/checkout", {
        leadId: parseInt(currentLeadId, 10),
        plan,
        customerEmail: email.trim(),
        successUrl,
        cancelUrl,
      }) as { url: string };

      if (url) {
        window.location.href = url;
      } else {
        setError("Could not start checkout. Please try again or contact us directly.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex items-start justify-center px-5 py-16">
        <div className="w-full max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-10" style={{ letterSpacing: "0.12em" }}>
            Get Started
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Order summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4" style={{ letterSpacing: "0.1em" }}>
                Order summary
              </p>

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-black tracking-wide mb-3">{info.name} Plan</h2>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-black">Monthly subscription</span>
                    <span className="font-semibold text-black">{info.monthly}</span>
                  </div>
                  <p className="text-xs text-gray-400 pt-1">No setup fee. Cancel anytime.</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <ul className="space-y-2.5">
                  {info.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {(role || service || location_) && (
                <div className="border-t border-gray-200 pt-4 mt-5">
                  <p className="text-xs text-gray-400 mb-2.5 uppercase tracking-wider font-medium">Your project</p>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    {role && (
                      <p>Role <span className="text-black font-medium ml-1">{role}</span></p>
                    )}
                    {service && (
                      <p>Service <span className="text-black font-medium ml-1">{service}</span></p>
                    )}
                    {location_ && (
                      <p>Location <span className="text-black font-medium ml-1">{location_}</span></p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment via Stripe
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4" style={{ letterSpacing: "0.1em" }}>
                Your details
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Full name <span className="text-black">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Email <span className="text-black">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                    Phone <span className="text-gray-300">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(916) 555-0100"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !name.trim() || !email.trim()}
                  className="w-full py-4 mt-2 rounded-full bg-black text-white font-medium text-base hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wide flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting to payment…
                    </>
                  ) : (
                    <>
                      Subscribe for {info.monthly} with Stripe
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  You'll be taken to Stripe's secure checkout page.
                </p>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/contact?lead=${leadId || ""}&plan=${plan}&role=${encodeURIComponent(role)}&service=${encodeURIComponent(service)}&location=${encodeURIComponent(location_)}`)}
                    className="text-sm text-gray-400 hover:text-black transition-colors underline"
                  >
                    Prefer to talk first? Send us a message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
