"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("http://localhost:5003/api/auth/status", {
          credentials: "include",
        });

        if (!authRes.ok) {
          setIsLoggedIn(false);
          setEnrolledCourses([]);
        } else {
          setIsLoggedIn(true);
          const enrolledRes = await fetch("http://localhost:5003/api/enrollments/my-courses", {
            credentials: "include",
          });

          if (enrolledRes.ok) {
            const enrolledData = await enrolledRes.json();
            setEnrolledCourses(enrolledData.map((c: Course) => c.id));
          }
        }

        const courseUrl =
          category && category !== "all"
            ? `http://localhost:5003/api/courses/public?category=${category}`
            : "http://localhost:5003/api/courses/public";

        const coursesRes = await fetch(courseUrl, { credentials: "include" });
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");

        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleCheckoutOrEnroll = async (course: Course) => {
    if (!isLoggedIn) {
      setFeedback("🔐 Please log in to enroll.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (parseFloat(course.price) === 0) {
      // Optional: auto-enroll via backend here
      setFeedback("✅ Enrolled successfully!");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      const res = await fetch("http://localhost:5003/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Missing checkout URL");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      setFeedback("Payment failed. Please try again.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-blue-800 text-center capitalize">
        {Array.isArray(category)
          ? category.join(" ").replace("-", " ")
          : category?.replace("-", " ") || "All"}{" "}
        Courses
      </h2>

      {/* Feedback */}
      {feedback && (
        <p className="text-center text-sm font-medium text-green-700 bg-green-100 border border-green-200 p-2 rounded-md shadow-sm">
          {feedback}
        </p>
      )}
      {loading && <p className="text-gray-500 text-center">Loading courses...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="text-gray-500 text-center">No courses available in this category.</p>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = isLoggedIn && enrolledCourses.includes(course.id);

          return (
            <Card
              key={course.id}
              className="hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-gray-600 line-clamp-3">{course.description}</p>
                <p className="text-sm text-gray-500">
                  👨‍🏫 Instructor: {course.first_name} {course.last_name}
                </p>
                <p className="text-sm font-medium text-blue-700">
                  💰 {parseFloat(course.price) === 0 ? "Free" : `$${course.price}`}
                </p>

                {!isLoggedIn ? (
                  <div className="bg-gray-100 text-center text-gray-400 py-2 rounded">
                    🔒 Login to enroll
                  </div>
                ) : isEnrolled ? (
                  <div className="bg-green-100 text-green-600 text-center font-medium py-2 rounded">
                    ✅ Already Enrolled
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleCheckoutOrEnroll(course)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      {parseFloat(course.price) === 0 ? "Enroll for Free" : "Buy Course"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/MyCourses/${course.id}`)}
                    >
                      👁️ Preview Course
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
