"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  created_at: string;
  first_name: string;
  last_name: string;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/courses");

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 🔙 Back Button */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push("/tutor-dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        My Courses
      </h2>

      {/* Add Course Button */}
      <div className="flex justify-end">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-700"
          onClick={() => router.push("/mycourses/addcourses")}
        >
          ➕ Add Course
        </Button>
      </div>

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
                Instructor: {course.first_name} {course.last_name}
              </p>
              <p className="text-gray-600">
                Price: ${parseFloat(course.price).toFixed(2)}
              </p>
              <Button variant="outline" className="w-full mt-4">
                Enroll Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
