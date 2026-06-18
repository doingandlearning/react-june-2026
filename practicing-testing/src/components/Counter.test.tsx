import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("Counter", () => {
  // WORKED EXAMPLE — read this one carefully. It shows the pattern every
  // component test follows: render it, then check what's on screen.
  it("starts at 0 by default", () => {
    // Arrange: render the component
    render(<Counter />);

    // Act: nothing to do — we're just checking the initial render

    // Assert: the starting count is visible on screen
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  // TODO 1: replace this with a real test.
  // Hints:
  //   - const user = userEvent.setup();
  //   - render(<Counter />);
  //   - find the button with screen.getByRole("button", { name: "Increment" })
  //   - click it with await user.click(button)
  //   - check screen.getByText("Count: 1") is in the document
  it.todo("increments the count by 1 when the Increment button is clicked");

  // TODO 2: replace this with a real test.
  // Same shape as TODO 1, but click "Decrement" and expect "Count: -1"
  it.todo("decrements the count by 1 when the Decrement button is clicked");

  // TODO 3: replace this with a real test.
  // Hint: pass a prop this time — render(<Counter initialCount={5} />) —
  // then check screen.getByText("Count: 5") is in the document
  it.todo("starts at a custom number when initialCount is passed in");
});
