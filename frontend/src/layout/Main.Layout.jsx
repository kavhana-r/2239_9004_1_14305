import React from "react";
import {
  Layout,
  Menu,
  Button,
  Tag,
  Space,
} from "antd";

import {
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  TrophyOutlined,
  TeamOutlined,
  DollarOutlined,
  TagsOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../store/slices/authSlice";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const role = String(
    user?.role || "ROLE_USER"
  ).toUpperCase();

  const isAdmin = role.includes("ADMIN");

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  const userMenuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: (
        <Link to="/dashboard">
          Dashboard
        </Link>
      ),
    },

    {
      key: "/transactions",
      icon: <TransactionOutlined />,
      label: (
        <Link to="/transactions">
          Transactions
        </Link>
      ),
    },

    {
      key: "/budgets",
      icon: <WalletOutlined />,
      label: (
        <Link to="/budgets">
          Budgets
        </Link>
      ),
    },

    {
      key: "/goals",
      icon: <TrophyOutlined />,
      label: (
        <Link to="/goals">
          Goals
        </Link>
      ),
    },
  ];

  const adminMenuItems = [
    {
      key: "/admin/stats",
      icon: <BarChartOutlined />,
      label: (
        <Link to="/admin/stats">
          Admin Stats
        </Link>
      ),
    },

    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: (
        <Link to="/admin/users">
          Users
        </Link>
      ),
    },

    {
      key: "/admin/currencies",
      icon: <DollarOutlined />,
      label: (
        <Link to="/admin/currencies">
          Currencies
        </Link>
      ),
    },

    {
      key: "/admin/categories",
      icon: <TagsOutlined />,
      label: (
        <Link to="/admin/categories">
          Categories
        </Link>
      ),
    },
  ];

  const menuItems = isAdmin
    ? [
        ...userMenuItems,
        {
          type: "divider",
        },
        ...adminMenuItems,
      ]
    : userMenuItems;

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {/* TOP NAVBAR */}

      <Header
        style={{
          height: 64,
          padding: "0 24px",
          background: "#ffffff",
          borderBottom:
            "1px solid #eeeeee",

          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
        }}
      >
        {/* LOGO */}

        <div
          style={{
            fontSize: 23,
            fontWeight: 700,
          }}
        >
          Mint
          <span
            style={{
              color: "#1677ff",
            }}
          >
            Matrix
          </span>
        </div>

        {/* USER AREA */}

        <Space size="middle">
          <span
            style={{
              fontWeight: 500,
            }}
          >
            {user?.username || "User"}
          </span>

          <Tag
            color={
              isAdmin
                ? "purple"
                : "blue"
            }
          >
            {isAdmin
              ? "ADMIN"
              : "USER"}
          </Tag>

          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      {/* BODY */}

      <Layout>

        {/* SIDEBAR */}

        <Sider
          width={230}
          breakpoint="lg"
          collapsedWidth="0"
          theme="light"
          style={{
            borderRight:
              "1px solid #eeeeee",
          }}
        >
          <div
            style={{
              padding: "20px 16px 10px",
              fontSize: 13,
              fontWeight: 600,
              color: "#888",
            }}
          >
            MENU
          </div>

          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[
              location.pathname,
            ]}
            items={menuItems}
            style={{
              borderRight: 0,
            }}
          />
        </Sider>

        {/* PAGE CONTENT */}

        <Layout>
          <Content
            style={{
              padding: 24,
              background: "#f5f7fb",
              minHeight:
                "calc(100vh - 64px)",
            }}
          >
            <Outlet />
          </Content>
        </Layout>

      </Layout>
    </Layout>
  );
}