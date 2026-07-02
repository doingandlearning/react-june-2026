import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const RATING_ERROR_ID = "rating-error";

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => void;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [showRatingError, setShowRatingError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!rating) {
      setShowRatingError(true);
      return;
    }

    setShowRatingError(false);
    onSubmit(rating, comment);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Alert severity="success">Thanks for your feedback!</Alert>
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
        <Rating
          name="feedback-rating"
          value={rating}
          onChange={(_event, newValue) => setRating(newValue)}
          aria-describedby={showRatingError ? RATING_ERROR_ID : undefined}
        />
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
