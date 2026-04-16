import type { AuthResponse, FormData, ResponseData, User } from "@/types";
import { api } from "./axios";

export const AuthApi = {
  login: (email: string, password: string) => api.post<AuthResponse>("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),
  me: () => api.get<{ user: User }>("/auth/me"),
  refresh: () => api.post<{ accessToken: string }>("/auth/refresh")
};

export const FormsApi = {
  list: () => api.get<{ forms: FormData[] }>("/forms"),
  create: (title = "Untitled Form") => api.post<{ form: FormData }>("/forms", { title }),
  get: (id: string) => api.get<{ form: FormData }>(`/forms/${id}`),
  update: (id: string, payload: Partial<FormData>) => api.patch<{ form: FormData }>(`/forms/${id}`, payload),
  remove: (id: string) => api.delete(`/forms/${id}`),
  publish: (id: string) => api.patch<{ isPublished: boolean }>(`/forms/${id}/publish`),
  checkSlug: (slug: string, formId?: string) =>
    api.get<{ available: boolean }>("/forms/slug-check", { params: { slug, formId } })
};

export const ResponsesApi = {
  submit: (id: string, data: Record<string, unknown>) => api.post(`/forms/${id}/submit`, { data }),
  list: (id: string, page = 1, limit = 20) =>
    api.get<{ responses: ResponseData[]; pagination: { page: number; totalPages: number; total: number } }>(
      `/forms/${id}/responses`,
      { params: { page, limit } }
    ),
  exportCsv: (id: string) => api.get(`/forms/${id}/responses/export`, { responseType: "blob" })
};

export const PublicApi = {
  bySlug: (slug: string) => api.get<{ form: FormData }>(`/public/${slug}`)
};
