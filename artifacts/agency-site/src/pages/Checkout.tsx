import { useEffect, useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { apiPost } from "@/lib/api";

const PLAN_INFO: Record<string, { name: string; price: string; features: string[] }> = {
  essential: {
    name: "Essential",
    price: "$499",
    features: ["Up to 5 pages", "Custom design", "Mobile responsive", "Basic SEO", "CMS access", "Hosting & SSL"],
  },
  growth: {
    name: "Growth",
    price: "$999",
    features: ["Up to 10 pages", "Everything in Essential", "Contact forms", "Google Analytics", "Priority support"],
  },
  premium: {
    name: "Premium",
    price: "$2,499",
    features: ["Up to 15 pages", "Everything in Growth", "E-commerce", "Custom integrations", "Advanced SEO"],
  },
};

export default function Checkout() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);

  const initialLeadId = params.get("lead");
  const plan = params.get("plan") || "essential";
  const role = params.get("role") || "";
  const service = params.get("service") || "";
  const location_ = params.get("location") || "";

  const info = PLAN_INFO[plan] || PLAN_INFO.essential;
  const [resolvedLeadId, setResolvedLeadId] = useState<string | null>(initialLeadId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!initialLeadId && role && service && location_) {
      apiPost("/leads", { role, service, location: location_, plan })
        .then((res: { id: number }) => setResolvedLeadId(String(res.id)))
        .catch(() => {});
    }
  }, [initialLeadId, role, service, location_, plan]);

  async function handlePay() {
    if (!resolvedLeadId) return;
    setLoading(true);
    setError("");
    try {
      const base = window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
      const { url } = await apiPost("/stripe/checkout", {
        leadId: parseInt(resolvedLeadId, 10),
        plan,
        successUrl: `${base}/checkout/success?lead=${resolvedLeadId}`,
        cancelUrl: window.location.href,
      });
      if (url) {
        window.location.href = url;
      } else {
        setError("Could not create checkout session. Stripe may not be configured yet.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleContact() {
    navigate(`/contact?lead=${resolvedLeadId || ""}&plan=${plan}&role=${role}&service=${service}&location=${location_}`);
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8" style={{ letterSpacing: "0.12em" }}>
            Checkout
          </p>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-black tracking-wide">{info.name} Plan</h2>
                <p className="text-sm text-gray-400 mt-1">One-time setup fee</p>
              </div>
              <span className="text-2xl font-semibold text-black">{info.price}</span>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <ul className="space-y-2">
                {info.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {(role || service || location_) && (
              <div className="border-t border-gray-50 pt-4 mt-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Your project</p>
                <div className="space-y-1 text-sm text-gray-600">
                  {role && <p>Role: <span className="text-black font-medium">{role}</span></p>}
                  {service && <p>Service: <span className="text-black font-medium">{service}</span></p>}
                  {location_ && <p>Location: <span className="text-black font-medium">{location_}</span></p>}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading || !resolvedLeadId}
            className="w-full py-4 rounded-full bg-black text-white font-medium text-base hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
          >
            {loading ? "Redirecting to payment…" : `Pay ${info.price}`}
          </button>

          <div className="text-center mt-4">
            <button
              onClick={handleContact}
              className="text-sm text-gray-400 hover:text-black transition-colors underline"
            >
              Or send us a message instead
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
