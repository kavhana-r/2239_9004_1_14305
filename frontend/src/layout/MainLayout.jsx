// import React, { useState } from "react";
// import {
//   Layout,
//   Menu,
//   Button,
//   Typography,
//   Avatar,
//   Tooltip,
// } from "antd";

// import {
//   DashboardOutlined,
//   TransactionOutlined,
//   WalletOutlined,
//   AimOutlined,
//   BarChartOutlined,
//   UserOutlined,
//   DollarOutlined,
//   AppstoreOutlined,
//   LogoutOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
// } from "@ant-design/icons";

// import { useDispatch, useSelector } from "react-redux";
// import {
//   useNavigate,
//   Outlet,
//   useLocation,
// } from "react-router-dom";

// import { logout } from "../store/slices/authSlice";
// import "../App.css";

// const { Sider, Header, Content } = Layout;
// const { Text } = Typography;

// function MainLayout() {
//   const [collapsed, setCollapsed] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const user = useSelector((state) => state.auth?.user);

//   const role = user?.role;

//   const isAdmin =
//     role === "ROLE_ADMIN" || role === "ADMIN";

//   const username =
//     user?.username ||
//     user?.user?.username ||
//     "User";

//   // ================= USER MENU =================

//   const userItems = [
//     {
//       key: "/dashboard",
//       icon: <DashboardOutlined />,
//       label: "Dashboard",
//     },
//     {
//       key: "/transactions",
//       icon: <TransactionOutlined />,
//       label: "Transactions",
//     },
//     {
//       key: "/budgets",
//       icon: <WalletOutlined />,
//       label: "Budgets",
//     },
//     {
//       key: "/goals",
//       icon: <AimOutlined />,
//       label: "Savings Goals",
//     },
//   ];

//   // ================= ADMIN MENU =================

//   const adminItems = [
//     {
//       key: "/admin/stats",
//       icon: <BarChartOutlined />,
//       label: "System Stats",
//     },
//     {
//       key: "/admin/users",
//       icon: <UserOutlined />,
//       label: "Manage Users",
//     },
//     {
//       key: "/admin/currencies",
//       icon: <DollarOutlined />,
//       label: "Currencies",
//     },
//     {
//       key: "/admin/categories",
//       icon: <AppstoreOutlined />,
//       label: "Categories",
//     },
//   ];

//   const menuItems = isAdmin
//     ? adminItems
//     : userItems;

//   // ================= LOGOUT =================

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   // ================= MENU CLICK =================

//   const handleMenuClick = ({ key }) => {
//     navigate(key);
//   };

//   // ================= MAIN UI =================

//   return (
//     <Layout className="app-layout-container">

//       {/* SIDEBAR */}

//       <Sider
//         collapsible
//         collapsed={collapsed}
//         trigger={null}
//         breakpoint="lg"
//         onBreakpoint={(broken) => {
//           if (broken) {
//             setCollapsed(true);
//           }
//         }}
//         className="sidebar-nav"
//       >

//         {/* BRAND AND MENU */}

//         <div>
//           <div className="brand-section">
//             {collapsed ? "MM" : "MintMatrix"}
//           </div>

//           <Menu
//             mode="inline"
//             selectedKeys={[location.pathname]}
//             items={menuItems}
//             onClick={handleMenuClick}
//             className="nav-menu-list"
//           />
//         </div>

//         {/* SIDEBAR FOOTER */}

//         <div className="sidebar-footer-profile">

//           {/* USER PROFILE */}

//           {!collapsed && (
//             <div className="user-profile-section">

//               <Avatar
//                 size="small"
//                 icon={<UserOutlined />}
//               />

//               <Text
//                 className="user-profile-name"
//                 style={{ color: "#fff" }}
//                 ellipsis
//               >
//                 {username}
//               </Text>

//             </div>
//           )}

//           {/* LOGOUT */}

//           <Tooltip
//             title={collapsed ? "Logout" : ""}
//           >
//             <button
//               type="button"
//               className="logout-action-trigger"
//               onClick={handleLogout}
//             >
//               <LogoutOutlined />

//               {!collapsed && (
//                 <span>Logout</span>
//               )}
//             </button>
//           </Tooltip>

//         </div>

//       </Sider>

//       {/* MAIN CONTENT */}

//       <Layout>

//         {/* HEADER */}

//         <Header
//           style={{
//             padding: "0 24px",
//             background: "#ffffff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             boxShadow:
//               "0 1px 4px rgba(0,0,0,0.05)",
//           }}
//         >

//           {/* COLLAPSE BUTTON */}

//           <Button
//             type="text"
//             icon={
//               collapsed ? (
//                 <MenuUnfoldOutlined />
//               ) : (
//                 <MenuFoldOutlined />
//               )
//             }
//             onClick={() =>
//               setCollapsed(!collapsed)
//             }
//             style={{
//               fontSize: "16px",
//             }}
//           />

//           {/* WELCOME MESSAGE */}

//           <div>
//             <Text
//               style={{
//                 fontSize: "14px",
//                 color: "#475569",
//               }}
//             >
//               {isAdmin
//                 ? "Administrator Account"
//                 : `Welcome, ${username}`}
//             </Text>
//           </div>

//         </Header>

//         {/* PAGE CONTENT */}

//         <Content className="workspace-viewport">
//           <Outlet />
//         </Content>

//       </Layout>

//     </Layout>
//   );
// }

// export default MainLayout;
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Avatar,
  Tooltip,
  Tag,
  Select,
  Dropdown,
  Drawer,
  Modal,
  Form,
  Input,
  message,
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
  ThunderboltFilled,
  CalendarOutlined,
  LineChartOutlined,
  DownOutlined,
  KeyOutlined,
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

import { logout } from "../store/slices/authSlice";

const { Sider, Header, Content } = Layout;
const { Text, Title } = Typography;

const checkPasswordCriteria = (pwd = "") => {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^a-zA-Z0-9]/.test(pwd),
  };
};

const getPasswordStrength = (pwd = "") => {
  if (!pwd) {
    return { score: 0, label: "Required", classSuffix: "none" };
  }
  const criteria = checkPasswordCriteria(pwd);
  const metCount = Object.values(criteria).filter(Boolean).length;

  if (metCount <= 2 || pwd.length < 6) {
    return { score: 1, label: "Weak", classSuffix: "weak" };
  } else if (metCount === 3 || (metCount === 4 && pwd.length < 8)) {
    return { score: 2, label: "Fair", classSuffix: "fair" };
  } else if (metCount === 4) {
    return { score: 3, label: "Good", classSuffix: "good" };
  } else {
    return { score: 4, label: "Strong", classSuffix: "strong" };
  }
};

function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.user);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || user?.preferredCurrency || "USD";
  });

  useEffect(() => {
    if (user?.preferredCurrency && !localStorage.getItem("preferredCurrency")) {
      setSelectedCurrency(user.preferredCurrency);
    }
  }, [user]);

  const role = user?.role;
  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(null);

  const newPasswordCriteria = checkPasswordCriteria(newPassword);
  const newPasswordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = confirmNewPassword && newPassword === confirmNewPassword;
  const passwordsMismatch = confirmNewPassword && newPassword !== confirmNewPassword;

  const resetChangePasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setChangePasswordError(null);
    setChangePasswordLoading(false);
    setChangePasswordOpen(false);
  };

  const handleChangePasswordSubmit = async () => {
    setChangePasswordError(null);
    if (!currentPassword) {
      setChangePasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setChangePasswordError("Please enter a new password.");
      return;
    }
    if (!newPasswordCriteria.minLength) {
      setChangePasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (!newPasswordCriteria.hasUpper) {
      setChangePasswordError("New password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!newPasswordCriteria.hasLower) {
      setChangePasswordError("New password must contain at least one lowercase letter (a-z).");
      return;
    }
    if (!newPasswordCriteria.hasNumber) {
      setChangePasswordError("New password must contain at least one number (0-9).");
      return;
    }
    if (!newPasswordCriteria.hasSpecial) {
      setChangePasswordError("New password must contain at least one special character (!@#$%^&*).");
      return;
    }
    if (!confirmNewPassword) {
      setChangePasswordError("Please confirm your new password.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("New passwords do not match.");
      return;
    }

    try {
      setChangePasswordLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/auth/change-password",
        {
          username: user?.username || localStorage.getItem("username"),
          currentPassword,
          newPassword,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      message.success("Password updated successfully to a strong password!");
      resetChangePasswordForm();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "Failed to update password. Please check your current password.";
      setChangePasswordError(msg);
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const username =
    user?.username ||
    user?.user?.username ||
    "User";

  const userItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined style={{ fontSize: 17 }} />,
      label: "Dashboard",
    },
    {
      key: "/transactions",
      icon: <TransactionOutlined style={{ fontSize: 17 }} />,
      label: "Transactions",
    },
    {
      key: "/budgets",
      icon: <WalletOutlined style={{ fontSize: 17 }} />,
      label: "Budgets",
    },
    {
      key: "/goals",
      icon: <AimOutlined style={{ fontSize: 17 }} />,
      label: "Goals",
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined style={{ fontSize: 17 }} />,
      label: "Categories",
    },
    {
      key: "/currencies",
      icon: <DollarOutlined style={{ fontSize: 17 }} />,
      label: "Currencies",
    },
    {
      key: "/reports",
      icon: <LineChartOutlined style={{ fontSize: 17 }} />,
      label: "Reports",
    },
  ];

  const adminItems = [
    {
      key: "/admin/stats",
      icon: <BarChartOutlined style={{ fontSize: 17 }} />,
      label: "System Stats",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined style={{ fontSize: 17 }} />,
      label: "Manage Users",
    },
    {
      key: "/admin/goals",
      icon: <AimOutlined style={{ fontSize: 17 }} />,
      label: "Manage Goals",
    },
    {
      key: "/admin/currencies",
      icon: <DollarOutlined style={{ fontSize: 17 }} />,
      label: "Currencies",
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined style={{ fontSize: 17 }} />,
      label: "Categories",
    },
  ];

  const menuItems = isAdmin ? adminItems : userItems;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileDrawerOpen(false);
  };

  // Get current page title for breadcrumb/header
  const getPageTitle = () => {
    const path = location.pathname;
    const found = [...userItems, ...adminItems].find((item) => item.key === path);
    return found ? found.label : "MintMatrix";
  };

  const userMenuItems = [
    ...(isAdmin
      ? [
          {
            key: "users",
            icon: <UserOutlined />,
            label: "Manage Users",
            onClick: () => navigate("/admin/users"),
          },
          {
            type: "divider",
          },
        ]
      : []),
    {
      key: "change-password",
      icon: <KeyOutlined />,
      label: "Change Password",
      onClick: () => {
        setChangePasswordError(null);
        setChangePasswordOpen(true);
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const sidebarContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        {/* Brand Logo Header */}
        <div
          className="mint-sidebar-logo"
          style={{
            padding: collapsed ? "0 16px" : "0 20px",
          }}
          onClick={() => navigate(isAdmin ? "/admin/stats" : "/dashboard")}
        >
          <div className="mint-logo-icon">
            <ThunderboltFilled />
          </div>

          {!collapsed && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#ffffff",
                  fontSize: 19,
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Mint<span style={{ color: "#10b981" }}>Matrix</span>
              </span>
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {isAdmin ? "Admin Portal" : "Multi-Currency Budget"}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{ padding: "14px 0" }}>
          {!collapsed && (
            <div
              style={{
                padding: "0 20px 8px",
                color: "#64748b",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Navigation
            </div>
          )}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: "none" }}
          />
        </div>
      </div>

      {/* User Card & Logout Footer */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          background: "#071a17",
        }}
      >
        {!collapsed ? (
          <div className="mint-user-card">
            <Avatar
              style={{
                backgroundColor: isAdmin ? "#f59e0b" : "#10b981",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {username}
              </div>
              <Tag
                color={isAdmin ? "gold" : "success"}
                style={{
                  fontSize: 10,
                  lineHeight: "16px",
                  padding: "0 6px",
                  margin: 0,
                  border: "none",
                }}
              >
                {isAdmin ? "Admin" : "Standard"}
              </Tag>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Avatar
              style={{
                backgroundColor: isAdmin ? "#f59e0b" : "#10b981",
                fontWeight: 700,
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        )}

        <Tooltip title={collapsed ? "Logout" : ""}>
          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              borderRadius: 8,
              height: 38,
              fontWeight: 600,
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      <Sider
        className="mint-sidebar"
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 100,
          background: "#071a17",
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        bodyStyle={{ padding: 0, background: "#071a17" }}
        width={260}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Layout Body */}
      <Layout style={{ background: "#f8fafc" }}>
        <Header
          className="app-header"
          style={{
            padding: "0 28px",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            lineHeight: "normal",
            boxSizing: "border-box",
          }}
        >
          {/* Context Header (Left) */}
          <div
            className="context-header-left"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              lineHeight: "normal",
            }}
          >
            <Button
              type="text"
              className="context-collapse-btn"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 18, color: "#334155" }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 18, color: "#334155" }} />
                )
              }
              onClick={() => {
                if (window.innerWidth < 992) {
                  setMobileDrawerOpen(true);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: 0,
              }}
            />

            <div
              className="context-title-group"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                lineHeight: "normal",
              }}
            >
              <Title
                level={4}
                className="context-title"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.25,
                }}
              >
                {getPageTitle()}
              </Title>
              <Text
                className="context-subtitle"
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {isAdmin
                  ? "System Administration Console"
                  : "MintMatrix Financial Analytics"}
              </Text>
            </div>
          </div>

          {/* Global Controls (Right) */}
          <div
            className="global-controls-right"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              lineHeight: "normal",
            }}
          >
            {/* Currency Selector */}
            <Select
              className="header-currency-select"
              value={selectedCurrency}
              onChange={(val) => {
                setSelectedCurrency(val);
                localStorage.setItem("preferredCurrency", val);
                window.dispatchEvent(new CustomEvent("currencyChange", { detail: val }));
              }}
              style={{ width: 125, height: 38 }}
              popupMatchSelectWidth={false}
              options={[
                { value: "AUD", label: "AUD (A$)" },
                { value: "CAD", label: "CAD (C$)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
                { value: "INR", label: "INR (₹)" },
                { value: "JPY", label: "JPY (¥)" },
                { value: "USD", label: "USD ($)" },
              ]}
            />

            {/* Calendar date */}
            <div
              className="header-date-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 38,
                gap: 7,
                padding: "0 14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                color: "#475569",
                fontSize: 12,
                fontWeight: 600,
                boxSizing: "border-box",
                lineHeight: "normal",
              }}
            >
              <CalendarOutlined style={{ color: "#10b981", fontSize: 14 }} />
              <span>{dayjs().format("MMM D, YYYY")}</span>
            </div>

            {/* Profile Dropdown */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div
                className="header-profile-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 38,
                  gap: 8,
                  padding: "0 12px 0 4px",
                  borderRadius: 20,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  lineHeight: "normal",
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: isAdmin ? "#f59e0b" : "#10b981",
                    fontWeight: 700,
                    width: 30,
                    height: 30,
                    lineHeight: "30px",
                    fontSize: 13,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                  {username}
                </span>
                <DownOutlined style={{ fontSize: 10, color: "#94a3b8", marginLeft: 2 }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 0,
            padding: "24px 28px",
            minHeight: "calc(100vh - 72px)",
            maxWidth: 1440,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Content>

        {/* Change Password Modal */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#dcfce7",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                <KeyOutlined />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                  Change to Strong Password
                </div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>
                  Update your credentials with strong security requirements
                </div>
              </div>
            </div>
          }
          open={changePasswordOpen}
          onCancel={resetChangePasswordForm}
          footer={null}
          destroyOnClose
          width={480}
        >
          <div style={{ marginTop: 16 }}>
            {changePasswordError && (
              <div
                className="auth-alert-box error"
                role="alert"
                style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8 }}
              >
                <CloseCircleFilled className="auth-alert-icon" />
                <div className="auth-alert-text" style={{ fontSize: 13 }}>{changePasswordError}</div>
              </div>
            )}

            <Form layout="vertical" onFinish={handleChangePasswordSubmit}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>Current Password</span>}
                required
                style={{ marginBottom: 16 }}
              >
                <Input.Password
                  id="currentPassword"
                  prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 8 }} />}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (changePasswordError) setChangePasswordError(null);
                  }}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>New Strong Password</span>}
                required
                style={{ marginBottom: 16 }}
              >
                <Input.Password
                  id="newPassword"
                  prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 8 }} />}
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (changePasswordError) setChangePasswordError(null);
                  }}
                  size="large"
                />

                {/* Real-time Strength Meter & Checklist */}
                <div className="auth-password-strength-container" style={{ marginTop: 8 }}>
                  <div className="auth-password-meter-header">
                    <span className="auth-password-meter-title">Password Strength</span>
                    <span className={`auth-password-strength-badge ${newPasswordStrength.classSuffix}`}>
                      {newPasswordStrength.label}
                    </span>
                  </div>

                  <div className="auth-password-meter-bar-track">
                    <div
                      className={`auth-password-meter-segment ${
                        newPasswordStrength.score >= 1 ? `active-${newPasswordStrength.classSuffix}` : ""
                      }`}
                    />
                    <div
                      className={`auth-password-meter-segment ${
                        newPasswordStrength.score >= 2 ? `active-${newPasswordStrength.classSuffix}` : ""
                      }`}
                    />
                    <div
                      className={`auth-password-meter-segment ${
                        newPasswordStrength.score >= 3 ? `active-${newPasswordStrength.classSuffix}` : ""
                      }`}
                    />
                    <div
                      className={`auth-password-meter-segment ${
                        newPasswordStrength.score >= 4 ? `active-${newPasswordStrength.classSuffix}` : ""
                      }`}
                    />
                  </div>

                  <div className="auth-password-criteria-list">
                    <div className={`auth-password-criterion ${newPasswordCriteria.minLength ? "valid" : ""}`}>
                      <span className="auth-password-criterion-icon">
                        {newPasswordCriteria.minLength ? <CheckCircleFilled /> : "•"}
                      </span>
                      <span>Min 8 characters</span>
                    </div>
                    <div className={`auth-password-criterion ${newPasswordCriteria.hasUpper ? "valid" : ""}`}>
                      <span className="auth-password-criterion-icon">
                        {newPasswordCriteria.hasUpper ? <CheckCircleFilled /> : "•"}
                      </span>
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`auth-password-criterion ${newPasswordCriteria.hasLower ? "valid" : ""}`}>
                      <span className="auth-password-criterion-icon">
                        {newPasswordCriteria.hasLower ? <CheckCircleFilled /> : "•"}
                      </span>
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`auth-password-criterion ${newPasswordCriteria.hasNumber ? "valid" : ""}`}>
                      <span className="auth-password-criterion-icon">
                        {newPasswordCriteria.hasNumber ? <CheckCircleFilled /> : "•"}
                      </span>
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`auth-password-criterion ${newPasswordCriteria.hasSpecial ? "valid" : ""}`}>
                      <span className="auth-password-criterion-icon">
                        {newPasswordCriteria.hasSpecial ? <CheckCircleFilled /> : "•"}
                      </span>
                      <span>Special symbol (!@#$...)</span>
                    </div>
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 13, color: "#334155" }}>Confirm New Password</span>}
                required
                style={{ marginBottom: 20 }}
              >
                <Input.Password
                  id="confirmNewPassword"
                  prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 8 }} />}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (changePasswordError) setChangePasswordError(null);
                  }}
                  size="large"
                />
                {passwordsMatch && (
                  <div className="auth-password-match-tag match">
                    <CheckCircleFilled /> Passwords match
                  </div>
                )}
                {passwordsMismatch && (
                  <div className="auth-password-match-tag mismatch">
                    <CloseCircleFilled /> Passwords do not match
                  </div>
                )}
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
                <Button onClick={resetChangePasswordForm} disabled={changePasswordLoading} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={changePasswordLoading}
                  size="large"
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    fontWeight: 600,
                    border: "none",
                  }}
                >
                  Update to Strong Password
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default MainLayout;