"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-sky-100 via-white to-sky-50 min-h-screen py-12 px-6 md:px-12 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-sky-900 mb-4">
          Affordable Plans for Every Learner
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          Choose the plan that fits your learning style. All plans come with
          access to expert tutors, real-world projects, and flexible learning
          options.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mt-20 grid gap-8 md:grid-cols-3 max-w-6xl w-full">
        <Plan
          name="Starter"
          price="$0"
          features={[
            "Access to free live sessions",
            "Weekly announcements",
            "Community support",
          ]}
          cta="Get Started"
        />
        <Plan
          name="Pro"
          price="$19/mo"
          features={[
            "All Starter features",
            "Unlimited 1:1 tutoring",
            "Access to project library",
          ]}
          highlight
          cta="Upgrade to Pro"
        />
        <Plan
          name="Elite"
          price="$49/mo"
          features={[
            "All Pro features",
            "Career mentorship",
            "Certificate of completion",
          ]}
          cta="Join Elite"
        />
      </section>

      {/* Banner */}
      <section className="mt-24 w-full bg-sky-600 py-12 rounded-2xl text-white text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Invest in Your Future
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          No credit card required for the Starter plan. Start learning today and
          upgrade anytime as you grow.
        </p>
      </section>

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="text-sm hover:bg-sky-100"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}

function Plan({
  name,
  price,
  features,
  cta,
  highlight = false,
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border shadow-md text-center bg-white ${
        highlight ? "border-sky-600 shadow-lg" : ""
      }`}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-3xl font-extrabold text-sky-700 mb-4">{price}</p>
      <ul className="text-gray-600 space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i}>✔ {feature}</li>
        ))}
      </ul>
      <Button className="bg-sky-700 text-white hover:bg-sky-800 w-full">
        {cta}
      </Button>
    </div>
  );
}
