import { useState, type ReactNode } from "react";
import { FeedbackContext, type Feedback } from "./feedbackStore";

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Feedback[]>([]);

  function addFeedback(rating: number, comment: string) {
    const feedback: Feedback = {
      id: crypto.randomUUID(),
      rating,
      comment,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((current) => [feedback, ...current]);
  }

  return (
    <FeedbackContext.Provider value={{ submissions, addFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}
