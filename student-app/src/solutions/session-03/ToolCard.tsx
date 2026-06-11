import { Tool } from "./data";

interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
}

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <span> — {tool.owner}</span>
      <button onClick={onDismiss} aria-label={`Dismiss ${tool.name}`}>
        Dismiss
      </button>
    </div>
  );
}
