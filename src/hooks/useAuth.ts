import { useEffect } from "react";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const useAuthBootstrap = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const init = async () => {
      try {
        const refresh = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });

        if (!refresh.ok) {
          throw new Error("Not authenticated");
        }

        const { accessToken } = (await refresh.json()) as { accessToken: string };
        const meRes = await authApi.me();
        setAuth(meRes.data.user, accessToken);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [setAuth, setLoading, clearAuth]);
};
