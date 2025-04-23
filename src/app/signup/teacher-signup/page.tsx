"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSignupSchema } from "@/lib/validations";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FaEye, FaEyeSlash } from "react-icons/fa";

type FormData = z.infer<typeof teacherSignupSchema>;

const subjects = [
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "ai", label: "AI" },
  { id: "dataanalyst", label: "Data Analyst" },
  { id: "softwareengineering", label: "Software Engineering" },
];

const days = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

const educationLevels = [
  { id: "bachelors", label: "Bachelor's Degree" },
  { id: "masters", label: "Master's Degree" },
  { id: "phd", label: "Ph.D." },
  { id: "doctorate", label: "Doctorate" },
  { id: "professional", label: "Professional Certification" },
];

export default function TeacherSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(teacherSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      education: "",
      certifications: "",
      experience: 0,
      password: "",
      subjects: [],
      otherSubjects: "",
      availability: {
        days: [],
        startTime: "",
        endTime: "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("http://localhost:5003/api/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // ✅ Success
        setShowDialog(true);
      } else {
        const error = await response.json();
  
        // ✅ Handle known error (e.g., duplicate email)
        if (response.status === 409 || error.message?.includes("already exists")) {
          // Show same dialog anyway
          setShowDialog(true);
        } else {
          // ❌ Other errors
          alert("❌ Error: " + error.message);
        }
      }
    } catch (err) {
      alert("❌ Unexpected error. Please try again.");
      console.error(err);
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Tutor Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="firstName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="lastName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">+961</span>
                        <Input
                          {...field}
                          className="pl-14"
                          placeholder="3 123456"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Password */}
              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Education */}
              <FormField name="education" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest Education Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Experience & Certifications */}
              <FormField name="certifications" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications (Link)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="experience" control={form.control} render={({ field }) => (
  <FormItem>
    <FormLabel>Years of Experience</FormLabel>
    <FormControl>
      <Input
        type="number"
        min="0"
        value={field.value}
        onChange={(e) => field.onChange(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e") e.preventDefault();
        }}
      />
    </FormControl>
    <FormMessage />
  </FormItem>
)} />

              {/* Subjects */}
              <FormField name="subjects" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects You Can Teach</FormLabel>
                  <div className="space-y-3 mt-2">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value.includes(subject.id)}
                          onCheckedChange={(checked) => {
                            const newList = checked
                              ? [...field.value, subject.id]
                              : field.value.filter((val) => val !== subject.id);
                            field.onChange(newList);
                          }}
                        />
                        <FormLabel>{subject.label}</FormLabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="otherSubjects" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Subjects</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Availability */}
              <FormField name="availability.days" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {days.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value.includes(day)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...field.value, day]
                              : field.value.filter((d) => d !== day);
                            field.onChange(updated);
                          }}
                        />
                        <FormLabel className="font-normal capitalize">{day}</FormLabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="availability.startTime" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="availability.endTime" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
                <Button type="submit">Register as Tutor</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ✅ Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle>🎉 Account Created!</DialogTitle>
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
