import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formsApi } from "@/api/formsApi";
import { AppLayout } from "@/components/layout/AppLayout";
import { FormGrid } from "@/components/forms/FormGrid";
import { EmptyState } from "@/components/forms/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForms } from "@/hooks/useForms";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { forms, loading, refetch } = useForms();

  const onCreate = async () => {
    const response = await formsApi.create();
    navigate(`/forms/${response.data.form.id}/edit`);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this form permanently?")) {
      return;
    }
    await formsApi.delete(id);
    toast.success("Form deleted");
    await refetch();
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Button onClick={onCreate}>
          <Plus className="mr-2 size-4" />
          New Form
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : forms.length ? (
        <FormGrid forms={forms} onDelete={onDelete} />
      ) : (
        <EmptyState onCreate={onCreate} />
      )}
    </AppLayout>
  );
};
