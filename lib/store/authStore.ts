import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  setUser: (user) =>
    set({ user, isAuthenticated: true, isLoading: false, error: null }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
