"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

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
  passedChapters: number[];
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalPassed, setFinalPassed] = useState(false); // ✅

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(
          `http://localhost:5003/api/courses/${courseId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    async function checkFinalQuizStatus() {
      try {
        const res = await fetch(
          `http://localhost:5003/api/final-quiz/${courseId}/status`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.passed) {
          setFinalPassed(true);
          // 🔄 Re-fetch course data to show updated progress
          fetchCourse();
        }
      } catch (err) {
        console.error("Error checking final quiz status:", err);
      }
    }

    fetchCourse();
    checkFinalQuizStatus();
  }, [courseId]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (!course) return <p className="text-center mt-6">Course not found</p>;

  const allChaptersPassed =
    Array.isArray(course.passedChapters) &&
    Array.isArray(course.sections) &&
    course.passedChapters.length === course.sections.length &&
    course.sections.length >= 3;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => router.push("/MyCourses")}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.description}</p>
          <p className="text-muted-foreground text-sm mt-2">
            Instructor: {course.tutor} | Category: {course.category}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.sections.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>{s.title}</span>
                {course.passedChapters?.includes(s.id) ? (
                  <span className="text-green-600">✅ Passed</span>
                ) : (
                  <span className="text-gray-500">❌ Not passed</span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ✅ Final Quiz Block */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Final Course Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          {finalPassed ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                🎉 You passed the final quiz!
              </p>
              <Link href="/certificates">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  🎓 View / Download Certificate
                </Button>
              </Link>
            </div>
          ) : allChaptersPassed ? (
            <Link href={`/final-quiz/${courseId}/start`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Take Final Quiz & Earn Certificate
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              ✅ Complete all chapters to unlock the final quiz.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
