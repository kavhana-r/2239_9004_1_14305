import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";

import AdminStats from "./pages/admin/AdminStats";
import UserManagement from "./pages/admin/UserManagement";
import CurrencyManagement from "./pages/admin/CurrencyManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function HomeRedirect() {
  const user = useSelector((state) => state.auth.user);

  if (user?.role === "ROLE_ADMIN") {
    return <Navigate to="/admin/stats" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="transactions"
          element={<TransactionsPage />}
        />

        <Route
          path="budgets"
          element={<BudgetsPage />}
        />

        <Route
          path="goals"
          element={<GoalsPage />}
        />

        <Route
          path="admin/stats"
          element={<AdminStats />}
        />

        <Route
          path="admin/users"
          element={<UserManagement />}
        />

        <Route
          path="admin/currencies"
          element={<CurrencyManagement />}
        />

        <Route
          path="admin/categories"
          element={<CategoryManagement />}
        />
      </Route>

      <Route
        path="*"
        element={<HomeRedirect />}
      />
    </Routes>
  );
}

export default App;