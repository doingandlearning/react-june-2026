import type { Tool } from "./data";

interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
}

export function ToolCard({ tool, onDismiss }: ToolCardProps) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <span> — {tool.owner}</span>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
