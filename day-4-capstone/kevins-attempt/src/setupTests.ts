import "@testing-library/jest-dom";

// jsdom doesn't implement matchMedia. MUI's useMediaQuery and our own
// prefers-reduced-motion check (FeedbackForm's confetti trigger) both call
// it, so anything that renders those in tests needs a stub.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
