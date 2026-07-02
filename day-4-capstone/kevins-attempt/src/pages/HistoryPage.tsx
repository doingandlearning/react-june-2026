import { Link as RouterLink } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFeedback } from "../context/useFeedback";

export function HistoryPage() {
  const { submissions } = useFeedback();

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Submission history
      </Typography>

      {submissions.length === 0 ? (
        <Typography>No feedback submitted yet.</Typography>
      ) : (
        <List>
          {submissions.map((submission) => (
            <ListItemButton
              key={submission.id}
              component={RouterLink}
              to={`/history/${submission.id}`}
            >
              <ListItemText
                primary={
                  <Rating value={submission.rating} readOnly size="small" />
                }
                secondary={submission.comment || "(no comment)"}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Stack>
  );
}
