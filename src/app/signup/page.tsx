"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "tutor" | null>(null);
  const router = useRouter();

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-12 min-h-screen">
        {/* Left SVG */}
        <div className="w-[150px] lg:w-[180px] hidden lg:block">
          <Image
            src="/images/student.svg"
            alt="Student Illustration"
            width={180}
            height={180}
            className="mx-auto"
          />
        </div>

        {/* Form Section */}
        <div className="max-w-xl w-full bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-8">
          <div className="space-y-8">
            {/* Back & Title */}
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

            {/* Role Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium">I want to join as:</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Student */}
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRole === "student"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-200 hover:border-primary hover:shadow-sm"
                  }`}
                  onClick={() => handleRoleSelect("student")}
                >
                  <div className="space-y-2">
                    <h3 className={`font-medium ${selectedRole === "student" ? "text-primary" : ""}`}>
                      Student
                    </h3>
                    <p className="text-sm text-gray-500">Learn from expert tutors</p>
                  </div>
                </div>

                {/* Tutor */}
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRole === "tutor"
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-200 hover:border-primary hover:shadow-sm"
                  }`}
                  onClick={() => handleRoleSelect("tutor")}
                >
                  <div className="space-y-2">
                    <h3 className={`font-medium ${selectedRole === "tutor" ? "text-primary" : ""}`}>
                      Tutor
                    </h3>
                    <p className="text-sm text-gray-500">Share your expertise</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue */}
            <Button className="w-full" disabled={!selectedRole} onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </div>

        {/* Right SVG */}
        <div className="w-[150px] lg:w-[180px] hidden lg:block">
          <Image
            src="/images/tutor.svg"
            alt="Tutor Illustration"
            width={180}
            height={180}
            className="mx-auto"
          />
        </div>
      </main>
    </div>
  );
}
