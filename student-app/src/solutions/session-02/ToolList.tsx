import type { Tool } from "./data";
import { ToolCard } from "./ToolCard";

interface ToolListProps {
  tools: Tool[];
  onDismiss: (id: string) => void;
}

export function ToolList({ tools, onDismiss }: ToolListProps) {
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
