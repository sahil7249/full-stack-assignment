import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Alert, Button, Input } from "../components/Ui";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validator";

interface FormField {
  email: string | null;
  password: string | null;
}

export const LoginPage = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState<FormField>({ email: "", password: "" });
  const navigate = useNavigate()

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "STORE_OWNER") navigate("/owner/dashboard");
      else navigate("/stores");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(form.email);
    const passwordError = form.password === " " ? "Password is required" : null;

    setErrors({
      email: emailError ?? "",
      password: passwordError ?? "",
    });

    if (emailError || passwordError) { return };
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setApiError(err.message || "Login failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            RateStore
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {apiError && <Alert message={apiError} />}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              error={errors.email}
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              error={errors.password}
              autoComplete="current-password"
            />

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
