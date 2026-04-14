import { useState, useEffect, useRef, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { apiPost } from "@/lib/api";

function InlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  const measure = useCallback(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth + 4);
    }
  }, []);

  useEffect(() => {
    measure();
  }, [value, placeholder, measure]);

  const displayText = value || placeholder;
  const minW = 60;

  return (
    <span className="relative inline-block align-baseline">
      <span
        ref={spanRef}
        aria-hidden
        className="invisible whitespace-pre absolute top-0 left-0 font-semibold"
        style={{ fontSize: "inherit", letterSpacing: "inherit" }}
      >
        {displayText}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="font-semibold text-black bg-transparent border-b-2 border-black outline-none placeholder:text-gray-300 placeholder:font-semibold"
        style={{
          fontSize: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
          width: Math.max(width, minW),
        }}
      />
    </span>
  );
}

export default function Contact() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(search);

  const initialLeadId = params.get("lead");
  const plan = params.get("plan") || "";
  const role = params.get("role") || "";
  const service = params.get("service") || "";
  const location_ = params.get("location") || "";

  const formatLabel = (val: string) =>
    val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [resolvedLeadId, setResolvedLeadId] = useState<string | null>(initialLeadId);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState(location_ ? formatLabel(location_) : "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!initialLeadId && (role || service || location_ || plan)) {
      apiPost("/leads", {
        role: role || "unknown",
        service: service || "unknown",
        location: location_ || "unknown",
        plan: plan || "unknown",
      })
        .then((res: { id: number }) => setResolvedLeadId(String(res.id)))
        .catch(() => {});
    }
  }, [initialLeadId, role, service, location_, plan]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError("");

    try {
      let currentLeadId = resolvedLeadId;

      if (!currentLeadId) {
        const { id } = await apiPost("/leads", {
          role: role || "unknown",
          service: service || "unknown",
          location: city.trim() || location_ || "unknown",
          plan: plan || "unknown",
        });
        currentLeadId = String(id);
        setResolvedLeadId(currentLeadId);
      }

      await apiPost("/contact", {
        leadId: parseInt(currentLeadId, 10),
        name: name.trim(),
        businessName: businessName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const hasLeadContext = !!(role || service || location_ || plan);

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
      <div className="min-h-[calc(100vh-57px)] flex flex-col items-start justify-center px-5 py-16 md:items-center">
        <div className="w-full max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6" style={{ letterSpacing: "0.12em" }}>
            Contact
          </p>

          {hasLeadContext && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-8">
              <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Your selections</p>
              <p className="text-sm text-gray-600">
                {[role && formatLabel(role), service && formatLabel(service), location_ && formatLabel(location_), plan && formatLabel(plan)].filter(Boolean).join(" · ")}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <p
              className="font-medium leading-snug text-left md:text-center"
              style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "#c0c0c0", lineHeight: 1.5, letterSpacing: "0.01em" }}
            >
              {"Hi, my name is "}
              <InlineInput
                value={name}
                onChange={setName}
                placeholder="your name"
                required
              />
              {". "}
              <br className="hidden md:inline" />
              {"I run "}
              <InlineInput
                value={businessName}
                onChange={setBusinessName}
                placeholder="a business"
              />
              {" in "}
              <InlineInput
                value={city}
                onChange={setCity}
                placeholder="Sacramento"
              />
              {". "}
              <br className="hidden md:inline" />
              {"You can reach me at "}
              <InlineInput
                value={email}
                onChange={setEmail}
                placeholder="email@example.com"
                type="email"
                required
              />
              {" or "}
              <InlineInput
                value={phone}
                onChange={setPhone}
                placeholder="(916) 555-0123"
                type="tel"
              />
              {"."}
            </p>

            <div className="mt-10 max-w-2xl md:mx-auto">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-0 py-3 border-b-2 border-gray-200 text-lg text-gray-900 bg-transparent focus:outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300"
                placeholder="Tell us about your project, goals, timeline. Anything helps."
              />
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 max-w-2xl md:mx-auto">
                {error}
              </div>
            )}

            <div className="mt-8 md:text-center">
              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim()}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all cursor-pointer tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : "Send message"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
