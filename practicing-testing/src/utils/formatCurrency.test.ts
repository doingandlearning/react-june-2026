import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  // WORKED EXAMPLE — read this one carefully. Every test below follows
  // the same three-step shape: Arrange, Act, Assert.
  it("adds a pound sign and two decimal places", () => {
    // Arrange: set up the input value
    const pennies = 150;

    // Act: call the function we're testing
    const result = formatCurrency(pennies);

    // Assert: check the result is exactly what we expect
    expect(result).toBe("£1.50");
  });

  // TODO 1: replace this with a real test.
  // Check that formatCurrency(0) returns "£0.00"
  it("formats zero as £0.00", () => {
    // Arrange
    const pennies = 0;

    // Act
    const result = formatCurrency(pennies);

    // Assert
    expect(result).toBe("£0.00");
    expect(formatCurrency(0)).toBe("£0.00");
  });

  // TODO 2: replace this with a real test.
  // Check that formatCurrency(5) returns "£0.05"
  // (single-digit pennies should be padded with a leading zero)
  it("pads a single-digit pennies value with a leading zero", () => {
    // Arrange
    const pennies = 5;

    // Act
    const result = formatCurrency(pennies);

    // Assert
    expect(result).toBe("£0.05");
  });

  // TODO 3: replace this with a real test.
  // Check that formatCurrency(200) returns "£2.00"
  // (a whole pound amount, no leftover pennies)
  it("formats a whole pound amount with no leftover pennies", () => {
    // Arrange
    const pennies = 200;

    // Act
    const result = formatCurrency(pennies);

    // Assert
    expect(result).toBe("£2.00");
  });

  // TODO 4: replace this with a real test.
  // Check that formatCurrency(-250) returns "-£2.50"
  // (the minus sign goes before the pound sign)
  it("puts the minus sign before the pound sign for a negative amount", () => {
    // Arrange
    const pennies = -250;

    // Act
    const result = formatCurrency(pennies);

    // Assert
    expect(result).toBe("-£2.50");
  });
});
