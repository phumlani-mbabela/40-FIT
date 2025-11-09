import { create } from "zustand";
export const useAuth = create((set, get) => ({
  user: null,
  subscription: null,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  isPremium: () => get().subscription?.status === "active",
}));

