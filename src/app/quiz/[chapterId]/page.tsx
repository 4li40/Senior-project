"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StudentNavBar from "@/components/StudentNavBar";

interface Question {
  id: number;
  question_text: string;
  options: string[];
}

interface Answer {
  questionId: number;
  selectedOption: string;
}

export default function TakeQuizPage() {
  const { chapterId } = useParams();
  const parsedChapterId = Array.isArray(chapterId)
    ? parseInt(chapterId[0])
    : parseInt(chapterId || "");

  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswersMap, setCorrectAnswersMap] = useState<
    Record<number, string>
  >({});
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!chapterId || isNaN(parsedChapterId)) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `http://localhost:5003/api/quiz/${parsedChapterId}/questions`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid quiz data");

        setQuestions(data);
        setAnswers(
          data.map((q: Question) => ({
            questionId: q.id,
            selectedOption: "",
          }))
        );
      } catch (err) {
        console.error("Failed to load quiz questions", err);
      }
    };

    const checkAttempts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5003/api/quiz/${parsedChapterId}/status`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const result = await res.json();

        if (result.submitted) {
          setSubmitted(true);
          setScore(result.score);
          setRetryAvailable(result.retryAvailable);
          setViewOnly(result.passed || !result.retryAvailable); // 💡 lock if passed or retries used
        }
      } catch (err) {
        console.error("Failed to check quiz submission status", err);
      }
    };

    fetchQuiz();
    checkAttempts();
  }, [chapterId]);

  const handleOptionChange = (questionId: number, selected: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedOption: selected } : a
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5003/api/quiz/${chapterId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      const answerMap: Record<number, string> = {};
      data.evaluation?.forEach((e: any) => {
        answerMap[e.questionId] = e.correctOption;
      });

      setCorrectAnswersMap(answerMap);
      setScore(data.score);
      setSubmitted(true);
      setRetryAvailable(data.retryAvailable ?? false);
      setViewOnly(true); // ✅ Lock after submission
    } catch (err) {
      console.error("❌ Error submitting quiz", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">📝 Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.length === 0 ? (
            <p className="text-gray-500">No quiz questions available.</p>
          ) : (
            questions.map((q, index) => {
              const userAnswer = answers.find(
                (a) => a.questionId === q.id
              )?.selectedOption;
              const isCorrect = userAnswer === correctAnswersMap[q.id];

              return (
                <div
                  key={q.id}
                  className="p-4 border rounded-md bg-gray-50 space-y-4"
                >
                  <h2 className="font-semibold">
                    Q{index + 1}: {q.question_text}
                  </h2>

                  <RadioGroup
                    value={userAnswer || ""}
                    onValueChange={(value) => handleOptionChange(q.id, value)}
                    disabled={viewOnly}
                  >
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`${q.id}-opt-${idx}`} />
                        <Label
                          htmlFor={`${q.id}-opt-${idx}`}
                          className={
                            submitted
                              ? userAnswer === opt
                                ? isCorrect
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                                : correctAnswersMap[q.id] === opt
                                ? "text-green-600"
                                : "text-gray-700"
                              : "text-gray-700"
                          }
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );
            })
          )}

          {submitted && score !== null && (
            <div className="text-lg font-medium text-center">
              Score: <span className="text-blue-600">{score.toFixed(2)}%</span>
              {score >= 60 ? (
                <span className="text-green-600 ml-2">✅ Passed</span>
              ) : (
                <span className="text-red-600 ml-2">❌ Failed</span>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push(`/student-dashboard`)}
            >
              ← Back to Course Sections
            </Button>

            {!viewOnly && !submitted && (
              <Button
                onClick={handleSubmit}
                disabled={answers.some((a) => !a.selectedOption)}
              >
                Submit Quiz
              </Button>
            )}
            {submitted && retryAvailable && !viewOnly && (
              <Button
                variant="outline"
                onClick={() => {
                  setAnswers(
                    questions.map((q) => ({
                      questionId: q.id,
                      selectedOption: "",
                    }))
                  );
                  setSubmitted(false);
                  setScore(null);
                  setCorrectAnswersMap({});
                }}
              >
                🔁 Retry Quiz
              </Button>
            )}
            {submitted && !retryAvailable && (
              <Button variant="ghost" disabled>
                Retry Limit Reached
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
