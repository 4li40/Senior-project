"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 py-12 px-6 md:px-12 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          Have questions, feedback, or need help? We're here for you. Reach out
          and a Study Buddy team member will respond shortly.
        </p>
      </section>

      {/* Contact Form */}
      <form className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-6 mt-10">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <Input type="text" placeholder="Your name" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <Input type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Message
          </label>
          <Textarea placeholder="How can we help you?" rows={5} required />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white"
        >
          Send Message
        </Button>
      </form>

      <div className="flex justify-center mt-10">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="text-sm hover:bg-blue-100"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
