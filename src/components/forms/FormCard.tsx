import { MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/utils/helpers";
import type { Form } from "@/types";

type Props = {
  form: Form;
  onDelete: (id: string) => void;
};

export const FormCard = ({ form, onDelete }: Props) => (
  <Card className="group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-slate-900">{form.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{form.description || "No description"}</p>
      </div>
      <MoreVertical className="size-4 text-slate-400" />
    </div>

    <div className="mb-4 flex items-center justify-between text-sm">
      <Badge className={form.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
        {form.isPublished ? "Published" : "Draft"}
      </Badge>
      <span className="text-slate-500">{form.responseCount} responses</span>
    </div>

    <p className="mb-4 text-xs text-slate-400">Updated {formatDate(form.updatedAt)}</p>

    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-sm">
      <Link to={`/forms/${form.id}/edit`} className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
        <Pencil className="size-4" />
        Edit
      </Link>
      <Link to={`/forms/${form.id}/preview`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
        <Share2 className="size-4" />
        Preview
      </Link>
      <button
        onClick={() => onDelete(form.id)}
        className="ml-auto flex items-center gap-1 text-rose-500 hover:text-rose-600"
      >
        <Trash2 className="size-4" />
        Delete
      </button>
    </div>
  </Card>
);
