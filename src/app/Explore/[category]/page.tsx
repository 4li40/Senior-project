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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const selectedCategory = category || "all";
        const url = category
          ? `http://localhost:5003/api/courses?category=${category}`
          : "http://localhost:5003/api/courses";

        console.log("📡 Fetching from:", url); // ✅ Debugging log

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        console.log("✅ Courses received:", data); // ✅ Debugging log

        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]); // ✅ Ensure category is used

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
                variant="outline"
                className="w-full mt-4 hover:bg-blue-500 hover:text-white"
              >
                View Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
