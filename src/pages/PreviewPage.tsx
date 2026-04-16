import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { formsApi } from "@/api/formsApi";
import { responsesApi } from "@/api/responsesApi";
import { FieldRenderer } from "@/components/fields/FieldRenderer";
import { Button } from "@/components/ui/Button";
import type { Form } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { buildDynamicFormSchema } from "@/utils/validation";

export const PreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState<Form | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      const response = await formsApi.getById(id);
      setFormConfig(response.data.form);
    };
    void run();
  }, [id]);

  const schema = buildDynamicFormSchema(formConfig?.fields ?? []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema)
  });

  if (!formConfig) {
    return <div className="p-6">Loading...</div>;
  }

  if (formConfig.requireLogin && !user) {
    navigate("/login");
    return null;
  }

  if (success) {
    return (
      <div className="mx-auto mt-16 max-w-xl rounded-xl border bg-white p-8 text-center shadow-soft">
        <h2 className="mb-2 text-2xl font-semibold">Thank you</h2>
        <p className="text-slate-600">{success}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">{formConfig.title}</h1>
      <p className="mt-2 text-slate-500">{formConfig.description}</p>

      <form
        className="mt-6 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-soft"
        onSubmit={handleSubmit(async (values) => {
          if (!id) return;
          try {
            const response = await responsesApi.submit(id, values);
            setSuccess(response.data.successMessage);
          } catch {
            toast.error("Failed to submit");
          }
        })}
      >
        {formConfig.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
          ))}

        <Button type="submit">{formConfig.submitButtonLabel || "Submit"}</Button>
      </form>
    </div>
  );
};
