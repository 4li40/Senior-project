"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  tutor: string;
  pdfs: string[];
  playlistUrl: string | null;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`http://localhost:5003/api/courses/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Fetched course:", data);
      setCourse(data);
    };
    fetchCourse();
  }, [id]);

  if (!course) {
    return <p className="text-center mt-10 text-gray-600">Loading course...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-blue-700">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        <div className="text-sm text-gray-500">
          Instructor: <span className="font-medium">{course.tutor}</span> |
          Category: <span className="capitalize">{course.category}</span> |
          Price: ${parseFloat(course.price).toFixed(2)}
        </div>
      </div>

      {/* PDFs Section */}
      <Card>
        <CardHeader>
          <CardTitle>📄 Course PDFs</CardTitle>
        </CardHeader>
        <CardContent>
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
                    className="text-blue-600 underline"
                  >
                    View / Download PDF {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Playlist Section (optional) */}
      {course.playlistUrl && (
        <Card>
          <CardHeader>
            <CardTitle>🎥 Course Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              width="100%"
              height="400"
              src={course.playlistUrl}
              title="Course Playlist"
              frameBorder="0"
              allowFullScreen
              className="rounded-md"
            ></iframe>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
