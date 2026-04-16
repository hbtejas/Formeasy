import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "@/api/authApi";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/utils/validation";

type FormValues = { email: string; password: string };

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await authApi.login(values);
      setAuth(response.data.user, response.data.accessToken);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Email" type="email" {...register("email")} />
        {errors.email?.message ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        <Input placeholder="Password" type="password" {...register("password")} />
        {errors.password?.message ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}

        <Button disabled={isSubmitting} className="w-full" type="submit">
          Login
        </Button>

        <p className="text-center text-sm text-slate-500">
          New here?{" "}
          <Link to="/register" className="font-medium text-brand-600">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
