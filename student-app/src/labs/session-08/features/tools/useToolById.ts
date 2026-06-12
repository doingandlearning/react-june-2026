import { useState, useEffect } from "react";
import { fetchToolById, type Tool } from "../../mock-api";

// TODO Task 3 — implement this hook
// Signature: useToolById(id: string | undefined): { tool, loading, error }
// - Manages tool (Tool | null), loading (true), error (string | null) state
// - Calls fetchToolById(id) in a useEffect — only when id is defined
// - Handles the success and error paths
// - Re-fetches if id changes

export function useToolById(id: string | undefined): {
  tool: Tool | null;
  loading: boolean;
  error: string | null;
} {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // TODO: fetch the tool, update state, handle errors
  }, [id]);

  return { tool, loading, error };
}
