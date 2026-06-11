export interface Tool {
  id: string;
  name: string;
  owner: string;
  status: "active" | "deprecated";
}

export const tools: Tool[] = [
  { id: "1", name: "Deployment Dashboard", owner: "Platform",  status: "active" },
  { id: "2", name: "Cost Explorer",        owner: "Finance",   status: "active" },
  { id: "3", name: "Incident Tracker",     owner: "SRE",       status: "active" },
  { id: "4", name: "Access Request Portal",owner: "Security",  status: "deprecated" },
  { id: "5", name: "Release Notes Generator", owner: "Platform", status: "active" },
  { id: "6", name: "On-Call Rota",         owner: "SRE",       status: "deprecated" },
];
