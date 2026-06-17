import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AddToolPage } from "./AddToolPage";
import { submitTool } from "../../mock-api";

vi.mock("../../mock-api");

function renderAddToolPage() {
  return render(
    <MemoryRouter initialEntries={["/tools/add"]}>
      <Routes>
        <Route path="/tools/add" element={<AddToolPage />} />
        <Route path="/" element={<p>Home</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AddToolPage", () => {
  it("shows a validation error when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderAddToolPage();

    await user.click(screen.getByRole("button", { name: /add tool/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/tool name/i);
  });

  it("submits the form and navigates away on success", async () => {
    vi.mocked(submitTool).mockResolvedValue({
      id: "99",
      name: "Deploy Bot 2",
      owner: "Platform",
      status: "active",
      category: "devops",
    });

    const user = userEvent.setup();
    renderAddToolPage();

    await user.type(screen.getByLabelText(/tool name/i), "Deploy Bot 2");
    await user.type(screen.getByLabelText(/owner/i), "Platform");
    await user.click(screen.getByRole("button", { name: /add tool/i }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /add tool/i })).not.toBeInTheDocument();
    });
  });
});
