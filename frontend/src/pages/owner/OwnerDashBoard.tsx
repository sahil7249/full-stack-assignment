import { useEffect, useState } from "react";
import { Card, PageWrapper, StarRating, Td, Th } from "../../components/Ui";
import { Navbar, StatCard } from "c:/Users/SAHIL/Downloads/ui";
import { useSort } from "../../hooks/useSort";
import type { Rating, Store, User } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../api/Api";

type RatingWithUser = Rating & { user: Pick<User, 'id' | 'name' | 'email'> };

const OwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { sorted, sortConfig, requestSort } = useSort(ratings);

  useEffect(() => {
    api.owner.getDashboard()
      .then(data => {
        setStore(data.store);
        setRatings(data.ratings);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const navLinks = [
    { label: 'Dashboard', onClick: () => navigate('/owner/dashboard') },
    { label: 'Change Password', onClick: () => navigate('/update-password') },
  ];

  return (
    <>
      <Navbar userName={user?.name ?? ''} role="Store Owner" onLogout={() => { logout(); navigate('/login'); }} links={navLinks} />
      <PageWrapper title="My Store Dashboard">
        {loading ? (
          <div className="text-sm text-slate-400">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : store ? (
          <>
            {/* Store Info + Average Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard label="Store" value={store.name} />
              <StatCard label="Average Rating" value={store.averageRating.toFixed(1)} />
              <StatCard label="Total Ratings" value={store.totalRating} />
            </div>

            {/* Visual rating */}
            <Card className="p-5 mb-6 flex items-center gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Overall Rating</p>
                <StarRating value={Math.round(store.averageRating)} readonly />
              </div>
            </Card>

            {/* Ratings table */}
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">User Ratings</h2>
            </div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-100">
                    <tr>
                      <Th label="User Name" sortKey="user.name" sortConfig={sortConfig} onSort={requestSort} />
                      <Th label="Email" sortKey="user.email" sortConfig={sortConfig} onSort={requestSort} />
                      <Th label="Rating" sortKey="value" sortConfig={sortConfig} onSort={requestSort} />
                      <Th label="Date" sortKey="createdAt" sortConfig={sortConfig} onSort={requestSort} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sorted.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">No ratings yet.</td></tr>
                    ) : sorted.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <Td>{r.user.name}</Td>
                        <Td>{r.user.email}</Td>
                        <Td>
                          <div className="flex items-center gap-1.5">
                            <StarRating value={r.value} readonly />
                            <span className="text-xs text-slate-500">({r.value})</span>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : null}
      </PageWrapper>
    </>
  );
};

export default OwnerDashboard;
