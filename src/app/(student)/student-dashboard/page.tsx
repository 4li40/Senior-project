"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";
import { useRouter } from "next/navigation";
import ChatPopup from "@/components/chatpopup";

// Define Course interface
interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
}

export default function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <StudentNavBar />

      <div className="flex-grow px-4 md:px-8 lg:px-12 space-y-8 mt-8">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-6">
          Welcome to Your Dashboard
        </h2>

        {/* My Courses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-purple-700">
                My Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-500">Loading courses...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 border-b pb-4"
                  >
                    <div className="p-2 bg-purple-100 rounded-full">
                      <GraduationCap className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${course.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No courses available.
                </p>
              )}
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/MyCourses")}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder Sections for Upcoming Sessions and Schedule */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-gray-400">
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              Coming Soon...
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-gray-400">
                Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              Coming Soon...
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-gray-400">
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              Coming Soon...
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-gray-400">
                Find Tutors
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              Coming Soon...
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600"
        >
          💬
        </button>
        {chatOpen && <ChatPopup />}
      </div>
    </div>
  );
}
