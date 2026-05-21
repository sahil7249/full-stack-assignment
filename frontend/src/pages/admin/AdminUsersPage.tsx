import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import type { Role, User } from "../../types/types";
import { useSort } from "../../hooks/useSort";
import { api } from "../../api/Api";
import { Badge, Navbar } from "c:/Users/SAHIL/Downloads/ui";
import {
  Button,
  Card,
  Input,
  PageWrapper,
  Select,
  Td,
  Th,
} from "../../components/Ui";

interface FilterFields {
  name :string,
  email:string,
  address:string,
  role:Role
}


export const AdminUsersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterFields>({
    name: "",
    email: "",
    address: "",
    role: "USER",
  });
  const { sorted, sortConfig, requestSort } = useSort(users);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;
    if (filters.role) params.role = filters.role;
    api.admin
      .getUsers(params)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const filterChange =
    (field: keyof typeof filters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFilters((p) => ({ ...p, [field]: e.target.value }));
    };

  const navLinks = [
    { label: "Dashboard", onClick: () => navigate("/admin/dashboard") },
    { label: "Users", onClick: () => navigate("/admin/users") },
    { label: "Stores", onClick: () => navigate("/admin/stores") },
  ];

  return (
    <div>
      <Navbar
        userName={user?.name ?? ""}
        role="Administrator"
        onLogout={() => {
          logout();
          navigate("/login");
        }}
        links={navLinks}
      />
      <PageWrapper
        title="Users"
        action={
          <Button size="sm" onClick={() => navigate("/admin/users/new")}>
            + Add User
          </Button>
        }
      >
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              placeholder="Filter by name…"
              value={filters.name}
              onChange={filterChange("name")}
            />
            <Input
              placeholder="Filter by email…"
              value={filters.email}
              onChange={filterChange("email")}
            />
            <Input
              placeholder="Filter by address…"
              value={filters.address}
              onChange={filterChange("address")}
            />
            <Select
              value={filters.role}
              onChange={filterChange('role')}
              options={[
                { value: "", label: "All roles" },
                { value: "ADMIN", label: "ADMIN" },
                { value: "USER", label: "USER" },
                { value: "STORE_OWNER", label: "STORE OWNER" },
              ]}
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
                    label="Role"
                    sortKey="role"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <Th label="" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <Td>{u.name}</Td>
                      <Td>{u.email}</Td>
                      <Td className="max-w-xs truncate">{u.address}</Td>
                      <Td>
                        <Badge label={u.role} />
                      </Td>
                      <Td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                        >
                          View
                        </Button>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </PageWrapper>
    </div>
  );
};
