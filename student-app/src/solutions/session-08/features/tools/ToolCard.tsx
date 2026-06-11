import { Link } from "react-router-dom";
import { Tool } from "../../mock-api";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
  tool: Tool;
  onDismiss?: () => void;
}

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div className={styles.card}>
      <strong className={styles.name}>
        <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
      </strong>
      <span> — {tool.owner}</span>
      <span className={`${styles.badge} ${styles[tool.status]}`}>
        {tool.status}
      </span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
          Dismiss
        </button>
      )}
    </div>
  );
}
