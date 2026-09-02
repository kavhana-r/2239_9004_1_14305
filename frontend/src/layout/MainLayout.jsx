import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  TrophyOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const { Sider, Content } = Layout;

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.user);

  const isAdmin = user?.role === "ROLE_ADMIN";

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
      icon: <TrophyOutlined />,
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

  const menuItems = isAdmin ? adminItems : userItems;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: collapsed ? 20 : 24,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "MM" : "MintMatrix"}
        </div>

        {!collapsed && (
          <div
            style={{
              color: "#fff",
              padding: "10px 20px",
              textAlign: "center",
            }}
          >
            <UserOutlined /> {user?.username || "User"}
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
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
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              width: "100%",
              color: "#fff",
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout>~
        <Content
          style={{
            padding: 24,
            minHeight: "100vh",
            background: "#f5f5f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;