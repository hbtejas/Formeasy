import React, { type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthBootstrap } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { BuilderPage } from "@/pages/BuilderPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PreviewPage } from "@/pages/PreviewPage";
import { PublicFormPage } from "@/pages/PublicFormPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ResponsesPage } from "@/pages/ResponsesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { TeamPage } from "@/pages/TeamPage";
import { TemplatesPage } from "@/pages/TemplatesPage";

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          <div>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-slate-500">Please refresh the page.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Protected = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnly = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  useAuthBootstrap();

  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          path="/forms/:id/edit"
          element={
            <Protected>
              <BuilderPage />
            </Protected>
          }
        />
        <Route
          path="/forms/:id/preview"
          element={
            <Protected>
              <PreviewPage />
            </Protected>
          }
        />
        <Route
          path="/forms/:id/responses"
          element={
            <Protected>
              <ResponsesPage />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />
        <Route
          path="/templates"
          element={
            <Protected>
              <TemplatesPage />
            </Protected>
          }
        />
        <Route
          path="/team"
          element={
            <Protected>
              <TeamPage />
            </Protected>
          }
        />

        <Route path="/f/:slug" element={<PublicFormPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
