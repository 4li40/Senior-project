"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeacherNavBar from "@/components/teacherNavBar";
import { Star, BarChart, Users, Clock, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gray-100">
      <TeacherNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header with "Add Course" Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-700">My Courses</h2>
          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => router.push("mycourses/addcourses")}
          >
            <PlusCircle className="w-5 h-5" />
            Add Course
          </Button>
        </div>

        {loading && (
          <p className="text-gray-600 text-center">Loading courses...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      Instructor: {course.first_name} {course.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart className="w-4 h-4" />
                    <span>Price: ${parseFloat(course.price).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Created on:{" "}
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 hover:bg-blue-500 hover:text-white"
                  >
                    ✏️ Edit Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-800">
                📊 Course Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                Coming soon...
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-800">
                🆕 Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                Coming soon...
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
