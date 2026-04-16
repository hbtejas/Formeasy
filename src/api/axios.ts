import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const apiBase = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: apiBase,
  withCredentials: true
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryConfig;
    if (error?.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      const refresh = await axios.post(`${apiBase}/auth/refresh`, {}, { withCredentials: true });
      const token = refresh.data.accessToken;
      useAuthStore.getState().setAccessToken(token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    }
  }
);
