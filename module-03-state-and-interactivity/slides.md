<!-- jump_to_middle -->

Session 3 — State and Interactivity
===

<!-- end_slide -->

## Opening scenario

A colleague hands you a component. There's a button that should increment a counter.
They say it's broken — clicking the button does nothing.

You open the file and find this:

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
```

**Type in chat: what's wrong with it?**

<!--
speaker_note: |
  Most people will sense something is wrong before they can name it. "count++"
  modifies a local variable — React has no idea it changed, so nothing re-renders.
  Accept all answers. The session opens with the mutation trap on purpose: it's
  the most common beginner bug, and seeing it broken first makes useState's job
  obvious.
-->

<!-- end_slide -->

## useState — telling React something changed

React only re-renders when you tell it to. `useState` is how you do that.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

<!-- column: 1 -->

`useState(0)` returns two things:

- `count` — the current value, **read-only**
- `setCount` — the function that updates it and schedules a re-render

<!-- pause -->

`count++` modifies the variable. React doesn't see it. Nothing re-renders.

`setCount(count + 1)` tells React the value changed. React re-renders. The new value appears.

<!-- pause -->

No `StateHasChanged()`. React handles the re-render automatically.

<!-- reset_layout -->

<!--
speaker_note: |
  This directly answers the opening scenario. The fix is one line: replace
  count++ with setCount(count + 1). The broken version isn't wrong JavaScript —
  it just doesn't go through React's update cycle.
  The StateHasChanged comparison lands well here: in Blazor you call it explicitly
  to trigger a re-render. useState's setter is the React equivalent, but it's
  baked into the update — you can't forget it.
-->

<!-- end_slide -->

## The mutation trap

The most common beginner bug in React. Two versions — same problem.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Mutating a primitive**

```tsx
// Broken
const [count, setCount] = useState(0);
count++; // modifies the variable, not React's state

// Fixed
setCount(count + 1);
```

<!-- pause -->
**Mutating an array**

```tsx
// Broken
const [items, setItems] = useState([]);
items.push(newItem); // React doesn't see this

// Fixed
setItems([...items, newItem]);
```
<!-- pause -->
<!-- column: 1 -->

**Mutating an object**

```tsx
// Broken
const [user, setUser] = useState({ name: "", age: 0 });
user.name = "Alice"; // React doesn't see this

// Fixed
setUser({ ...user, name: "Alice" });
```
<!-- reset_layout -->

<!-- pause -->

**The rule:** never modify state directly. Always call the setter with a new value. For arrays and objects, that means creating a new one — spread operator is your friend.

<!--
speaker_note: |
  The array and object versions are the ones that trip people up after the
  primitive version is obvious. "I called push, why didn't it update?" is
  a real support question you'll get in the lab. The spread pattern is worth
  practising until it's automatic.
  If anyone asks about Immer or structuredClone: valid tools, out of scope today.
  Spread covers everything they'll need this week.
-->

<!-- end_slide -->

## Controlled inputs

React form inputs come in two flavours. **Controlled** is the standard — the one you'll write and the one you'll read in the existing codebase.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Uncontrolled** — the DOM owns the value

```tsx
// React doesn't know what's in this input
<input type="text" defaultValue="initial" />
```

<!-- pause -->


**Controlled** — React owns the value

```tsx
const [query, setQuery] = useState("");

<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```
<!-- pause -->

<!-- column: 1 -->

With a controlled input:

<!-- incremental_lists: true -->

- The input always shows exactly what's in `query`
- Every keystroke calls `onChange`, which updates `query`, which re-renders the input
- `query` is always in sync with what the user sees
- You can read `query` anywhere in the component — no DOM querying needed

<!-- incremental_lists: false -->

<!-- reset_layout -->

<!-- pause -->

This is `@bind-Value` written explicitly. Both directions, visible in your code.

<!--
speaker_note: |
  The "why controlled?" question usually comes up. The answer is predictability:
  the input cannot get out of sync with your state. With uncontrolled inputs,
  the DOM is the source of truth and you have to query it to find out what the
  user typed. With controlled, React state is always the source of truth.
-->

<!-- end_slide -->

## Handling form submission

A controlled form doesn't need to query the DOM. The values are already in state.

```tsx
function SearchForm() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Searching for:", query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">Search tools</label>
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

<!-- pause -->

Two things worth noting:

<!-- incremental_lists: true -->

- `e.preventDefault()` stops the browser from submitting the form and refreshing the page — same as Blazor
- `htmlFor` connects the label to the input — the accessible pattern you saw in Session 2

<!-- incremental_lists: false -->

<!--
speaker_note: |
  The preventDefault is a gotcha that trips everyone once. Without it, the form
  submits, the page reloads, and all state is lost. It looks like the handler
  isn't running. Mention it explicitly so they recognise it when it happens.
  The label/htmlFor is a deliberate callback to Session 2 accessibility content —
  worth naming: "this is the same pattern from the composition lab."
-->

<!-- end_slide -->

## Multiple state values

A component can have as many `useState` calls as it needs. Each is independent.

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
      <ToolList tools={visible} />
    </div>
  );
}
```

<!-- pause -->

**Type in chat: where does `ToolList` come from in this example?**

<!--
speaker_note: |
  The answer: Session 2's lab. This is a deliberate callback — the components
  they built are being used in new context. If anyone looks uncertain, point out
  that ToolList is the same component: it accepts a tools prop, it renders a list.
  The discussion beat is also checking comprehension: if they can answer "it's
  the component we built in Session 2", the sessions are connecting.
-->

<!-- end_slide -->

## Closing the loop — Session 3

Back to the opening. The broken counter:

```tsx
let count = 0;
onClick={() => { count++; }}
```

Now you can say exactly what's wrong and how to fix it:

<!-- incremental_lists: true -->

- `count` is a local variable — modifying it doesn't go through React
- React has no idea the value changed, so it never re-renders
- The fix: `const [count, setCount] = useState(0)` and `setCount(count + 1)`
- The setter tells React something changed — React re-renders — the new value appears

<!-- incremental_lists: false -->

<!-- pause -->

**State is how React knows something changed. Calling the setter is how you tell it.**

<!--
speaker_note: |
  This is the session in one sentence. Everything else — controlled inputs,
  multiple state values, the mutation trap — is a variation on this principle.
  Session 4 takes this further: when multiple components need the same state,
  where does it live?
-->

<!-- end_slide -->

## Bridge to Session 4

**We've covered:**

<!-- incremental_lists: true -->

- `useState` as React's re-render trigger
- The mutation trap — always call the setter, never modify directly
- Controlled inputs — React state as the single source of truth for form values
- Multiple independent state values in one component

<!-- incremental_lists: false -->

**Session 4:** when two components need the same state, neither can own it alone — it moves to the closest parent that contains both. That's the problem Session 4 solves.

<!-- end_slide -->