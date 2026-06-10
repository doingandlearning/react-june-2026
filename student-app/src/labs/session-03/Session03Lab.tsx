import { useState } from "react";
import { tools } from "./data";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";

export function Session03Lab() {
  // TODO: add state for the search query (string, starts empty)
  // TODO: add state for showing deprecated tools (boolean, starts false)

  const [visibleTools, setVisibleTools] = useState(tools);

  // TODO: derive visible tools from query and showDeprecated
  // Filter by name (case-insensitive) then by status
  const visible = visibleTools;

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    // TODO: prevent default form submission
    // TODO: log the current query to the console
  }

  return (
    <Panel title="Internal Tools">
      <form onSubmit={handleSubmit}>
        {/* TODO: controlled text input for search query (with label) */}
        {/* TODO: labelled checkbox for showDeprecated */}
        <button type="submit">Search</button>
      </form>
      {/* TODO: result count — "Showing X of 6 tools" */}
      {/* TODO: render ToolList with visible tools and handleDismiss */}
    </Panel>
  );
}
