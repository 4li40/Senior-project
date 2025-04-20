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
} from "@/components/ui/accordion";
import { FileText, Lock } from "lucide-react";

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
  progress: number | null;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [progressInput, setProgressInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessibleChapters, setAccessibleChapters] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, accessRes] = await Promise.all([
          fetch(`http://localhost:5003/api/courses/${id}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:5003/api/quiz/accessible/${id}`, {
            credentials: "include",
          }),
        ]);

        const courseData = await courseRes.json();
        const accessData = await accessRes.json();

        setCourse({ ...courseData, sections: courseData.sections || [] });
        setProgressInput(courseData.progress ?? 0);

        if (Array.isArray(accessData.chapterIds)) {
          setAccessibleChapters(accessData.chapterIds);
        } else {
          setAccessibleChapters([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleProgressUpdate = async () => {
    if (progressInput == null || progressInput < 0 || progressInput > 100)
      return;
    setUpdating(true);
    try {
      await fetch(`http://localhost:5003/api/enrollments/${id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progress: progressInput }),
      });

      setCourse((prev) => (prev ? { ...prev, progress: progressInput } : prev));
    } catch (err) {
      alert("Error updating progress.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!course)
    return <p className="text-center mt-10 text-gray-600">Course not found.</p>;

  const effectiveChapters =
    accessibleChapters.length > 0
      ? accessibleChapters
      : course.sections.length > 0
      ? [
          course.sections[0].id,
          ...(course.sections[1] ? [course.sections[1].id] : []),
        ]
      : [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-2">
        ← Back
      </Button>

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <div className="h-44 bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center">
          <span className="text-7xl text-blue-400">📘</span>
        </div>

        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-700">
            {course.title}
          </CardTitle>
          <p className="text-gray-600 text-lg">{course.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{course.tutor?.charAt(0)}</AvatarFallback>
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

          <div className="mt-3 space-y-2">
            <Progress value={course.progress ?? 0} className="h-2" />
            <span className="text-xs text-gray-500">
              Progress: {course.progress ?? 0}%
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <label htmlFor="progress-range" className="sr-only">
                Progress
              </label>
              <input
                id="progress-range"
                type="range"
                min={0}
                max={100}
                value={progressInput ?? 0}
                onChange={(e) => setProgressInput(Number(e.target.value))}
                className="w-40 accent-blue-600"
                title="Adjust progress"
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
          <Button className="w-full mb-4" size="lg" variant="default">
            ▶️ Continue Course
          </Button>

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
                {course.sections.map((section, index) => {
                  const isUnlocked = effectiveChapters.includes(section.id);
                  return (
                    <AccordionItem key={section.id} value={`item-${index}`}>
                      <AccordionTrigger
                        className={`bg-gray-50 hover:bg-gray-100 px-4 py-3 text-md font-medium text-gray-700 ${
                          !isUnlocked ? "cursor-not-allowed text-gray-400" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {!isUnlocked && <Lock className="w-4 h-4" />}
                          {section.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 bg-white">
                        {isUnlocked ? (
                          <>
                            <ul className="space-y-2">
                              {section.files.map((file) => (
                                <li
                                  key={file.id}
                                  className="flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline hover:text-blue-800 text-sm"
                                  >
                                    {file.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                            {index !== 0 && (
                              <Button
                                variant="outline"
                                className="mt-4 text-blue-600 border-blue-600"
                                onClick={() =>
                                  router.push(`/quiz/${section.id}`)
                                }
                              >
                                Take Quiz
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Complete previous quiz to unlock this section.
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>

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
