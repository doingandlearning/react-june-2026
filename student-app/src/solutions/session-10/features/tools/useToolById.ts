import { useQuery } from "@tanstack/react-query";
import { fetchToolById } from "../../mock-api";

export function useToolById(id: string | undefined) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () => fetchToolById(id!),
    enabled: !!id,
  });
}
