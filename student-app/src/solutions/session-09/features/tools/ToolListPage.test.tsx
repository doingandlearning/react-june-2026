import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToolListPage } from "./ToolListPage";
import { fetchTools } from "../../mock-api";

vi.mock("../../mock-api");

describe("ToolListPage", () => {
  it("shows a loading state while tools are being fetched", () => {
    vi.mocked(fetchTools).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <ToolListPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading tools/i)).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(fetchTools).mockRejectedValue(new Error("Could not load tools."));

    render(
      <MemoryRouter>
        <ToolListPage />
      </MemoryRouter>
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not load tools.");
  });
});
