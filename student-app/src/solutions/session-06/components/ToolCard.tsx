import { Link } from "react-router-dom";
import { Tool } from "../mock-api";

interface ToolCardProps {
  tool: Tool;
  onDismiss?: () => void;
}

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div>
      <strong>
        <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
      </strong>
      <span> — {tool.owner}</span>
      <span> [{tool.status}]</span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
          Dismiss
        </button>
      )}
    </div>
  );
}
