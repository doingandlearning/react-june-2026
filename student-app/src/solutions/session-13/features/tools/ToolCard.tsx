import { Link } from "react-router-dom";
import { Card, CardContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Tool } from "../../mock-api";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
  onDismiss?: () => void;
}

// Task 2 + Task 4 (module-13 lab.md): Dismiss button -> IconButton, outer
// container -> Card/CardContent. The badge span keeps its CSS Modules
// classes untouched — MUI and CSS Modules rendering side by side.
export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <strong className={styles.name}>
          <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
        </strong>
        <span> — {tool.owner}</span>
        <span className={`${styles.badge} ${styles[tool.status]}`}>
          {tool.status}
        </span>
        {onDismiss && (
          <IconButton onClick={onDismiss} aria-label={`Dismiss ${tool.name}`} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
}
