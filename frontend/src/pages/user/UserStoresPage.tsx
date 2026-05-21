import { useState, useCallback, useEffect } from "react";
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
import { useAuth } from "../../hooks/useAuth";
import type { Store } from "../../types/types";
import { api } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/Navbar";
import { useSort } from "../../hooks/useSort";

type StoreWithUserRating = Store & {
  userRating?: number;
  userRatingId?: string;
};

export const UserStoresPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate()

  const [stores, setStores] = useState<StoreWithUserRating[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const { sorted,sortConfig,requestSort} = useSort(stores)

  const [ratingModal, setRatingModal] = useState<{
    store: StoreWithUserRating;
    pendingValue: number;
  } | null>(null);
  const [ratingError, setRatingError] = useState("");
  const [ratingSaving, setRatingSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filters.name) params.name = filters.name;
    if (filters.address) params.address = filters.address;
    api.stores
      .getAll(params)
      .then(setStores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const openRatingModal = (store: StoreWithUserRating) => {
    setRatingError("");
    setRatingModal({ store, pendingValue: store.userRating ?? 0 });
  };

  const handleSubmitRating = async () => {
    if (!ratingModal || ratingModal.pendingValue === 0) {
      setRatingError('Please select a rating between 1 and 5.');
      return;
    }
    setRatingSaving(true);
    setRatingError('');
    try {
      if (ratingModal.store.userRatingId) {
        await api.ratings.update(ratingModal.store.userRatingId, ratingModal.pendingValue);
      } else {
        await api.ratings.submit(ratingModal.store.id, ratingModal.pendingValue);
      }
      setRatingModal(null);
      load();
    } catch (err: any) {
      setRatingError(err.message || 'Failed to submit rating.');
    } finally {
      setRatingSaving(false);
    }
  };

  const navLinks = [
    {label : 'Stores',onClick: () => navigate('/stores')},
    {label : 'Change Password',onClick: () => navigate('/update-password')}, 
  ]

  return (
    <div>
      <NavBar
        userName={user?.name ?? ""}
        role="User"
        onLogOut={() => {
          logout();
          navigate("/login");
        }}
        links={navLinks}
      />
      <PageWrapper title="Stores">
        {/* Search */}
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Search by name…"
              value={filters.name}
              onChange={(e) =>
                setFilters((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="Search by address…"
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
                    label="Store Name"
                    sortKey="name"
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
                    label="Overall Rating"
                    sortKey="averageRating"
                    sortConfig={sortConfig}
                    onSort={requestSort}
                  />
                  <Th label="Your Rating" />
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
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <Td className="font-medium">{s.name}</Td>
                      <Td className="max-w-xs truncate">{s.address}</Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <StarRating
                            value={Math.round(s.averageRating)}
                            readonly
                          />
                          <span className="text-xs text-slate-500">
                            ({s.averageRating.toFixed(1)})
                          </span>
                        </div>
                      </Td>
                      <Td>
                        {s.userRating ? (
                          <StarRating value={s.userRating} readonly />
                        ) : (
                          <span className="text-xs text-slate-400">
                            Not rated
                          </span>
                        )}
                      </Td>
                      <Td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRatingModal(s)}
                        >
                          {s.userRating ? "Modify" : "Rate"}
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

      {ratingModal && (
        <Modal
          title={ratingModal.store.userRating ? "Modify Rating" : "Rate Store"}
          onClose={() => {
            setRatingModal(null);
            setRatingError("");
          }}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              {ratingModal.store.userRating
                ? `Update your rating for "${ratingModal.store.name}"`
                : `Rate "${ratingModal.store.name}"`}
            </p>
            {ratingError && <Alert message={ratingError} />}
            <div className="flex justify-center py-2">
              <StarRating
                value={ratingModal.pendingValue}
                onChange={(v) =>
                  setRatingModal((p) => (p ? { ...p, pendingValue: v } : p))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRatingModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRating} disabled={ratingSaving}>
                {ratingSaving ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
