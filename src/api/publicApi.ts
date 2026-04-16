import type { Form } from "@/types";
import { http } from "./http";

export const publicApi = {
  getFormBySlug: (slug: string) => http.get<{ form: Form }>(`/public/forms/${slug}`)
};
