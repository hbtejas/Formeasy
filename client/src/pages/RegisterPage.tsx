import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "@/api/authApi";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { registerSchema } from "@/utils/validation";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      setAuth(response.data.user, response.data.accessToken);
      toast.success("Account created");
      navigate("/dashboard");
    } catch {
      toast.error("Could not create account");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Full Name" {...register("name")} />
        {errors.name?.message ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
        <Input placeholder="Email" type="email" {...register("email")} />
        {errors.email?.message ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
        <Input placeholder="Password" type="password" {...register("password")} />
        {errors.password?.message ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
        <Input placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword?.message ? (
          <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>
        ) : null}

        <Button disabled={isSubmitting} className="w-full" type="submit">
          Create Account
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-brand-600">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
