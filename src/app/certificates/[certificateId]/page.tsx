// /app/certificates/[certificateId]/preview.tsx

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CertificatePreview() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    async function fetchCertificate() {
      const res = await fetch(`/api/certificates/${certificateId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setCertificate(data);
    }
    fetchCertificate();
  }, [certificateId]);

  if (!certificate) return <p>Loading...</p>;

  return (
    <div className="p-10 bg-white text-center border border-gray-300 rounded-xl shadow-lg w-[800px] mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-4">🎓 Certificate of Completion</h1>
      <p className="text-lg">
        This is to certify that <strong>{certificate.studentName}</strong> has
        successfully completed the course{" "}
        <strong>{certificate.courseTitle}</strong>
        on{" "}
        <strong>{new Date(certificate.issuedAt).toLocaleDateString()}</strong>.
      </p>
      <p className="mt-10 text-gray-500">
        Study Buddy • Certificate ID: {certificateId}
      </p>
    </div>
  );
}
