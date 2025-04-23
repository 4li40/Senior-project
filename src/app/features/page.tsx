"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Laptop2,
  GraduationCap,
  Clock,
  Globe,
  Lightbulb,
} from "lucide-react";

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-purple-100 via-white to-blue-50 min-h-screen py-12 px-6 md:px-12 flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mt-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4">
          Discover What Makes Us Unique
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          Our features are designed to provide a seamless and impactful learning
          experience—backed by expert tutors and real-world projects.
        </p>
        <Button
          onClick={() => router.push("/signup")}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow-lg"
        >
          Join Now
        </Button>
      </section>

      {/* Feature Highlights */}
      <section className="mt-20 grid gap-8 md:grid-cols-3 max-w-6xl w-full">
        <Feature
          icon={<Laptop2 className="w-10 h-10 text-purple-600" />}
          title="Interactive Dashboard"
          description="Track your learning, sessions, progress, and upcoming classes in one organized place."
        />
        <Feature
          icon={<Clock className="w-10 h-10 text-blue-600" />}
          title="On-Demand Access"
          description="Learn at your convenience with recorded sessions and downloadable resources."
        />
        <Feature
          icon={<GraduationCap className="w-10 h-10 text-green-600" />}
          title="Certification"
          description="Earn certificates as you complete courses and boost your professional portfolio."
        />
        <Feature
          icon={<Globe className="w-10 h-10 text-yellow-600" />}
          title="Global Community"
          description="Connect with students and tutors around the world to exchange ideas and collaborate."
        />
        <Feature
          icon={<Lightbulb className="w-10 h-10 text-indigo-600" />}
          title="AI-Powered Recommendations"
          description="Get smart course suggestions and tutoring help based on your goals and learning style."
        />
        <Feature
          icon={<Wrench className="w-10 h-10 text-red-600" />}
          title="Practical Tools"
          description="Access real development tools, environments, and challenges to sharpen your skills."
        />
      </section>

      {/* Call to Action */}
      <section className="mt-24 w-full bg-blue-700 py-12 rounded-2xl text-white text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          All-in-One Learning Experience
        </h2>
        <p className="text-lg max-w-3xl mx-auto">
          From live tutoring to hands-on labs, we’re redefining online tech
          education to be more accessible, engaging, and effective than ever.
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
