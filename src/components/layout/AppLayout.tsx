import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-slate-50">
    <Sidebar />
    <main className="flex-1 p-6">{children}</main>
  </div>
);
