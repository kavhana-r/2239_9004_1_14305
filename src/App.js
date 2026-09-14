import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
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
import "./App.css";

function AccessDeniedView({ message, redirectPath, redirectLabel }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "60px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "55vh",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#fef2f2",
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          marginBottom: 20,
          border: "1px solid #fee2e2",
          boxShadow: "0 4px 14px rgba(239, 68, 68, 0.15)",
        }}
      >
        🛡️
      </div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Access Denied
      </h2>
      <p
        style={{
          fontSize: 15,
          color: "#64748b",
          maxWidth: 460,
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        {message || "You don't have permission to access this page."}
      </p>
      <button
        type="button"
        onClick={() => navigate(redirectPath || "/dashboard", { replace: true })}
        style={{
          padding: "11px 26px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
        }}
      >
        {redirectLabel || "Return to Dashboard"}
      </button>
    </div>
  );
}

function ProtectedRoute() {
  const token = useSelector((state) => state.auth?.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function UserRoute() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || user?.user?.role;
  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  if (isAdmin) {
    return (
      <AccessDeniedView
        message="Admin accounts cannot access user financial views. Please use the Admin Console."
        redirectPath="/admin/stats"
        redirectLabel="Go to Admin Console"
      />
    );
  }

  return <Outlet />;
}

function AdminRoute() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const role = user?.role || user?.user?.role;
  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  if (!isAdmin) {
    return (
      <AccessDeniedView
        message="You don't have permission to access this page."
        redirectPath="/dashboard"
        redirectLabel="Return to User Dashboard"
      />
    );
  }

  return <Outlet />;
}

function HomeRedirect() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || user?.user?.role;

  if (role === "ROLE_ADMIN" || role === "ADMIN") {
    return <Navigate to="/admin/stats" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Authentication Endpoints */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* User-only views */}
            <Route element={<UserRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
            </Route>

            {/* Common / Standard Views */}
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/currencies" element={<CurrencyManagement />} />
            <Route path="/reports" element={<AdminStats />} />

            {/* Admin-only area */}
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
              <Route
                path="/admin/goals"
                element={<GoalsPage />}
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