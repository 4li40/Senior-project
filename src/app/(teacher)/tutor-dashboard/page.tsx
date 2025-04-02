"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherNavBar from "@/components/teacherNavBar";
import { BarChart, Activity, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TutorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEarnings: 4500,
    totalCourses: 12,
    activeStudents: 150,
    sessionsCompleted: 85,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* 🔹 Teacher NavBar */}
      <TeacherNavBar />

      <div className="flex-grow px-6 md:px-12 space-y-10 mt-10">
        <h1 className="text-4xl font-bold text-center text-black mb-6">
          Welcome to Your Tutor Dashboard
        </h1>

        {/* 📊 Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BarChart,
              label: "Total Earnings",
              value: `$${stats.totalEarnings}`,
            },
            {
              icon: BookOpen,
              label: "Courses Created",
              value: stats.totalCourses,
            },
            {
              icon: Users,
              label: "Active Students",
              value: stats.activeStudents,
            },
            {
              icon: Activity,
              label: "Sessions Completed",
              value: stats.sessionsCompleted,
            },
          ].map(({ icon: Icon, label, value }, index) => (
            <Card
              key={index}
              className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon className="w-10 h-10 text-gray-700 mb-3" />
                <h2 className="text-xl font-semibold">{value}</h2>
                <p className="text-sm text-gray-600">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔹 Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              path: "/mycourses",
              title: "📖 My Courses",
              description: "Manage and track your courses.",
            },
            {
              path: "/schedule",
              title: "📆 Schedule",
              description: "View and manage your tutoring schedule.",
            },
            {
              path: "/earnings",
              title: "💲 Earnings",
              description: "Track your earnings and payment history.",
            },
            {
              path: "/messages",
              title: "💬 Messages",
              description: "Communicate with students.",
            },
            {
              path: "/Profile",
              title: "👤 Profile",
              description: "View and edit your profile.",
            },
          ].map(({ path, title, description }, index) => (
            <Card
              key={index}
              className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200 cursor-pointer"
              onClick={() => router.push(path)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold text-black">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{description}</CardContent>
              <Button className="m-4 bg-black text-white hover:bg-gray-700">
                Go
              </Button>
            </Card>
          ))}
        </div>

        {/* 🔹 Recent Activity Section */}
        <div className="mt-10">
          <Card className="border border-gray-300 shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:bg-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <ul className="list-disc ml-6 space-y-3">
                <li>🎉 New student enrolled in "Advanced React"</li>
                <li>💬 You received 2 new messages from students</li>
                <li>📖 Course "Python for Data Science" was updated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
