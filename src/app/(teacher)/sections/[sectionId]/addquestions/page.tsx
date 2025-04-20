"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import AddQuestionForm from "@/components/AddQuestionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddQuizQuestionPage() {
  const { sectionId } = useParams(); // Dynamic route param
  const searchParams = useSearchParams();
  const courseId = Number(searchParams.get("courseId"));
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">
        ➕ Add Quiz Question for Chapter {sectionId}
      </h1>
      <AddQuestionForm chapterId={Number(sectionId)} courseId={courseId} />
    </div>
  );
}
