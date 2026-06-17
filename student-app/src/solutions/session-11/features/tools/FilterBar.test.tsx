import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders a labelled search input", () => {
    render(
      <FilterBar
        query=""
        onQueryChange={() => {}}
        showDeprecated={false}
        onShowDeprecatedChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox", { name: /filter/i });
    expect(input).toBeInTheDocument();
  });

  it("calls onQueryChange once per character typed", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FilterBar
        query=""
        onQueryChange={handleChange}
        showDeprecated={false}
        onShowDeprecatedChange={() => {}}
      />
    );

    const input = screen.getByRole("textbox", { name: /filter/i });
    await user.type(input, "deploy");

    expect(handleChange).toHaveBeenCalledTimes(6);
  });
});
