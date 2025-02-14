"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentNavBar from "@/components/StudentNavBar";
import { Calendar, User, DollarSign } from "lucide-react";

export default function MyCoursesPage() {
  // ✅ Updated interface to match the API response
  interface Course {
    id: number;
    title: string;
    description: string;
    price: string; // API returns price as a string
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
          const errorText = await response.text();
          throw new Error(`Failed to fetch courses: ${errorText}`);
        }

        const coursesData = await response.json();
        console.log("Fetched courses:", coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. See console for details.");
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
        {loading && <p className="text-gray-600">Loading courses...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{course.description}</p>

                  {/* Instructor Name */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={16} />
                    <span>Instructor: {course.first_name} {course.last_name}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign size={16} />
                    <span>Price: ${parseFloat(course.price).toFixed(2)}</span>
                  </div>

                  {/* Course Creation Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Created on: {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* View Details Button */}
                  <Button variant="outline" className="w-full mt-3">
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
