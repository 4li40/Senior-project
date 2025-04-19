"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

interface CourseFile {
  id: number;
  name: string;
  url: string;
}

interface CourseSection {
  id: number;
  title: string;
  files: CourseFile[];
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  tutor: string;
  sections: CourseSection[];
  playlistUrl: string | null;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
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
        setCourse({ ...data, sections: data.sections || [] });
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError(err.message || "An error occurred while loading the course.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Back & Edit Buttons */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push(`/teacher/mycourses/edit/${id}`)}
        >
          ✏️ Edit Course
        </Button>
      </div>

      {/* Course Header */}
      <div className="space-y-3 text-center border-b pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {course.description}
        </p>
        <div className="text-md text-gray-500">
          Instructor:{" "}
          <span className="font-medium text-gray-700">{course.tutor}</span> | Category:{" "}
          <span className="capitalize font-medium text-gray-700">{course.category}</span> | Price:{" "}
          <span className="font-medium text-gray-700">
            ${parseFloat(course.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Sections (Chapters) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700">
            📚 Course Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {course.sections.length === 0 ? (
            <p className="text-gray-500 italic">No content sections uploaded yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {course.sections.map((section, index) => (
                <AccordionItem
                  key={section.id || index}
                  value={`item-${index}`}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="bg-gray-50 hover:bg-gray-100 px-4 py-3 text-lg font-medium text-gray-700">
                    {section.title || `Section ${index + 1}`}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-white space-y-4">
                    {section.files.length === 0 ? (
                      <p className="text-gray-500 italic">No files in this section.</p>
                    ) : (
                      <ul className="space-y-2">
                        {section.files.map((file, fileIndex) => (
                          <li key={file.id || fileIndex} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                            >
                              {file.name || `File ${fileIndex + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* ➕ Add Quiz Button */}
                    <Button

                                variant="outline"
                                onClick={() => router.push(`/sections/${section.id}/addquestions?courseId=${id}`)}
                                >
                      
                      ➕ Add Quiz Question
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Playlist Section (optional) */}
      {course.playlistUrl && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-700">🎥 Course Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={course.playlistUrl}
                title="Course Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
