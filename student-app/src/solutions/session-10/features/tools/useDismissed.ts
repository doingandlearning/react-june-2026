import { create } from "zustand";

interface DismissedStore {
  dismissed: string[];
  dismiss: (id: string) => void;
}

export const useDismissed = create<DismissedStore>((set) => ({
  dismissed: [],
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
}));
