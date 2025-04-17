"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface CourseSection {
  id: string; // Use a unique ID for keys
  name: string;
  files: File[];
}

export default function AddCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  // State for sections
  const [sections, setSections] = useState<CourseSection[]>([
    { id: crypto.randomUUID(), name: "Section 1", files: [] },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // --- Section Management Handlers ---

  const handleAddSection = () => {
    setSections([
      ...sections,
      { id: crypto.randomUUID(), name: `Section ${sections.length + 1}`, files: [] },
    ]);
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleSectionNameChange = (
    sectionId: string,
    newName: string
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, name: newName } : section
      )
    );
  };

  const handleSectionFileChange = (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? { ...section, files: [...section.files, ...selectedFiles] }
            : section
        )
      );
      setError(""); // Clear error on new file selection
    }
  };

  const handleRemoveFileFromSection = (sectionId: string, fileIndex: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedFiles = [...section.files];
          updatedFiles.splice(fileIndex, 1);
          return { ...section, files: updatedFiles };
        }
        return section;
      })
    );
  };

  // --- Form Submission ---

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation: Check basic fields and ensure at least one section with at least one file exists
    const hasFiles = sections.some((section) => section.files.length > 0);
    if (!title || !description || !price || !category || sections.length === 0 || !hasFiles) {
      setError(
        "All fields are required, and at least one section with files must be added."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      // Append section data and files
      // We'll send section structure as JSON and files separately
      const sectionStructure = sections.map((section) => ({
        name: section.name,
        fileCount: section.files.length,
      }));
      formData.append("sections", JSON.stringify(sectionStructure));

      sections.forEach((section, sectionIndex) => {
        section.files.forEach((file, fileIndex) => {
          // Naming convention: section_{sectionIndex}_file_{fileIndex}
          formData.append(`section_${sectionIndex}_file_${fileIndex}`, file, file.name);
        });
      });

      // TODO: Update the backend endpoint and logic to handle this new structure
      const response = await fetch("http://localhost:5003/api/courses/", { // Ensure backend supports this
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add course.");

      setSuccess(true);
      // Reset form or redirect
      // setTitle(""); setDescription(""); setPrice(""); setCategory("");
      // setSections([{ id: crypto.randomUUID(), name: "Section 1", files: [] }]);
      setTimeout(() => router.push("/mycourses"), 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Add course error:", err);
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
          <form onSubmit={handleAddCourse} className="space-y-6">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-4">
                🎉 Course added successfully! Redirecting...
              </p>
            )}

            {/* Course Details */}
            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Course Details</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full border rounded-md p-2 h-10" // Match input height
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
              </div>
            </div>

            {/* Sections Management */}
            <div className="space-y-4 border p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Course Sections</h3>
                <Button type="button" size="sm" onClick={handleAddSection}>
                  <Plus className="w-4 h-4 mr-1" /> Add Section
                </Button>
              </div>

              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="border p-4 rounded-md space-y-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <Input
                      value={section.name}
                      onChange={(e) =>
                        handleSectionNameChange(section.id, e.target.value)
                      }
                      placeholder={`Section ${sectionIndex + 1} Name`}
                      className="font-medium flex-grow mr-2"
                    />
                    {sections.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveSection(section.id)}
                        title="Remove Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`section-files-${section.id}`}>
                      Upload Files for this Section (PDFs, Videos, etc.)
                    </Label>
                    <Input
                      id={`section-files-${section.id}`}
                      type="file"
                      multiple
                      onChange={(e) => handleSectionFileChange(section.id, e)}
                      className="w-full border rounded-md p-2 text-sm"
                      accept=".pdf,video/*,image/*,.zip,.rar,.txt,.md"
                    />
                    {section.files.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm list-disc list-inside pl-2">
                        {section.files.map((file, fileIndex) => (
                          <li key={fileIndex} className="flex justify-between items-center">
                            <span className="truncate max-w-[80%]">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 p-1 h-auto"
                              onClick={() => handleRemoveFileFromSection(section.id, fileIndex)}
                              title="Remove File"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
