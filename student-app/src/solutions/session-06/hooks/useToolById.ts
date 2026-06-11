import { useState, useEffect } from "react";
import { fetchToolById, type Tool } from "../mock-api";

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
    setLoading(true);
    fetchToolById(id)
      .then((data) => { setTool(data); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [id]);

  return { tool, loading, error };
}
