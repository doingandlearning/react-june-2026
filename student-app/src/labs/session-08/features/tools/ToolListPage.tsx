import { useState } from "react";
import { useTools } from "../hooks/useTools";
import { ToolList } from "../components/ToolList";
import { FilterBar } from "../components/FilterBar";
import { ResultCount } from "../components/ResultCount";
import { Panel } from "../components/Panel";

// TODO Task 2 — replace placeholder Link with a real <Link to={...}> for each tool name

export function ToolListPage() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const { tools, loading, error } = useTools();

  const filteredTools = tools
    .filter((t) => !dismissed.includes(t.id))
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  if (loading) return <Panel title="Internal Tools"><p>Loading tools…</p></Panel>;
  if (error)   return <Panel title="Internal Tools"><p role="alert">{error}</p></Panel>;

  return (
    <Panel title="Internal Tools">
      <ResultCount count={filteredTools.length} total={tools.length} />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        showDeprecated={showDeprecated}
        onShowDeprecatedChange={setShowDeprecated}
      />
      {/* TODO Task 2 — update ToolList/ToolCard so tool names link to /tools/:id */}
      <ToolList
        tools={filteredTools}
        onDismiss={(id) => setDismissed([...dismissed, id])}
      />
    </Panel>
  );
}
