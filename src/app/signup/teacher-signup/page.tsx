"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  education: string;
  certifications: string;
  experience: string;
  subjects: string[];
  otherSubjects: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

const subjects = [
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "ai", label: "AI" },
  { id: "dataanalyst", label: "Data analyst" },
  { id: "softwareengineering", label: "Software engineering" },
];

const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const TeacherSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: "",
    certifications: "",
    experience: "",
    subjects: [],
    otherSubjects: "",
    availability: {
      days: [],
      startTime: "",
      endTime: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the payload matches the backend expectations
    const payload = {
      ...formData,
      phone: formData.phone, // Map 'phone' correctly
      password: "examplePassword123", // Add a default password for testing
      experience: parseInt(formData.experience, 10), // Ensure 'experience' is a number
      availability: {
        ...formData.availability,
        days: formData.availability.days, // Ensure 'days' is an array
        startTime: formData.availability.startTime, // Ensure valid time format
        endTime: formData.availability.endTime,
      },
    };

    console.log("Payload being sent to the API:", payload);

    try {
      const response = await fetch("http://localhost:5003/api/tutors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("Backend response:", responseData);

      if (!response.ok) {
        console.error("Registration failed:", responseData);
        alert(responseData.message || "Failed to register.");
        return;
      }

      alert("Tutor registered successfully!");
      router.push("/tutor-dashboard");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Tutor Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Qualifications</h3>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Education Level</Label>
                    <Input
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      name="certifications"
                      placeholder="List any relevant certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      Years of Teaching Experience
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Subjects You Can Teach</h3>
                <div className="mt-4 space-y-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={subject.id}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={() => handleSubjectToggle(subject.id)}
                      />
                      <Label htmlFor={subject.id}>{subject.label}</Label>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="otherSubjects">Other Subjects</Label>
                    <Input
                      id="otherSubjects"
                      name="otherSubjects"
                      placeholder="Enter other subjects you can teach"
                      value={formData.otherSubjects}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Availability</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {days.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={formData.availability.days.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.availability.startTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              startTime: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.availability.endTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              endTime: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>

              <Button type="submit">Register</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSignup;
