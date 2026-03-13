import Layout from "@/components/Layout";

const plans = [
  {
    name: "Essential",
    price: "$299",
    monthly: "$69/month",
    features: [
      "Up to 5 pages",
      "Custom design",
      "Mobile responsive",
      "Basic SEO",
      "CMS access",
      "Hosting & SSL",
    ],
    bestFor: "Barbershops, cafes, food trucks, solo shops",
    dark: true,
  },
  {
    name: "Growth",
    price: "$749",
    monthly: "$99/month",
    features: [
      "Up to 10 pages",
      "Everything in Essential",
      "Contact forms",
      "Google Analytics",
      "Priority support",
    ],
    bestFor: "Tattoo shops, dental, auto shops, studios",
    recommended: true,
    dark: false,
  },
  {
    name: "Premium",
    price: "$1,499",
    monthly: "$149/month",
    features: [
      "Up to 15 pages",
      "Everything in Growth",
      "E-commerce",
      "Custom integrations",
      "Advanced SEO",
    ],
    bestFor: "Med spas, multi-location, dealerships",
    dark: false,
  },
];

export default function Pricing() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-6 py-20 bg-gray-100">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-10">Choose your plan</p>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 relative flex flex-col ${
                  plan.dark ? "bg-black text-white" : "bg-white border border-gray-100"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold tracking-wide">
                      RECOMMENDED
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`font-bold text-lg mb-2 ${plan.dark ? "text-white" : "text-black"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-3xl ${plan.dark ? "text-white" : "text-black"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.dark ? "text-gray-400" : "text-gray-400"}`}>
                      + {plan.monthly}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 shrink-0 ${plan.dark ? "text-gray-400" : "text-gray-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.dark ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <p className={`text-xs mb-4 ${plan.dark ? "text-gray-500" : "text-gray-400"}`}>
                    Best for: {plan.bestFor}
                  </p>
                  {plan.dark && (
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Need something more tailored?{" "}
            <span className="text-black font-medium underline cursor-pointer hover:opacity-70">Contact us</span>
            {" "}for a custom quote.
          </p>
        </div>
      </div>
    </Layout>
  );
}
