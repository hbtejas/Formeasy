import type { FormResponse } from "@/types";
import { http } from "./http";

export const responsesApi = {
  submit: (formId: string, data: Record<string, unknown>) =>
    http.post<{ id: string; successMessage: string }>(`/forms/${formId}/submit`, { data }),
  list: (formId: string, page = 1) =>
    http.get<{ responses: FormResponse[]; pagination: { page: number; totalPages: number; total: number } }>(
      `/forms/${formId}/responses`,
      { params: { page, limit: 20 } }
    ),
  single: (formId: string, responseId: string) =>
    http.get<{ response: FormResponse }>(`/forms/${formId}/responses/${responseId}`),
  exportCsv: (formId: string) =>
    http.get(`/forms/${formId}/responses/export/csv`, { responseType: "blob" })
};
