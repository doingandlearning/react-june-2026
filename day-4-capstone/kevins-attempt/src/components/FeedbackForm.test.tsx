import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CONFIRMATION_MESSAGES } from "./feedbackFormContent";
import { FeedbackForm } from "./FeedbackForm";

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

  it("groups the star rating under an accessible 'Rating' legend", () => {
    renderForm();

    // A screen reader user tabbing onto the star radios should hear this
    // group name, not just "1 Star, radio button" with no context.
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });

  it("shows a validation error when submitting without a rating, linked to the rating group via aria-describedby", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    const errorMessage = screen.getByText(
      "Please select a star rating before submitting.",
    );
    expect(errorMessage).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    const firstStar = screen.getByRole("radio", { name: "1 Star" });
    const group = firstStar.closest("[aria-describedby]");
    expect(group).not.toBeNull();
    const describedByEl = document.getElementById(
      group!.getAttribute("aria-describedby")!,
    );
    expect(describedByEl).toContainElement(errorMessage);
  });

  it("submits the rating and comment, then shows a confirmation in place of the form", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    fireEvent.click(screen.getByRole("radio", { name: "4 Stars" }));
    await user.type(screen.getByLabelText("Comment"), "Great session!");
    await user.click(screen.getByRole("button", { name: "Submit feedback" }));

    expect(onSubmit).toHaveBeenCalledWith(4, "Great session!");
    // The confirmation copy is picked randomly from a fixed set — assert
    // membership rather than one exact string.
    expect(
      CONFIRMATION_MESSAGES.some(
        (message) => screen.queryByText(message) !== null,
      ),
    ).toBe(true);
    expect(
      screen.queryByRole("button", { name: "Submit feedback" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View submission history" }),
    ).toBeInTheDocument();
  });
});
