"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import TeacherNavBar from "@/components/teacherNavBar";

export default function TutorReviewsPage() {
  interface Review {
    student_first_name: string;
    student_last_name: string;
    course_title: string;
    rating: number;
    review: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch reviews for the logged-in tutor
  useEffect(() => {
    const fetchTutorReviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:5003/api/reviews/tutor",
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to load reviews");

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError("Failed to fetch tutor info");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorReviews();
  }, []);

  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Student Reviews
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          See what students are saying about your courses.
        </p>

        {loading && (
          <p className="text-center text-gray-600">Loading reviews...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {reviews.length === 0 && !loading && !error && (
          <p className="text-gray-500 text-center">No reviews available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="border rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                  <User className="w-5 h-5 text-primary" />
                  {review.student_first_name} {review.student_last_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Course: {review.course_title}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ⭐ Rating Section */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Rating:</p>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500" />
                  ))}
                </div>

                {/* 📝 Review Content */}
                <p className="text-gray-700">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
