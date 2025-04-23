"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSignupSchema } from "@/lib/validations";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudentSignupFormData = z.infer<typeof studentSignupSchema>;

const subjects = [
  "Cybersecurity",
  "AI & Machine Learning",
  "Data Science",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
];


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function StudentSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StudentSignupFormData>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = async (data: StudentSignupFormData) => {
    console.log("Payload being sent:", data); // Log payload for debugging

    try {
      const response = await fetch("http://localhost:5003/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Registration successful!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        console.error("Backend responded with error:", errorData);
        alert(errorData.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...register("password")}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-l-md">
                      +961
                    </span>
                    <Input
                      id="phoneNumber"
                      placeholder="e.g., 71234567"
                      {...register("phoneNumber")}
                      className="rounded-l-none"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Educational Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level</Label>
                  <Select
                    onValueChange={(value) => setValue("educationLevel", value)}
                    defaultValue={watch("educationLevel")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="undergraduate">
                        Undergraduate
                      </SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.educationLevel && (
                    <p className="text-red-500 text-sm">
                      {errors.educationLevel.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
  <Select
    onValueChange={(value) => setValue("school", value)}
    defaultValue={watch("school")}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select your institution" />
    </SelectTrigger>
    <SelectContent>
      {[
        "American University of Beirut (AUB)",
        "Lebanese American University (LAU)",
        "Lebanese University",
        "University of Balamand",
        "Notre Dame University (NDU)",
        "Beirut Arab University (BAU)",
        "Haigazian University",
        "Holy Spirit University of Kaslik (USEK)",
        "Modern University for Business and Science (MUBS)",
        "Lebanese International University (LIU)",
        "Islamic University of Lebanon",
      ].map((uni) => (
        <SelectItem key={uni} value={uni}>
          {uni}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.school && (
    <p className="text-red-500 text-sm">{errors.school.message}</p>
  )}
</div>
              </div>
            </div>

            {/* Tutoring Goals */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tutoring Goals</h2>
              <Label>Subjects of Interest</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={watch("subjects").includes(subject)}
                      onCheckedChange={(checked) => {
                        const updatedSubjects = checked
                          ? [...watch("subjects"), subject]
                          : watch("subjects").filter((s) => s !== subject);
                        setValue("subjects", updatedSubjects);
                      }}
                    />
                    <Label htmlFor={subject}>{subject}</Label>
                  </div>
                ))}
              </div>
              {errors.subjects && (
                <p className="text-red-500 text-sm">
                  {errors.subjects.message}
                </p>
              )}

              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Improve grades, prepare for exams, learn new skills"
                  {...register("goals")}
                  className="h-32"
                />
                {errors.goals && (
                  <p className="text-red-500 text-sm">{errors.goals.message}</p>
                )}
              </div>
            </div>

            {/* Terms of Service */}
            <div className="space-y-1 mt-4">
  <div className="flex items-center space-x-2">
    <Checkbox
      id="terms"
      checked={watch("agreedToTerms")}
      onCheckedChange={(checked) =>
        setValue("agreedToTerms", checked === true)
      }
    />
    <Label htmlFor="terms" className="text-sm">
      I agree to the{" "}
      <a
        href="/terms"
        target="_blank"
        className="text-blue-600 hover:underline"
      >
        Terms of Service
      </a>
    </Label>
  </div>
  {errors.agreedToTerms && (
    <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
  )}
</div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button type="submit">Register</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* ✅ Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>🎉 Account Created!</DialogTitle>
                </DialogHeader>
                <p>Please verify your email before logging in.</p>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => {
                    setShowDialog(false);
                    router.push("/login");
                  }}>
                    Go to Login
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
         
    </div>
    
  );
}
