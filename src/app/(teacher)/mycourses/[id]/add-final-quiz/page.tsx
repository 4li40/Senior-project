"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NewQuestion {
  question_text: string;
  options: string[];
  correct_option: string;
}

export default function AddFinalQuizPage() {
  const { id } = useParams<{ id: string }>(); // ✅ Grab 'id' from [id] route
  const router = useRouter();

  const [questions, setQuestions] = useState<NewQuestion[]>([
    { question_text: "", options: ["", "", "", ""], correct_option: "" },
  ]);

  const update = (index: number, updater: (q: NewQuestion) => void) => {
    setQuestions((prev) => {
      const copy = [...prev];
      updater(copy[index]);
      return copy;
    });
  };

  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { question_text: "", options: ["", "", "", ""], correct_option: "" },
    ]);

  const submit = async () => {
    const valid = questions.every(
      (q) =>
        q.question_text.trim() &&
        q.options.every((o) => o.trim()) &&
        q.options.includes(q.correct_option)
    );

    if (!valid) {
      alert(
        "Please fill all fields and ensure the correct answer matches one of the options."
      );
      return;
    }

    const numericCourseId = parseInt(id as string); // ✅ Safely parse courseId

    console.log("SUBMITTING TO BACKEND:", {
      course_id: numericCourseId,
      questions,
    });

    try {
      const res = await fetch(
        "http://localhost:5003/api/final-quiz/tutor/add-final-questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            course_id: numericCourseId,
            questions,
          }),
        }
      );

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Unknown error");
      }

      alert("Final quiz questions saved successfully!");
      router.push(`/mycourses/${id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit final quiz.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Final Quiz Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="border p-4 bg-gray-50 rounded-md space-y-4"
            >
              <Label>Question {qi + 1}</Label>
              <Textarea
                placeholder="Enter question text"
                value={q.question_text}
                onChange={(e) =>
                  update(qi, (q) => (q.question_text = e.target.value))
                }
              />

              {q.options.map((opt, oi) => (
                <div key={oi}>
                  <Label>Option {oi + 1}</Label>
                  <Input
                    value={opt}
                    onChange={(e) =>
                      update(qi, (q) => (q.options[oi] = e.target.value))
                    }
                    placeholder={`Option ${oi + 1}`}
                  />
                </div>
              ))}

              <Label>Correct Answer</Label>
              <Input
                value={q.correct_option}
                onChange={(e) =>
                  update(qi, (q) => (q.correct_option = e.target.value))
                }
                placeholder="Must match one of the options above"
              />
            </div>
          ))}

          <div className="flex justify-between">
            <Button onClick={addQuestion} variant="secondary">
              ➕ Add Another Question
            </Button>
            <Button className="bg-green-600 text-white" onClick={submit}>
              ✅ Submit Final Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
