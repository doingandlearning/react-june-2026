import { describe, it, expect } from "vitest";
import { validate } from "./validate";

describe("validate", () => {
  it("returns an error when name is shorter than 3 characters", () => {
    const errors = validate({
      name: "AB",
      owner: "Platform",
      category: "devops",
      description: "",
    });
    expect(errors.name).toBeDefined();
  });

  it("returns an error when owner is empty", () => {
    const errors = validate({
      name: "Deploy Bot",
      owner: "",
      category: "devops",
      description: "",
    });
    expect(errors.owner).toBeDefined();
  });

  it("returns an empty errors object when inputs are valid", () => {
    const errors = validate({
      name: "Deploy Bot",
      owner: "Platform",
      category: "devops",
      description: "",
    });
    expect(errors).toEqual({});
  });
});
