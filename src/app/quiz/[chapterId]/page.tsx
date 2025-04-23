"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/*************************************************
 * TYPES
 *************************************************/
interface Question {
  id: number;
  question_text: string;
  options: string[];
}

interface Answer {
  questionId: number;
  selectedOption: string;
}

interface QuizStatusResponse {
  submitted: boolean;
  passed?: boolean;
  score?: number;
  attempt?: number;
  retryAvailable?: boolean;
  correctAnswers?: Record<number, string>; //  ⬅ backend now sends this
}

/*************************************************
 * COMPONENT
 *************************************************/
export default function TakeQuizPage() {
  /************** URL params & router ***********/
  const { chapterId } = useParams();
  const parsedChapterId = Array.isArray(chapterId)
    ? parseInt(chapterId[0])
    : parseInt(chapterId || "");

  const router = useRouter();

  /************** State **************************/
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswersMap, setCorrectAnswersMap] = useState<
    Record<number, string>
  >({});
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);

  const MAX_ATTEMPTS = 2; // keep in sync with backend

  /*************************************************
   * INITIAL LOAD – fetch questions & status
   *************************************************/
  useEffect(() => {
    if (!chapterId || isNaN(parsedChapterId)) return;

    /** fetch all questions **/
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `http://localhost:5003/api/quiz/${parsedChapterId}/questions`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid quiz data");

        setQuestions(data);
        // initialise blank answers
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

    /** check previous attempts & pull correct answers if needed **/
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:5003/api/quiz/${parsedChapterId}/status`,
          { credentials: "include" }
        );
        if (!res.ok) return; // first attempt – nothing to do
        const result: QuizStatusResponse = await res.json();

        if (result.submitted) {
          setSubmitted(true);
          setScore(result.score ?? null);
          setRetryAvailable(Boolean(result.retryAvailable));
          setViewOnly(result.passed || (result.attempt ?? 0) >= MAX_ATTEMPTS);
          if (result.correctAnswers)
            setCorrectAnswersMap(result.correctAnswers);
        }
      } catch (err) {
        console.error("Failed to check quiz status", err);
      }
    };

    fetchQuiz();
    checkStatus();
  }, [chapterId]);

  /*************************************************
   * Helpers
   *************************************************/
  const handleOptionChange = (questionId: number, selected: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedOption: selected } : a
      )
    );
  };

  const resetStateForRetry = () => {
    setAnswers(
      questions.map((q) => ({ questionId: q.id, selectedOption: "" }))
    );
    setSubmitted(false);
    setScore(null);
    setCorrectAnswersMap({});
  };

  /*************************************************
   * SUBMIT HANDLER
   *************************************************/
  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5003/api/quiz/${parsedChapterId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ answers }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      // map correct answers returned from backend
      const m: Record<number, string> = {};
      (data.evaluation || []).forEach((e: any) => {
        m[e.questionId] = e.correctOption;
      });
      // fallback if backend sends correctAnswers map
      Object.assign(m, data.correctAnswers);

      setCorrectAnswersMap(m);
      setScore(data.score);
      setSubmitted(true);
      setRetryAvailable(Boolean(data.retryAvailable));
      setViewOnly(true);
    } catch (err) {
      console.error("❌ Error submitting quiz", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  /*************************************************
   * RENDER
   *************************************************/
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
              const correct = correctAnswersMap[q.id];

              return (
                <div
                  key={q.id}
                  className="p-4 border rounded-md bg-gray-50 space-y-4"
                >
                  <h2 className="font-semibold">
                    Q{index + 1}: {q.question_text}
                  </h2>

                  {/* options */}
                  <RadioGroup
                    value={userAnswer || ""}
                    onValueChange={(val) => handleOptionChange(q.id, val)}
                    disabled={viewOnly}
                  >
                    {q.options.map((opt, idx) => {
                      const isSelected = userAnswer === opt;
                      const isCorrect = correct === opt;
                      const showCorrect = submitted && isCorrect;
                      const showWrong = submitted && isSelected && !isCorrect;

                      return (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={opt}
                            id={`${q.id}-opt-${idx}`}
                          />
                          <Label
                            htmlFor={`${q.id}-opt-${idx}`}
                            className={`text-gray-700 ${
                              showCorrect
                                ? "text-green-600 font-semibold"
                                : showWrong
                                ? "text-red-600 font-semibold"
                                : ""
                            }`}
                          >
                            {opt} {showCorrect && "✅"} {showWrong && "❌"}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {/* show the correct answer explicitly under each question */}
                  {submitted && (
                    <p className="text-sm text-green-600">
                      Correct Answer:{" "}
                      <span className="font-medium">{correct}</span>
                    </p>
                  )}
                </div>
              );
            })
          )}

          {/* score banner */}
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

          {/* need‑a‑refresher banner (optional hard‑coded link) */}
          {submitted && !retryAvailable && score! < 60 && (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
              Need a refresher? &nbsp;
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="underline font-medium"
              >
                Review previous chapters
              </a>{" "}
              before continuing.
            </div>
          )}

          {/* action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/MyCourses")}
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
              <Button variant="outline" onClick={resetStateForRetry}>
                🔁 Retry Quiz
              </Button>
            )}

            {submitted && (!retryAvailable || viewOnly) && (
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
