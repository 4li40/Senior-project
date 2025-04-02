"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = category
          ? `http://localhost:5003/api/courses?category=${category}`
          : "http://localhost:5003/api/courses";

        const response = await fetch(url);
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
  }, [category]);

  const handleEnroll = async (courseId: number) => {
    try {
      const response = await fetch(
        "http://localhost:5003/api/enrollments/enroll",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ course_id: courseId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Already enrolled? Add to state for disabled button
        if (data.message?.toLowerCase().includes("already enrolled")) {
          setEnrolledCourses((prev) => [...prev, courseId]);
          setFeedback("You're already enrolled in this course.");
        } else {
          throw new Error(data.message || "Enrollment failed.");
        }
      } else {
        setEnrolledCourses((prev) => [...prev, courseId]);
        setFeedback("🎉 Successfully enrolled!");
      }

      setTimeout(() => setFeedback(null), 3000); // hide feedback after 3s
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-start">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 text-center">
        {Array.isArray(category)
          ? category.join(" ").replace("-", " ")
          : category?.replace("-", " ") || "All"}{" "}
        Courses
      </h2>

      {feedback && (
        <p className="text-center text-sm font-medium text-green-600 bg-green-100 p-2 rounded-md">
          {feedback}
        </p>
      )}

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
        {courses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
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
                  disabled={isEnrolled}
                  onClick={() => handleEnroll(course.id)}
                  className={`w-full ${
                    isEnrolled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isEnrolled ? "✅ Enrolled" : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
