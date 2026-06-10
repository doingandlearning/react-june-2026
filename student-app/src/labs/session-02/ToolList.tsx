import { Tool } from "./data";
import { ToolCard } from "./ToolCard";

interface ToolListProps {
  tools: Tool[];
  // TODO: add an onDismiss prop — receives the dismissed tool's id as a string
}

export function ToolList({ tools }: ToolListProps) {
  return (
    <ul>
      {tools.map((tool) => (
        // TODO: add the key prop
        // TODO: pass onDismiss to ToolCard, calling it with tool.id
        <li>
          <ToolCard tool={tool} onDismiss={() => {}} />
        </li>
      ))}
    </ul>
  );
}
