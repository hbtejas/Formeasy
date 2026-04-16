import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { formsApi } from "@/api/formsApi";
import { FieldPalette } from "@/components/builder/FieldPalette";
import { FormCanvas } from "@/components/builder/FormCanvas";
import { PropertiesPanel } from "@/components/builder/PropertiesPanel";
import { BuilderTopbar } from "@/components/layout/Topbar";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { useFormBuilderStore } from "@/store/formBuilderStore";
import type { FormField } from "@/types";
import { createDefaultField } from "@/utils/helpers";

export const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, selectedField } = useFormBuilder();
  const setForm = useFormBuilderStore((s) => s.setForm);
  const updateForm = useFormBuilderStore((s) => s.updateForm);
  const setFields = useFormBuilderStore((s) => s.setFields);
  const selectField = useFormBuilderStore((s) => s.selectField);
  const saveState = useFormBuilderStore((s) => s.saveState);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }
      const response = await formsApi.getById(id);
      setForm(response.data.form);
    };

    void fetchForm();
  }, [id, navigate, setForm]);

  useAutoSave();

  if (!form) {
    return <div className="p-6">Loading builder...</div>;
  }

  const updateFieldById = (fieldId: string, patch: Partial<FormField>) => {
    const fields = form.fields.map((field) =>
      field.id === fieldId
        ? {
            ...field,
            ...patch
          }
        : field
    );
    setFields(fields);
  };

  const addField = (type = "short_text") => {
    setFields([...form.fields, createDefaultField(type as FormField["type"], form.fields.length)]);
  };

  const deleteField = (fieldId: string) => {
    setFields(
      form.fields
        .filter((field) => field.id !== fieldId)
        .map((field, index) => ({ ...field, order: index }))
    );
    selectField(null);
  };

  const onPublishToggle = async () => {
    const response = await formsApi.togglePublish(form.id);
    updateForm({ isPublished: response.data.isPublished });
    toast.success(response.data.isPublished ? "Form published" : "Form unpublished");
  };

  const onShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/f/${form.slug}`);
    toast.success("Share link copied");
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <BuilderTopbar
        title={form.title}
        saveState={saveState}
        isPublished={form.isPublished}
        onPublishToggle={onPublishToggle}
        onShare={onShare}
      />
      <div className="flex flex-1 overflow-hidden">
        <FieldPalette onAdd={(type) => addField(type)} />
        <FormCanvas
          title={form.title}
          description={form.description}
          fields={form.fields}
          selectedFieldId={selectedField?.id ?? null}
          onSelectField={selectField}
          onUpdateField={updateFieldById}
          onDeleteField={deleteField}
          onReorder={setFields}
          onChangeMeta={updateForm}
          onAddField={() => addField()}
        />
        <PropertiesPanel
          selectedField={selectedField}
          form={form}
          onUpdateField={(patch) => selectedField && updateFieldById(selectedField.id, patch)}
          onUpdateForm={updateForm}
        />
      </div>
    </div>
  );
};
