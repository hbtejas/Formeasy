import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Form, FormField } from "@/types";

type Props = {
  selectedField: FormField | null;
  form: Form;
  onUpdateField: (patch: Partial<FormField>) => void;
  onUpdateForm: (patch: Partial<Form>) => void;
};

export const PropertiesPanel = ({ selectedField, form, onUpdateField, onUpdateForm }: Props) => {
  if (selectedField) {
    return (
      <aside className="w-[280px] border-l border-slate-200 bg-white p-4">
        <h3 className="mb-4 font-semibold">Field Properties</h3>

        <div className="space-y-3">
          <div>
            <Label>Field Label</Label>
            <Input value={selectedField.label} onChange={(e) => onUpdateField({ label: e.target.value })} />
          </div>
          <div>
            <Label>Placeholder</Label>
            <Input
              value={selectedField.placeholder}
              onChange={(e) => onUpdateField({ placeholder: e.target.value })}
            />
          </div>
          <div>
            <Label>Description / Help Text</Label>
            <Textarea value={selectedField.helpText} onChange={(e) => onUpdateField({ helpText: e.target.value })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Required</Label>
            <Switch checked={selectedField.required} onCheckedChange={(checked) => onUpdateField({ required: checked })} />
          </div>

          {(selectedField.type === "select" || selectedField.type === "multi_select") && (
            <div>
              <Label>Options (one per line)</Label>
              <Textarea
                value={selectedField.options.join("\n")}
                onChange={(e) =>
                  onUpdateField({
                    options: e.target.value
                      .split("\n")
                      .map((opt) => opt.trim())
                      .filter(Boolean)
                  })
                }
              />
            </div>
          )}

          {selectedField.type === "number" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min</Label>
                <Input
                  type="number"
                  value={selectedField.validation.min ?? ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: { ...selectedField.validation, min: Number(e.target.value) }
                    })
                  }
                />
              </div>
              <div>
                <Label>Max</Label>
                <Input
                  type="number"
                  value={selectedField.validation.max ?? ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: { ...selectedField.validation, max: Number(e.target.value) }
                    })
                  }
                />
              </div>
            </div>
          )}

          {(selectedField.type === "short_text" || selectedField.type === "long_text") && (
            <div>
              <Label>Max Length</Label>
              <Input
                type="number"
                value={selectedField.validation.maxLength ?? ""}
                onChange={(e) =>
                  onUpdateField({
                    validation: {
                      ...selectedField.validation,
                      maxLength: Number(e.target.value)
                    }
                  })
                }
              />
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[280px] border-l border-slate-200 bg-white p-4">
      <h3 className="mb-4 font-semibold">Form Settings</h3>
      <div className="space-y-3">
        <div>
          <Label>Form Title</Label>
          <Input value={form.title} onChange={(e) => onUpdateForm({ title: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => onUpdateForm({ description: e.target.value })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Require Login</Label>
          <Switch checked={form.requireLogin} onCheckedChange={(checked) => onUpdateForm({ requireLogin: checked })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Allow Save and Continue</Label>
          <Switch
            checked={form.allowSaveProgress}
            onCheckedChange={(checked) => onUpdateForm({ allowSaveProgress: checked })}
          />
        </div>
        <div>
          <Label>Custom Slug</Label>
          <Input value={form.slug} onChange={(e) => onUpdateForm({ slug: e.target.value })} />
        </div>
        <div>
          <Label>Submit Button Label</Label>
          <Input
            value={form.submitButtonLabel}
            onChange={(e) => onUpdateForm({ submitButtonLabel: e.target.value })}
          />
        </div>
        <div>
          <Label>Success Message</Label>
          <Textarea
            value={form.successMessage}
            onChange={(e) => onUpdateForm({ successMessage: e.target.value })}
          />
        </div>
      </div>
    </aside>
  );
};
