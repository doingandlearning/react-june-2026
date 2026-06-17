import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToolListPage } from "./ToolListPage";
import { fetchTools } from "../../mock-api";

vi.mock("../../mock-api");

function renderToolListPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ToolListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ToolListPage", () => {
  it("shows a loading state while tools are being fetched", () => {
    vi.mocked(fetchTools).mockReturnValue(new Promise(() => {}));

    renderToolListPage();

    expect(screen.getByText(/loading tools/i)).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(fetchTools).mockRejectedValue(new Error("Could not load tools."));

    renderToolListPage();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not load tools.");
  });
});
