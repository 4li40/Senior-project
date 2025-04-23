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
import { FileText, Lock, GraduationCap } from "lucide-react";

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
  isEnrolled: boolean; // New property to track enrollment status
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
  const [finalQuizUnlocked, setFinalQuizUnlocked] = useState(false);

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
          if (
            accessData.chapterIds.length >= 3 &&
            accessData.chapterIds.length === courseData.sections.length
          ) {
            setFinalQuizUnlocked(true);
          }
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

  // Only calculate effectiveChapters if the student is enrolled
  const effectiveChapters = course.isEnrolled
    ? accessibleChapters.length > 0
      ? accessibleChapters
      : course.sections.length > 0
      ? [
          course.sections[0].id,
          ...(course.sections[1] ? [course.sections[1].id] : []),
        ]
      : []
    : [];

  // Handle enrollment
  const handleEnroll = async () => {
    try {
      // For paid courses, redirect to checkout
      if (parseFloat(course.price) > 0) {
        const res = await fetch(
          "http://localhost:5003/api/payments/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ courseId: course.id }),
          }
        );

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe checkout
        } else {
          alert("Unable to process payment.");
        }
        return;
      }

      // For free courses, enroll directly
      const response = await fetch(
        "http://localhost:5003/api/enrollments/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ course_id: course.id }),
        }
      );

      if (response.ok) {
        // Refresh the page to show enrolled content
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to enroll in course");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to enroll in course");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Button
        variant="outline"
        onClick={() => router.push("/student-dashboard")}
        className="mb-2"
      >
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

          <div className="mt-3 space-y-2 text-center">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{course.progress ?? 0}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${course.progress ?? 0}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {course.isEnrolled ? (
            // Content for enrolled students
            <>
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
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                  >
                    {course.sections.map((section, index) => {
                      const isUnlocked = effectiveChapters.includes(section.id);
                      return (
                        <AccordionItem key={section.id} value={`item-${index}`}>
                          <AccordionTrigger
                            className={`bg-gray-50 hover:bg-gray-100 px-4 py-3 text-md font-medium text-gray-700 ${
                              !isUnlocked
                                ? "cursor-not-allowed text-gray-400"
                                : ""
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
                                  {section.files.map((file) => {
                                    // Check if the file is a video based on name or URL
                                    const isVideo =
                                      file.name
                                        .toLowerCase()
                                        .match(
                                          /\.(mp4|webm|mov|avi|wmv|flv|mkv)$/
                                        ) ||
                                      file.url.toLowerCase().includes("video");

                                    return (
                                      <li
                                        key={file.id}
                                        className="flex items-center gap-2"
                                      >
                                        <FileText
                                          className={`w-4 h-4 ${
                                            isVideo
                                              ? "text-red-600"
                                              : "text-blue-600"
                                          } flex-shrink-0`}
                                        />
                                        {isVideo ? (
                                          // For video files, link to the video player page
                                          <a
                                            onClick={() =>
                                              router.push(
                                                `/MyCourses/${id}/video/${file.id}`
                                              )
                                            }
                                            className="text-red-600 hover:underline hover:text-red-800 text-sm cursor-pointer"
                                          >
                                            {file.name} (Video)
                                          </a>
                                        ) : (
                                          // For non-video files, keep the current behavior
                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline hover:text-blue-800 text-sm"
                                          >
                                            {file.name}
                                          </a>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                                {/* Show quiz for all unlocked sections */}
                                <Button
                                  variant="outline"
                                  className="mt-4 text-blue-600 border-blue-600"
                                  onClick={() =>
                                    router.push(`/quiz/${section.id}`)
                                  }
                                >
                                  Take Quiz
                                </Button>
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

              {finalQuizUnlocked && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" /> Final
                    Quiz
                  </h2>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => router.push(`/final-quiz/${id}`)}
                  >
                    Take Final Quiz & Get Certificate
                  </Button>
                </div>
              )}

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
            </>
          ) : (
            // Content for non-enrolled students (course preview)
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-800 font-semibold text-lg mb-2">
                  Course Preview
                </h3>
                <p className="text-blue-700 mb-4">
                  You're viewing a preview of this course. Enroll to access all
                  course materials, quizzes, and receive a certificate upon
                  completion.
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleEnroll}
                >
                  {parseFloat(course.price) > 0
                    ? `Enroll Now - $${parseFloat(course.price).toFixed(2)}`
                    : "Enroll Now - Free"}
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  📚 Course Content Preview
                </h2>
                {course.sections.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No content sections available yet.
                  </p>
                ) : (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                  >
                    {course.sections.map((section, index) => (
                      <AccordionItem key={section.id} value={`item-${index}`}>
                        <AccordionTrigger className="bg-gray-50 hover:bg-gray-100 px-4 py-3 text-md font-medium text-gray-700">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white">
                          <div className="text-sm text-gray-500 mb-2">
                            This section contains {section.files.length}{" "}
                            learning resource
                            {section.files.length !== 1 ? "s" : ""}.
                          </div>

                          <ul className="space-y-2">
                            {section.files.map((file) => (
                              <li
                                key={file.id}
                                className="flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-500">
                                  {file.name}
                                </span>
                                <Lock className="w-3 h-3 text-gray-400 ml-1" />
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={handleEnroll}
                            >
                              Enroll to Access
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              {/* Course details for non-enrolled students */}
              <div className="mt-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    What You'll Learn
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>{" "}
                      Complete understanding of {course.category}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>{" "}
                      Hands-on practice with real examples
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>{" "}
                      Certificate upon course completion
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
