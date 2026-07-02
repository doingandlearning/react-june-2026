import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders a labelled search input", () => {
    // Arrange
    render(
      <FilterBar
        query=""
        onQueryChange={() => { }}
        showDeprecated={false}
        onShowDeprecatedChange={() => { }}
      />
    );

    // Act
    const input = screen.getByRole("textbox", { name: /filter/i });

    // Assert
    expect(input).toBeInTheDocument();
  });

  it("calls onQueryChange once per character typed", async () => {
    // Arrange
    const handleChange = vi.fn();
    const user = userEvent.setup(); // Allows me to simulate typing events

    render(
      <FilterBar
        query=""
        onQueryChange={handleChange}
        showDeprecated={false}
        onShowDeprecatedChange={() => { }}
      />
    );

    // Act
    const input = screen.getByRole("textbox", { name: /filter/i });
    await user.type(input, "deploy");

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(6);
  });
});
