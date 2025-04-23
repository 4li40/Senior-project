"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
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

      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("✅ Course deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete course.");
    }
  };

  const filteredCourses = courses
    .filter(Boolean)
    .filter((course) =>
      course.title?.toLowerCase?.().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 🔙 Back Button */}
      <div className="flex items-start">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push("/tutor-dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex justify-center items-center gap-6 mb-6">
        <h2 className="text-4xl font-bold text-blue-700">My Courses</h2>
        <img
          src="/images/courses.svg"
          alt="Courses Illustration"
          className="w-24 h-24 md:w-32 md:h-32"
        />
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
        <Input
          placeholder="Search by course title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg rounded-lg px-4 py-2 font-semibold"
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
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="hover:shadow-2xl rounded-xl border border-gray-200 bg-white transition duration-300 group relative overflow-hidden"
          >
            {/* Course Image (placeholder) */}
            <div className="h-40 w-full bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center">
              <span className="text-5xl text-blue-400">📘</span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 line-clamp-3 min-h-[56px]">
                {course.description}
              </p>

              <div className="flex flex-col gap-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
