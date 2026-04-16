import { http } from "./http";
import type { User } from "@/types";

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    http.post<{ accessToken: string; user: User }>("/auth/register", payload),
  login: (payload: { email: string; password: string }) =>
    http.post<{ accessToken: string; user: User }>("/auth/login", payload),
  me: () => http.get<{ user: User }>("/auth/me"),
  logout: () => http.post("/auth/logout")
};
