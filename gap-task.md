# Gap Task — Between Day 2 and Day 3

**Time:** 45 minutes core work, as long as you want if you get into it

**When:** complete this before Day 3. Bring your notes to the opening discussion.

---

## The task

Build a small app on something you're actually interested in.

It doesn't have to be impressive. It doesn't have to be finished. It just has to be yours — a topic you'd genuinely enjoy poking at for 45 minutes.

Some starting points if you're stuck for ideas:

- A reading list with a list view and a detail page per book
- A recipe index — ingredients and method on the detail page
- A gig or concert tracker — upcoming shows, past shows, a detail view for each
- A film watchlist with status (watched / want to watch)
- A run or workout log
- A catalogue of something you collect

The subject doesn't matter. The constraint is the pattern: **a list page, a detail page, and some data connecting them.**

---

## What to build

**Two or three routes:**

- `/` — a list of items, each linking to its detail page
- `/:id` — a detail page for a single item, with a back link
- Optionally a third route — an add form, a filtered view, a settings page

**Your data:**

Use the same mock-api pattern from the lab — a module that exports an array and a couple of fetch functions with a `setTimeout` delay. This keeps you focused on the React rather than wrestling with a real API.

```ts
// e.g. books.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  status: "read" | "reading" | "want-to-read";
}

const BOOKS: Book[] = [ /* your data */ ];

export function fetchBooks(): Promise<Book[]> {
  return new Promise((resolve) => setTimeout(() => resolve(BOOKS), 500));
}

export function fetchBookById(id: string): Promise<Book | null> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(BOOKS.find((b) => b.id === id) ?? null), 300)
  );
}
```

**The patterns to use** — everything from Days 1 and 2 is fair game:

- `useEffect` for fetching, with loading and error states
- A custom hook wrapping the fetch logic
- React Router for navigation between views
- Controlled inputs if you add a filter or form
- Accessible markup throughout — labels, semantic elements, `aria-live` on counts

---

## If you have more time

Pick any of these that appeal — in any order:

**Style it.** Add CSS Modules to at least two components. Make it look like something you'd actually use.

**Add a form.** A third route at `/add` with a controlled form, validation, and a submit handler that pushes to your in-memory data.

**Filter the list.** A search input on the list page, derived state, a result count.

**Run Lighthouse.** Open DevTools → Lighthouse → run an accessibility audit. Fix every failure. Note any warnings you chose to leave.

**Protect a route.** Wire up a `RequireAuth` guard — even with a hardcoded flag — and put one route behind it.

---

## Before Day 3

Jot down answers to these three questions. They'll drive the opening discussion:

1. **What did you build?** One sentence on the topic and what the app does.
2. **What slowed you down?** The one thing that took longer than it should have, or left you unsure.
3. **What's one thing you'd like to go deeper on in Day 3?**

You don't need to finish. A half-built app with honest notes is more useful than a polished one with nothing to ask.

---

Day 3 opens with 15 minutes on what came up. Everything is on the table.
