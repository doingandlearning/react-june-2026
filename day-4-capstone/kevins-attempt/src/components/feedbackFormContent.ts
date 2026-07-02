import confetti from "canvas-confetti";

export const RATING_ERROR_ID = "rating-error";

// Decorative only — the Rating component already exposes the numeric value
// accessibly (e.g. "4 Stars"), so this is aria-hidden rather than adding a
// second, redundant announcement.
export const RATING_EMOJI: Record<number, string> = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😄",
  5: "🤩",
};

export const CONFIRMATION_MESSAGES = [
  "Thanks for your feedback!",
  "You're a legend — thanks for that!",
  "Feedback received, high five! 🙌",
  "Got it — appreciate you taking the time!",
  "Boom! Feedback delivered.",
];

export function celebrate() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Dev-only escape hatch: visiting with ?confetti=force in the URL bypasses
  // the reduced-motion guard below, so the effect can be previewed locally
  // without having to change OS-level accessibility settings. Gated to dev
  // builds (import.meta.env.DEV is false in a production build), so this
  // never gives real users a way around their own stated preference — per
  // WCAG 2.3.3 (Animation from Interactions), that preference should always
  // win in production.
  const forcedForPreview =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("confetti") === "force";

  if (prefersReducedMotion && !forcedForPreview) {
    return;
  }
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.6 },
  });
}
