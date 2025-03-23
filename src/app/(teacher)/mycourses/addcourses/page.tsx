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
  const [files, setFiles] = useState<File[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setFileTypes(selectedFiles.map(() => "pdf")); // Default all to pdf
      setError("");
    }
  };

  const handleFileTypeChange = (index: number, type: string) => {
    const updatedTypes = [...fileTypes];
    updatedTypes[index] = type;
    setFileTypes(updatedTypes);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !description || !price || !category || files.length === 0) {
      setError("All fields, including at least one file, are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("types", JSON.stringify(fileTypes));

      const response = await fetch("http://localhost:5003/api/courses/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add course.");

      setSuccess(true);
      setTimeout(() => router.push("/mycourses"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
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
            {success && (
              <p className="text-green-500">🎉 Course added successfully!</p>
            )}

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

            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the course"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="category">Course Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value.toLowerCase())}
                className="w-full border rounded-md p-2"
                required
                title="Select course category"
              >
                <option value="">Select a category</option>
                <option value="web-development">Web Development</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="software-engineering">
                  Software Engineering
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">
                Upload Course Materials (PDFs or Videos)
              </Label>
              <input
                type="file"
                accept=".pdf,video/*"
                multiple
                onChange={handleFileChange}
                className="w-full border rounded-md p-2"
                required
                title="Upload Course Materials"
              />
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm text-gray-600"
                >
                  <span>{file.name}</span>
                  <select
                    title="Select file type"
                    value={fileTypes[index]}
                    onChange={(e) =>
                      handleFileTypeChange(index, e.target.value)
                    }
                    className="ml-4 p-1 border rounded"
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              ))}
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
