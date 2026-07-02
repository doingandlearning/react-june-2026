import { useMemo, useRef, useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  CONFIRMATION_MESSAGES,
  RATING_EMOJI,
  RATING_ERROR_ID,
  celebrate,
} from "./feedbackFormContent";

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(-1);
  const [comment, setComment] = useState("");
  const [showRatingError, setShowRatingError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const confirmationMessage = useRef(CONFIRMATION_MESSAGES[0]);

  const displayedRating = hoverRating !== -1 ? hoverRating : (rating ?? 0);
  const emoji = useMemo(() => RATING_EMOJI[displayedRating], [displayedRating]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!rating) {
      setShowRatingError(true);
      return;
    }

    setShowRatingError(false);
    onSubmit(rating, comment);
    confirmationMessage.current =
      CONFIRMATION_MESSAGES[
        Math.floor(Math.random() * CONFIRMATION_MESSAGES.length)
      ];
    celebrate();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Alert severity="success">{confirmationMessage.current}</Alert>
        <Link component={RouterLink} to="/history">
          View submission history
        </Link>
      </Stack>
    );
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      sx={{ maxWidth: 420 }}
      noValidate
    >
      <FormControl component="fieldset" error={showRatingError} variant="standard">
        <FormLabel component="legend">Rating</FormLabel>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Rating
            name="feedback-rating"
            value={rating}
            onChange={(_event, newValue) => setRating(newValue)}
            onChangeActive={(_event, newHover) => setHoverRating(newHover)}
            aria-describedby={showRatingError ? RATING_ERROR_ID : undefined}
          />
          <Box
            aria-hidden="true"
            sx={{
              fontSize: "1.5rem",
              lineHeight: 1,
              opacity: emoji ? 1 : 0,
              transform: emoji ? "scale(1)" : "scale(0.6)",
              transition: "opacity 150ms ease, transform 150ms ease",
            }}
          >
            {emoji ?? "🙂"}
          </Box>
        </Stack>
        {showRatingError && (
          <Alert id={RATING_ERROR_ID} severity="error" sx={{ mt: 1 }}>
            Please select a star rating before submitting.
          </Alert>
        )}
      </FormControl>

      <TextField
        label="Comment"
        multiline
        minRows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />

      <Button type="submit" variant="contained">
        Submit feedback
      </Button>
    </Stack>
  );
}
