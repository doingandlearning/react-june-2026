import { useState } from "react";
import { Link } from "react-router-dom";
import { useTools } from "./useTools";
import { useDismissed } from "./useDismissed";
import { ToolList } from "./ToolList";
import { FilterBar } from "./FilterBar";
import { ResultCount } from "./ResultCount";
import { Panel } from "../../shared/Panel";

export function ToolListPage() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const dismissed = useDismissed((s) => s.dismissed);
  const dismiss = useDismissed((s) => s.dismiss);

  const { data: tools = [], isLoading, error } = useTools();

  const filteredTools = tools
    .filter((t) => !dismissed.includes(t.id))
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  if (isLoading) return <Panel title="Internal Tools"><p>Loading tools…</p></Panel>;
  if (error)      return <Panel title="Internal Tools"><p role="alert">{error.message}</p></Panel>;

  return (
    <Panel title="Internal Tools">
      <Link to="/tools/add">+ Add tool</Link>
      <ResultCount count={filteredTools.length} total={tools.length} />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        showDeprecated={showDeprecated}
        onShowDeprecatedChange={setShowDeprecated}
      />
      <ToolList
        tools={filteredTools}
        onDismiss={(id) => dismiss(id)}
      />
    </Panel>
  );
}
