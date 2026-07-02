import { UserCard, type User } from ".//UserCard";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

it("shows loading, then the name once the fetch resolves", async () => {
	const fetchUser = vi.fn().mockResolvedValue({ id: 1, name: "Alice" });

	render(<UserCard fetchUser={fetchUser} />);

	// The component should show "Loading..." while the fetch is in progress
	expect(screen.getByText("Loading...")).toBeInTheDocument();

	// Wait for the fetch to resolve and the component to re-render
	const nameElement = await screen.findByText("Welcome, Alice");
	expect(nameElement).toBeInTheDocument();
	expect(fetchUser).toHaveBeenCalledTimes(1);
	expect(fetchUser).toHaveBeenCalledWith();
})

it("if name is empty, shows 'Welcome, Guest'", async () => {
	const fetchUser = vi.fn().mockResolvedValue({ id: 1, name: "" });

	render(<UserCard fetchUser={fetchUser} />);

	// The component should show "Loading..." while the fetch is in progress
	expect(screen.getByText("Loading...")).toBeInTheDocument();

	// Wait for the fetch to resolve and the component to re-render
	const nameElement = await screen.findByText("Welcome, Guest");
	expect(nameElement).toBeInTheDocument();
	expect(fetchUser).toHaveBeenCalledTimes(1);
	expect(fetchUser).toHaveBeenCalledWith();
})