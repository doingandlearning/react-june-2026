# Reading the Existing Codebase — and Extending It Confidently

*A condensed reference, not a taught session. This replaces the original Day 4 Session 3 ("Reading the Existing React Codebase") and Session 4 ("Extending It Confidently") — there wasn't room to teach these live this time, so take ten minutes to actually read this rather than filing it away unread. Come back to it the first time you open a PR against the real app.*

---

## Reading an unfamiliar component tree

**Start at the routes, not the components.** The `Routes`/`Route` tree (Session 6) tells you the shape of the app faster than clicking through folders — it's the app's table of contents.

**Find the entry point and its providers next.** Open `main.tsx` / `App.tsx` and see what's wrapped around the app — Context providers, a Redux `<Provider>`, `QueryClientProvider`, a theme provider. Whatever's global is declared right there, before you've read a single feature component.

**Grep for patterns before you read files.** Search the codebase for `useContext(`, `connect(`, `useSelector(`, `class .* extends Component` — a rough census of what era each part of the app is from, before you commit to reading anything in depth.

**Patterns you're likely to meet that we didn't build this week:**

- **Class components** — `this.setState`, lifecycle methods like `componentDidMount` / `componentDidUpdate`. Conceptually the closest match is Blazor's `OnInitializedAsync` / `OnParametersSetAsync` — same idea (do something when the component mounts or its inputs change), older syntax.
- **Older hook patterns** — hand-rolled data fetching with `useEffect` + `useState` + manual loading/error flags, written before the app had TanStack Query. Functionally equivalent to what you built in Session 5, just without the caching layer from Session 10.
- **Legacy Redux** — `connect()` HOCs, `mapStateToProps` / `mapDispatchToProps`, action type constants, a single global store. If the app you're going back to uses this, it's a different mental model from the Context/Zustand approach this course taught — worth flagging to your team lead so you get paired on your first Redux-touching change rather than reverse-engineering it solo.

---

## What's safe to touch vs what needs care

- **Safest** — a leaf component with no shared state and a test file sitting next to it.
- **Treat as shared infrastructure** — anything imported by more than two or three other files. Before changing its shape (props, return value, exported type), grep every call site.
- **Global state** — Context providers, a Redux store, a Zustand store. Changes here ripple outward; check every consumer before you touch the shape of the value it provides.
- **No test file at all** — not a green light to move fast. Treat the absence of a test as a signal to slow down and read more carefully, not less.

---

## Where the tests are (or aren't)

- Look for a `__tests__` folder, `.test.tsx` / `.spec.tsx` files sitting next to the component, or a top-level `tests/` directory.
- **Run the existing suite before you touch anything.** A red baseline you didn't cause is important information — better to know that on day one than to discover it after your PR.
- No tests in the area you're changing? That's not permission to skip writing one — see the checklist below.

---

## Extending it confidently — your first PR checklist

- [ ] Read the file you're changing in full before editing it — don't pattern-match from a quick skim.
- [ ] Follow the file's existing conventions, even where they differ from what you learned this week. Consistency within a file beats importing a "better" pattern from a different session.
- [ ] Add or extend a test for the behaviour you're adding, following the `render` + `screen` + `userEvent` pattern from Session 9.
- [ ] Run the accessibility checklist from Session 11 — keyboard reachability, labels, focus management — on anything you touch, not just the code you add.
- [ ] Run the security checklist from Session 7 if your change touches user input or secrets — sanitise anything rendered via `dangerouslySetInnerHTML`, check what a `.env` variable actually exposes to the client.
- [ ] Keep the PR small — one feature, not a feature bundled with a drive-by refactor.

---

## What to tackle first Monday

Answer these for yourself, not for a form:

1. What's the component you're most likely to touch first — and does it already have a test?
2. What from this course maps most directly onto that codebase? Routing? Context? Testing? Forms? That's your highest-leverage thing to be confident in before you start.
3. Who do you ask when a pattern in the codebase doesn't match anything from this week? Decide that now, not mid-PR.
