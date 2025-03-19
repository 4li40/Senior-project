"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  created_at: string;
  tutor_first_name: string;
  tutor_last_name: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // ✅ Initialize useRouter for navigation

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/enrollments/my-courses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // ✅ Include authentication
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses.");
        }

        const enrolledCourses = await response.json();
        setCourses(enrolledCourses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ✅ Back to Dashboard Button */}
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/student-dashboard")} // ✅ Redirects to student dashboard
      >
        ← Back
      </Button>

      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        My Courses
      </h2>

      {loading && (
        <p className="text-gray-600 text-center">Loading courses...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-500 text-center">No courses available.</p>
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
              <p className="text-gray-600">
                Instructor: {course.tutor_first_name} {course.tutor_last_name}
              </p>
              <p className="text-gray-600">
                Price: ${parseFloat(course.price).toFixed(2)}
              </p>
              <Button variant="outline" className="w-full mt-4">
                View Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
