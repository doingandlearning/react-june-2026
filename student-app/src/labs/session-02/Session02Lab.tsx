import { useState } from "react";
import { tools } from "./data";
import { Panel } from "./Panel";
import { ToolList } from "./ToolList";

export function Session02Lab() {
  const [visibleTools, setVisibleTools] = useState(tools);

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  return (
    <Panel title="Internal Tools">
      {/* TODO: render ToolList, passing visibleTools and handleDismiss */}
    </Panel>
  );
}
