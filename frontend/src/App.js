import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";

import AdminStats from "./pages/admin/AdminStats";
import UserManagement from "./pages/admin/UserManagement";
import CurrencyManagement from "./pages/admin/CurrencyManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";

import MainLayout from "./layout/MainLayout";

function ProtectedRoute() {
  const token = useSelector((state) => state.auth?.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AdminRoute() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;

  if (role !== "ROLE_ADMIN" && role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function HomeRedirect() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;

  if (role === "ROLE_ADMIN" || role === "ADMIN") {
    return <Navigate to="/admin/stats" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected user area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/goals" element={<GoalsPage />} />

            {/* Admin area */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route
                path="/admin/currencies"
                element={<CurrencyManagement />}
              />
              <Route
                path="/admin/categories"
                element={<CategoryManagement />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;