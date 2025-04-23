"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Code, Layout } from "lucide-react";
import Image from "next/image";
import MainNavBar from "@/components/MainNavBar";

export default function LandingPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // useEffect(() => {
  //   fetch("http://localhost:5003/api/courses/announcements/public")
  //     .then((res) => res.json())
  //     .then(setAnnouncements)
  //     .catch((err) => console.error("Error loading announcements", err));
  // }, []);

  return (
    <div className="min-h-screen">
      <MainNavBar />

      {/* Hero Section */}
      <div className="relative h-[700px]">
        <Image
          src="/images/student-laptop.jpg"
          alt="Student studying on laptop"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl">
              Learn. Build. Succeed.
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join thousands of learners and master in-demand tech skills with
              expert-led guidance.
            </p>
            <Button className="bg-white text-black font-semibold text-lg px-6 py-3 rounded-full hover:bg-gray-200">
              Start Your Journey →
            </Button>
          </div>
        </div>
      </div>

      {/* Why Study Buddy */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-6">
          Why Choose Study Buddy?
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Our platform is designed to make your learning journey intuitive,
          flexible, and full of opportunity.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-7 w-7 text-blue-600" />}
            title="Live Expert Sessions"
            description="Attend engaging classes led by top tech instructors from the field."
          />
          <FeatureCard
            icon={<BookOpen className="h-7 w-7 text-green-600" />}
            title="1:1 Tutoring Anytime"
            description="Connect instantly with a tutor to get help, advice, or code reviews."
          />
          <FeatureCard
            icon={<Code className="h-7 w-7 text-purple-600" />}
            title="Project-Based Learning"
            description="Work on real-world problems and build a portfolio employers will notice."
          />
          <FeatureCard
            icon={<Layout className="h-7 w-7 text-yellow-600" />}
            title="Interactive Tools"
            description="Track your progress, ask questions, and collaborate with peers easily."
          />
        </div>
      </section>

      {/* Scroll Reveal Image After Why Study Buddy */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative h-[500px] w-full"
      >
        <Image
          src="/images/student-class-looking-course.jpg"
          alt="Student class setup"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Earn Certificates. Prove Your Skills.
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Get recognized for your learning by earning certificates upon
              course completion.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14 mt-16">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-bold text-lg mb-4">About Study Buddy</h3>
            <p className="text-sm text-gray-400">
              We help learners like you build real tech skills through guided
              courses, projects, and mentorship.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300">
                  Tutors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">support@studybuddy.com</p>
            <p className="text-sm text-gray-400">+961 81 419 450</p>
            <p className="text-sm text-gray-400">Tripoli, Lebanon</p>
          </div>
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
    <Card className="shadow-md border border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
}
