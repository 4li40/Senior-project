"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  first_name: string;
  last_name: string;
}

export default function CategoryPage() {
  const { category } = useParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]); // Store enrolled courses

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const selectedCategory = category || "all";
        const url = category
          ? `http://localhost:5003/api/courses?category=${category}`
          : "http://localhost:5003/api/courses";

        console.log("📡 Fetching from:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        console.log("✅ Courses received:", data);

        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  const handleEnroll = async (courseId: number) => {
    try {
      const response = await fetch(
        "http://localhost:5003/api/enrollments/enroll",
        {
          // ✅ Correct URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures authentication cookies are sent
          body: JSON.stringify({ course_id: courseId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Enrollment failed.");
      }

      alert("Successfully enrolled!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Failed to enroll.");
      } else {
        alert("Failed to enroll.");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        {Array.isArray(category)
          ? category.join(" ").replace("-", " ")
          : category?.replace("-", " ") || "All"}{" "}
        Courses
      </h2>
      {loading && (
        <p className="text-gray-600 text-center">Loading courses...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-600 text-center">
          No courses found in this category.
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
                Instructor: {course.first_name} {course.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Price: ${course.price}
              </p>
              <Button
                onClick={() => handleEnroll(course.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enroll Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
