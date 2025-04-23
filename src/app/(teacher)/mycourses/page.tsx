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
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
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
    .filter((course) => course.title?.toLowerCase()?.includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-12">
      {/* Header + Controls */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded shadow-md transition-transform hover:scale-105"
            variant="outline"
            onClick={() => router.push("/tutor-dashboard")}
            
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            
            Back to Dashboard
          </Button>

          <Button
            onClick={() => router.push("/mycourses/addcourses")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow-md transition-transform hover:scale-105"
          >
            ➕ Add New Course
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
          <h2 className="text-3xl font-bold text-black-900 tracking-tight">My Courses</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Status */}
      {loading && <p className="text-center text-gray-600">Loading courses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-gray-500">No courses found.</p>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="relative group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="h-32 flex items-center justify-center text-5xl text-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl">
              📘
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 text-sm line-clamp-3 min-h-[60px]">
                {course.description}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/mycourses/${course.id}`)}
                  className="hover:scale-105 transition"
                >
                  📂 View Course
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(course.id)}
                  className="hover:scale-105 transition"
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
