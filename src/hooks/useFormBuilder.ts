import { useMemo } from "react";
import { useFormBuilderStore } from "@/store/formBuilderStore";

export const useFormBuilder = () => {
  const form = useFormBuilderStore((s) => s.form);
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);

  const selectedField = useMemo(
    () => form?.fields.find((field) => field.id === selectedFieldId) ?? null,
    [form, selectedFieldId]
  );

  return { form, selectedField, selectedFieldId };
};
