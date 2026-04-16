import type { Form } from "@/types";
import { FormCard } from "./FormCard";

export const FormGrid = ({
  forms,
  onDelete
}: {
  forms: Form[];
  onDelete: (id: string) => void;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {forms.map((form) => (
      <FormCard key={form.id} form={form} onDelete={onDelete} />
    ))}
  </div>
);
