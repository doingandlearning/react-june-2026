import type { Tool } from "../mock-api";
import { ToolCard } from "./ToolCard";

interface ToolListProps {
  tools: Tool[];
  onDismiss?: (id: string) => void;
}

export function ToolList({ tools, onDismiss }: ToolListProps) {
  if (tools.length === 0) {
    return <p>No tools to display.</p>;
  }

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          <ToolCard
            tool={tool}
            onDismiss={onDismiss ? () => onDismiss(tool.id) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
