import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { formsApi } from "@/api/formsApi";
import { responsesApi } from "@/api/responsesApi";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Form, FormResponse } from "@/types";

export const ResponsesPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [selected, setSelected] = useState<FormResponse | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      const [formRes, responseRes] = await Promise.all([
        formsApi.getById(id),
        responsesApi.list(id, page)
      ]);
      setForm(formRes.data.form);
      setResponses(responseRes.data.responses);
      setTotalPages(responseRes.data.pagination.totalPages);
    };

    void run();
  }, [id, page]);

  const exportCsv = async () => {
    if (!id) return;
    const response = await responsesApi.exportCsv(id);
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form?.slug ?? "responses"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Responses</h1>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      {!responses.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No responses yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Submitted At</th>
                {form?.fields.map((field) => (
                  <th key={field.id} className="px-4 py-3">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr
                  key={response.id}
                  className="cursor-pointer border-b hover:bg-slate-50"
                  onClick={() => setSelected(response)}
                >
                  <td className="px-4 py-3">{(page - 1) * 20 + index + 1}</td>
                  <td className="px-4 py-3">{new Date(response.submittedAt).toLocaleString()}</td>
                  {form?.fields.map((field) => (
                    <td key={field.id} className="max-w-[220px] truncate px-4 py-3">
                      {String(response.data[field.id] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </Button>
        <p className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <h3 className="mb-4 text-lg font-semibold">Response Detail</h3>
          <pre className="max-h-[400px] overflow-auto rounded-lg bg-slate-50 p-3 text-xs">
            {JSON.stringify(selected?.data ?? {}, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};
