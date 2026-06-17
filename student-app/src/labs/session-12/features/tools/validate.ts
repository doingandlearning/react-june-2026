export interface ToolFormData {
  name: string;
  owner: string;
  category: "devops" | "product" | "support" | "data";
  description: string;
}

export interface FormErrors {
  name?: string;
  owner?: string;
}

export function validate(form: ToolFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name || form.name.trim().length < 3) {
    errors.name = "Tool name must be at least 3 characters.";
  }
  if (!form.owner || !form.owner.trim()) {
    errors.owner = "Owner is required.";
  }
  return errors;
}
