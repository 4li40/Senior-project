"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Compass } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-blue-100 via-white to-blue-50 min-h-screen py-12 px-6 md:px-12 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4">
          Welcome to Study Buddy
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          Empowering the next generation of tech leaders through live classes,
          expert guidance, and personalized learning experiences.
        </p>
        <Button
          onClick={() => router.push("/signup")}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-lg"
        >
          Get Started Today
        </Button>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid gap-8 md:grid-cols-3 max-w-6xl w-full">
        <Feature
          icon={<Users className="w-10 h-10 text-blue-600" />}
          title="Expert Tutors"
          description="Learn from professionals with real-world experience and proven teaching methods tailored to your goals."
        />
        <Feature
          icon={<BookOpen className="w-10 h-10 text-green-600" />}
          title="Flexible Learning"
          description="Study at your own pace with access to live sessions, announcements, and self-paced courses."
        />
        <Feature
          icon={<Compass className="w-10 h-10 text-purple-600" />}
          title="Personalized Guidance"
          description="Get customized support and mentorship whether you're a beginner or ready to advance your skills."
        />
      </section>

      {/* Slogan Banner */}
      <section className="mt-24 w-full bg-blue-600 py-12 rounded-2xl text-white text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Learning Made Personal
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          We’re here to guide your journey in tech. From coding to cloud
          computing, our expert-led platform has everything you need to succeed.
        </p>
      </section>

      <div className="flex justify-center mt-12">
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

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
