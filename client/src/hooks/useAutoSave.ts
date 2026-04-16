import { useEffect, useRef } from "react";
import { formsApi } from "@/api/formsApi";
import { useFormBuilderStore } from "@/store/formBuilderStore";

export const useAutoSave = () => {
  const form = useFormBuilderStore((s) => s.form);
  const setSaveState = useFormBuilderStore((s) => s.setSaveState);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!form) {
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setSaveState("saving");

    timerRef.current = window.setTimeout(async () => {
      try {
        await formsApi.update(form.id, {
          title: form.title,
          description: form.description,
          slug: form.slug,
          requireLogin: form.requireLogin,
          allowSaveProgress: form.allowSaveProgress,
          submitButtonLabel: form.submitButtonLabel,
          successMessage: form.successMessage,
          fields: form.fields
        });
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 1500);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [form, setSaveState]);
};
