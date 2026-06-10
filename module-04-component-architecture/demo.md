# Session 4 — Live Coding Demo Script

## Before you start

- `src/teaching/session-4.tsx` — write everything here
- Copy the `tools` data import from Session 3
- Browser open, Vite running
- Have Session 3's `ToolDirectory` visible in a split pane — you're starting
  from its end state and deliberately breaking it

---

## Beat 1 — Reproduce the trapped state problem (3 min)

Start from Session 3's `ToolDirectory` but move the query state *down* into
a new `ToolList` component. You're creating the problem on purpose.

```tsx
import { useState } from "react";
import { tools } from "../teaching/session-3"; // or paste the data inline

function ToolList() {
  const [query, setQuery] = useState(""); // state lives here

  const visible = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter tools..."
      />
      <ul>
        {visible.map((t) => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

function ResultCount() {
  // This component needs to know how many tools are visible
  // It has no way to get that information
  return <p>Showing ??? tools</p>;
}

export function Session4Teaching() {
  return (
    <div>
      <ResultCount />
      <ToolList />
    </div>
  );
}
```

Run it. The filter works. The count shows "???".

Ask: *"`ResultCount` needs the same `query` value that `ToolList` holds.
How does it get it?"*

Wait. "Pass it up?" — yes, but how? They're siblings — `ResultCount` can't
receive props from `ToolList`. The only route is through the parent.

**The point:** siblings can't share state directly. The parent is the only
channel between them.

---

## Beat 2 — Lift the state (4 min)

Move `query` up to `Session4Teaching`. Do it step by step, not all at once.

**Step 1 — move the state:**

```tsx
export function Session4Teaching() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <ResultCount />
      <ToolList />
    </div>
  );
}
```

TypeScript immediately complains about `ToolList` — it still has its own
`useState` call. Good. That's the signal.

**Step 2 — update `ToolList` to receive props:**

```tsx
interface ToolListProps {
  tools: typeof tools;
  query: string;
  onQueryChange: (value: string) => void;
}

function ToolList({ tools: filteredTools, query, onQueryChange }: ToolListProps) {
  return (
    <div>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter tools..."
      />
      <ul>
        {filteredTools.map((t) => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}
```

**Step 3 — derive `visible` in the parent and pass it down:**

```tsx
export function Session4Teaching() {
  const [query, setQuery] = useState("");

  const visible = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <ResultCount count={visible.length} total={tools.length} />
      <ToolList
        tools={visible}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
```

**Step 4 — fix `ResultCount`:**

```tsx
interface ResultCountProps {
  count: number;
  total: number;
}

function ResultCount({ count, total }: ResultCountProps) {
  return <p>Showing {count} of {total} tools</p>;
}
```

Run it. Type in the filter. The count updates in sync.

Ask: *"What changed about `ToolList`?"* — it went from owning state to
receiving it. It's now a controlled component in the same sense as the
input inside it.

**The point:** the fix is always the same. Find the lowest ancestor that
contains every component that needs the value. Move the state there.
Pass it down as props.

---

## Beat 3 — Component boundary decision (3 min)

The `Session4Teaching` component is getting long. Make a deliberate mess
of it first — add the deprecated toggle back from Session 3:

```tsx
export function Session4Teaching() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);

  const visible = tools
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  return (
    <div>
      <p>Showing {visible.length} of {tools.length} tools</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter..."
      />
      <label>
        <input
          type="checkbox"
          checked={showDeprecated}
          onChange={(e) => setShowDeprecated(e.target.checked)}
        />
        Show deprecated
      </label>
      <ToolList tools={visible} query={query} onQueryChange={setQuery} />
    </div>
  );
}
```

Ask: *"What would you extract here? What would you call it?"*

Take answers. Then extract the filter controls into a `FilterBar`:

```tsx
interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  showDeprecated: boolean;
  onShowDeprecatedChange: (value: boolean) => void;
}

function FilterBar({
  query,
  onQueryChange,
  showDeprecated,
  onShowDeprecatedChange,
}: FilterBarProps) {
  return (
    <div>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Filter..."
      />
      <label>
        <input
          type="checkbox"
          checked={showDeprecated}
          onChange={(e) => onShowDeprecatedChange(e.target.checked)}
        />
        Show deprecated
      </label>
    </div>
  );
}
```

Update the parent to use it. Point out: the state didn't move. Only the
rendering was extracted. The parent still owns `query` and `showDeprecated`
because `ToolList` and `ResultCount` still need them.

**The point:** extracting a component doesn't always mean moving state.
Sometimes it's just giving a piece of UI a name.

---

## Beat 4 — The div-as-button problem (2 min)

Add a dismiss action to the list items — but do it wrong first:

```tsx
{visible.map((t) => (
  <li key={t.id}>
    {t.name}
    <div onClick={() => console.log("dismiss", t.id)}>✕</div>
  </li>
))}
```

Run it. Click the ✕. It works with a mouse.

Ask: *"Can you tab to it? Can you press Enter to activate it?"*

Try it live — tab through the list. The ✕ divs are invisible to the keyboard.

Fix it:

```tsx
<button
  onClick={() => console.log("dismiss", t.id)}
  aria-label={`Dismiss ${t.name}`}
>
  ✕
</button>
```

Tab through again. The button is reachable. Enter activates it.

Point out `aria-label`: the visible text is just ✕, which is meaningless to
a screen reader. The label gives it context.

**The point:** semantic HTML is the first accessibility tool. It costs nothing
and gives you keyboard support, focus management, and screen reader announcements
for free.

---

## Beat 5 — aria-live for dynamic content (2 min)

The result count updates silently. A screen reader user typing in the filter
would have no way of knowing the count changed.

Add `role="status"` and `aria-live`:

```tsx
function ResultCount({ count, total }: ResultCountProps) {
  return (
    <p role="status" aria-live="polite">
      Showing {count} of {total} tools
    </p>
  );
}
```

Explain briefly: `aria-live="polite"` tells the browser to announce this
element's content to screen readers when it changes, without interrupting
whatever they're currently reading.

Don't demonstrate with a screen reader unless you have one configured —
just name the pattern and move on.

**The point:** dynamic content that updates without a page reload is invisible
to screen readers unless you announce it. `aria-live` is the fix.

---

## Handover to the lab

Point at the finished `Session4Teaching` component on screen:

> "The lab takes everything from today's four sessions and puts it together.
> You're building a complete component tree — lifted state, a filter bar,
> a tool list, a result count, and semantic, accessible markup throughout.
> Nothing in the lab is new. It's the same patterns, assembled."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Reproduce trapped state | 3 min |
| 2 | Lift state — step by step | 4 min |
| 3 | Component boundary decision | 3 min |
| 4 | div-as-button → button | 2 min |
| 5 | aria-live for dynamic content | 2 min |
| — | Lab handover | 1 min |
| **Total** | | **~15 min** |