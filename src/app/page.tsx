import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Code, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainNavBar from "@/components/MainNavBar";

// Add metadata here
export const metadata: Metadata = {
  title: "Study Buddy - Master Tech Skills", // Change this to your desired title
  description: "Learn tech skills with expert tutors and interactive courses.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <MainNavBar />

      {/* Hero Section */}
      <div className="relative h-[500px]">
        <Image
          src="/placeholder.svg?height=500&width=1920"
          alt="Student studying on laptop"
          width={1920}
          height={500}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl">
              Master Tech Skills with Expert Tutors
            </h1>
          </div>
        </div>
      </div>

      {/* Why Study Buddy Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Why Study Buddy?</h2>
        <p className="text-muted-foreground max-w-3xl mb-12">
          Learn at your own pace with our flexible courses. Our curriculum is
          designed to help you build a strong foundation in tech. Whether you're
          a beginner or an experienced coder, we have something for you.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Expert-Led Live Classes"
            description="Our instructors are industry professionals from top tech companies. They're experts in the skills you need to learn."
          />
          <FeatureCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Unlimited 1:1 Tutoring"
            description="Book a session with a tutor anytime, 24/7. Get help with your code, work through problems, or ask questions about the course material."
          />
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="Real-World Projects"
            description="Build a professional portfolio with real-world projects. Get hands-on experience and practice with the tools and technologies used in the tech industry."
          />
          <FeatureCard
            icon={<Layout className="h-6 w-6" />}
            title="Interactive Learning Platform"
            description="Our platform makes it easy to learn. You can take notes, ask questions, and collaborate with other students."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Testimonials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
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
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 text-primary">{icon}</div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ name, text }: { name: string; text: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 w-12 h-12 rounded-full bg-gray-200" />
        <p className="text-sm text-muted-foreground mb-4">{text}</p>
        <p className="text-sm font-medium">{name}</p>
      </CardContent>
    </Card>
  );
}

const testimonials = [
  {
    name: "Karim Karoum",
    text: "I'm so glad I found Study Buddy. The tutors are really helpful, and the live classes are great for learning new concepts. I've already made a lot of progress in just a few weeks.",
  },
  {
    name: "Ahmad Ahmadani",
    text: "Study Buddy is amazing! I love that I can get help whenever I need it. The tutors are friendly and knowledgeable, and the platform is easy to use. I've learned a lot and feel more confident in my coding skills.",
  },
  {
    name: "Lina Ali",
    text: "Study Buddy has been a game changer for me. The 1:1 tutoring is invaluable, and the projects are a fun way to apply what I've learned. I've been able to learn at my own pace and get the support I need to succeed.",
  },
  {
    name: "Mhamad Mhamadani",
    text: "I highly recommend Study Buddy to anyone looking to learn how to code. The instructors are top-notch, and the curriculum is well-structured. The platform is user-friendly, and the community is supportive. I've had a great experience so far!",
  },
];
