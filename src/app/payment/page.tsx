"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "No plan selected";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Study Buddy</h1>
          <p className="text-lg">Complete your subscription to the selected plan.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Your Selected Plan</h2>
          <p className="text-lg text-gray-700 mb-6">
            You have selected the <strong>{selectedPlan}</strong> plan.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Please proceed to enter your payment details to complete your subscription.
          </p>
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            onClick={() => alert("This is a placeholder. Integrate your payment system here.")}
          >
            Proceed to Pay
          </button>
        </div>
      </main>

{/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">About Study Buddy</h3>
            <p className="text-sm">
              Study Buddy connects students with expert tutors to achieve
              academic success and reach their learning goals.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="text-sm block hover:text-white">
                Home
              </a>
              <a href="#" className="text-sm block hover:text-white">
                Courses
              </a>
              <a href="#" className="text-sm block hover:text-white">
                Tutors
              </a>
              <a href="#" className="text-sm block hover:text-white">
                FAQ
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>support@studybuddy.com</p>
              <p>+961 81 419 450</p>
              <p>Tripoli</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
