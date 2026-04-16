import { create } from "zustand";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setLoading: (loading) => set({ loading }),
  clearAuth: () => set({ user: null, accessToken: null })
}));
