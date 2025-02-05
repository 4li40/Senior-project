"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainNavBar from "@/components/MainNavBar";
import { Check } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for students getting started",
      features: [
        "Access to basic study materials",
        "5 tutoring sessions per month",
        "Basic AI study assistance",
        "Limited roadmap templates",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro Student",
      price: billingCycle === "monthly" ? "$20" : "$192",
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Everything in Basic, plus",
      features: [
        "Unlimited study materials",
        "20 tutoring sessions per month",
        "Advanced AI study assistance",
        "Priority tutor matching",
        "Full roadmap library access",
        "Custom roadmap creation",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
    },
    {
      name: "Premium",
      price: billingCycle === "monthly" ? "$40" : "$384",
      period: billingCycle === "monthly" ? "/month" : "/year",
      description: "Everything in Pro Student, plus",
      features: [
        "1-on-1 dedicated tutor",
        "Unlimited tutoring sessions",
        "Custom study plan creation",
        "Progress tracking analytics",
        "24/7 premium support",
        "Advanced roadmap customization",
        "AI-powered roadmap recommendations",
        "Collaborative roadmap sharing",
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavBar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works for you
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === "yearly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly (Save 20%)
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="border-2 hover:border-primary transition-colors relative p-6 flex flex-col h-full"
            >
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <p className="text-muted-foreground">{plan.description}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="default" className="w-full mt-6 font-semibold">
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Contact */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Questions about enterprise security, procurement, or custom
            contracts?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact Sales
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
