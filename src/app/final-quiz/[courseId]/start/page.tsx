"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizQuestion {
  id: number;
  question_text: string;
  options: string[];
}

export default function FinalQuizPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<
    { questionId: number; selectedOption: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch quiz questions
  useEffect(() => {
    async function fetchFinalQuiz() {
      try {
        const res = await fetch(
          `http://localhost:5003/api/final-quiz/${courseId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("📦 Final Quiz Response:", data);

        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch final quiz:", err);
        setError("Could not load final quiz.");
      } finally {
        setLoading(false);
      }
    }

    fetchFinalQuiz();
  }, [courseId]);

  // ✅ Track selected answers
  const handleOptionChange = (questionId: number, selected: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((a) => a.questionId === questionId);
      if (idx !== -1) {
        updated[idx].selectedOption = selected;
      } else {
        updated.push({ questionId, selectedOption: selected });
      }
      return updated;
    });
  };

  // ✅ Submit handler
  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5003/api/final-quiz/${courseId}/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();
      if (data.passed) {
        alert("✅ Quiz passed! Certificate awarded.");
        router.push("/MyCourses");
      } else {
        alert(`❌ You failed the quiz. Score: ${data.score.toFixed(2)}%`);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Something went wrong while submitting the quiz.");
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading final quiz...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">🎓 Final Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <p className="text-gray-500 italic">No questions available.</p>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="mb-6">
                <h4 className="font-semibold mb-2">
                  {index + 1}. {q.question_text}
                </h4>
                <RadioGroup
                  onValueChange={(value) => handleOptionChange(q.id, value)}
                >
                  {q.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${q.id}-${idx}`} />
                      <Label htmlFor={`${q.id}-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))
          )}

          {questions.length > 0 && (
            <Button onClick={handleSubmit} className="mt-4">
              Submit Quiz
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
