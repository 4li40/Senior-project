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
        // 🔐 Check login status
        const authRes = await fetch("http://localhost:5003/api/auth/status", {
          credentials: "include",
        });

        if (!authRes.ok) {
          console.log("🔴 Not logged in");
          setIsLoggedIn(false);
          setEnrolledCourses([]);
        } else {
          console.log("🟢 Logged in");
          setIsLoggedIn(true);

          const enrolledRes = await fetch(
            "http://localhost:5003/api/enrollments/my-courses",
            { credentials: "include" }
          );

          if (enrolledRes.ok) {
            const enrolledData = await enrolledRes.json();
            setEnrolledCourses(enrolledData.map((c: Course) => c.id));
          } else {
            setEnrolledCourses([]);
          }
        }

        // 📚 Fetch courses
        const courseUrl =
          category && category !== "all"
            ? `http://localhost:5003/api/courses/public?category=${category}`
            : "http://localhost:5003/api/courses/public";

        const coursesRes = await fetch(courseUrl, {
          credentials: "include",
        });

        if (!coursesRes.ok) throw new Error("Course fetch failed");

        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const handleCheckoutOrEnroll = async (course: Course) => {
    if (!isLoggedIn) {
      setFeedback("Please log in to enroll in a course.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Free course → enroll directly
    if (parseFloat(course.price) === 0) {
      await handleCheckoutOrEnroll(course);
      return;
    }

    // Paid course → Stripe checkout
    try {
      const res = await fetch(
        "http://localhost:5003/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: course.id }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // ⬅️ Redirect to Stripe Checkout
      } else {
        alert("Unable to redirect to payment.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setFeedback("Payment failed. Please try again.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-start">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 text-center">
        {Array.isArray(category)
          ? category.join(" ").replace("-", " ")
          : category?.replace("-", " ") || "All"}{" "}
        Courses
      </h2>

      {feedback && (
        <p className="text-center text-sm font-medium text-green-600 bg-green-100 p-2 rounded-md">
          {feedback}
        </p>
      )}

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
        {courses.map((course) => {
          const isEnrolled = isLoggedIn && enrolledCourses.includes(course.id);

          return (
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

                {!isLoggedIn ? (
                  <div className="bg-gray-100 text-center text-gray-400 py-2 rounded">
                    🔒 Please log in to view course details
                  </div>
                ) : isEnrolled ? (
                  <div className="bg-gray-100 p-2 rounded flex items-center justify-center text-green-600">
                    ✅ Enrolled
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleCheckoutOrEnroll(course)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {parseFloat(course.price) === 0
                        ? "Enroll for Free"
                        : "Buy Course"}
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
          );
        })}
      </div>
    </div>
  );
}
