"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// Interface for existing file from the API
interface ExistingFile {
  id: number;
  name: string;
  url: string;
}

// Interface for section with existing files
interface CourseSection {
  id: number | string; // String for new sections, number for existing ones
  title: string;
  name?: string; // Used locally for form handling
  files: File[]; // New files to upload
  existingFiles: ExistingFile[]; // Files already in the DB
  isNew?: boolean; // Flag to identify new sections vs existing ones
}

// Interface for the course detail
interface CourseDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  tutor: string;
  sections: {
    id: number;
    title: string;
    files: ExistingFile[];
  }[];
  playlistUrl: string | null;
}

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [removedFiles, setRemovedFiles] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalCourse, setOriginalCourse] = useState<CourseDetail | null>(
    null
  );

  // Fetch the original course data
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch course: ${res.statusText}`);
        }
        const data = await res.json();
        setOriginalCourse(data);

        // Set form fields
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCategory(data.category);

        // Transform sections for the edit form
        const transformedSections = data.sections.map((section) => ({
          id: section.id,
          title: section.title,
          name: section.title, // For the input field
          files: [], // New files to be added (none yet)
          existingFiles: section.files, // Existing files
          isNew: false, // This is an existing section
        }));

        setSections(transformedSections);
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError(err.message || "An error occurred while loading the course.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // --- Section Management Handlers ---

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        title: `Section ${sections.length + 1}`,
        name: `Section ${sections.length + 1}`,
        files: [],
        existingFiles: [],
        isNew: true,
      },
    ]);
  };

  const handleRemoveSection = (sectionId: number | string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleSectionNameChange = (
    sectionId: number | string,
    newName: string
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, name: newName, title: newName }
          : section
      )
    );
  };

  const handleSectionFileChange = (
    sectionId: number | string,
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

  const handleRemoveFileFromSection = (
    sectionId: number | string,
    fileIndex: number
  ) => {
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

  const handleRemoveExistingFile = (
    sectionId: number | string,
    fileId: number
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            existingFiles: section.existingFiles.filter(
              (file) => file.id !== fileId
            ),
          };
        }
        return section;
      })
    );

    // Also track removed files to delete them on the server
    setRemovedFiles([...removedFiles, fileId]);
  };

  // --- Form Submission ---

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      sections.length === 0
    ) {
      setError(
        "All basic fields are required, and at least one section must exist."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      // Add removed files
      if (removedFiles.length > 0) {
        formData.append("removedFiles", JSON.stringify(removedFiles));
      }

      // Prepare section data
      const sectionStructure = sections.map((section) => ({
        id: section.id,
        name: section.name || section.title,
        fileCount: section.files.length,
        isNew: section.isNew,
      }));
      formData.append("sections", JSON.stringify(sectionStructure));

      // Add new files
      sections.forEach((section, sectionIndex) => {
        section.files.forEach((file, fileIndex) => {
          formData.append(
            `section_${sectionIndex}_file_${fileIndex}`,
            file,
            file.name
          );
        });
      });

      const response = await fetch(`http://localhost:5003/api/courses/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update course.");
      }

      setSuccess(true);
      setTimeout(() => router.push(`/mycourses/${id}`), 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Update course error:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading course data...</p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.push(`/mycourses/${id}`)}
        className="flex items-center text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Course Details
      </button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCourse} className="space-y-6">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-4">
                🎉 Course updated successfully! Redirecting...
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
                    className="w-full border rounded-md p-2 h-10"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="web-development">Web Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="mobile-development">
                      Mobile Development
                    </option>
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
                <div
                  key={section.id}
                  className="border p-4 rounded-md space-y-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <Input
                      value={section.name || section.title}
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

                  {/* Existing Files */}
                  {section.existingFiles &&
                    section.existingFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Existing Files</h4>
                        <ul className="mt-2 space-y-1 text-sm list-disc list-inside pl-2">
                          {section.existingFiles.map((file) => (
                            <li
                              key={file.id}
                              className="flex justify-between items-center"
                            >
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate max-w-[80%]"
                              >
                                {file.name}
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 p-1 h-auto"
                                onClick={() =>
                                  handleRemoveExistingFile(section.id, file.id)
                                }
                                title="Remove File"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Add New Files */}
                  <div className="space-y-2">
                    <Label htmlFor={`section-files-${section.id}`}>
                      Add New Files to this Section (PDFs, Videos, etc.)
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
                      <div>
                        <h4 className="text-sm font-medium mt-3">
                          New Files to Upload
                        </h4>
                        <ul className="mt-2 space-y-1 text-sm list-disc list-inside pl-2">
                          {section.files.map((file, fileIndex) => (
                            <li
                              key={fileIndex}
                              className="flex justify-between items-center"
                            >
                              <span className="truncate max-w-[80%]">
                                {file.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 p-1 h-auto"
                                onClick={() =>
                                  handleRemoveFileFromSection(
                                    section.id,
                                    fileIndex
                                  )
                                }
                                title="Remove File"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
            >
              Update Course
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
