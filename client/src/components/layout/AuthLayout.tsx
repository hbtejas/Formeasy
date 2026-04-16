import type { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-soft">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Forms Pro</h1>
        <p className="text-sm text-slate-500">Build beautiful forms faster</p>
      </div>
      {children}
    </div>
  </div>
);
