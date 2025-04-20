"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, User } from "lucide-react";

export default function TutorReviewsPage() {
  interface Review {
    student_first_name: string;
    student_last_name: string;
    course_title: string;
    rating: number;
    review: string;
    created_at: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);

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
        console.log("Fetched reviews:", data);
        setReviews(data);

        // Calculate average rating
        if (data.length > 0) {
          const sum = data.reduce(
            (total: number, review: Review) => total + review.rating,
            0
          );
          setAverageRating(parseFloat((sum / data.length).toFixed(1)));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorReviews();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
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

        {!loading && !error && (
          <div className="text-center mb-8">
            <div className="text-2xl font-bold">
              Overall Rating: {averageRating || "N/A"}
            </div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                  fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <div className="text-muted-foreground mt-1">
              Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {reviews.length === 0 && !loading && !error && (
          <p className="text-gray-500 text-center">
            No reviews available yet. When students review your courses, they
            will appear here.
          </p>
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
                {review.created_at && (
                  <p className="text-xs text-gray-400">
                    {formatDate(review.created_at)}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ⭐ Rating Section */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Rating:</p>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
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
