export interface Tool {
  id: string;
  name: string;
  owner: string;
  status: "active" | "deprecated";
  category: string;
}

const TOOLS: Tool[] = [
  { id: "1", name: "Deploy Bot",       owner: "Platform", status: "active",     category: "devops" },
  { id: "2", name: "Log Viewer",       owner: "Platform", status: "active",     category: "devops" },
  { id: "3", name: "Feature Flags",    owner: "Product",  status: "active",     category: "product" },
  { id: "4", name: "User Lookup",      owner: "Support",  status: "active",     category: "support" },
  { id: "5", name: "Old Dashboard",    owner: "Platform", status: "deprecated", category: "devops" },
  { id: "6", name: "Legacy Importer",  owner: "Data",     status: "deprecated", category: "data" },
];

export function fetchTools(category?: string): Promise<Tool[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = category ? TOOLS.filter((t) => t.category === category) : TOOLS;
      resolve(result);
    }, 800);
  });
}

export function fetchToolById(id: string): Promise<Tool | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TOOLS.find((t) => t.id === id) ?? null);
    }, 400);
  });
}
