"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PDFViewer from "@/components/PDFViewer";

export default function StudentPDFViewerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileId = params.fileId as string;
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchPDFDetails = async () => {
      try {
        // Fetch the course details to get the PDF name
        const courseRes = await fetch(
          `http://localhost:5003/api/courses/${id}`,
          {
            credentials: "include",
          }
        );

        if (!courseRes.ok) {
          throw new Error("Failed to load course details");
        }

        const courseData = await courseRes.json();

        // Find the file with the matching fileId
        let foundFile = null;

        // Search through all sections
        for (const section of courseData.sections || []) {
          for (const file of section.files || []) {
            if (file.id.toString() === fileId.toString()) {
              foundFile = file;
              break;
            }
          }
          if (foundFile) break;
        }

        if (!foundFile) {
          throw new Error(`PDF file not found with ID: ${fileId}`);
        }

        setPdfTitle(foundFile.name);
        setPdfUrl(foundFile.url);
      } catch (err) {
        console.error("Error fetching PDF details:", err);
      }
    };

    fetchPDFDetails();
  }, [id, fileId]);

  return (
    <PDFViewer
      pdfUrl={pdfUrl}
      title={pdfTitle}
      onBack={() => router.push(`/MyCourses/${id}`)}
    />
  );
} 