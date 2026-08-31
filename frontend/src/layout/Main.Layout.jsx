import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
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
import { useNavigate, Outlet } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const { Sider, Header, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);

  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "MM" : "MintMatrix"}
        </div>

        {!collapsed && (
          <div
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            <UserOutlined /> {user?.username || "User"}
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          items={isAdmin ? adminItems : userItems}
          onClick={({ key }) => navigate(key)}
        />

        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 16px",
          }}
        >
          <Button
            danger
            type="primary"
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 20px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
          />
          <Typography.Title
            level={4}
            style={{ margin: "0 0 0 15px" }}
          >
            {isAdmin ? "Administrator Panel" : "Financial Dashboard"}
          </Typography.Title>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}