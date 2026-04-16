import { useCallback, useEffect, useState } from "react";
import { formsApi } from "@/api/formsApi";
import type { Form } from "@/types";

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await formsApi.list();
      setForms(response.data.forms);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchForms();
  }, [fetchForms]);

  return { forms, loading, refetch: fetchForms, setForms };
};
