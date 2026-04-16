import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
    <FilePlus2 className="mb-4 size-10 text-slate-400" />
    <h3 className="text-lg font-semibold">No forms yet</h3>
    <p className="mb-4 text-sm text-slate-500">Create your first form to start collecting responses.</p>
    <Button onClick={onCreate}>New Form</Button>
  </div>
);
