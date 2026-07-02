import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FeedbackForm } from "../components/FeedbackForm";
import { useFeedback } from "../context/useFeedback";

export function HomePage() {
  const { addFeedback } = useFeedback();

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Share your feedback
      </Typography>
      <FeedbackForm onSubmit={addFeedback} />
    </Stack>
  );
}
