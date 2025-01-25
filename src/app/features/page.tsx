import MainNavBar from "@/components/MainNavBar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Code, Layout } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <MainNavBar />

      {/* Hero Section */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Discover Study Buddy Features</h1>
        <p className="text-lg max-w-3xl mx-auto">
          At Study Buddy, we’re dedicated to creating a transformative learning experience. Explore our cutting-edge tools designed to help you master skills, achieve your goals, and connect with expert guidance.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 space-y-12">
          {/* Feature 1 */}
          <FeatureCard
            icon={<BookOpen className="h-12 w-12 text-blue-600" />}
            title="Personalized Learning"
            description="Create a learning experience tailored just for you. With our customizable roadmaps and curated course recommendations, you'll always stay on track toward your goals. Monitor your progress, unlock achievements, and celebrate milestones along the way."
          />
          {/* Feature 2 */}
          <FeatureCard
            icon={<Users className="h-12 w-12 text-green-600" />}
            title="1:1 Tutor Support"
            description="Receive personalized attention and expert help whenever you need it. Our skilled tutors are here to answer your questions, solve challenges, and guide you through complex topics. No matter where you are in your learning journey, we’ve got you covered."
          />
          {/* Feature 3 */}
          <FeatureCard
            icon={<Code className="h-12 w-12 text-purple-600" />}
            title="Interactive Tools"
            description="Dive into an engaging learning environment with collaborative tools like live coding sessions, shared whiteboards, and real-time chat. Work together with tutors and peers to gain deeper insights and hands-on experience in an interactive setting."
          />
          {/* Feature 4 */}
          <FeatureCard
            icon={<Layout className="h-12 w-12 text-yellow-600" />}
            title="Smart Notifications"
            description="Stay ahead of your schedule with our intelligent notification system. Get reminders for upcoming sessions, personalized suggestions for new topics, and never miss an opportunity to advance your learning. We keep you organized and motivated."
          />
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