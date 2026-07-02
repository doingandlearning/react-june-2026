---
title: "**Accessibility to AA**"
sub_title: Day 3 — Session 3
author: Kevin Cunningham
---

## The audit question

You run Lighthouse on the ToolDirectory. Accessibility score — 74.  
Your manager asks: "Is it accessible?"

**What do you say?**

<!--
speaker_note: |
  Let this sit for a moment. 74 out of 100 feels like a pass, but it isn't.
  Expected answers — "it depends on what failed", "not fully", "we need to fix the failures first".
  The 74 is almost meaningless without knowing what failed. A missing lang attribute scores differently to unlabelled form inputs.
  Keep this scenario. Return at the end when they've run an actual audit.
-->

<!-- end_slide -->


<!-- jump_to_middle -->

Lighthouse and WAVE
===

<!-- end_slide -->

## What Lighthouse measures

Lighthouse runs in Chrome DevTools — Cmd+Opt+I → Lighthouse tab → Analyse page load.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Five scored categories**

<!-- incremental_lists: true -->

- **Performance** — load speed, time to interactive
- **Accessibility** — automated WCAG checks
- **Best Practices** — HTTPS, console errors, deprecated APIs
- **SEO** — meta tags, crawlability
- **PWA** — service worker, manifest (Day 3 topic)

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**For internal tools, focus on**

Accessibility and Best Practices. Performance matters less for internal tools behind a VPN — the audience is small and on good connections.

<!-- pause -->

Accessibility score of **90+** is the realistic WCAG AA target for a working app. 100 is achievable with care.

<!-- reset_layout -->

<!-- pause -->

**The accessibility score is a floor, not a ceiling.** Lighthouse catches about 30–40% of WCAG issues automatically. The rest require manual testing — WAVE and screen reader checks cover the gap.

<!--
speaker_note: |
  The "30-40% automated coverage" figure is important to set expectations.
  Lighthouse passing does not mean the app is fully accessible. It means the
  automatable checks pass. Focus management, screen reader announcement, logical
  reading order, and keyboard traps cannot be fully automated — they need a
  human tester. WAVE (browser extension) catches some of what Lighthouse misses.
  For Day 3, there's a dedicated accessibility session that goes deeper.
-->

<!-- end_slide -->

## Reading a Lighthouse accessibility result

Lighthouse groups issues by severity. Focus on the failures first.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Common failures in React apps**

<!-- incremental_lists: true -->

- Missing `<html lang>` attribute
- Images without `alt` text
- Buttons with no accessible name (icon buttons)
- Form inputs with no associated label
- Insufficient colour contrast
- Links whose text is not descriptive ("click here")

<!-- incremental_lists: false -->

<!-- column: 1 -->

<!-- pause -->

**Reading the output**

Each failure links to the element in the DOM. Click through to see exactly which element failed and why.

<!-- pause -->

Fix the failures before chasing the score. A score of 95 with known failures is worse than a score of 80 where every remaining issue is a known limitation.

<!-- reset_layout -->

<!--
speaker_note: |
  Run Lighthouse live on the finished ToolDirectory at this point if time allows.
  The failures will be real and fixable — missing lang attribute, any icon buttons
  that haven't been labelled yet. Fixing one live is more memorable than listing
  them abstractly. If time is short, skip the live run and move to the lab handover.
  This is the natural cut point if Day 2 is running long — the lab can include
  the Lighthouse task without the session covering it in depth.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

What WCAG AA Actually Means
===

<!-- end_slide -->

## WCAG AA — the practical version

WCAG has three levels — A, AA, AAA. AA is the legal and professional baseline in the UK.


| Principle | What it means in practice |
|---|---|
| **Perceivable** | Content is available to the senses — text alternatives for images, sufficient colour contrast |
| **Operable** | Everything works with a keyboard, no seizure-triggering content, enough time |
| **Understandable** | Language is declared, errors are explained, forms are labelled |
| **Robust** | Works with assistive technology — valid HTML, correct ARIA roles |


For internal tools — you're most likely to fail on **Operable** (keyboard) and **Understandable** (forms, errors).


<!--
speaker_note: |
  The acronym is POUR — Perceivable, Operable, Understandable, Robust.
  For internal tooling the audience is small and known. That doesn't lower the bar — it often means there are specific users with specific needs.
  The most common AA failures in React apps — missing form labels, insufficient colour contrast, focus not managed on route change, no skip link.
  AA doesn't require perfection. It requires systematic attention to the four principles.
-->

<!-- end_slide -->

## What React gives you — and what it doesn't

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**React handles:**

- Escaping HTML output (XSS protection)
- Rendering to the DOM with correct attribute names
- Synthetic events that work cross-browser

**React does not handle:**

- Whether your HTML is semantic
- Whether your inputs have labels
- Whether focus is managed when content changes
- Whether colour contrast meets AA

<!-- column: 1 -->

A React app has no inherent accessibility advantage over a plain HTML page.

The component model can help — an accessible `<Button>` component used everywhere is better than fixing every button — but only if you build it accessibly first.

<!-- reset_layout -->

<!--
speaker_note: |
  This resets assumptions. Some developers think React handles a11y for them. It doesn't.
  The component library argument cuts both ways — if your shared Button has no accessible name, every button in the app fails.
  MUI (Day 4) gives you accessible components out of the box. But custom components need building correctly.
  The Blazor comparison — MudBlazor wraps Material components with accessibility baked in. MUI is the React equivalent.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Focus Management in SPAs
===

<!-- end_slide -->

## The SPA focus problem

In a traditional multi-page app, every navigation loads a new page. Focus resets to the top.

In a React SPA — **the page doesn't reload. Focus stays wherever it was.**

<!-- pause -->

```
User clicks "Deploy Bot" link → /tools/1 loads → focus stays on the link in the list
Screen reader user — hears nothing. Has no idea the page changed.
```

<!-- pause -->

This is one of the most common AA failures in React applications.

<!--
speaker_note: |
  Demo this if possible — tab to a link, click it, notice focus doesn't move.
  Screen reader users navigate by listening to focus. If focus doesn't move, they don't know content changed.
  The fix — move focus to the page heading or the main content area on route change.
  React Router doesn't handle this automatically. You need to do it.
-->

<!-- end_slide -->

## Managing focus on route change

```tsx
// In AppLayout or a dedicated FocusManager component
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function FocusManager() {
  const location = useLocation();
  const mainRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <h1 tabIndex={-1} ref={mainRef}>
      {/* page title */}
    </h1>
  );
}
```

`tabIndex={-1}` — allows programmatic focus on an element that isn't normally focusable.

<!--
speaker_note: |
  The `tabIndex={-1}` pattern appeared in Session 7 for error messages — same technique, same reason.
  Some teams move focus to the `<main>` element instead of the h1. Either works — consistency matters more than which element.
  An alternative — an sr-only "live region" that announces the new page title. Both approaches are valid AA.
  This is a one-time fix that benefits every page in the app.
-->

<!-- end_slide -->

## Focus management for modals and dynamic content

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**Modal opens** — focus moves inside it

```tsx
useEffect(() => {
  if (isOpen) {
    firstFocusableRef.current?.focus();
  }
}, [isOpen]);
```

**Modal closes** — focus returns to the trigger

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (!isOpen) {
    triggerRef.current?.focus();
  }
}, [isOpen]);
```

<!-- column: 1 -->

**Validation errors** — focus moves to first error

```tsx
useEffect(() => {
  if (submitted && errors.name) {
    nameErrorRef.current?.focus();
  }
}, [submitted, errors]);
```

You built this in Session 7.

<!-- reset_layout -->

<!--
speaker_note: |
  The pattern is consistent — useEffect + ref + focus().
  The modal pattern also needs a focus trap — Tab should cycle within the modal, not reach behind it.
  There are libraries for this — @radix-ui/react-dialog, headlessui — but the principle is the same.
  Emphasise the validation error pattern — they've already done this. Connect new knowledge to existing work.
-->

<!-- end_slide -->

<!-- jump_to_middle -->

Auditing with WAVE and Lighthouse
===

<!-- end_slide -->

## Lighthouse — reading the results

<!-- column_layout: [3, 2] -->

<!-- column: 0 -->

**DevTools → Lighthouse → Accessibility**

The score is a starting point, not the goal.

What matters —

- **Failures** (red) — fix these first; they indicate definite AA violations
- **Warnings** (orange) — review; some are real failures, some need context
- **Passing** (green) — good, but Lighthouse can't catch everything

Common failures in React apps —

- Missing `lang="en"` on `<html>`
- Form inputs without labels
- Buttons with no accessible name
- Insufficient colour contrast

<!-- column: 1 -->

A score of 100 does not mean fully accessible.  
Lighthouse tests ~30% of WCAG AA criteria automatically.

The rest requires manual testing.

<!-- reset_layout -->

<!--
speaker_note: |
  Fix the lang attribute first — it's one line in index.html and dramatically improves screen reader pronunciation.
  Buttons with no accessible name — icon-only buttons are a common case. Fix with aria-label or a visually-hidden span.
  Colour contrast — Lighthouse catches most, but not all. The contrast ratio for AA is 4.5:1 for normal text.
  Remind them — the Session 8 lab included a Lighthouse task. Today they'll go deeper.
-->

<!-- end_slide -->

## WAVE — what Lighthouse misses

**WAVE** (Web Accessibility Evaluation Tool) — browser extension, free.

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**WAVE catches what Lighthouse doesn't —**

- Empty links (links with no text)
- Redundant alt text ("image of a dog" on an `<img alt="image of a dog">`)
- Suspicious contrast in dynamic content
- Structural issues — skipped heading levels, missing landmarks

Run it alongside Lighthouse, not instead of it.

<!-- column: 1 -->

**The manual testing gap —**

- Keyboard-only navigation — tab through every interactive element
- Screen reader testing — VoiceOver (Mac), NVDA (Windows), or the browser's built-in
- Focus visibility — can you always see where focus is?
- Reading order — does the DOM order make sense without CSS?

<!-- reset_layout -->

<!--
speaker_note: |
  Install WAVE as a Chrome/Edge extension before the session.
  WAVE adds visual overlays — red icons are errors, yellow are alerts.
  The reading order check — disable CSS in DevTools and read the page top to bottom. If it's confusing, so is the screen reader experience.
  Screen reader testing doesn't require expertise — just turn it on, navigate with Tab and arrow keys, and notice what's announced.
-->

<!-- end_slide -->

## Screen reader basics — what to know

<!-- column_layout: [1, 1] -->

<!-- column: 0 -->

**VoiceOver (Mac)**  
`Cmd + F5` to toggle  
`VO + →` to navigate forward  
`Tab` to move between focusable elements  
`VO + Space` to activate

**NVDA (Windows, free)**  
`Insert + Q` to quit  
`H` to navigate by heading  
`F` for form fields  
`B` for buttons

<!-- column: 1 -->

**What to listen for —**

- Is the button name meaningful? "Button" alone is useless.
- Is the form error announced when it appears?
- Does navigating to a new page announce the page title?
- Are images described or marked as decorative?

<!-- reset_layout -->

<!--
speaker_note: |
  Don't go deep into screen reader commands — this is orientation, not training.
  The goal — developers should turn VoiceOver on once and tab through their own app. That experience changes how they write HTML.
  For internal tools — even if no current user uses a screen reader, contract staff, future hires, and accessibility auditors will.
  "role=alert" from Sessions 5 and 7 — that's what makes error messages announced automatically. Connect to what they built.
-->

<!-- end_slide -->

## Common React a11y patterns — quick reference

| Scenario | Pattern |
|---|---|
| Validation error | `aria-invalid`, `aria-describedby`, `role="alert"` |
| Live updating count | `role="status"` or `aria-live="polite"` |
| Icon-only button | `aria-label="Dismiss Deploy Bot"` |
| Image (decorative) | `alt=""` |
| Image (meaningful) | `alt="Description of what the image conveys"` |
| Route change focus | `useEffect` + `ref.focus()` on `[location.pathname]` |
| Modal focus trap | Move focus in on open, return trigger focus on close |
| Skip link | `<a href="#main">Skip to content</a>` as first element |

<!--
speaker_note: |
  This is a reference slide, not a lecture. Read through it, invite questions.
  The patterns in rows 1–3 appear in the code they wrote. The others are extensions.
  A skip link lets keyboard and screen reader users bypass nav and jump to content. One line of HTML, significant impact.
  aria-live regions — "polite" waits for the user to finish before announcing. "assertive" interrupts. Use polite almost always.
-->

<!-- end_slide -->

## Lab — audit and fix the ToolDirectory

**In the student-app, run Lighthouse and WAVE on Session 8.**

Fix every failure. Work through this order —

<!-- incremental_lists: true -->

1. Add `lang="en"` to `index.html`
2. Find any inputs without visible labels and fix them
3. Find any buttons without accessible names and fix them
4. Check colour contrast on the status badges (active/deprecated)
5. Tab through the entire app — note anywhere focus is invisible or jumps unexpectedly
6. Add a focus manager for route changes

<!-- incremental_lists: false -->

**Document one warning you chose not to fix and why.**

<!--
speaker_note: |
  Allow 25–30 minutes for this.
  Circulate and check that students have WAVE installed and can run Lighthouse.
  The colour contrast on the CSS Module badges from Session 8 — the dcfce7/166534 green passes AA. The fee2e2/991b1b red passes AA. Worth confirming.
  The "document a warning" task pushes them to think critically rather than fixing everything blindly.
  Bring the group back together to share what they found — the variety of issues usually sparks good discussion.
-->

<!-- end_slide -->

## Back to the audit question

Lighthouse — accessibility score 74.  
Your manager asks: "Is it accessible?"

**Now you can answer.**

<!-- pause -->

The score tells you automated checks found issues. What matters —

<!-- incremental_lists: true -->

- What specific failures exist, and are they AA violations?
- Have you done manual keyboard and screen reader testing?
- Have you fixed the failures Lighthouse surfaces?

<!-- incremental_lists: false -->

<!-- pause -->

A score of 100 after fixing failures is a floor, not a ceiling. AA compliance requires both automated and manual testing.

<!--
speaker_note: |
  Close the loop on the opening provocation.
  The honest answer to the manager — "Automated checks pass, we have some warnings to review, and we've done basic keyboard testing. We haven't done a full screen reader audit."
  That's an accurate, professional answer. It doesn't overclaim.
-->

<!-- end_slide -->

## Summary

<!-- incremental_lists: true -->

1. **WCAG AA** — the four POUR principles; for internal tools, operable and understandable are where you'll fail
2. **React doesn't help** — semantic HTML and ARIA are your responsibility; the component model can help or hurt
3. **Focus management** — the most overlooked SPA problem; fix it with `useEffect` + `ref.focus()`
4. **Lighthouse is a floor** — fixes failures first; use WAVE and manual testing to find the rest
5. **The patterns are consistent** — `role="alert"`, `aria-live`, `aria-describedby` — you've used them already

<!-- incremental_lists: false -->

<!-- end_slide -->

## Bridge to Session 4

**We've established:**

<!-- incremental_lists: true -->

- What AA means in practice and where React apps typically fail
- How to audit with Lighthouse and WAVE and act on the results

<!-- incremental_lists: false -->

**Session 4 — PWA Overview** — what makes a Progressive Web App, when it's worth it for internal tools, and a quick Lighthouse PWA audit.

The Lighthouse audit you ran today has a PWA tab. Session 4 explains what those criteria mean.

<!-- end_slide -->
