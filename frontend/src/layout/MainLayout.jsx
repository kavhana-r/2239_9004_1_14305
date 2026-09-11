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
import {
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { logout } from "../store/slices/authSlice";
import "../App.css";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get logged-in user from Redux
  const user = useSelector((state) => state.auth?.user);

  // Get role
  const role = user?.role;

  // Check admin
  const isAdmin =
    role === "ROLE_ADMIN" || role === "ADMIN";

  // Get username safely
  const username =
    user?.username ||
    user?.user?.username ||
    "User";

  // ================= USER MENU =================
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

  // ================= ADMIN MENU =================
  const adminItems = [
    {
      key: "/admin/stats",
      icon: <BarChartOutlined />,
      label: "System Stats",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Manage Users",
    },
    {
      key: "/admin/currencies",
      icon: <DollarOutlined />,
      label: "Currencies",
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: "Categories",
    },
  ];

  // Select menu based on role
  const menuItems = isAdmin
    ? adminItems
    : userItems;

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ================= MENU CLICK =================
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout className="app-layout-container">

      {/* ================= SIDEBAR ================= */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        className="sidebar-nav"
      >
        {/* Top Header Logo Brand Area */}
        <div>
          <div className="brand-section">
            {collapsed ? "MM" : "MintMatrix"}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="nav-menu-list"
          />
        </div>

        {/* Dynamic User Profile Footer Placement Area */}
        <div className="sidebar-footer-profile">
          {!collapsed && (
            
              <Avatar size="small" icon={<UserOutlined />} />
              <Text className="user-profile-name" style={{ color: '#fff' }} ellipsis>
                {username}
              </Text>
            </div>
          )}

          <Tooltip title={collapsed ? "Logout" : ""}>
            <button
              className="logout-action-trigger"
              onClick={handleLogout}
            >
              <LogoutOutlined />
              {!collapsed && "Logout"}
            </button>
          </Tooltip>
        </div>
      </Sider>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px" }}
          />

          <div>
            <Text style={{ fontSize: "14px", color: "#475569" }}>
              {isAdmin ? "Administrator Account" : `Welcome, ${username}`}
            </Text>
          </div>
        </Header>

        <Content className="workspace-viewport">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
