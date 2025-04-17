"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import { FileText } from "lucide-react"; // Import an icon for files

// Define the structure for a file within a section
interface CourseFile {
  id: number;
  name: string;
  url: string;
}

// Define the structure for a course section
interface CourseSection {
  id: number;
  title: string;
  files: CourseFile[];
}

// Update the main CourseDetail interface
interface CourseDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  tutor: string;
  sections: CourseSection[]; // Changed from pdfs: string[]
  playlistUrl: string | null;
  progress: number | null;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [progressInput, setProgressInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Combine fetch logic into one useEffect
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch course: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched course:", data); // Keep for debugging if needed
        // Ensure sections is always an array
        setCourse({ ...data, sections: data.sections || [] });
        setProgressInput(data.progress ?? 0);
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError(err.message || "An error occurred while loading the course.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleProgressUpdate = async () => {
    if (progressInput == null || progressInput < 0 || progressInput > 100)
      return;
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5003/api/enrollments/${id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progress: progressInput }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update progress: ${res.statusText}`);
      }
      // Refetch course detail after update to get latest progress and sections
      const courseRes = await fetch(`http://localhost:5003/api/courses/${id}`, {
        credentials: "include",
      });
      if (!courseRes.ok) {
        throw new Error(`Failed to re-fetch course: ${courseRes.statusText}`);
      }
      const updatedData = await courseRes.json();
      setCourse({ ...updatedData, sections: updatedData.sections || [] });
      setProgressInput(updatedData.progress ?? 0);
    } catch (err: any) {
      console.error("Error updating progress:", err);
      setError(err.message || "Failed to update progress."); // Show error to user
    } finally {
      setUpdating(false);
    }
  };

  // Remove redundant fetchCourse function
  // const fetchCourse = async () => { ... };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  }

  if (!course) {
    return <p className="text-center mt-10 text-gray-600">Course not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()} className="mb-2">
        ← Back
      </Button>

      {/* Course Card */}
      <Card className="shadow-xl rounded-2xl overflow-hidden">
        {/* Cover Image/Icon */}
        <div className="h-44 bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center">
          <span className="text-7xl text-blue-400">📘</span>
        </div>
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-700">
            {course.title}
          </CardTitle>
          <p className="text-gray-600 text-lg">{course.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 mt-2">
            {/* Instructor Avatar */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {course.tutor?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{course.tutor}</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span>
              Category: <span className="capitalize">{course.category}</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>Price: ${parseFloat(course.price).toFixed(2)}</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 space-y-2">
            <Progress value={course.progress ?? 0} className="h-2" />
            <span className="text-xs text-gray-500">
              Progress: {course.progress ?? 0}%
            </span>
            {/* Progress update UI */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <input
                type="range"
                min={0}
                max={100}
                value={progressInput ?? 0}
                onChange={(e) => setProgressInput(Number(e.target.value))}
                className="w-40 accent-blue-600"
                disabled={updating}
              />
              <span className="text-xs w-8 text-center">
                {progressInput ?? 0}%
              </span>
              <Button
                size="sm"
                onClick={handleProgressUpdate}
                disabled={updating || progressInput === course.progress}
              >
                {updating ? "Updating..." : "Update Progress"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Continue Button - Consider linking this to the first section/video? */}
          <Button className="w-full mb-4" size="lg" variant="default">
            ▶️ Continue Course
          </Button>

          {/* Sections (Chapters) using Accordion */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              📚 Course Content
            </h2>
            {course.sections.length === 0 ? (
              <p className="text-gray-500 italic">
                No content sections available yet.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {course.sections.map((section, index) => (
                  <AccordionItem
                    key={section.id || index}
                    value={`item-${index}`}
                    className="border rounded-lg overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="bg-gray-50 hover:bg-gray-100 px-4 py-3 text-md font-medium text-gray-700">
                      {section.title || `Section ${index + 1}`}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                      {section.files.length === 0 ? (
                        <p className="text-gray-500 italic">
                          No files in this section.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {section.files.map((file, fileIndex) => (
                            <li
                              key={file.id || fileIndex}
                              className="flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <a
                                href={file.url} // Assuming the backend provides the correct URL
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors text-sm"
                              >
                                {file.name || `File ${fileIndex + 1}`}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Playlist Section (optional) */}
          {course.playlistUrl && (
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                🎥 Course Playlist
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={course.playlistUrl}
                  title="Course Playlist"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md border w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
