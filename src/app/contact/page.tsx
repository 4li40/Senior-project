"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
          Contact Our Team
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          Need help or have a question? Our team is happy to assist you.
        </p>
      </div>

      {/* Contact Form Card */}
      <div className="mt-12 max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 sm:p-10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input placeholder="Enter your full name" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input type="email" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <Textarea rows={5} placeholder="What would you like to ask or share?" />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white transition-all duration-200"
        >
          📬 Send Message
        </Button>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
