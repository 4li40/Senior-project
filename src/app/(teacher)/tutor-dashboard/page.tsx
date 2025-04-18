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
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    popularCourse: "N/A",
  });

  const [activity, setActivity] = useState<{
    courses: { title: string; created_at: string }[];
    enrollments: { title: string; enrolledAt: string }[];
    sessions: { title: string; scheduled_at: string }[];
  }>({
    courses: [],
    enrollments: [],
    sessions: [],
  });

  useEffect(() => {
    fetch("http://localhost:5003/api/tutors/dashboard-stats", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("❌ Error fetching dashboard stats:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5003/api/tutors/dashboard-activity", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure arrays exist, default to empty array if missing
        setActivity({
          courses: data?.courses || [],
          enrollments: data?.enrollments || [],
          sessions: data?.sessions || [],
        });
      })
      .catch((err) => console.error("❌ Error fetching recent activity:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <TeacherNavBar />

      <div className="flex-grow px-6 md:px-12 space-y-10 mt-10">
        <h1 className="text-4xl font-bold text-center mb-6">
          Welcome to Your Tutor Dashboard
        </h1>

        {/* 🔹 Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              label: "Courses Created",
              value: stats.totalCourses,
            },
            {
              icon: Users,
              label: "Active Students",
              value: stats.totalStudents,
            },
            {
              icon: BarChart,
              label: "Total Enrollments",
              value: stats.totalEnrollments,
            },
            {
              icon: BookOpen,
              label: "Top Course",
              value: stats.popularCourse,
            },
          ].map(({ icon: Icon, label, value }, i) => (
            <Card key={i} className="border shadow-md hover:bg-gray-100">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon className="w-8 h-8 mb-2 text-gray-700" />
                <h2 className="text-xl font-semibold">{value}</h2>
                <p className="text-sm text-gray-600">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔹 Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              path: "/mycourses",
              title: "\ud83d\udcd6 My Courses",
              desc: "Manage and track your courses.",
            },
            {
              path: "/schedule",
              title: "\ud83d\udcc6 Schedule",
              desc: "Manage your tutoring schedule.",
            },
            {
              path: "/earnings",
              title: "\ud83d\udcb2 Earnings",
              desc: "View payment history.",
            },
            {
              path: "/Profile",
              title: "\ud83d\udc64 Profile",
              desc: "Edit your profile.",
            },
          ].map(({ path, title, desc }, i) => (
            <Card
              key={i}
              className="border hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(path)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {desc}
              </CardContent>
              <Button className="m-4 bg-black text-white hover:bg-gray-800">
                Go
              </Button>
            </Card>
          ))}
        </div>

        {/* 🔹 Recent Activity */}
        <div className="mt-10">
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              {activity.courses.map((c, i) => (
                <p key={`course-${i}`}>
                  📘 New course added: <strong>{c.title}</strong>
                </p>
              ))}
              {activity.enrollments.map((e, i) => (
                <p key={`enroll-${i}`}>
                  🧑‍🎓 New student enrolled in <strong>{e.title}</strong>
                </p>
              ))}
              {activity.sessions.map((s, i) => (
                <p key={`session-${i}`}>
                  📅 New session scheduled: <strong>{s.title}</strong>
                </p>
              ))}
              {activity.courses.length +
                activity.enrollments.length +
                activity.sessions.length ===
                0 && <p>No recent activity yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
