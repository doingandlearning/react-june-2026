import { useState } from "react";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";
import { useTools } from "./hooks/useTools";

export function Session05Lab() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // TODO Task 2 — replace these with your useTools hook
  const { tools, loading, error } = useTools();

  const filteredTools = tools
    .filter((t) => !dismissed.includes(t.id))
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  function handleDismiss(id: string) {
    // TODO Task 4 — update dismissed list instead of filtering the hook's data
    setDismissed([...dismissed, id]);
  }

  // TODO Task 3 — handle loading and error states before the main return
  if (loading) return <Panel title="Internal Tools"><p>Loading tools…</p></Panel>;
  if (error) return <Panel title="Internal Tools"><p role="alert">Failed to load: {error}</p></Panel>;

  return (
    <Panel title="Internal Tools">
      {/* TODO Task 5 — render ResultCount */}
      {/* TODO Task 5 — render FilterBar */}
      <ToolList tools={filteredTools} onDismiss={handleDismiss} />
    </Panel>
  );
}
