<!-- jump_to_middle -->

Session 4 — Component Architecture
===

<!-- end_slide -->

## Opening scenario

You're extending the tool directory. The search input is inside `ToolList`.
A new requirement arrives: add a result count above the list that updates
as the user types.

You realise the count needs the same query value the input holds.
But the count lives outside `ToolList`.

**Type in chat: where does the query state need to move?**

<!--
speaker_note: |
  Most people will say "up" or "to the parent" — which is correct. The session
  names and formalises that instinct. If anyone says "pass it up via a callback",
  that's also right — and it's exactly what lifting state involves.
  This scenario is deliberate: they built something close to this in Session 3.
  The problem is concrete because they've just lived it.
-->

<!-- end_slide -->

## The problem — trapped state

State that lives too low in the tree can't be shared.

```tsx
// query is trapped inside ToolList
// ResultCount has no way to see it

function ToolList() {
  const [query, setQuery] = useState(""); // only ToolList can see this

  const visible = tools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((t) => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

function ToolDirectory() {
  return (
    <div>
      <ResultCount /> {/* needs query — can't get it */}
      <ToolList />    {/* owns query — won't share it */}
    </div>
  );
}
```

<!-- pause -->

`ResultCount` and `ToolList` are siblings. Neither can reach into the other.
The only route between them is **up through their common parent**.

<!--
speaker_note: |
  Let the problem sit for a moment before moving to the fix. The instinct is to
  reach for a global solution — Redux, Context — but the right first move is
  almost always just lifting the state. Global solutions are for when lifting
  becomes genuinely painful, not as a first response.
-->

<!-- end_slide -->

## Lifting state up — the fix

Move state to the lowest ancestor that contains every component that needs it.

```tsx
function ToolDirectory() {
  const [query, setQuery] = useState(""); // lifted here — both children can see it

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

<!-- pause -->

`ToolList` no longer owns the query — it receives it as a prop and reports changes
via a callback. `ResultCount` gets what it needs from the same parent.

<!-- pause -->

**The rule:** when you're unsure where state belongs, ask who needs it.
Put it in the lowest ancestor that contains all of them.

<!--
speaker_note: |
  Point out what changed in ToolList: it went from owning state to receiving it.
  This is a common refactor in real codebases — components that started small
  and owned their own state, then grew until they needed to share it.
  The pattern is always the same: identify the lowest common ancestor, move the
  state there, pass it down as props.
-->

<!-- end_slide -->

## Thinking about component boundaries

When do you extract a new component?

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

Look at this JSX. Where would you draw the lines?

```tsx
function ToolDirectory() {
  return (
    <div>
      <div className="header">
        <h1>Internal Tools</h1>
        <span>{visible.length} of {tools.length}</span>
      </div>
      <div className="filters">
        <input value={query} onChange={...} placeholder="Filter..." />
        <label>
          <input type="checkbox" checked={showDeprecated} onChange={...} />
          Show deprecated
        </label>
      </div>
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong>
            <span>{t.owner}</span>
            <span className={t.status}>{t.status}</span>
            <button onClick={() => onDismiss(t.id)}>Dismiss</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

<!-- column: 1 -->

Three signals to extract:

<!-- incremental_lists: true -->

- **More than one reason to change** — the header, filters, and list item all change independently
- **Reusable elsewhere** — a `StatusBadge` or `FilterBar` has value outside this component
- **Hard to read at a glance** — if you have to scan to understand it, a named component adds clarity

<!-- incremental_lists: false -->

<!-- reset_layout -->

<!-- pause -->

**Type in chat: name one component you'd extract from this — what would you call it?**

<!--
speaker_note: |
  Good answers: FilterBar, ToolItem, ResultCount, StatusBadge. All defensible.
  The point isn't the right answer — it's getting them to apply a criterion rather
  than gut feel. If two people name the same thing, ask them if they'd give it the
  same props. That usually surfaces a useful disagreement.
-->

<!-- end_slide -->

## Semantic HTML in JSX

React renders HTML. The same accessibility rules apply.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Use the right element for the job**

```tsx
// Broken — a div with a click handler
// Not focusable, not keyboard-activatable
// Screen readers announce it as nothing
<div onClick={handleDismiss}>Dismiss</div>

// Fixed — a button
// Focusable, Enter/Space activatable
// Announced as "Dismiss, button"
<button onClick={handleDismiss}>Dismiss</button>
```

<!-- column: 1 -->

**The rule of thumb:**

- Does it **do something**? → `<button>`
- Does it **go somewhere**? → `<a href="...">`
- Does it **contain a section of content**? → `<section>`, `<article>`, `<nav>`
- Is it **just layout**? → `<div>` or `<span>`

<!-- reset_layout -->

<!-- pause -->

This matters for the existing codebase. `<div onClick>` is a common pattern in older React code. When you see it, it's a bug — not a style choice.

<!--
speaker_note: |
  If anyone asks "but it works, doesn't it?" — yes, for mouse users. Tab through
  the page and you'll skip every div-as-button. Screen reader users get nothing.
  Keyboard-only users (including power users who never touch a mouse) can't
  activate it. It's not an edge case — it affects a meaningful proportion of users
  of any internal tool.
-->

<!-- end_slide -->

## ARIA — when HTML isn't enough

Semantic HTML covers most cases. ARIA fills the gaps.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Icon buttons need a label**

```tsx
// What does this button do?
// A screen reader announces: "button"
<button onClick={onClose}>
  <XIcon />
</button>

// Fixed:
<button onClick={onClose} aria-label="Close panel">
  <XIcon />
</button>
```

**Dynamic content needs announcement**

```tsx
// Status messages that appear after an action
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

<!-- column: 1 -->

**The practical shortlist for internal tools:**

<!-- incremental_lists: true -->

- `aria-label` — name a control when visible text isn't enough
- `aria-live="polite"` — announce dynamic updates (status messages, counts)
- `aria-describedby` — connect an input to its hint or error text
- `aria-expanded` — indicate open/closed state on toggles and dropdowns

<!-- incremental_lists: false -->

<!-- reset_layout -->

<!--
speaker_note: |
  Don't overwhelm them with ARIA. The message is: semantic HTML first, ARIA only
  when HTML can't express the meaning on its own. An icon button with no text is
  the most common case they'll hit immediately. The aria-live pattern comes up
  any time you show a toast, a count update, or a form error.
-->

<!-- end_slide -->

## Closing the loop — Session 4

Back to the opening: the query is trapped in `ToolList`, and `ResultCount` can't see it.

Now you can answer precisely:

<!-- incremental_lists: true -->

- The query state belongs in `ToolDirectory` — the lowest ancestor of both components
- `ToolList` receives `query` and `onQueryChange` as props
- `ResultCount` receives `count` and `total` as props
- Neither child owns state they need to share

<!-- incremental_lists: false -->

<!-- pause -->

**Lifting state is not a refactoring smell. It is the architecture.**

<!--
speaker_note: |
  This connects back to Sessions 2 and 3: callbacks let children report events,
  useState lets components hold values, lifting state puts those values where they
  can be shared. The three sessions form one pattern.
-->

<!-- end_slide -->

## Day 1 summary

<!-- incremental_lists: true -->

1. **React is a library** — routing, forms, state management are explicit choices
2. **Props down, callbacks up** — the complete data flow model
3. **Never mutate state directly** — always call the setter with a new value
4. **Lift state to the lowest common ancestor** — when two components need the same value, move it up
5. **Semantic HTML is not optional** — buttons for actions, anchors for navigation, labels for inputs

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Day 2

**Today you built the foundation:**

<!-- incremental_lists: true -->

- Components with typed props
- Controlled state and one-way data flow
- Component trees where state lives in the right place

<!-- incremental_lists: false -->

**Day 2 — Hooks, Routing, and a Complete App:**

What happens when state needs to talk to a server? When your app has multiple pages?
When a form needs validation before it can submit?

The patterns from today carry forward. The vocabulary gets larger.

<!-- end_slide -->

<!-- jump_to_middle -->

Questions?
===