"use client";

import Link from "next/link";

export default function ProceedToPaymentButton({
  selectedPlan,
}: {
  selectedPlan: string | null;
}) {
  return (
    <div className="fixed bottom-0 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Plan Selection Text */}
        <p className="text-lg font-medium">
          {selectedPlan
            ? `You selected the "${selectedPlan}" plan.`
            : "Please select a plan to proceed."}
        </p>

        {/* Proceed to Payment Button */}
        <Link
          href={{
            pathname: "/payment",
            query: { plan: selectedPlan || "" },
          }}
          className={`px-6 py-3 font-semibold rounded-md transition-all duration-300 ${
            selectedPlan
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
}

