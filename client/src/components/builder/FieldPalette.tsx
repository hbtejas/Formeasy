import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIELD_GROUPS } from "@/utils/constants";
import type { FieldType } from "@/types";

export const FieldPalette = ({ onAdd }: { onAdd: (type: FieldType) => void }) => (
  <aside className="w-[260px] border-r border-slate-200 bg-white p-4">
    <h3 className="mb-4 font-semibold">Add Fields</h3>

    <div className="space-y-4">
      {FIELD_GROUPS.map((group) => (
        <div key={group.group}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.group}</p>
          <div className="flex flex-wrap gap-2">
            {group.fields.map((field) => (
              <Button
                key={field.type}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => onAdd(field.type)}
              >
                <Plus className="mr-1 size-3" />
                {field.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </aside>
);
