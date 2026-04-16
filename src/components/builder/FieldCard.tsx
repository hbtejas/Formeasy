import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";
import { FIELD_LABEL_BY_TYPE } from "@/utils/constants";
import type { FormField } from "@/types";

type Props = {
  field: FormField;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<FormField>) => void;
  onDelete: () => void;
};

export const FieldCard = ({ field, selected, onSelect, onUpdate, onDelete }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        "mb-3 rounded-xl border bg-white p-3",
        selected ? "border-brand-500 ring-2 ring-brand-100" : "border-slate-200"
      )}
      onClick={onSelect}
    >
      <div className="mb-3 flex items-center gap-2">
        <button className="rounded p-1 text-slate-400 hover:bg-slate-100" {...attributes} {...listeners}>
          <GripVertical className="size-4" />
        </button>
        <Input value={field.label} onChange={(e) => onUpdate({ label: e.target.value })} />
        <Badge className="bg-slate-100 text-slate-700">{FIELD_LABEL_BY_TYPE[field.type]}</Badge>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Required</span>
          <Switch checked={field.required} onCheckedChange={(checked) => onUpdate({ required: checked })} />
        </div>
        <button onClick={onDelete} className="rounded p-2 text-rose-500 hover:bg-rose-50">
          <Trash2 className="size-4" />
        </button>
      </div>
      <p className="text-xs text-slate-500">Click this field to edit detailed properties on the right panel.</p>
    </div>
  );
};
