"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentNavBar from "@/components/StudentNavBar";
import { ArrowLeft } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  tutor: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/enrollments/my-courses",
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch enrolled courses");

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <>
      <StudentNavBar />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* 🔙 Back Button */}
        <div className="flex items-start">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/student-dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          My Courses
        </h2>

        {loading && (
          <p className="text-gray-600 text-center">Loading courses...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-gray-500 text-center">
            You haven't enrolled in any courses yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition duration-300"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">{course.description}</p>
                <p className="text-sm text-muted-foreground">
                  Instructor: {course.tutor}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: ${parseFloat(course.price).toFixed(2)}
                </p>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => router.push(`/MyCourses/${course.id}`)}
                >
                  📂 View Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
