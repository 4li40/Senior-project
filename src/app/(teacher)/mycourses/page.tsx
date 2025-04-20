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
  pdfs: string[];
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5003/api/courses", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5003/api/courses/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete.");

      // Update UI by removing deleted course
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("✅ Course deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete course.");
    }
  };

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
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

        <h2 className="text-3xl font-bold text-black-700 text-center mb-6">
          My Courses
        </h2>

        <div className="flex justify-end">
          <Button
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg rounded-lg px-4 py-2 font-semibold"
            onClick={() => router.push("/mycourses/addcourses")}
          >
            🞡 Add Course
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

                {course.pdfs?.length > 0 ? (
                  <iframe
                    src={course.pdfs[0]}
                    className="w-full h-40 border rounded-md"
                    title="Course Material Preview"
                  ></iframe>
                ) : (
                  <p className="text-gray-500">No PDF uploaded.</p>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/mycourses/${course.id}`)}
                >
                  📂 View Course
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(course.id)}
                >
                  🗑 Delete Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
