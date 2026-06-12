// Session 3 — State and Interactivity
// Demo script: module-03-state-and-interactivity/demo.md
//
// Beats:
//   1 (~3 min)  Broken counter — local var vs useState
//   2 (~3 min)  Mutation trap: arrays — push() vs spread
//   3 (~4 min)  Controlled input — uncontrolled first, then value+onChange
//   4 (~2 min)  Form submit + preventDefault
//   5 (~3 min)  Multiple state values — ToolDirectory with query + showDeprecated
//   6 (~2 min)  Mutation trap: objects — spread fix
//
// Write everything below the beat markers during the demo.

import { useState } from "react";
import { tools, type Tool } from "./data";

function TagList() {
  const [tags, setTags] = useState(["platform", "sre"]);

  function addTag() {
    // tags.push("finance"); // do this deliberately wrong
    setTags([...tags, "finance"]);    // log it so they can see it's "working"
  }

  return (
    <div>
      <ul>
        {tags.map((tag, i) => <li key={i}>{tag}</li>)}
      </ul>
      <button onClick={addTag}>Add tag</button>
      <input placeholder="Search" type="" />
    </div>
  );
}


// ─── Beat 1 — start here ─────────────────────────────────────────────────────
// Write Counter with let count = 0 first (broken), then fix with useState

// ─── Beat 2 ──────────────────────────────────────────────────────────────────
// Write TagList — tags.push() first (broken), then spread fix

// ─── Beat 3 ──────────────────────────────────────────────────────────────────
// Write SearchBox — uncontrolled first, then value+onChange controlled version

// ─── Beat 4 ──────────────────────────────────────────────────────────────────
// Wrap SearchBox in <form>, show page refresh bug, add handleSubmit + preventDefault

// ─── Beat 5 ──────────────────────────────────────────────────────────────────
// Write ToolDirectory with [query, setQuery] and [showDeprecated, setShowDeprecated]
// Derive visible with two .filter() calls — no extra useState for derived values

// ─── Beat 6 ──────────────────────────────────────────────────────────────────
// Write UserProfile — user.role = "lead" (broken), then spread fix

export function Session03Teaching() {
  return <TagList />
}
