import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { apiPost } from "@/lib/api";

export default function Contact() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);

  const leadId = params.get("lead");
  const plan = params.get("plan") || "";
  const role = params.get("role") || "";
  const service = params.get("service") || "";
  const location_ = params.get("location") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let currentLeadId = leadId;

    setLoading(true);
    setError("");

    try {
      if (!currentLeadId) {
        const { id } = await apiPost("/leads", {
          role: role || "unknown",
          service: service || "unknown",
          location: location_ || "unknown",
          plan: plan || "unknown",
        });
        currentLeadId = String(id);
      }

      await apiPost("/contact", {
        leadId: parseInt(currentLeadId!, 10),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-5 py-16">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-black mb-3 tracking-wide">Message sent</h1>
            <p className="text-gray-400 text-base mb-8 leading-relaxed">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all tracking-wide"
            >
              Back to Home
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2" style={{ letterSpacing: "0.12em" }}>
            Contact
          </p>
          <h1 className="text-2xl font-semibold text-black mb-8 tracking-wide">Tell us about your project</h1>

          {(role || service || location_ || plan) && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Your selections</p>
              <p className="text-sm text-gray-600">
                {[role, service, location_, plan].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors"
                placeholder="(916) 555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Tell us more about what you need…"
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
              className="w-full py-4 rounded-full bg-black text-white font-medium text-base hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
