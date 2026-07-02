import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFeedback } from "../context/useFeedback";

export function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { submissions } = useFeedback();
  const submission = submissions.find((item) => item.id === id);

  // Entry doesn't exist (bad id, or state reset on refresh) — bounce back
  // to the list rather than showing a broken page.
  if (!submission) {
    return <Navigate to="/history" replace />;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Feedback entry
      </Typography>
      <Rating value={submission.rating} readOnly />
      <Typography>{submission.comment || "(no comment)"}</Typography>
      <Typography variant="caption" color="text.secondary">
        Submitted {new Date(submission.submittedAt).toLocaleString()}
      </Typography>
      <Link component={RouterLink} to="/history">
        Back to history
      </Link>
    </Stack>
  );
}
