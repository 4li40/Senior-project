"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !price || !category || !file) {
      setError("All fields, including file upload, are required.");
      return;
    }

    try {
      // ✅ Step 1: Upload File to MongoDB GridFS
      const fileData = new FormData();
      fileData.append("file", file);

      const fileUploadResponse = await fetch("http://localhost:5003/api/courses/upload", {
        method: "POST",
        body: fileData,
        credentials: "include",
      });

      const fileResult = await fileUploadResponse.json();
      if (!fileUploadResponse.ok) {
        throw new Error(fileResult.message || "File upload failed.");
      }

      const fileId = fileResult.fileId; // ✅ MongoDB File ID
      console.log("📂 Uploaded fileId:", fileId);

      if (!fileId) {
        throw new Error("File upload failed. No fileId returned.");
      }

      // ✅ Step 2: Send Course Data to MySQL
      const courseData = {
        title,
        description,
        price,
        category,
        fileId, // ✅ Link the fileId with the course in MySQL
      };

      console.log("📤 Sending course data to backend:", courseData);

      const response = await fetch("http://localhost:5003/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add course.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/mycourses"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
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
          <CardTitle className="text-2xl font-bold">Add a New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCourse} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">🎉 Course added successfully!</p>}

            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" placeholder="Enter course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea id="description" placeholder="Describe the course" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Course Price (USD)</Label>
              <Input id="price" type="number" min="0" step="0.01" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Course Category</Label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value.toLowerCase())} className="w-full border rounded-md p-2" required>
                <option value="">Select a category</option>
                <option value="web-development">Web Development</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="software-engineering">Software Engineering</option>
              </select>
            </div>

            {/* File Upload (PDF/Video) */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload Course Material (PDF or Video)</Label>
              <input type="file" accept=".pdf, video/*" onChange={handleFileChange} className="w-full border rounded-md p-2" required />
              {file && <p className="text-gray-700">Selected file: {file.name}</p>}
            </div>

            <Button className="w-full" type="submit">
              Add Course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
