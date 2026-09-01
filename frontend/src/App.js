import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useSelector } from "react-redux";

import MainLayout from "./layout/MainLayout";

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


function ProtectedRoute({ children, admin = false }) {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user?.role || "").toUpperCase();

  if (admin && !role.includes("ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function RootRedirect() {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user?.role || "").toUpperCase();

  if (role.includes("ADMIN")) {
    return <Navigate to="/admin/stats" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<RootRedirect />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="/budgets"
            element={<BudgetsPage />}
          />

          <Route
            path="/goals"
            element={<GoalsPage />}
          />

          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute admin>
                <AdminStats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute admin>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/currencies"
            element={
              <ProtectedRoute admin>
                <CurrencyManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute admin>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

        </Route>

        <Route
          path="*"
          element={<RootRedirect />}
        />

      </Routes>
    </BrowserRouter>
  );
}