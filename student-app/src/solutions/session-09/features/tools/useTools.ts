import { useState, useEffect } from "react";
import { fetchTools, type Tool } from "../../mock-api";

// Complete — brought forward from Session 05.
// useTools fetches all tools (or a category subset) and manages
// loading / error state so pages don't have to.

export function useTools(category?: string): {
  tools: Tool[];
  loading: boolean;
  error: string | null;
} {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();

    fetchTools(category)
      .then((data) => { setTools(data); setLoading(false); })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [category]);

  return { tools, loading, error };
}
