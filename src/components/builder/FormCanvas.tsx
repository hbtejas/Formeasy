import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldCard } from "./FieldCard";
import type { FormField } from "@/types";

type Props = {
  title: string;
  description: string;
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
  onUpdateField: (fieldId: string, patch: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onReorder: (fields: FormField[]) => void;
  onChangeMeta: (patch: { title?: string; description?: string }) => void;
  onAddField: () => void;
};

export const FormCanvas = ({
  title,
  description,
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onReorder,
  onChangeMeta,
  onAddField
}: Props) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = fields.findIndex((f) => f.id === String(active.id));
    const newIndex = fields.findIndex((f) => f.id === String(over.id));
    const reordered = arrayMove(fields, oldIndex, newIndex).map((field, index) => ({ ...field, order: index }));
    onReorder(reordered);
  };

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <input
          className="mb-2 w-full border-none bg-transparent text-3xl font-bold outline-none"
          value={title}
          onChange={(e) => onChangeMeta({ title: e.target.value })}
        />
        <textarea
          className="mb-6 w-full resize-none border-none bg-transparent text-slate-500 outline-none"
          value={description}
          onChange={(e) => onChangeMeta({ description: e.target.value })}
          placeholder="Add a form description"
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                selected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id)}
                onUpdate={(patch) => onUpdateField(field.id, patch)}
                onDelete={() => onDeleteField(field.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button variant="outline" className="w-full" onClick={onAddField}>
          <Plus className="mr-2 size-4" />
          Add field
        </Button>
      </div>
    </section>
  );
};
