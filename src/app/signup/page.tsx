"use client";

// Import statements
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/NavBar";

export default function OnboardingPage() {
  // State and hooks
  const [selectedRole, setSelectedRole] = useState<"student" | "tutor" | null>(
    null
  );
  const router = useRouter();

  // Event handlers
  const handleRoleSelect = (role: "student" | "tutor") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === "student") {
      router.push("signup/student-signup");
    } else if (selectedRole === "tutor") {
      router.push("signup/teacher-signup");
    }
  };

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Back Button and Title */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-semibold">Join Study Buddy</h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium">I want to join as:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Student Card */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === "student"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 hover:border-primary hover:shadow-sm"
                }`}
                onClick={() => handleRoleSelect("student")}
              >
                <div className="space-y-2">
                  <h3
                    className={`font-medium ${
                      selectedRole === "student" ? "text-primary" : ""
                    }`}
                  >
                    Student
                  </h3>
                  <p className="text-sm text-gray-500">
                    Learn from expert tutors
                  </p>
                </div>
              </div>

              {/* Tutor Card */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRole === "tutor"
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 hover:border-primary hover:shadow-sm"
                }`}
                onClick={() => handleRoleSelect("tutor")}
              >
                <div className="space-y-2">
                  <h3
                    className={`font-medium ${
                      selectedRole === "tutor" ? "text-primary" : ""
                    }`}
                  >
                    Tutor
                  </h3>
                  <p className="text-sm text-gray-500">Share your expertise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            className="w-full"
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  );
}
