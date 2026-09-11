import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Tooltip,
} from "antd";

import {
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  AimOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import "../App.css";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.user);

  const role = user?.role;

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  const username =
    user?.username || user?.user?.username || "User";

  // ---------------- USER MENU ----------------
  const userItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/transactions",
      icon: <TransactionOutlined />,
      label: "Transactions",
    },
    {
      key: "/budgets",
      icon: <WalletOutlined />,
      label: "Budgets",
    },
    {
      key: "/goals",
      icon: <AimOutlined />,
      label: "Savings Goals",
    },
  ];

  // ---------------- ADMIN MENU ----------------
  const adminItems = [
    {
      key: "/admin/stats",
      icon: <BarChartOutlined />,
      label: "System Stats",
    }