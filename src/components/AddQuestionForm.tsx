"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

interface AddQuestionFormProps {
  chapterId: number;
  courseId: number;
}

interface QuestionData {
  question_text: string;
  options: string[];
  correct_option_index: string;
}

export default function AddQuestionForm({
  chapterId,
  courseId,
}: AddQuestionFormProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      question_text: "",
      options: ["", "", "", ""],
      correct_option_index: "0",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updated = [...questions];
    if (field === "question_text") updated[index].question_text = value;
    else if (field === "correct_option_index") updated[index].correct_option_index = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: ["", "", "", ""],
        correct_option_index: "0",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const isValidOption = (value: string) =>
    /^[a-zA-Z0-9\s]+$/.test(value.trim()) && value.trim().length > 0;

  const validateBeforeSubmit = (): boolean => {
    for (const q of questions) {
      if (!q.question_text.trim()) return false;
      if (q.options.some((opt) => !isValidOption(opt))) return false;
      if (!isValidOption(q.options[parseInt(q.correct_option_index)])) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) {
      alert("🚫 All fields must be filled and options must be valid text/numbers.");
      return;
    }

    setLoading(true);
    try {
      for (const q of questions) {
        const res = await fetch("http://localhost:5003/api/quiz/tutor/add-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            course_id: courseId,
            chapter_id: chapterId,
            question_text: q.question_text,
            options: q.options,
            correct_option: q.options[parseInt(q.correct_option_index)],
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Submission failed");
        }
      }

      alert("✅ All questions submitted successfully!");
      router.back();
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      alert(err.message || "Failed to submit questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <CardTitle>➕ Add Multiple Quiz Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded-md bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg">Question {qIndex + 1}</Label>
              {questions.length > 1 && (
                <Button variant="destructive" size="sm" onClick={() => removeQuestion(qIndex)}>
                  Remove
                </Button>
              )}
            </div>

            <Input
              placeholder="Enter question text"
              value={q.question_text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "question_text", e.target.value)
              }
            />

            <div className="space-y-2">
              <Label>Options</Label>
              {q.options.map((opt, optIndex) => (
                <Input
                  key={optIndex}
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                />
              ))}
            </div>

            <div>
              <Label>Correct Option</Label>
              <RadioGroup
                value={q.correct_option_index}
                onValueChange={(val) => handleQuestionChange(qIndex, "correct_option_index", val)}
              >
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={optIndex.toString()} id={`q-${qIndex}-opt-${optIndex}`} />
                    <Label htmlFor={`q-${qIndex}-opt-${optIndex}`}>
                      {opt || `Option ${optIndex + 1}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion}>
          ➕ Add Another Question
        </Button>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit All"}
        </Button>
      </CardContent>
    </Card>
  );
}
