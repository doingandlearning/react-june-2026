import { createContext } from "react";

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface FeedbackContextValue {
  submissions: Feedback[];
  addFeedback: (rating: number, comment: string) => void;
}

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined,
);
