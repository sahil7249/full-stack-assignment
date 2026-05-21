import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Store } from "../../types/types";
import { useCallback, useEffect, useState } from "react";
import { useSort } from "../../hooks/useSort";
import { api } from "../../api/Api";
import { validateAddress, validateEmail, validateName, validateStoreName } from "../../utils/validator";
import { NavBar } from "../../components/Navbar";
import {
  Alert,
  Button,
  Card,
  Input,
  Modal,
  PageWrapper,
  StarRating,
  Td,
  Th,
} from "../../components/Ui";

export const AdminStoresPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const { sorted, sortConfig, requestSort } = useSort(stores);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    api.admin
      .getStores(params)
      .then(setStores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddStore = async () => {
    const nameError = validateStoreName(form.name);
    const emailError = validateEmail(form.email);
    const addressError = validateAddress(form.address);

    setFormErrors({
      email: emailError ?? "",
      name: nameError ?? "",
      address: addressError ?? "",
    });

    if (emailError || nameError || addressError) {
      return;
    }
    setFormErrors({
    name: "",
    email: "",
    address: "",
  });
    setApiError("");
    setSaving(true);
    try {
      await api.admin.createStore({
          name: form.name,
          email: form.email,
          address: form.address,
          ownerId: form.ownerId || undefined,
          totalRating: 0
      });
      setShowModal(false);
      setForm({ name: "", email: "", address: "", ownerId: "" });
      load();
    } catch (err: any) {
      setApiError(err.message || "Failed to add store.");
    } finally {
      setSaving(false);
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
        title="Stores"
        action={
          <Button size="sm" onClick={() => setShowModal(true)}>
            + Add Store
          </Button>
        }
      >
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Filter by name…"
              value={filters.name}
              onChange={(e) =>
                setFilters((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="Filter by email…"
              value={filters.email}
              onChange={(e) =>
                setFilters((p) => ({ ...p, email: e.target.value }))
              }
            />
            <Input
              placeholder="Filter by address…"
              value={filters.address}
              onChange={(e) =>
                setFilters((p) => ({ ...p, address: e.target.value }))
              }
            />
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-100">
                <tr>
                  <Th
                    label="Name"
                    sortKey="name"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <Th
                    label="Email"
                    sortKey="email"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <Th
                    label="Address"
                    sortKey="address"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <Th
                    label="Rating"
                    sortKey="averageRating"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <Td>{s.name}</Td>
                      <Td>{s.email}</Td>
                      <Td className="max-w-xs truncate">{s.address}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <StarRating
                            value={Math.round(s.averageRating)}
                            readonly
                          />
                          <span className="text-xs text-slate-500">
                            ({s.averageRating.toFixed(1)})
                          </span>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </PageWrapper>

      {showModal && (
        <Modal
          title="Add Store"
          onClose={() => {
            setShowModal(false);
            setApiError("")
          }}
        >
          <div className="flex flex-col gap-4">
            {apiError && <Alert message={apiError} />}
            <Input
              id="sName"
              label="Store Name"
              placeholder="Min 20 characters"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              error={formErrors.name}
            />
            <Input
              id="sEmail"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              error={formErrors.email}
            />
            <Input
              id="sAddress"
              label="Address"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              error={formErrors.address}
            />
            <Input
              id="sOwner"
              label="Owner ID (optional)"
              placeholder="User ID of store owner"
              value={form.ownerId}
              onChange={(e) =>
                setForm((p) => ({ ...p, ownerId: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStore} disabled={saving}>
                {saving ? "Adding…" : "Add Store"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
