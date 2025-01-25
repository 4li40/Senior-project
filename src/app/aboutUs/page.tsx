"use client";

import MainNavBar from "@/components/MainNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Code } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <MainNavBar />

      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl font-semibold mb-3">About Study Buddy</h1>
          <p className="text-base max-w-xl">
            Empowering students and tutors with tools to succeed. Learn more about our mission and how we can help you achieve your goals.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Study Buddy, we are committed to empowering students with the tools
            and support they need to excel in their learning journey. Whether it's
            mastering a new skill or acing your exams, we're here to guide you every
            step of the way. Our mission is to make learning accessible, effective,
            and enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">Why Choose Study Buddy?</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Our platform is designed with your success in mind. Here’s what sets us apart.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-12 w-12 text-blue-600" />}
              title="Expert Tutors"
              description="Learn from industry professionals who bring real-world experience to every session."
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-green-600" />}
              title="Personalized Learning"
              description="Tailored roadmaps to suit your individual goals and learning pace."
            />
            <FeatureCard
              icon={<Code className="h-12 w-12 text-purple-600" />}
              title="Comprehensive Resources"
              description="Access a library of resources, interactive tools, and real-world projects."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Join the Study Buddy community today and take the first step toward achieving your academic goals.
          </p>
          <Link
            href="/pricing"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100"
          >
            Explore Subscriptions
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Study Buddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border border-gray-200 rounded-lg shadow-md p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
      <div>{icon}</div>
      <div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </Card>
  );
}
