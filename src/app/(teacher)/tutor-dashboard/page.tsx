"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherNavBar from "@/components/teacherNavBar";
import { BarChart, Activity, Users, BookOpen, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TutorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalCourses: 0,
    activeStudents: 0,
    sessionsCompleted: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    setStats({
      totalEarnings: 4500,
      totalCourses: 12,
      activeStudents: 150,
      sessionsCompleted: 85,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <TeacherNavBar />
      <div className="flex-grow px-6 md:px-12 space-y-10 mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Welcome to Your Tutor Dashboard
        </h1>

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BarChart className="w-10 h-10 text-indigo-500 mb-3" />
              <h2 className="text-xl font-semibold">${stats.totalEarnings}</h2>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BookOpen className="w-10 h-10 text-indigo-500 mb-3" />
              <h2 className="text-xl font-semibold">{stats.totalCourses}</h2>
              <p className="text-sm text-muted-foreground">Courses Created</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="w-10 h-10 text-indigo-500 mb-3" />
              <h2 className="text-xl font-semibold">{stats.activeStudents}</h2>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Activity className="w-10 h-10 text-indigo-500 mb-3" />
              <h2 className="text-xl font-semibold">
                {stats.sessionsCompleted}
              </h2>
              <p className="text-sm text-muted-foreground">
                Sessions Completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card
            className="text-center bg-white hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/mycourses")}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold text-indigo-700">
                📖 My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Manage and track the courses you offer.
            </CardContent>
            <Button className="m-4">Go to My Courses</Button>
          </Card>

          <Card
            className="text-center bg-white hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/schedule")}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold text-indigo-700">
                📆 Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              View and manage your tutoring schedule.
            </CardContent>
            <Button className="m-4">Go to Schedule</Button>
          </Card>

          <Card
            className="text-center bg-white hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/earnings")}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold text-indigo-700">
                💲 Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Track your earnings and payment history.
            </CardContent>
            <Button className="m-4">Go to Earnings</Button>
          </Card>

          <Card
            className="text-center bg-white hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/messages")}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold text-indigo-700">
                💬 Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Communicate with students and respond to inquiries.
            </CardContent>
            <Button className="m-4">Go to Messages</Button>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-10">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-indigo-700">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
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
