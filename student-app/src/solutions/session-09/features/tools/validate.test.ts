import { validate, type ToolFormData } from "./validate";
import { test, expect } from "vitest";
// export interface ToolFormData {
//   name: string;
//   owner: string;
//   category: "devops" | "product" | "support" | "data";
//   description: string;
// }
test("rejects name if less than 3 characters", () => {
  // Arrange - Given
  const user: ToolFormData = {
    name: "ab",
    owner: "John Doe",
    category: "devops",
    description: "A tool for DevOps",
  };

  // Act - When
  const errors = validate(user);

  // Assert - Then
  expect(errors).toHaveProperty("name");
  expect(errors.name).toBe("Tool name must be at least 3 characters.");
});
test("rejects if owner is empty", () => {
  // Arrange - Given
  const user: ToolFormData = {
    name: "Valid Tool Name",
    owner: "",
    category: "devops",
    description: "A tool for DevOps",
  };

  // Act - When
  const errors = validate(user);

  // Assert - Then
  expect(errors).toHaveProperty("owner");
  expect(errors.owner).toBe("Owner is required.");
});

test("should reject if invalid category is provided", () => {
  // Arrange - Given
  const user: ToolFormData = {
    name: "Valid Tool Name",
    owner: "John Doe",
    category: "invalid-category" as any, // Force an invalid category for testing
    description: "A tool for DevOps",
  };

  // Act - When
  const errors = validate(user);

  // Assert - Then
  expect(errors).toHaveProperty("category");
  expect(errors.category).toBe("Invalid category provided.");
});
