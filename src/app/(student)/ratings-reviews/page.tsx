"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User, MessageSquare } from "lucide-react";
import StudentNavBar from "@/components/StudentNavBar";

export default function RatingsReviewsPage() {
  // Example list of tutors the student has taken classes with
  const tutors = [
    {
      id: 1,
      name: "Prof. Smith",
      subject: "Advanced Mathematics",
    },
    {
      id: 2,
      name: "Dr. Johnson",
      subject: "Physics 101",
    },
    {
      id: 3,
      name: "Ms. Davis",
      subject: "Chemistry",
    },
  ];

  // State to manage ratings and reviews
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [reviews, setReviews] = useState<{ [key: number]: string }>({});

  // Handle rating change
  const handleRatingChange = (tutorId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [tutorId]: rating }));
  };

  // Handle review change
  const handleReviewChange = (tutorId: number, review: string) => {
    setReviews((prev) => ({ ...prev, [tutorId]: review }));
  };

  // Handle form submission
  const handleSubmit = (tutorId: number) => {
    const rating = ratings[tutorId] || 0;
    const review = reviews[tutorId] || "";

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    // Simulate saving the review (replace with API call)
    console.log(`Review for Tutor ID ${tutorId}:`, { rating, review });
    alert("Thank you for your review!");
  };

  return (
    <>
      <StudentNavBar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Ratings and Reviews</h1>
        <p className="text-muted-foreground">
          Rate and review the tutors you've taken classes with.
        </p>

        <div className="space-y-6">
          {tutors.map((tutor) => (
            <Card key={tutor.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {tutor.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{tutor.subject}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating Section */}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Rating:</p>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(tutor.id, star)}
                      className={`text-2xl ${
                        ratings[tutor.id] >= star
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Review Section */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Review:</p>
                  <textarea
                    value={reviews[tutor.id] || ""}
                    onChange={(e) =>
                      handleReviewChange(tutor.id, e.target.value)
                    }
                    placeholder="Write your review here..."
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={() => handleSubmit(tutor.id)}
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
