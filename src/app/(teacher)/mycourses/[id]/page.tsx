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
import { FileText, Video } from "lucide-react";

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
      try {
        const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to fetch course: ${res.statusText}`);
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

  if (loading) return <p className="text-center mt-10 text-gray-500 animate-pulse">Loading course...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (!course) return <p className="text-center mt-10 text-gray-500">Course not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-gradient-to-br from-blue-50 via-white to-blue-70 rounded-lg">
      {/* Top Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/mycourses')}>
          ← Back
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
          onClick={() => router.push(`/mycourses/edit/${id}`)}
        >
          ✏️ Edit Course
        </Button>
      </div>

      {/* Course Info */}
      <div className="text-center space-y-2 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-extrabold text-black-800">{course.title}</h1>
        <p className="text-lg text-gray-900">{course.description}</p>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-blue-700">{course.tutor}</span> |{" "}
          <span className="capitalize">{course.category}</span> |{" "}
          <span className="text-black-700 font-semibold">${parseFloat(course.price).toFixed(2)}</span>
        </p>
      </div>

      {/* Content */}
      <Card className="bg-white/90 shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-black-700">📘 Course Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {course.sections.length === 0 ? (
            <p className="text-gray-500 italic">No sections added yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {course.sections.map((section, index) => (
                <AccordionItem
                  key={section.id || index}
                  value={`item-${index}`}
                  className="border rounded-lg shadow-sm transition-all"
                >
                  <AccordionTrigger className="bg-blue-50 hover:bg-black-100 px-4 py-3 text-md font-medium text-black-900">
                    {section.title || `Section ${index + 1}`}
                  </AccordionTrigger>
                  <AccordionContent className="bg-white p-4 rounded-b-md space-y-4">
                    {section.files.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No files in this section.</p>
                    ) : (
                      <ul className="space-y-2">
                        {section.files.map((file, i) => {
                          const isVideo = file.name.match(/\.(mp4|webm|mov|avi)$/i) || file.url.includes("video");
                          const isPDF = file.name.endsWith(".pdf") || file.url.includes("pdf");

                          return (
                            <li key={file.id || i} className="flex items-center gap-2">
                              {isVideo ? (
                                <Video className="text-red-500 w-4 h-4" />
                              ) : (
                                <FileText className={`w-4 h-4 ${isPDF ? "text-blue-600" : "text-blue-600"}`} />
                              )}
                              {isVideo ? (
                                <span
                                  onClick={() => router.push(`/mycourses/${id}/video/${file.id}`)}
                                  className="text-red-600 hover:underline hover:text-red-800 text-sm cursor-pointer transition-all"
                                >
                                  🎬 {file.name || `File ${i + 1}`}
                                </span>
                              ) : isPDF ? (
                                <span
                                  onClick={() => router.push(`/mycourses/${id}/pdf/${file.id}`)}
                                  className="text-blue-600 hover:underline hover:text-blue-800 text-sm cursor-pointer transition-all"
                                >
                                  📄 {file.name || `File ${i + 1}`}
                                </span>
                              ) : (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline transition"
                                >
                                  {file.name || `File ${i + 1}`}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* Add Quiz Question Button */}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        router.push(`/sections/${section.id}/addquestions?courseId=${id}`)
                      }
                    >
                      ➕ Add Quiz Question
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* Final Quiz Button */}
          <div className="pt-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full transition-all"
              onClick={() => router.push(`/mycourses/${id}/add-final-quiz`)}
            >
              ➕ Add Final Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional Playlist Embed */}
      {course.playlistUrl && (
        <Card className="bg-white/90 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-700">🎞️ Course Playlist</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-lg">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={course.playlistUrl}
                title="Course Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
