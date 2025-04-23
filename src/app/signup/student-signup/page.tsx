"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSignupSchema } from "@/lib/validations";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type StudentSignupFormData = z.infer<typeof studentSignupSchema>;

const subjects = [
  "Cybersecurity",
  "AI & Machine Learning",
  "Data Science",
  "Software Engineering",
  "Web Development",
  "Mobile Development",
];

export default function StudentSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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
    try {
      const response = await fetch("http://localhost:5003/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowDialog(true); // show popup
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Student Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pr-10"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex items-center">
                  <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-l-md">+961</span>
                  <Input id="phoneNumber" {...register("phoneNumber")} className="rounded-l-none" />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            {/* Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select onValueChange={(val) => setValue("educationLevel", val)} defaultValue={watch("educationLevel")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.educationLevel && <p className="text-red-500 text-sm">{errors.educationLevel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School/Institution</Label>
                <Input id="school" {...register("school")} />
                {errors.school && <p className="text-red-500 text-sm">{errors.school.message}</p>}
              </div>
            </div>

            {/* Subjects & Goals */}
            <div className="space-y-2">
              <Label>Subjects of Interest</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={watch("subjects").includes(subject)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...watch("subjects"), subject]
                          : watch("subjects").filter((s) => s !== subject);
                        setValue("subjects", updated);
                      }}
                    />
                    <Label htmlFor={subject}>{subject}</Label>
                  </div>
                ))}
              </div>
              {errors.subjects && <p className="text-red-500 text-sm">{errors.subjects.message}</p>}

              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                {...register("goals")}
                placeholder="e.g., Improve grades, prepare for exams"
              />
              {errors.goals && <p className="text-red-500 text-sm">{errors.goals.message}</p>}
            </div>

            {/* Terms of Service */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={watch("agreedToTerms")}
                onCheckedChange={(checked) => setValue("agreedToTerms", checked === true)}
              />
              <Label htmlFor="terms">I agree to the Terms of Service</Label>
              {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit">Register</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ✅ Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✅ Registration Complete</DialogTitle>
          </DialogHeader>
          <p>Please check your email to verify your account before logging in.</p>
          <div>
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
