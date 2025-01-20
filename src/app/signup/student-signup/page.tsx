"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Interface for our form data
 */
interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // We'll toggle visibility for this field
  phoneNumber: string;
  educationLevel: string;
  school: string;
  subjects: string[];
  goals: string;
  agreedToTerms: boolean;
}

/**
 * Subjects array
 */
const subjects = [
  "Cybersecurity",
  "AI",
  "Data analyst",
  "Software engineer",
  "Quality assurance",
  "UI/UX",
];

export default function StudentSignupPage() {
  const router = useRouter();

  // Local state for all form fields
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    educationLevel: "",
    school: "",
    subjects: [],
    goals: "",
    agreedToTerms: false,
  });

  // Local state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Toggle a subject's selection in the `subjects` array
   */
  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5003/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          console.error("Registration failed (JSON):", errorData);
          alert(errorData.message || "Failed to register. Please try again.");
        } else {
          const errorText = await response.text();
          console.error("Registration failed (Text):", errorText);
          alert(errorText || "Failed to register. Please try again.");
        }
      } else {
        // Optional: handle success scenario
        // e.g., const successData = await response.json();
        // alert("Registration successful!");
        // router.push("/somewhere");
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Student Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          {/* Grid for firstName, lastName, email, password, phoneNumber */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            {/* Password with Eye Icon Toggle */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[54px] text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Educational Background */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Educational Background</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Current Education Level</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, educationLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* School/Institution */}
            <div className="space-y-2">
              <Label htmlFor="school">School/Institution</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, school: e.target.value }))
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Tutoring Goals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tutoring Goals</h2>
          <Label>Subjects of Interest (Select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={subject}
                  checked={formData.subjects.includes(subject)}
                  onCheckedChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      subjects: prev.subjects.includes(subject)
                        ? prev.subjects.filter((s) => s !== subject)
                        : [...prev.subjects, subject],
                    }));
                  }}
                />
                <Label htmlFor={subject}>{subject}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals">What are your main tutoring goals?</Label>
            <Textarea
              id="goals"
              placeholder="e.g., Improve grades, prepare for exams, learn new skills"
              value={formData.goals}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goals: e.target.value }))
              }
              className="h-32"
              required
            />
          </div>
        </div>

        {/* Terms of Service */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreedToTerms}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                agreedToTerms: Boolean(checked),
              }))
            }
            required
          />
          <Label htmlFor="terms">
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit">Register as Student</Button>
        </div>
      </form>
    </div>
  );
}
