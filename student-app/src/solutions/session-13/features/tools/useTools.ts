import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "../../mock-api";

export function useTools(category?: string) {
  return useQuery({
    queryKey: ["tools", category],
    queryFn: () => fetchTools(category),
  });
}
