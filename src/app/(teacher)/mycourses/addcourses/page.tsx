"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TeacherNavBar from "@/components/teacherNavBar";
import { ArrowLeft } from "lucide-react";

export default function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !price) {
      setError("All fields are required.");
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Send cookies with request
        body: JSON.stringify({ title, description, price }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add course.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/mycourses"), 1500); // Redirect after success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <TeacherNavBar />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/mycourses")}
          className="flex items-center text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to My Courses
        </button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add a New Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCourse} className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              {success && (
                <p className="text-green-500">🎉 Course added successfully!</p>
              )}

              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Course Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the course"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {/* Course Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Course Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button className="w-full" type="submit">
                Add Course
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
