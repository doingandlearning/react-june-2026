import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { FeedbackForm } from "./FeedbackForm";

// FeedbackForm renders a <Link to="/history"> after a successful submit,
// so it needs a Router in the tree even though we're only testing the form.
function renderForm(onSubmit = vi.fn()) {
  render(
    <MemoryRouter>
      <FeedbackForm onSubmit={onSubmit} />
    </MemoryRouter>,
  );
  return { onSubmit };
}

describe("FeedbackForm", () => {
  it("renders the rating, comment field, and submit button", () => {
    renderForm();

    expect(screen.getByRole("radio", { name: "1 Star" })).toBeInTheDocument();
    expect(screen.getByLabelText("Comment")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit feedback" }),
    ).toBeInTheDocument();
  });

  it("shows a validation error when submitting without a rating", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(
      screen.getByText("Please select a star rating before submitting."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the rating and comment, then shows a confirmation in place of the form", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    // MUI's Rating renders the actual <input type="radio"> as visually
    // hidden with pointer-events: none (the visible click target is the
    // sibling <label>/icon). userEvent respects pointer-events and refuses
    // to click it, so we fire the native click event directly here instead.
    fireEvent.click(screen.getByRole("radio", { name: "4 Stars" }));
    await user.type(screen.getByLabelText("Comment"), "Great session!");
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(onSubmit).toHaveBeenCalledWith(4, "Great session!");
    expect(screen.getByText("Thanks for your feedback!")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Submit feedback" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View submission history" }),
    ).toBeInTheDocument();
  });
});
