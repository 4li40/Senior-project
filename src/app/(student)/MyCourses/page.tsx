"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Clock, Calendar } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";

export default function MyCoursesPage() {
  interface Course {
    id: number;
    title: string;
    description: string;
    instructor: string;
    lessonsCompleted: number;
    totalLessons: number;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/courses");

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const coursesData = await response.json(); // Parse JSON response
        console.log("Fetched courses:", coursesData); // Debug log
        setCourses(coursesData); // Set the courses data
        setLoading(false); // Stop loading state
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses."); // Set error state
        setLoading(false); // Stop loading state
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{course.description}</p>
                  <p>Instructor: {course.instructor}</p>
                  <div className="w-full bg-muted h-2 rounded-full mt-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${
                          (course.lessonsCompleted / course.totalLessons) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p>
                    {course.lessonsCompleted}/{course.totalLessons} lessons
                    completed
                  </p>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
