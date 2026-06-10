import { Tool } from "./data";

// TODO: define ToolCardProps
// - tool: Tool
// - onDismiss: a callback that takes no arguments and returns nothing

export function ToolCard({ tool, onDismiss }: { tool: Tool; onDismiss: () => void }) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <span> — {tool.owner}</span>
      {/* TODO: wire onDismiss to the button's onClick */}
      <button>Dismiss</button>
    </div>
  );
}
