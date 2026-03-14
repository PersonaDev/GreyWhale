import { useSearch } from "wouter";
import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function CheckoutSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const leadId = params.get("lead");

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-black mb-3 tracking-wide">Payment received</h1>
          <p className="text-gray-400 text-base mb-8 leading-relaxed">
            Thank you for choosing GreyWhale. We'll be in touch within 24 hours to kick off your project.
          </p>

          {leadId && (
            <p className="text-xs text-gray-300 mb-6">Reference: #{leadId}</p>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white text-base font-medium hover:bg-gray-800 active:scale-95 transition-all tracking-wide"
          >
            Back to Home
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
