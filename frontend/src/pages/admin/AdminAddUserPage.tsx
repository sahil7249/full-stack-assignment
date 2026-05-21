import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/Navbar";
import {
  Alert,
  Button,
  Card,
  Input,
  PageWrapper,
  Select,
} from "../../components/Ui";
import { useAuth } from "../../hooks/useAuth";
import { useState, type FormEvent } from "react";
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validator";
import type { Role } from "../../types/types";
import { api } from "../../api/Api";

interface FormFields {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
}

export const AdminAddUserPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    console.log("Clicked...");
    e.preventDefault();

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const addressError = validateAddress(form.address);
    const passwordError = validatePassword(form.password);

    setErrors({
      name: nameError ?? "",
      email: emailError ?? "",
      password: passwordError ?? "",
      address: addressError ?? "",
    });

    if (nameError || emailError || addressError || passwordError) {
      return;
    }

    setErrors({
      name: "",
      email: "",
      address: "",
      password: "",
    });
    setLoading(true);
    try {
      await api.admin.createUser(form);
      setSuccess("User created successfully");
      setForm({ name: "", email: "", address: "", password: "", role: "USER" });
    } catch (error: any) {
      setApiError(error.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { label: "Dashboard", onClick: () => navigate("/admin/dashboard") },
    { label: "Users", onClick: () => navigate("/admin/users") },
    { label: "Stores", onClick: () => navigate("/admin/stores") },
  ];

  return (
    <div>
      <NavBar
        userName={user?.name ?? ""}
        role="Administrator"
        onLogOut={() => {
          logout();
          navigate("/login");
        }}
        links={navLinks}
      />
      <PageWrapper
        title="Add User"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/users")}
          >
            ← Back
          </Button>
        }
      >
        <Card className="max-w-sm p-8">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {apiError && <Alert message={apiError} />}
            {success && <Alert message={success} type="success" />}

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
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              error={errors.email}
            />
            <Input
              id="address"
              label="Address"
              placeholder="Full address"
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
            <Select
              id="role"
              label="Role"
              value={form.role}
              onChange={(e) =>
                setForm((p) => ({ ...p, role: e.target.value as Role }))
              }
              options={[
                { value: "USER", label: "Normal User" },
                { value: "ADMIN", label: "Administrator" },
                { value: "STORE_OWNER", label: "Store Owner" },
              ]}
            />

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Creating…" : "Create User"}
            </Button>
          </form>
        </Card>
      </PageWrapper>
    </div>
  );
};
