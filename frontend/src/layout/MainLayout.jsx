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

  const user = useSelector((state) => state.auth?.user);

  const role = user?.role;

  const isAdmin =
    role === "ROLE_ADMIN" || role === "ADMIN";

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

  // ================= MAIN UI =================

  return (
    <Layout className="app-layout-container">

      {/* SIDEBAR */}

      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        className="sidebar-nav"
      >

        {/* BRAND AND MENU */}

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

        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer-profile">

          {/* USER PROFILE */}

          {!collapsed && (
            <div className="user-profile-section">

              <Avatar
                size="small"
                icon={<UserOutlined />}
              />

              <Text
                className="user-profile-name"
                style={{ color: "#fff" }}
                ellipsis
              >
                {username}
              </Text>

            </div>
          )}

          {/* LOGOUT */}

          <Tooltip
            title={collapsed ? "Logout" : ""}
          >
            <button
              type="button"
              className="logout-action-trigger"
              onClick={handleLogout}
            >
              <LogoutOutlined />

              {!collapsed && (
                <span>Logout</span>
              )}
            </button>
          </Tooltip>

        </div>

      </Sider>

      {/* MAIN CONTENT */}

      <Layout>

        {/* HEADER */}

        <Header
          style={{
            padding: "0 24px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow:
              "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >

          {/* COLLAPSE BUTTON */}

          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() =>
              setCollapsed(!collapsed)
            }
            style={{
              fontSize: "16px",
            }}
          />

          {/* WELCOME MESSAGE */}

          <div>
            <Text
              style={{
                fontSize: "14px",
                color: "#475569",
              }}
            >
              {isAdmin
                ? "Administrator Account"
                : `Welcome, ${username}`}
            </Text>
          </div>

        </Header>

        {/* PAGE CONTENT */}

        <Content className="workspace-viewport">
          <Outlet />
        </Content>

      </Layout>

    </Layout>
  );
}

export default MainLayout;
