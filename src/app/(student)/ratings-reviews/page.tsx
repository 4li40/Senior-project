"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User } from "lucide-react";

export default function RatingsReviewsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});
  const [reviews, setReviews] = useState<Reviews>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch courses the student has completed
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/enrollments/my-courses",
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // ✅ Handle Rating Change
  interface Course {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    tutor_id: string;
  }

  interface Ratings {
    [key: string]: number;
  }

  interface Reviews {
    [key: string]: string;
  }

  const handleRatingChange = (courseId: string, rating: number): void => {
    setRatings((prev: Ratings) => ({ ...prev, [courseId]: rating }));
  };

  // ✅ Handle Review Change
  interface ReviewChange {
    (courseId: string, review: string): void;
  }

  const handleReviewChange: ReviewChange = (courseId, review) => {
    setReviews((prev: Reviews) => ({ ...prev, [courseId]: review }));
  };

  // ✅ Submit Review
  interface SubmitReviewPayload {
    tutor_id: string;
    course_id: string;
    rating: number;
    review: string;
  }

  const handleSubmit = async (courseId: string) => {
    const selectedCourse = courses.find((course) => course.id === courseId);

    if (!selectedCourse) {
      alert("Course not found.");
      return;
    }
    const tutorId = selectedCourse.tutor_id;
    const rating = ratings[courseId] || 0;
    const review = reviews[courseId] || "";

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    console.log("📤 Submitting Review:", { tutorId, courseId, rating, review });

    try {
      const response = await fetch("http://localhost:5003/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tutor_id: tutorId, // ✅ Ensure tutor_id is sent correctly
          course_id: courseId,
          rating,
          review,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error submitting review");
      }

      alert("🎉 Review submitted successfully!");
    } catch (error) {
      console.error("❌ Review Error:", error);
      if (error instanceof Error) {
        alert(error.message || "Error submitting review");
      } else {
        alert("Error submitting review");
      }
    }
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Ratings and Reviews
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Rate and review the courses you have completed.
        </p>

        {loading && (
          <p className="text-center text-gray-600">Loading courses...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {courses.length === 0 && !loading && !error && (
          <p className="text-gray-500 text-center">
            No courses available for review.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border rounded-lg shadow-md">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                    <User className="w-5 h-5 text-primary" />
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Instructor: {course.first_name} {course.last_name}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ⭐ Rating Section */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Your Rating:</p>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(course.id, star)}
                      className={`text-2xl transition ${
                        ratings[course.id] >= star
                          ? "text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* 📝 Review Section */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Review:</p>
                  <textarea
                    value={reviews[course.id] || ""}
                    onChange={(e) =>
                      handleReviewChange(course.id, e.target.value)
                    }
                    placeholder="Share your experience..."
                    className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleSubmit(course.id)} // ✅ Pass tutor_id properly
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
