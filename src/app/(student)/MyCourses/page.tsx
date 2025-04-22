"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  tutor: string;
  progress: number;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const router = useRouter();
  const pathname = usePathname();

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
        console.log("Fetched courses:", data); // DEBUG: log API response
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [pathname]);

  // DEBUG: Loosen filtering for now
  const filteredCourses = courses
    .filter(Boolean)
    .filter(
      (course) =>
        (course.title?.toLowerCase?.().includes(search.toLowerCase()) ??
          false) ||
        (course.tutor?.toLowerCase?.().includes(search.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      if (sort === "instructor")
        return (a.tutor || "").localeCompare(b.tutor || "");
      if (sort === "price")
        return parseFloat(a.price || "0") - parseFloat(b.price || "0");
      return 0;
    });

  return (
    <>
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

        <div className="flex justify-center items-center gap-6 mb-6">
  <h2 className="text-4xl font-bold text-blue-700">My Courses</h2>
  <img
    src="/images/courses.svg"
    alt="Courses Illustration"
    className="w-24 h-24 md:w-32 md:h-32"
  />
</div>

        {loading && (
          <p className="text-gray-600 text-center">Loading courses...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-gray-500 text-center">
            You haven't enrolled in any courses yet.
          </p>
        )}

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
          <Input
            placeholder="Search by course or instructor..."
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
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                <p className="text-sm text-muted-foreground">
                  Instructor: {course.tutor}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price: ${parseFloat(course.price).toFixed(2)}
                </p>
                {/* Progress Bar Placeholder */}
                <div className="mt-2">
                  <Progress value={course.progress ?? 0} className="h-2" />
                  <span className="text-xs text-gray-500">
                    Progress: {course.progress ?? 0}%
                  </span>
                </div>
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
