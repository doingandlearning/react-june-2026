---
title: "**React** for .NET/Blazor Developers"
sub_title: Day 1 — Thinking in React
author: Kevin Cunningham
---

## Opening scenario

Your team has inherited a React application. You're a confident .NET and Blazor developer.
On your first morning you open a component file. It's a function that returns something
that looks like HTML, imports things called hooks, and has no class, no `ComponentBase`,
no `@bind`, no `StateHasChanged`.

**Type in chat: where do you start reading?**

We'll come back to this at the end of the session.

<!--
speaker_note: |
  This is deliberately open — there's no correct answer yet. You want to surface
  the disorientation of reading React without a map. Common responses: "the return
  statement", "the imports", "I'd look for something familiar". Accept all of them.
  The session gives them the map.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Session 1 — From Blazor to React
===

<!-- end_slide -->

## React is a library, not a framework

React handles one thing: **rendering UI from state**.

Everything else is a decision you make.

<!-- pause -->

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Blazor makes these choices for you:**

- Routing (`NavigationManager`, `@page`)
- Forms (`EditForm`, `DataAnnotations`)
- HTTP (`HttpClient` injection)
- State (`@bind`, `StateHasChanged`)
- Component model (`ComponentBase`)

<!-- column: 1 -->

**React hands them back to you:**

- Routing → React Router (community standard)
- Forms → controlled inputs or a library
- HTTP → `fetch`, `axios`, TanStack Query
- State → `useState`, `useContext`, Zustand
- Component model → just a function

<!-- reset_layout -->

<!-- pause -->

**This is not a complaint about React.** It's the single most important thing to understand before reading any React codebase — because the answers to "how does this app do routing?" and "how does it fetch data?" will be different in every project.

<!--
speaker_note: |
  The instinct from Blazor is to look for "the React way" to do X. There often
  isn't one — there's a community standard. React Router is the routing standard;
  TanStack Query is the server-state standard. But these are choices the team made,
  not things React mandated. This framing matters when they read the existing codebase.
-->

<!-- end_slide -->

## What transfers from Blazor

You already know more than you think.



The component model is the same idea:

<!-- incremental_lists: true -->

- A component is a self-contained unit of UI
- Props flow in from the parent — read-only inside the component
- Events flow out via callbacks — child tells parent something happened
- When state changes, the component re-renders
- There is a lifecycle — mount, update, unmount

<!-- incremental_lists: false -->


**The Blazor equivalents:**

| React | Blazor |
|---|---|
| Props | `[Parameter]` |
| Callback prop | `EventCallback<T>` |
| `useState` | `@bind` / field + `StateHasChanged` |
| `useEffect` | `OnInitializedAsync` |
| `children` | `ChildContent` |

<!-- reset_layout -->

<!-- pause -->

**Type in chat: which of these feels most unfamiliar?**

<!--
speaker_note: |
  Read responses. "useEffect" and "children" are the most common answers — both
  are covered in detail later today and on Day 2. If someone says "all of it",
  that's fine — reassure them the Blazor column is there as a reference point
  throughout the day.
-->

<!-- end_slide -->

## What doesn't transfer — the mental shift

The single biggest difference: **React has no two-way binding**.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

In Blazor, `@bind-Value` is magic. You change the field, the UI updates. You change the UI, the field updates. The framework manages both directions.

<!-- pause -->
```csharp
// Blazor: framework handles both directions
<InputText @bind-Value="searchQuery" />
```
<!-- pause -->
<!-- column: 1 -->

In React, you write both directions yourself — explicitly.

```tsx
// React: you wire both directions
<input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

<!-- reset_layout -->

<!-- pause -->

`@bind-Value` is syntactic sugar for this exact pattern. React just doesn't provide the sugar. Once you've written it a few times, it stops feeling verbose.

<!--
speaker_note: |
  This is the "aha" that unlocks controlled inputs later in Session 3. Plant it
  here so it lands as "oh, that's what they meant" rather than a surprise.
  If anyone asks "why would you want that?" — the answer is predictability.
  The UI always reflects exactly what's in your state. No hidden synchronisation.
-->

<!-- end_slide -->

## JSX — what you're actually reading

JSX looks like HTML inside JavaScript. It isn't HTML — it's a **syntax transform**.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->
<!-- pause -->
**What you write**

```tsx
function Greeting({ name }: { name: string }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}</h1>
    </div>
  );
}
```
<!-- pause -->
<!-- column: 1 -->

**What the compiler produces**

```tsx
React.createElement(
  "div",
  { className: "greeting" },
  React.createElement(
    "h1", null, "Hello, ", name
  )
)
```

<!-- reset_layout -->

<!-- pause -->

The `{}` curly braces are **JavaScript**, not template syntax. Anything valid in JavaScript goes inside them: expressions, ternaries, function calls, `.map()`.

<!-- pause -->

Three JSX rules that trip up Blazor developers:

<!-- incremental_lists: true -->

- `className` not `class` — `class` is a reserved word in JS
- `htmlFor` not `for` — same reason
- Event handlers are camelCase: `onClick`, `onChange`, `onSubmit`

<!-- incremental_lists: false -->

<!--
speaker_note: |
  The className/htmlFor rules are visible in every component they'll ever read.
  Worth making them memorable: "the compiler is turning this into JavaScript
  objects, so it has to avoid reserved words." TypeScript will catch these mistakes
  anyway — but knowing why helps them read error messages.
-->

<!-- end_slide -->

## Setting up: Vite + React + TypeScript

**Demo:** scaffold a new project and walk through what Vite gives you.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

<!-- pause -->

Four files worth orienting to:

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

`index.html` — the only HTML file. React owns the `<div id="root">` inside it. There is no routing in HTML — React Router handles that in JavaScript.

`src/main.tsx` — the entry point. `ReactDOM.createRoot` mounts your app into that div and starts React's rendering.

<!-- column: 1 -->

`src/App.tsx` — your first component. This is where your application tree begins. Delete the boilerplate — it's just a starting point.

`vite.config.ts` — replaces webpack. HMR is near-instant. You'll notice the difference if you're used to `dotnet watch`.

<!-- reset_layout -->

<!--
speaker_note: |
  Run this live. Open the browser before moving to the file tour so they can see
  the running app first, then trace backwards to how it got there.
  If anyone asks about Create React App: deprecated, don't use it.
  If anyone asks about Next.js: server rendering on top of React — out of scope
  for this course, but a natural next step for anyone building public-facing apps.
-->

<!-- end_slide -->

## Closing the loop — Session 1

You were asked: **where do you start reading a React component?**

Now you have a map:

<!-- incremental_lists: true -->

- The **function signature** — what props does it accept?
- The **return statement** — what JSX does it render?
- The **hooks** — what state does it hold, what side effects does it run?
- The **callbacks** — what events does it report to its parent?

<!-- incremental_lists: false -->

<!-- pause -->

The rest of the day gives you the vocabulary for each of those four questions.

<!--
speaker_note: |
  Return to the chat responses from the opening. Read back what they said and map
  each response to this framework. "The return statement" → correct, and here's
  why. "The imports" → also useful — the imports tell you what hooks and components
  are in play. "I'd look for something familiar" → the table from the previous
  slide is your reference.
-->

<!-- end_slide -->

## Task — read a component cold

Open `src/App.tsx` in your Vite project.

Without running it:

1. What props does it accept?
2. What does it render?
3. Does it hold any state?
4. Does it report any events to a parent?

Be ready to answer all four in one minute.

<!--
speaker_note: |
  Give 3–4 minutes. This is a low-stakes first application of the reading framework.
  The default App.tsx is simple enough that everyone can answer all four questions —
  building confidence before the complexity arrives in Session 2.
  Debrief quickly: the answers are "none", "a heading and some boilerplate", "no",
  "no". The point is not the answers — it's that they now have a method.
-->

<!-- end_slide -->