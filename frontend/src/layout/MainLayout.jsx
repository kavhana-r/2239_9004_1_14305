import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Space,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  TransactionOutlined,
  WalletOutlined,
  TrophyOutlined,
  BarChartOutlined,
  TeamOutlined,
  DollarOutlined,
  TagsOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);

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
      icon: <TeamOutlined />,
      label: "Manage Users",
    },
    {
      key: "/admin/currencies",
      icon: <DollarOutlined />,
      label: "Currencies",
    },
    {
      key: "/admin/categories",
      icon: <TagsOutlined />,
      label: "Categories",
    },
  ];

  const items = isAdmin ? adminItems : userItems;

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
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? 20 : 24,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "MM" : "MintMatrix"}
        </div>

        {!collapsed && user?.username && (
          <div
            style={{
              padding: "10px 20px",
              color: "rgba(255,255,255,.75)",
              borderBottom: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <Space>
              <Avatar size="small">
                {user.username.charAt(0).toUpperCase()}
              </Avatar>

              <Text style={{ color: "white" }}>{user.username}</Text>
            </Space>
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />

        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 15px",
          }}
        >
          <Tooltip title={collapsed ? "Logout" : ""}>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              {!collapsed && "Logout"}
            </Button>
          </Tooltip>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          transition: "all .2s",
        }}
      >
        <Header
          style={{
            padding: "0 20px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={() => setCollapsed(!collapsed)}
          />

          <Text strong>
            {isAdmin ? "Administrator" : "Personal Finance"}
          </Text>
        </Header>

        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;