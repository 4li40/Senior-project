"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  const [progressInput, setProgressInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessibleChapters, setAccessibleChapters] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setCourse({ ...data, sections: data.sections || [] });
        setProgressInput(data.progress ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccessibleChapters = async () => {
      try {
        const res = await fetch(`http://localhost:5003/api/quiz/accessible/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data && Array.isArray(data.chapterIds)) {
          setAccessibleChapters(data.chapterIds);
          console.log("Accessible chapters fetched:", data.chapterIds);
        } else {
          console.error("Invalid response format:", data);
          setAccessibleChapters([]);
        }
      } catch (err) {
        console.error("Failed to fetch accessible chapters", err);
      }
    };

    fetchCourseData();
    fetchAccessibleChapters();
  }, [id]);

  const handleProgressUpdate = async () => {
    try {
      await fetch(`http://localhost:5003/api/enrollments/${id}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progress: progressInput }),
      });
      alert("Progress updated!");
    } catch (err) {
      alert("Error updating progress");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading course...</p>;
  if (!course) return <p className="text-center mt-10 text-red-600">Course not found.</p>;

  // Ensure at least the first two chapters are accessible if array is empty
  const effectiveAccessibleChapters = accessibleChapters.length > 0 
    ? accessibleChapters 
    : course.sections.length > 0 
      ? [course.sections[0].id, ...(course.sections.length > 1 ? [course.sections[1].id] : [])]
      : [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>

      <Card>
        <div className="h-44 bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center">
          <span className="text-6xl">📘</span>
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">{course.title}</CardTitle>
          <p className="text-gray-600">{course.description}</p>
          <div className="mt-3">
            <Progress value={course.progress ?? 0} />
            <p className="text-sm text-gray-500">Progress: {course.progress ?? 0}%</p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="range"
                min={0}
                max={100}
                value={progressInput ?? 0}
                onChange={(e) => setProgressInput(Number(e.target.value))}
              />
              <Button
                size="sm"
                onClick={handleProgressUpdate}
                disabled={progressInput === course.progress}
              >
                Update Progress
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <h2 className="text-lg font-semibold mb-2">📚 Course Content</h2>
          {course.sections.length === 0 ? (
            <p className="text-gray-500">No content yet.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {course.sections.map((section, index) => {
                const sectionIdNum = Number(section.id);
                const isUnlocked = effectiveAccessibleChapters.includes(sectionIdNum);

                console.log(`Section ${section.id} (${section.title}): Unlocked = ${isUnlocked}`);
                console.log(`Available chapters: ${effectiveAccessibleChapters.join(', ')}`);

                return (
                  <AccordionItem key={section.id} value={`item-${index}`}>
                    <AccordionTrigger className={`text-left ${!isUnlocked ? "cursor-not-allowed text-gray-400" : ""}`}>
                      <div className="flex items-center gap-2">
                        {!isUnlocked && <Lock className="w-4 h-4" />}
                        {section.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {isUnlocked ? (
                        <ul className="space-y-2">
                          {section.files.map((file) => (
                            <li key={file.id} className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {file.name}
                              </a>
                            </li>
                          ))}
                          {/* Hide the quiz button for the introduction section (index 0) */}
                          {index !== 0 && (
                            <Button
                              variant="outline"
                              className="mt-4 text-blue-600 border-blue-600"
                              onClick={() => router.push(`/quiz/${section.id}`)}
                            >
                              Take Quiz
                            </Button>
                          )}
                        </ul>
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
        </CardContent>
      </Card>
    </div>
  );
}