"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentNavBar from "@/components/StudentNavBar";
import { Calendar, User, DollarSign, BookOpen } from "lucide-react";

export default function MyCoursesPage() {
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5003/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }
        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
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

                  <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
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
