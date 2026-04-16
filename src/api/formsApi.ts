import type { Form } from "@/types";
import { http } from "./http";

export const formsApi = {
  list: () => http.get<{ forms: Form[] }>("/forms"),
  create: () => http.post<{ form: Form }>("/forms", { title: "Untitled Form" }),
  getById: (id: string) => http.get<{ form: Form }>(`/forms/${id}`),
  update: (id: string, payload: Partial<Form>) => http.patch<{ form: Form }>(`/forms/${id}`, payload),
  delete: (id: string) => http.delete(`/forms/${id}`),
  togglePublish: (id: string) => http.patch<{ isPublished: boolean }>(`/forms/${id}/publish`),
  checkSlug: (slug: string, formId: string) =>
    http.get<{ available: boolean }>(`/forms/slug/check`, { params: { slug, formId } })
};
