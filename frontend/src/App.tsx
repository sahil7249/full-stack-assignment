import { NavBar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { RegisterPage } from "./pages/RegisterPage";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

export const App = () => {
  const handleLogout = () => {
    return null;
  };

  return (
    <AuthProvider>
      <NavBar userName="user1" role="USER" onLogOut={handleLogout} />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
