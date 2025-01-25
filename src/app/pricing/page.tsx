"use client";

import { useState } from "react";
import MainNavBar from "@/components/MainNavBar";
import ProceedToPaymentButton from "@/components/proceedToPaymentButton";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const pricingPlans = [
    {
      id: "basic",
      title: "Basic",
      price: "$9.99/month",
      features: [
        "Access to all free courses",
        "Limited tutor support",
        "Basic roadmap tracking",
      ],
    },
    {
      id: "standard",
      title: "Standard",
      price: "$19.99/month",
      features: [
        "Access to all courses",
        "1:1 tutor sessions (5/month)",
        "Advanced roadmap tracking",
        "Interactive notifications",
      ],
    },
    {
      id: "premium",
      title: "Premium",
      price: "$29.99/month",
      features: [
        "Unlimited access to all courses",
        "Unlimited 1:1 tutor sessions",
        "Collaborative tools for projects",
        "Exclusive content and materials",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navigation */}
      <MainNavBar />

      {/* Pricing Plans Section */}
      <section className="py-16 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">Choose Your Plan</h1>
        <p className="text-lg text-gray-900 text-center max-w-2xl mx-auto mb-12">
          Pick a plan that suits your needs and start learning today. No hidden fees, cancel anytime.
        </p>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* Safety Message */}
        <p className="text-sm text-gray-500 text-center mt-8 max-w-2xl mx-auto">
          Your security is our priority. All transactions are encrypted and your personal and payment information is protected with industry-leading security measures.
        </p>
      </section>

      {/* Proceed to Payment Button */}
      <ProceedToPaymentButton selectedPlan={selectedPlan} />
    </div>
  );
}

function PricingCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: { id: string; title: string; price: string; features: string[] };
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer bg-gray-800 text-white ${
        isSelected ? "border-2 border-blue-500 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4">{plan.title}</h3>
        <p className="text-2xl font-bold mb-6">{plan.price}</p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-400">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
