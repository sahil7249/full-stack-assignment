import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { api } from "../../api/Api";
import { Badge, Navbar } from "c:/Users/SAHIL/Downloads/ui";
import { Button, Card, PageWrapper, StarRating } from "../../components/Ui";
import type { User } from "../../types/types";

type UserDetail = User & { rating?: number };


export const AdminUserDetailPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.admin.getUserById(id)
      .then(setDetail)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const navLinks = [
    { label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { label: 'Users', onClick: () => navigate('/admin/users') },
    { label: 'Stores', onClick: () => navigate('/admin/stores') },
  ];

  const Field: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-center gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider sm:w-32 shrink-0">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );

  return (
    <>
      <Navbar userName={user?.name ?? ''} role="Administrator" onLogout={() => { logout(); navigate('/login'); }} links={navLinks} />
      <PageWrapper title="User Detail" action={<Button variant="secondary" size="sm" onClick={() => navigate('/admin/users')}>← Back</Button>}>
        {loading ? (
          <div className="text-sm text-slate-400">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : detail ? (
          <Card className="max-w-lg p-6">
            <Field label="Name" value={detail.name} />
            <Field label="Email" value={detail.email} />
            <Field label="Address" value={detail.address} />
            <Field label="Role" value={<Badge label={detail.role} />} />
            {detail.role === 'STORE_OWNER' && detail.rating !== undefined && (
              <Field
                label="Store Rating"
                value={
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(detail.rating)} readonly />
                    <span className="text-slate-500 text-xs">({detail.rating.toFixed(1)})</span>
                  </div>
                }
              />
            )}
          </Card>
        ) : null}
      </PageWrapper>
    </>
  );
};