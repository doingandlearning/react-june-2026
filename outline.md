React for .NET/Blazor Developers
4-Day Training Programme — Course Proposal
 

Overview

This programme takes your .NET and Blazor development team from first principles in React through to confidently reading and extending your existing React codebase. It is structured around your team’s real context: internal tooling, a MudBlazor background, TypeScript, and an existing React.
 
The course is delivered in two blocks. Days 1 and 2 run together as a foundation block. Days 3 and 4 are standalone follow-on days, each with a short recap at the start. A gap task between Days 2 and 3 gives participants time to consolidate and surfaces any issues before Day 3 begins.
 
Audience and Approach

The course is designed for developers coming from C#, .NET, and Blazor/MudBlazor, with one participant who already has React experience. It acknowledges what the team already knows — the component model, data binding, lifecycle, a proper build toolchain — and builds directly from that foundation rather than starting from scratch.
 
TypeScript is used throughout. Accessibility to WCAG AA is treated as a professional standard, not an afterthought. Security, testing, and practical application structure are woven through the programme rather than siloed into a single day.
 
Daily Timings

 
Time
Session
9.30 – 11.00
Session 1
11.00 – 11.15
Break
11.15 – 12.45
Session 2
12.45 – 1.45
Lunch
1.45 – 3.15
Session 3
3.15 – 3.30
Break
3.30 – 4.30
Session 4
 
Delivery Structure

 
Days 1–2 run together as a block. Day 3 and Day 4 are standalone sessions delivered on separate dates, each opening with a 15-minute recap and Q&A.
 
DAY 1  Thinking in React
 
Session 1 — From Blazor to React
– What React is and isn’t: comparison with Blazor and Angular
– The component model: what transfers from Blazor, what doesn’t
– Setting up a project with Vite, React, and TypeScript
– JSX: what it compiles to and how to read it as a Blazor developer


Session 2 — Components and Props
– Functional components and TypeScript interfaces for props
– Composition over inheritance
– Conditional rendering and list rendering (.map() in depth)
– Passing callbacks as props

Session 3 — State and Interactivity
– useState: local state and how it differs from Blazor’s two-way binding
– Event handling and controlled inputs
– Lab: build a small interactive filterable list

Session 4 — Component Architecture
– Lifting state up
– Thinking about component boundaries
– Accessibility foundations: semantic HTML in JSX, ARIA basics
– Lab: refactor the filterable list into a proper component tree

 
DAY 2  Hooks, Routing, and a Complete App
 
Session 1 — Core Hooks and Side Effects
– useEffect: fetching data, cleanup, dependency array pitfalls
– useRef: DOM access and persisting values
– Custom hooks: extracting and reusing logic
– TypeScript patterns with hooks
Session 2 — SPAs and Routing
– React Router v6: BrowserRouter, Routes, Route, Link, useNavigate, useParams
– Layouts and nested routes
– Protecting routes: the auth guard pattern
Session 3 — Forms, Validation, and Security
– Controlled forms with TypeScript
– Client-side validation patterns
– Accessibility in forms: labels, error messages, ARIA live regions
– Input sanitisation: where React protects you, where it doesn’t, DOMPurify
– Secrets management: .env files and what Vite exposes to the client
Session 4 — Completing the App
– useContext for shared state across the component tree
– CSS Modules: scoped styles in React, comparison with Blazor’s .razor.css model
– Structuring a real application: feature folders and co-location
– Lab: complete a small CRUD app with routing, a form, and fetched data
– Lighthouse and WAVE walkthrough on the completed app
 
Gap Task — Between Days 2 and 3
Completed independently before Day 3. The notes feed directly into the Day 3 opening discussion.
– Add a second route with its own view
– Pass data between routes using route params or context
– Add CSS Modules styling to at least two components
– Run a Lighthouse accessibility audit and fix at least one issue it surfaces
– Note one thing that confused you and one thing you’d like to go deeper on
 

 
DAY 3  Testing, State Management, and PWA Overview
 
Opens with a retro on the gap task: what came up, what was hard, what to carry into the day.
 
Session 1 — Testing React
– Testing philosophy: unit, integration, end-to-end — what to prioritise for internal tools
– Vitest and React Testing Library: setup and first tests
– Testing user interactions and async behaviour
– Testing Library’s accessibility-first query approach (getByRole etc.)
– Mocking API calls
Session 2 — State and Data Fetching
– The key distinction: client state vs server state
– useState for local state, useContext for shared state — and when that’s enough
– Zustand if context starts to feel painful: the pragmatic step up
– Server state is a different problem: caching, synchronisation, loading and error states
– TanStack Query as the standard answer to server state — concept and demo
Session 3 — Accessibility to AA
– WCAG AA in practical terms: what it means for internal tools
– Focus management in SPAs: route changes, modals, dynamic content
– WAVE and Lighthouse audits: reading results and acting on them
– Screen reader basics
– Lab: audit and fix a component set
Session 4 — PWA Overview
– What makes a PWA: manifest, service worker, installability
– When it’s worth it for internal tools
– Vite PWA plugin: quick setup walkthrough
– Caching strategies at a glance
– Lighthouse PWA audit: what to aim for
 

DAY 4  UI Libraries, Existing Codebases, and the Bus Number
 
Opens with a short Q&A on anything outstanding from Day 3.
 
Session 1 — CSS Modules in Depth and the Styling Landscape
– CSS Modules patterns: composition, variables, naming conventions
– How this compares to other React styling approaches — knowing the map even if you’re not visiting everywhere
– Why component libraries handle their own styling and what that means for your CSS Modules code
Session 2 — Component Libraries: MUI
– The MudBlazor comparison: same Material Design roots, familiar mental model
– Installing and configuring MUI
– Theming and customisation alongside CSS Modules
– Accessibility baseline you get for free, and where you still need to do work
– Hands-on: build a small UI with MUI components
Session 3 — Reading the Existing React Codebase
– Patterns they’ll encounter: class components, older hook patterns, legacy Redux
– Making sense of an unfamiliar component tree
– Identifying what’s safe to touch and what needs care
– Where the tests are (or aren’t)
Session 4 — Extending It Confidently
– Adding a new feature to the existing app structure
– Writing a test for what you’ve added
– Applying the accessibility and security checklist from Days 2–3
– Closing discussion: what to tackle first when you get back to the codebase
 

Assumptions and Open Questions

This proposal is based on the scoping call and makes the following assumptions. Please confirm or correct before finalising the programme design.
 
Confirmed

– TypeScript throughout
– Accessibility to WCAG AA is a requirement, including use of WAVE and Lighthouse
– Input sanitisation and secrets management are in scope for the security section
– CSS Modules as the default styling approach (consistent with the Blazor .razor.css model)
– MUI as the component library for Day 4 (Material Design, closest analogue to MudBlazor)
– PWA is an overview session rather than a full hands-on day
Open Question

Does the existing React application use Redux? If so, the Day 3 state management session and Day 4 codebase session will weight Redux Toolkit more heavily, so participants can read and work with what’s already there rather than encountering it for the first time in production.
 
This outline is a working proposal and can be adjusted based on your feedback, the Redux question above, and any further context about the existing codebase.