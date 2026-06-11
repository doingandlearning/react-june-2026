import type { Tool } from "./data";
import { ToolCard } from "./ToolCard";

// ToolList now receives already-filtered tools from the parent.
// It no longer owns state — the parent controls what's visible.

interface ToolListProps {
  tools: Tool[];
  onDismiss: (id: string) => void;
}

export function ToolList({ tools, onDismiss }: ToolListProps) {
  if (tools.length === 0) {
    return <p>No tools match your search.</p>;
  }

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          <ToolCard tool={tool} onDismiss={() => onDismiss(tool.id)} />
        </li>
      ))}
    </ul>
  );
}
