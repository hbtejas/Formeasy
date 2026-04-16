import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
    <h1 className="mb-2 text-4xl font-bold">404</h1>
    <p className="mb-6 text-slate-600">The page you are looking for does not exist.</p>
    <Link to="/dashboard">
      <Button>Go to dashboard</Button>
    </Link>
  </div>
);
