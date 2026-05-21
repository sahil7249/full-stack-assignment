import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserStoresPage } from "./pages/user/UserStoresPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminStoresPage } from "./pages/admin/AdminStoresPage";
import { useAuth } from "./hooks/useAuth";
import { AdminAddUserPage } from "./pages/admin/AdminAddUserPage";
import { AdminUserDetailPage } from "./pages/admin/AdminUserDetailsPage";
import OwnerDashboard from "./pages/owner/OwnerDashBoard";

const RootRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RootRedirect />} />

    <Route path="/stores" element={<UserStoresPage  />} /> 

    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /> </ProtectedRoute>
    } /> 
    <Route path="/admin/users" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsersPage /> </ProtectedRoute>
    } /> 
    <Route path="/admin/stores" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminStoresPage /> </ProtectedRoute>
    } /> 
    <Route path="/admin/users/new" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminAddUserPage /> </ProtectedRoute>
    } /> 
    <Route path="/admin/users/:id" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminUserDetailPage /> </ProtectedRoute>
    } /> 
    <Route path="/owner/dashboard" element={
      <ProtectedRoute allowedRoles={["STORE_OWNER"]}><OwnerDashboard /> </ProtectedRoute>
    } /> 
  </Routes>
);

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};
