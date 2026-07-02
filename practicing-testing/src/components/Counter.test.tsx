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
  it("increments the count by 1 when the Increment button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole("button", { name: "Increment" });
    await user.click(button);

    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });

  // TODO 2: replace this with a real test.
  // Same shape as TODO 1, but click "Decrement" and expect "Count: -1"
  it("decrements the count by 1 when the Decrement button is clicked", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole("button", { name: "Decrement" });
    await user.click(button);

    expect(screen.getByText("Count: -1")).toBeInTheDocument();
  });

  // TODO 3: replace this with a real test.
  // Hint: pass a prop this time — render(<Counter initialCount={5} />) —
  // then check screen.getByText("Count: 5") is in the document
  it("starts at a custom number when initialCount is passed in", () => {
    render(<>
      <Counter initialCount={5} />
      <Counter initialCount={10} />
    </>);
    expect(screen.getByText("Count: 5")).toBeInTheDocument();
    expect(screen.getByText("Count: 10")).toBeInTheDocument();
  });
});
