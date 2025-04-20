"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certificate {
  certificate_id: number;
  course_title: string;
  issued_at: string;
  first_name: string;
  last_name: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const certRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch("http://localhost:5003/api/certificates", {
          credentials: "include",
        });
        const data = await res.json();
        setCertificates(data);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  const handleDownload = async (index: number, title: string) => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = certRefs.current[index];
    if (!element) return;

    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: `${title}_certificate.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      })
      .save();
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 🔙 Back Button */}
      <Button variant="outline" onClick={() => router.push("/MyCourses")}>
        ← Back
      </Button>

      <h1 className="text-2xl font-bold mb-4">🎓 Your Certificates</h1>

      {certificates.length === 0 ? (
        <p className="text-gray-600">No certificates yet.</p>
      ) : (
        certificates.map((cert, idx) => (
          <Card key={cert.certificate_id}>
            <CardHeader>
              <CardTitle>{cert.course_title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Certificate Preview */}
              <div
                ref={(el) => {
                  certRefs.current[idx] = el;
                }}
                className="bg-white p-6 rounded-lg shadow-md w-full text-center border"
              >
                <h2 className="text-2xl font-bold mb-2">
                  🎓 Certificate of Completion
                </h2>
                <p>
                  This certifies that{" "}
                  <strong>
                    {cert.first_name} {cert.last_name}
                  </strong>{" "}
                  has successfully completed the course{" "}
                  <strong>{cert.course_title}</strong>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Issued on: {new Date(cert.issued_at).toLocaleDateString()}
                </p>
              </div>

              <Button
                variant="default"
                onClick={() => handleDownload(idx, cert.course_title)}
              >
                📄 Download Certificate
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
