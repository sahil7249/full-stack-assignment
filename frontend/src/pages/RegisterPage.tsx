import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, type FormEvent } from "react";
import { Alert, Button, Input } from "../components/Ui";
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validator";
import { api } from "../api/Api";

interface FormField {
  name: string;
  email: string;
  password: string;
  address: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const { login } = useAuth();
//   const navigate = useNavigate();

  const [form, setForm] = useState<FormField>({
    name: "",
    email: "",
    password: "",
    address: "",
    confirmPassword: "",
  });
  const [ apiError ,setApiError] = useState('')
  const[loading,setLoading] = useState(false)

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });


  const handleSubmit = async (e : FormEvent) => {
    e.preventDefault()

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const addressError = validateAddress(form.address);
    const passwordError = validatePassword(form.password);

    let confirmError: string | null = null;

    if (form.confirmPassword == "") {
      confirmError = "Confirm password is required";
    } else if (form.confirmPassword != form.password) {
      confirmError = "Passwords do not match";
    }

    setErrors({
      name: nameError ?? "",
      email: emailError ?? "",
      password: passwordError ?? "",
      address: addressError ?? "",
      confirmPassword: confirmError ?? "",
    });

    if (
      nameError ||
      emailError ||
      addressError ||
      passwordError ||
      confirmError
    ) {
      return;
    }


    setLoading(true)
    setApiError('')
    setLoading(true)
    try {
        await api.auth.register({ name : form.name,email:form.email,password:form.email,address:form.address})
        await login(form.name,form.password)
        // navigate('/stores')
    } catch (error : any) {
        setApiError(error.message || 'Registration failed. Please try again')
    }finally {
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            RateStore
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {apiError && <Alert message={apiError} />}

            <Input
              id="name"
              label="Full Name"
              placeholder="Min 20 characters"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              error={errors.name}
            />
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
              id="address"
              label="Address"
              placeholder="Your full address"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              error={errors.address}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="8–16 chars, 1 uppercase, 1 special"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              error={errors.password}
            />
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              error={errors.confirmPassword}
            />

            <Button  type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
