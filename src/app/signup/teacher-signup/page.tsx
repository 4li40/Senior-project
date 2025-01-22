"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSignupSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeacherFormData = z.infer<typeof teacherSignupSchema>;

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
  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSignupSchema),
    defaultValues: {
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
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = watch("subjects");
    const updatedSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];
    setValue("subjects", updatedSubjects);
  };

  const handleDayToggle = (day: string) => {
    const currentDays = watch("availability.days");
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setValue("availability.days", updatedDays);
  };

  const onSubmit = async (data: TeacherFormData) => {
    try {
      // TODO: Implement form submission logic
      console.log(data);
      router.push("/tutor-dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex">
                      <span className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-l-md">
                        +961
                      </span>
                      <Input
                        id="phone"
                        placeholder="e.g., 71234567"
                        className="rounded-l-none"
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
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
                      placeholder="e.g., Master's in Computer Science"
                      {...register("education")}
                    />
                    {errors.education && (
                      <p className="text-red-500 text-sm">
                        {errors.education.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      placeholder="e.g., AWS Certified, Microsoft Certified Trainer"
                      {...register("certifications")}
                    />
                    {errors.certifications && (
                      <p className="text-red-500 text-sm">
                        {errors.certifications.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      Years of Teaching Experience
                    </Label>
                    <Input
                      id="experience"
                      placeholder="Enter number of years"
                      {...register("experience")}
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-sm">
                        {errors.experience.message}
                      </p>
                    )}
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
                        checked={watch("subjects").includes(subject.id)}
                        onCheckedChange={() => handleSubjectToggle(subject.id)}
                      />
                      <Label htmlFor={subject.id}>{subject.label}</Label>
                    </div>
                  ))}
                  {errors.subjects && (
                    <p className="text-red-500 text-sm">
                      {errors.subjects.message}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="otherSubjects">Other Subjects</Label>
                    <Input
                      id="otherSubjects"
                      placeholder="e.g., Web Development, Mobile App Development"
                      {...register("otherSubjects")}
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
                          checked={watch("availability.days").includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.availability?.days && (
                    <p className="text-red-500 text-sm">
                      {errors.availability.days.message}
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        placeholder="Select start time"
                        {...register("availability.startTime")}
                      />
                      {errors.availability?.startTime && (
                        <p className="text-red-500 text-sm">
                          {errors.availability.startTime.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        placeholder="Select end time"
                        {...register("availability.endTime")}
                      />
                      {errors.availability?.endTime && (
                        <p className="text-red-500 text-sm">
                          {errors.availability.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button type="submit">Register as Tutor</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSignup;
