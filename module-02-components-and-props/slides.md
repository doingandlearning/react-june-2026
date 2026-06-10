<!-- jump_to_middle -->

Session 2 — Components and Props
===

<!-- end_slide -->

## Opening scenario

You're reading a component in the existing app. It accepts a prop called `onClose`.
Inside the component, it's called like a function: `onClose()`.

But searching the whole file, there's no `function onClose` anywhere.

**Where does `onClose` come from — and who decides what it does?**

<!--
speaker_note: |
  This surfaces the "callbacks as props" concept before naming it. Most people from
  a Blazor background will have a hunch — "the parent?" — but won't have the
  vocabulary yet. Accept "the parent passed it in" as correct. Hold the full
  explanation for the callbacks slide.
-->

<!-- end_slide -->

## Defining a component with typed props

A React component is a function. Its props are its parameters — typed with an interface.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

```tsx
interface AlertProps {
  title: string;
  message: string;
  onDismiss: () => void;
}

function Alert({ title, message, onDismiss }: AlertProps) {
  return (
    <div role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
```

<!-- column: 1 -->

Reading this component, you can answer four questions immediately:

<!-- incremental_lists: true -->

- What data does it need? → `title`, `message`
- What event does it report? → `onDismiss`
- What does it render? → the return statement
- Who decides what `onDismiss` does? → whoever renders `<Alert />`

<!-- incremental_lists: false -->

<!-- reset_layout -->

<!--
speaker_note: |
  These four questions are the reading framework from Session 1 applied to a real
  component. The interface is the contract — you can understand the component's
  behaviour entirely from the interface + return, without reading the internals.
  This is what good prop typing gives you.
-->

<!-- end_slide -->

## TypeScript prop patterns

Three patterns that come up constantly:

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Optional props**

```tsx
interface ButtonProps {
  label: string;
  icon?: string;      // optional — may be undefined
  disabled?: boolean;
}
```
<!-- pause -->
**Children**

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode; // anything renderable
}
```
<!-- pause -->
<!-- column: 1 -->

**Callback props**

```tsx
interface SearchProps {
  value: string;
  // a function that receives a string, returns nothing
  onChange: (value: string) => void;
  // a click handler on a button element
  onClear: React.MouseEventHandler<HTMLButtonElement>;
}
```

<!-- reset_layout -->

<!-- pause -->

**`interface` vs `type` for props:** either works. Teams pick one convention. `interface` is marginally more common for props — it can be extended later. Don't agonise over it.

<!--
speaker_note: |
  If the `React.MouseEventHandler<HTMLButtonElement>` syntax looks intimidating:
  in practice, most callback props are typed as `() => void` or
  `(value: SomeType) => void`. The verbose event handler type is only needed
  when you're passing the raw DOM event through. TypeScript will tell you when
  you need it.
-->

<!-- end_slide -->

## Composition — building with children

React has no component inheritance. You build complex UI by **nesting components inside each other**.

<!-- column_layout: [2, 1] -->

<!-- column: 0 -->

The `children` prop is how you pass JSX into a component:

```tsx
interface PanelProps {
  title: string;
  children: React.ReactNode;
}

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

// The caller decides what goes inside:
<Panel title="Search Results">
  <FilterBar />
  <ResultList items={results} />
  <Pagination page={page} total={total} />
</Panel>
```

<!-- column: 1 -->

`Panel` knows nothing about `FilterBar`, `ResultList`, or `Pagination`.

It just provides the structure. The caller provides the content.

<!-- pause -->

**The Blazor equivalent:** `[Parameter] public RenderFragment ChildContent { get; set; }` — React makes this automatic for anything between the opening and closing tags.

<!-- reset_layout -->

<!--
speaker_note: |
  The power here is that Panel is completely reusable — it never needs to know
  what it contains. The layout pattern from Blazor (@Body in MainLayout) is
  exactly this: the layout component wraps whatever the page provides.
  If anyone asks about multiple named slots (like Blazor's multiple RenderFragments):
  you can pass multiple ReactNode props by name — e.g. header and footer as separate
  props. Children is just the default unnamed slot.
-->

<!-- end_slide -->

## Rendering lists — `.map()` and `key`

To render a list of items, you use `.map()` to turn your data into JSX.

```tsx
interface Tool {
  id: string;
  name: string;
  owner: string;
}

function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          <strong>{tool.name}</strong> — {tool.owner}
        </li>
      ))}
    </ul>
  );
}
```

<!-- pause -->

**On `key`:** React uses it to track which items changed between renders. It must be stable and unique — not the array index.

<!-- pause -->

Why index fails: if the user deletes item 2, React sees item 3 move into position 2. Any state or focus attached to the old item 2 follows the wrong element. A stable ID from your data avoids this entirely.

<!--
speaker_note: |
  The key warning is one of the most common console warnings they'll see. Worth
  being concrete about the failure mode — it's not just a lint rule, it causes
  real rendering bugs that are hard to diagnose. "Always use an ID from your data"
  is a rule they can follow without needing to fully understand React's reconciler.
-->

<!-- end_slide -->

## Conditional rendering

JSX is JavaScript — you use JavaScript expressions to render conditionally.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Short-circuit: show or show nothing**

```tsx
// Renders <Spinner /> only when isLoading is true
{isLoading && <Spinner />}
```

**Ternary: one of two options**

```tsx
{error
  ? <ErrorMessage message={error} />
  : <DataTable rows={rows} />
}
```

<!-- column: 1 -->

**Early return: complex conditions**

```tsx
function Results({ isLoading, error, rows }) {
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (rows.length === 0) return <EmptyState />;

  return <DataTable rows={rows} />;
}
```

<!-- reset_layout -->

<!-- pause -->

**Type in chat: which pattern would you reach for first — short-circuit, ternary, or early return?**

<!--
speaker_note: |
  All three are valid. Early return is the most readable for multiple conditions —
  if they're coming from C# they'll find it natural. Short-circuit is idiomatic
  for simple show/hide. Ternary is the most common in the wild but gets unreadable
  when nested. If the group favours one, that's fine — the point is knowing all
  three so they can read code that uses any of them.
-->

<!-- end_slide -->

## Callbacks as props — the full pattern

This is how React components communicate. The parent owns the state; the child reports events.

```tsx
// The parent owns the state and defines what happens on change
function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultList query={query} />
    </>
  );
}

// The child receives a value and a function — it doesn't own either
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

<!-- pause -->

`SearchInput` has no idea what `onChange` does. It just calls it. The parent decides the behaviour.

<!--
speaker_note: |
  This answers the opening scenario: onClose "comes from the parent". The parent
  passed in a function — maybe it closes a modal, maybe it navigates away, maybe
  it logs an event. The child doesn't know and doesn't need to.
  The Blazor equivalent: EventCallback<T>. Same contract — child fires it, parent
  handles it. React just makes the function type explicit.
  This pattern is the core of React data flow. Everything in Sessions 3 and 4
  builds on it.
-->

<!-- end_slide -->

## Closing the loop — Session 2

Back to the opening: `onClose` is called inside the component, but defined nowhere in it.

Now you can read that code and say:

<!-- incremental_lists: true -->

- `onClose` is a **callback prop** — its type will be `() => void` in the interface
- The **parent component** passed it in when it rendered this component
- The child calls it — the parent decides what it does
- To find the implementation, search for where `<ThisComponent onClose=` is called

<!-- incremental_lists: false -->

<!-- pause -->

**This is the entire data flow model.** Data flows down through props. Events flow up through callbacks. The rest of the day is this pattern applied to state.

<!--
speaker_note: |
  This is the session's payoff. If one thing sticks from Session 2, it's this:
  "I can read any component if I find its interface and find where it's called."
  The session has given them both of those tools.
-->

<!-- end_slide -->