# Session 3 — Live Coding Demo Script

## Before you start

Same setup as Session 2:

- `src/teaching/session-3.tsx` — write everything here
- `App.tsx` renders `<Session3Teaching />`
- Browser open, Vite running

Keep the Session 2 teaching file open in a split pane if your editor allows it —
you'll reference `ToolList` from it later.

---

## Beat 1 — The broken counter (3 min)

Start with exactly the code from the opening provocation slide. Type it out —
don't paste it. The slower pace gives them time to spot the problem.

```tsx
function Counter() {
  let count = 0;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => { count++; }}>Increment</button>
    </div>
  );
}

export function Session3Teaching() {
  return <Counter />;
}
```

Run it. Click the button. Nothing happens.

Ask: *"The click handler is running — `count` is genuinely incrementing. So why
doesn't the UI update?"*

Wait. Take answers. Then explain:

> React rendered this component once. `count` is a local variable in that render.
> Changing it doesn't tell React anything happened. React has no reason to
> re-render, so the UI stays at zero.

Then fix it:

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Click the button. It works.

**The point:** `setCount` doesn't just update the value — it tells React something
changed. React re-renders. The new value appears.

---

## Beat 2 — The mutation trap: arrays (3 min)

Don't move on from mutation yet. This is the version that trips people up later.

Add a second component below `Counter`:

```tsx
function TagList() {
  const [tags, setTags] = useState(["platform", "sre"]);

  function addTag() {
    tags.push("finance"); // do this deliberately wrong
    console.log(tags);    // log it so they can see it's "working"
  }

  return (
    <div>
      <ul>
        {tags.map((tag, i) => <li key={i}>{tag}</li>)}
      </ul>
      <button onClick={addTag}>Add tag</button>
    </div>
  );
}
```

Run it. Open the browser console. Click the button.

The console shows the array growing. The UI doesn't change.

Ask: *"The array has three items. The UI shows two. What's happening?"*

Then fix it:

```tsx
function addTag() {
  setTags([...tags, "finance"]);
}
```

Now it updates. Point out the spread: you're creating a new array, not modifying
the existing one. React sees a new reference and re-renders.

**The point:** mutating state in place — `push`, `splice`, direct property
assignment — is always silent. The setter always needs a new value.

---

## Beat 3 — Controlled input (4 min)

New component. Start uncontrolled so the contrast is visible:

```tsx
function SearchBox() {
  return (
    <div>
      <input type="text" />
      <button onClick={() => console.log("what did they type?")}>
        Search
      </button>
    </div>
  );
}
```

Click Search. The console has no idea what's in the input.

Ask: *"How do we read the input value?"*

Take answers — someone will say `useRef` or `document.getElementById`. Acknowledge
both: they work, but they bypass React. Then show the React way:

```tsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => console.log("Searching for:", query)}>
        Search
      </button>
    </div>
  );
}
```

Type in the box. Click Search. The console logs exactly what's in the input.

Point out the two sides explicitly:

- `value={query}` — React pushes its state into the input
- `onChange` — the input pushes keystrokes back into React state

**The point:** `query` is always in sync with what the user sees. No DOM querying.
This is `@bind-Value` written out explicitly — both directions, visible in your code.

---

## Beat 4 — Form submission and preventDefault (2 min)

Small addition to `SearchBox`. Wrap the inputs in a `<form>`:

```tsx
function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <form>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

Run it. Type something. Click Search. The page refreshes and the input clears.

Ask: *"Why did that happen?"*

The browser submitted the form the old-fashioned way — full page reload. Fix it:

```tsx
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  console.log("Searching for:", query);
}

return (
  <form onSubmit={handleSubmit}>
    ...
  </form>
);
```

Now it logs without refreshing.

**The point:** same as Blazor — `e.preventDefault()` stops the browser's default
form behaviour. Easy to forget, very obvious when you do.

---

## Beat 5 — Multiple state values (3 min)

This beat connects directly to Session 2's `ToolList`. Pull it into the file:

```tsx
import { tools } from "./data"; // reuse Session 2 data
```

Build a `ToolDirectory` component that holds two state values:

```tsx
function ToolDirectory() {
  const [query, setQuery] = useState("");
  const [showDeprecated, setShowDeprecated] = useState(false);

  const visible = tools
    .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    .filter((t) => showDeprecated || t.status === "active");

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter tools..."
      />
      <label>
        <input
          type="checkbox"
          checked={showDeprecated}
          onChange={(e) => setShowDeprecated(e.target.checked)}
        />
        Show deprecated
      </label>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Run it. Type in the filter. Toggle the checkbox. Both work independently.

Point out:
- Two `useState` calls — each is completely independent
- `visible` is derived from both state values — no extra state needed, just a
  variable computed on every render
- The checkbox uses `checked` and `onChange` — same controlled pattern as the text input

Ask: *"Where have you seen `ToolList` before?"* — the list rendering is the same
pattern from Session 2. This is the same data, the same component shape.

**The point:** multiple state values are just multiple `useState` calls.
Derived values — things you can compute from state — don't need their own `useState`.

---

## Beat 6 — The mutation trap: objects (2 min)

Quick beat — show the object version before the lab, because they'll hit it:

```tsx
function UserProfile() {
  const [user, setUser] = useState({ name: "Alice", role: "developer" });

  function promote() {
    user.role = "lead"; // broken — same trap, different shape
  }

  return (
    <div>
      <p>{user.name} — {user.role}</p>
      <button onClick={promote}>Promote</button>
    </div>
  );
}
```

Run it. Click Promote. Nothing changes.

Fix it without explaining — ask them to tell you what the fix should be:

```tsx
function promote() {
  setUser({ ...user, role: "lead" });
}
```

**The point:** spread creates a new object. React sees a new reference.
Same rule as arrays — always a new value, never a mutation.

---

## Handover to the lab

Update `Session3Teaching` to render `ToolDirectory`:

```tsx
export function Session3Teaching() {
  return <ToolDirectory />;
}
```

Then say:

> "The lab builds this same thing — a filterable tool list with a controlled input —
> but adds a second filter and asks you to handle the form submission properly.
> You've just watched every piece of it. Now you build it."

---

## Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Broken counter → useState | 3 min |
| 2 | Mutation trap: arrays | 3 min |
| 3 | Controlled input | 4 min |
| 4 | Form submission + preventDefault | 2 min |
| 5 | Multiple state values | 3 min |
| 6 | Mutation trap: objects | 2 min |
| — | Lab handover | 1 min |
| **Total** | | **~18 min** |