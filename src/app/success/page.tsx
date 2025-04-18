"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    const enrollAndRecordPayment = async () => {
      if (!courseId) return;

      try {
        // 1. Enroll the student
        await fetch("http://localhost:5003/api/enrollments/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ course_id: Number(courseId) }),
        });

        // 2. Record the payment for tutor earnings
        await fetch("http://localhost:5003/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ courseId: Number(courseId) }),
        });
      } catch (err) {
        console.error("Post-payment error:", err);
      }
    };

    enrollAndRecordPayment();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-200 flex flex-col lg:flex-row items-center gap-10">
        {/* Optional: Replace src with your illustration */}
        <div className="hidden lg:block">
          <img
            src="/payment-done.svg"
            alt="Payment Success"
            className="w-60 h-auto"
          />
        </div>

        <div className="text-center lg:text-left space-y-4">
          <CheckCircle className="mx-auto lg:mx-0 text-green-500" size={48} />
          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful
          </h1>
          <p className="text-gray-700 text-base">
            🎉 You're now enrolled in your selected course.
          </p>
          <p className="text-sm text-muted-foreground">
            Access your course content anytime from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button onClick={() => router.push("/MyCourses")}>
              Go to My Courses
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/student-dashboard")}
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
