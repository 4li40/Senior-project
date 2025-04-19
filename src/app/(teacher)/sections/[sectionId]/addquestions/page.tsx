"use client";

import { useParams, useSearchParams } from "next/navigation";
import AddQuestionForm from "@/components/AddQuestionForm";

export default function AddQuizQuestionPage() {
  const { sectionId } = useParams(); // Dynamic route param
  const searchParams = useSearchParams();
  const courseId = Number(searchParams.get("courseId"));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        ➕ Add Quiz Question for Chapter {sectionId}
      </h1>
      <AddQuestionForm
        chapterId={Number(sectionId)}
        courseId={courseId}
      />
    </div>
  );
}
