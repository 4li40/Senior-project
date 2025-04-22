"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User, CheckCircle, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function RatingsReviewsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});
  const [reviews, setReviews] = useState<Reviews>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewedCourses, setReviewedCourses] = useState<{[key: string]: boolean}>({});
  const [submitting, setSubmitting] = useState<{[key: string]: boolean}>({});

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

        // Check review status for each course
        const reviewStatuses: {[key: string]: boolean} = {};
        for (const course of data) {
          const statusResponse = await fetch(
            `http://localhost:5003/api/reviews/check/${course.id}`,
            { credentials: "include" }
          );
          if (statusResponse.ok) {
            const { hasReviewed } = await statusResponse.json();
            reviewStatuses[course.id] = hasReviewed;
          }
        }
        setReviewedCourses(reviewStatuses);
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
    progress?: number;
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

    setSubmitting(prev => ({ ...prev, [courseId]: true }));

    try {
      const response = await fetch("http://localhost:5003/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
          rating,
          review,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error submitting review");
      }

      // Update the reviewed courses state
      setReviewedCourses(prev => ({ ...prev, [courseId]: true }));
      alert("🎉 Review submitted successfully!");
    } catch (error) {
      console.error("❌ Review Error:", error);
      if (error instanceof Error) {
        alert(error.message || "Error submitting review");
      } else {
        alert("Error submitting review");
      }
    } finally {
      setSubmitting(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border rounded-lg shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Reviews
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your experience with the courses you've completed. Your feedback helps other students and instructors improve.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          renderSkeleton()
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Courses Available</h3>
            <p className="text-gray-600 mb-4">You don't have any completed courses to review yet.</p>
            <Button variant="outline" onClick={() => window.location.href = "/MyCourses"}>
              View My Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-2"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-1">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {course.first_name} {course.last_name}
                      </CardDescription>
                    </div>
                    {course.progress !== undefined && (
                      <Badge variant={course.progress >= 100 ? "success" : "outline"} className="ml-2">
                        {course.progress >= 100 ? "Completed" : `${course.progress}% Complete`}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {reviewedCourses[course.id] ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 font-medium">Review Submitted</p>
                        <p className="text-green-700 text-sm">Thank you for your feedback!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Your Rating</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(course.id, star)}
                              className={`text-2xl transition ${
                                ratings[course.id] >= star
                                  ? "text-yellow-500"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                              aria-label={`Rate ${star} stars`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Your Review</p>
                        <textarea
                          value={reviews[course.id] || ""}
                          onChange={(e) =>
                            handleReviewChange(course.id, e.target.value)
                          }
                          placeholder="Share your experience with this course..."
                          className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          rows={4}
                        />
                      </div>

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition"
                        onClick={() => handleSubmit(course.id)}
                        disabled={submitting[course.id]}
                      >
                        {submitting[course.id] ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
