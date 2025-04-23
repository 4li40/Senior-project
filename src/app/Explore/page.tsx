"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, DollarSign, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
export default function ExplorePage() {
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("http://localhost:5003/api/auth/status", {
          credentials: "include",
        });

        setIsLoggedIn(authRes.ok);

        const coursesRes = await fetch(
          "http://localhost:5003/api/courses/public",
          {
            credentials: "include",
          }
        );

        if (!coursesRes.ok) throw new Error("Failed to fetch courses");

        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!isLoggedIn) {
      setFeedback("Please log in to enroll in a course.");
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5003/api/enrollments/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ course_id: courseId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Enrollment failed.");

      setFeedback("🎉 Successfully enrolled!");
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(error.message || "Failed to enroll.");
      } else {
        setFeedback("Failed to enroll.");
      }
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl mb-6">
          Whether you're curious about features, have feedback, or need support — we're here to help.
        </p>
      </div>

      {/* Contact Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            placeholder="Your full name"
            className="focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Message
          </label>
          <Textarea
            rows={5}
            placeholder="Let us know how we can help you"
            className="focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition-all duration-200"
        >
          📬 Send Message
        </Button>
      </div>

      {/* Navigation */}
      <div className="mt-10 text-center">
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 text-sm underline"
          onClick={() => router.push("/")}
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}