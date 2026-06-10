## Session 2 — Live Coding Flow

### Before you start

Have two things open:

- A fresh component file: `src/teaching/session-2.tsx`
- The browser with Vite running

You'll build everything in `session-2.tsx` and render it from `App.tsx`. Keep `App.tsx` as a one-liner: `<Session2Teaching />`. Delete it between beats if you want a clean slate — the teaching is the code, not the running app.

---

### Beat 1 — A component with no interface (2 min)

Start with something deliberately broken:

```tsx
function ToolCard({ tool, onDismiss }) {
  return (
    <div>
      <strong>{tool.name}</strong>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
```

Let TypeScript complain. Point at the red underlines. Ask: *"What does TypeScript want that we haven't given it?"*

Then fix it live:

```tsx
interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
}

function ToolCard({ tool, onDismiss }: ToolCardProps) {
```

**The point:** the interface is the contract. Once it exists, you can read the component without reading the body. Pause on that before moving on.

---

### Beat 2 — Optional props (90 sec)

Still on `ToolCard`. Ask: *"What if we want a description, but not every tool has one?"*

Add it to the interface first, not the JSX:

```tsx
interface ToolCardProps {
  tool: Tool;
  onDismiss: () => void;
  description?: string;
}
```

Then show what TypeScript does when you try to render `{description.toUpperCase()}` without guarding it. Let the error appear. Then fix it:

```tsx
{description && <p>{description}</p>}
```

**The point:** optional props require defensive rendering. TypeScript catches it before the browser does.

---

### Beat 3 — Children and composition (3 min)

New component. Don't explain it first — just write it:

```tsx
function Panel({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

Ask: *"What's the type of `children`?"* Take answers. Then add the interface:

```tsx
interface PanelProps {
  title: string;
  children: React.ReactNode;
}
```

Now use it:

```tsx
<Panel title="Internal Tools">
  <p>Anything can go here.</p>
  <ToolCard tool={tools[0]} onDismiss={() => {}} />
</Panel>
```

Point out that `Panel` has no idea what's inside it. Swap the contents. It doesn't care.

**The point:** the caller decides the content. The component provides the structure. Connect this explicitly to Blazor's `ChildContent`.

---

### Beat 4 — Rendering a list (3 min)

Add a `ToolList` component. Do it wrong first:

```tsx
function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <ul>
      {tools.map((tool, index) => (
        <li key={index}>
          <ToolCard tool={tool} onDismiss={() => {}} />
        </li>
      ))}
    </ul>
  );
}
```

Run it. No warning yet — ask: *"What's wrong with this?"* Take answers.

Then demonstrate the bug. Add a `useState` to hold the list, wire a dismiss that removes by index, and show that deleting the middle item re-renders the wrong card. (This takes 60 seconds but makes the `key` rule stick permanently.)

Fix it:

```tsx
<li key={tool.id}>
```

**The point:** stable IDs, not positions. The demo is worth more than the explanation.

---

### Beat 5 — Callbacks as props (4 min)

This is the session's core concept. Build it in two steps.

**Step 1 — the broken version.** Add a `useState` for the tool list and try to handle dismiss *inside* `ToolList`:

```tsx
function ToolList({ tools: initialTools }: { tools: Tool[] }) {
  const [items, setItems] = useState(initialTools);

  function handleDismiss(id: string) {
    setItems(items.filter((t) => t.id !== id));
  }

  return (
    <ul>
      {items.map((tool) => (
        <li key={tool.id}>
          <ToolCard tool={tool} onDismiss={() => handleDismiss(tool.id)} />
        </li>
      ))}
    </ul>
  );
}
```

It works. Ask: *"What's the problem?"*

Wait. Someone will say it: `ToolList` owns state it probably shouldn't. What if the parent needs to know which tools are visible? What if another component on the page needs the same list?

**Step 2 — lift the callback out.** Move `useState` to a parent `Session2Teaching` component. Pass `onDismiss` down:

```tsx
function Session2Teaching() {
  const [visibleTools, setVisibleTools] = useState(tools);

  function handleDismiss(id: string) {
    setVisibleTools(visibleTools.filter((t) => t.id !== id));
  }

  return (
    <Panel title="Internal Tools">
      <ToolList tools={visibleTools} onDismiss={handleDismiss} />
    </Panel>
  );
}
```

Update `ToolList` to accept and pass through `onDismiss`:

```tsx
interface ToolListProps {
  tools: Tool[];
  onDismiss: (id: string) => void;
}
```

Run it. Same behaviour. But now the parent owns the state and the decision.

**The point:** return to the opening scenario. *"`onClose` is defined nowhere in the component — now you know exactly where to look."*

---

### Beat 6 — Conditional rendering (2 min)

One addition to `Session2Teaching` while the callback pattern is fresh:

```tsx
return (
  <Panel title="Internal Tools">
    {visibleTools.length === 0
      ? <p>No tools to display.</p>
      : <ToolList tools={visibleTools} onDismiss={handleDismiss} />
    }
  </Panel>
);
```

Dismiss all the tools. The message appears.

Ask: *"Why is this conditional in the parent and not inside `ToolList`?"*

**The point:** the parent owns `visibleTools`. It's the only component that knows the list is empty. This is the decision you'll make in the lab.

---

### Handover to the lab

The app you've just built is almost exactly the lab skeleton. The difference: in the lab, the components are pre-written with deliberate gaps. Their job is to complete the interfaces, wire the callbacks, and fix the list — then add the empty state themselves.

Point at `Session2Teaching` on screen: *"You've just watched me build this. Now you're going to build the same thing from the other direction — starting from broken components and making them work."*

---

### Timing

| Beat | Topic | Time |
|---|---|---|
| 1 | Interface and contract | 2 min |
| 2 | Optional props | 90 sec |
| 3 | Children and composition | 3 min |
| 4 | List rendering and key | 3 min |
| 5 | Callbacks as props | 4 min |
| 6 | Conditional rendering | 2 min |
| — | Lab handover | 1 min |
| **Total** | | **~17 min** |

That leaves a comfortable 25–28 minutes for the lab within a 45-minute session slot.