"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, DollarSign, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  interface Course {
    id: number;
    title: string;
    description: string;
    price: string;
    created_at: string;
    tutor_id: number;
    first_name: string;
    last_name: string;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("http://localhost:5003/api/auth/status", {
          credentials: "include",
        });

        setIsLoggedIn(authRes.ok);

        const coursesRes = await fetch(
          "http://localhost:5003/api/courses/public",
          {
            credentials: "include",
          }
        );

        if (!coursesRes.ok) throw new Error("Failed to fetch courses");

        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!isLoggedIn) {
      setFeedback("Please log in to enroll in a course.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5003/api/enrollments/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ course_id: courseId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Enrollment failed.");

      setFeedback("🎉 Successfully enrolled!");
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(error.message || "Failed to enroll.");
      } else {
        setFeedback("Failed to enroll.");
      }
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          All Courses
        </h1>

        {feedback && (
          <p className="text-center text-sm font-medium text-green-600 bg-green-100 p-2 rounded-md">
            {feedback}
          </p>
        )}

        {loading && (
          <p className="text-gray-600 text-center">Loading courses...</p>
        )}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-xl transition-shadow border border-gray-200 rounded-xl"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <BookOpen className="text-indigo-600 w-6 h-6" />
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {course.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm">{course.description}</p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={16} className="text-blue-500" />
                    <span>
                      Instructor: {course.first_name} {course.last_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign size={16} className="text-green-500" />
                    <span>Price: ${parseFloat(course.price).toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} className="text-yellow-500" />
                    <span>
                      Created on:{" "}
                      {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 🔐 Enroll Button */}
                  {!isLoggedIn ? (
                    <div className="bg-gray-100 text-center text-gray-400 py-2 rounded">
                      🔒 Please log in to view course details
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enroll Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/MyCourses/${course.id}`)}
                        className="w-full"
                      >
                        👁️ Preview Course
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
