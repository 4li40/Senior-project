"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  tutor: string;
  pdfs: string[];
  playlistUrl: string | null;
  progress: number | null;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [updating, setUpdating] = useState(false);
  const [progressInput, setProgressInput] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Fetched course:", data);
      setCourse(data);
      setProgressInput(data.progress ?? 0);
    };
    fetchCourse();
  }, [id]);

  const handleProgressUpdate = async () => {
    if (progressInput == null || progressInput < 0 || progressInput > 100)
      return;
    setUpdating(true);
    await fetch(`http://localhost:5003/api/enrollments/${id}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ progress: progressInput }),
    });
    await fetchCourse(); // Refetch course detail after update
    setUpdating(false);
  };

  const fetchCourse = async () => {
    const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    setCourse(data);
    setProgressInput(data.progress ?? 0);
  };

  if (!course) {
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
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
            <div className="flex items-center gap-2 mt-2">
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
          {/* Continue Button */}
          <Button className="w-full mb-4" size="lg" variant="default">
            ▶️ Continue Course
          </Button>

          {/* PDFs Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              📄 Course PDFs
            </h2>
            {course.pdfs.length === 0 ? (
              <p className="text-gray-500">No PDFs uploaded.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {course.pdfs.map((pdfUrl, i) => (
                  <li key={i}>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View / Download PDF {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Playlist Section (optional) */}
          {course.playlistUrl && (
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                🎥 Course Playlist
              </h2>
              <iframe
                width="100%"
                height="400"
                src={course.playlistUrl}
                title="Course Playlist"
                frameBorder="0"
                allowFullScreen
                className="rounded-md border"
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
