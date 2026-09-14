// // import React, { useEffect, useState } from "react";
// // import {
// //   Button,
// //   Form,
// //   Input,
// //   Typography,
// //   message,
// // } from "antd";

// // import {
// //   LockOutlined,
// //   UserOutlined,
// //   LoginOutlined,
// //   CheckCircleFilled,
// // } from "@ant-design/icons";

// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate, Link } from "react-router-dom";

// // import { login, clearError } from "../store/slices/authSlice";

// // import "../Login.css";

// // const { Title, Text } = Typography;

// // function LoginPage() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const { loading, error, token, user } = useSelector(
// //     (state) => state.auth
// //   );

// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");

// //   useEffect(() => {
// //     if (token && user) {
// //       const role = user?.role;

// //       if (role === "ROLE_ADMIN" || role === "ADMIN") {
// //         navigate("/admin/stats", { replace: true });
// //       } else {
// //         navigate("/dashboard", { replace: true });
// //       }
// //     }
// //   }, [token, user, navigate]);

// //   useEffect(() => {
// //     if (error) {
// //       const errorMessage =
// //         typeof error === "string"
// //           ? error
// //           : error?.message || "Login failed";

// //       message.error(errorMessage);
// //       dispatch(clearError());
// //     }
// //   }, [error, dispatch]);

// //   const handleSubmit = async () => {
// //     if (!username.trim() || !password) {
// //       message.error("Please enter username and password.");
// //       return;
// //     }

// //     try {
// //       await dispatch(
// //         login({
// //           username: username.trim(),
// //           password,
// //         })
// //       ).unwrap();

// //       message.success("Login successful");
// //     } catch (err) {
// //       const errorMessage =
// //         typeof err === "string"
// //           ? err
// //           : err?.message || "Invalid username or password";

// //       message.error(errorMessage);
// //     }
// //   };

// //   return (
// //     <div className="auth-page">
// //       <div className="auth-split-container">

// //         {/* LEFT SIDE — LOGIN */}
// //         <section className="auth-form-panel">
// //           <div className="auth-form-content">

// //             {/* Brand */}
// //             <div className="auth-brand">
// //               <div className="auth-brand-mark">
// //                 <LoginOutlined />
// //               </div>

// //               <span className="auth-brand-name">
// //                 MintMatrix
// //               </span>
// //             </div>

// //             {/* Heading */}
// //             <div className="auth-heading">
// //               <Title level={1}>Welcome back</Title>

// //               <Text>
// //                 Sign in to continue managing your finances
// //                 with MintMatrix.
// //               </Text>
// //             </div>

// //             {/* Login Form */}
// //             <Form
// //               layout="vertical"
// //               onFinish={handleSubmit}
// //               className="auth-form"
// //             >
// //               <Form.Item
// //                 label="Username"
// //                 required
// //                 className="auth-form-item"
// //               >
// //                 <Input
// //                   prefix={<UserOutlined />}
// //                   placeholder="Username"
// //                   value={username}
// //                   onChange={(e) => setUsername(e.target.value)}
// //                   autoComplete="username"
// //                   size="large"
// //                 />
// //               </Form.Item>

// //               <Form.Item
// //                 label="Password"
// //                 required
// //                 className="auth-form-item"
// //               >
// //                 <Input.Password
// //                   prefix={<LockOutlined />}
// //                   placeholder="Password"
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   autoComplete="current-password"
// //                   size="large"
// //                 />
// //               </Form.Item>

// //               <div className="auth-forgot">
// //                 <span>Forgot password?</span>
// //               </div>

// //               <Button
// //                 type="primary"
// //                 htmlType="submit"
// //                 block
// //                 size="large"
// //                 loading={loading}
// //                 className="auth-submit-button"
// //               >
// //                 Log in
// //               </Button>
// //             </Form>

// //             {/* Register */}
// //             <div className="auth-switch">
// //               <Text>
// //                 Don't have an account?{" "}
// //               </Text>

// //               <Link to="/register">
// //                 REGISTER NOW!
// //               </Link>
// //             </div>

// //             <div className="auth-security-note">
// //               <span>Secure financial workspace</span>
// //             </div>
// //           </div>
// //         </section>

// //         {/* RIGHT SIDE — MINTMATRIX SHOWCASE */}
// //         <section className="auth-showcase-panel">

// //           <div className="showcase-decoration showcase-decoration-one" />
// //           <div className="showcase-decoration showcase-decoration-two" />

// //           <div className="showcase-content">

// //             <div className="showcase-label">
// //               <span className="showcase-dot" />
// //               SMART FINANCIAL MANAGEMENT
// //             </div>

// //             <Title level={2} className="showcase-title">
// //               Take control of your
// //               <br />
// //               <span>financial journey.</span>
// //             </Title>

// //             <Text className="showcase-description">
// //               Track your money, plan your spending, and
// //               build better financial habits — all in one
// //               beautifully simple platform.
// //             </Text>

// //             {/* Feature list */}
// //             <div className="showcase-features">

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Track your expenses effortlessly</span>
// //               </div>

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Plan and manage monthly budgets</span>
// //               </div>

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Set and monitor savings goals</span>
// //               </div>

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Analyze your financial activity</span>
// //               </div>

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Manage multiple currencies</span>
// //               </div>

// //               <div className="showcase-feature">
// //                 <CheckCircleFilled />
// //                 <span>Make smarter financial decisions</span>
// //               </div>

// //             </div>

// //             {/* Decorative financial visual */}
// //             <div className="showcase-visual">

// //               <div className="visual-orbit visual-orbit-one" />
// //               <div className="visual-orbit visual-orbit-two" />

              
              
// //             </div>

// //           </div>

// //           <div className="showcase-footer">
// //             <span>Multi-Currency</span>
// //             <span>•</span>
// //             <span>Budget Analytics</span>
// //             <span>•</span>
// //             <span>Financial Goals</span>
// //           </div>

// //         </section>
// //       </div>
// //     </div>
// //   );
// // }

// // export default LoginPage;

// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   Button,
// // //   Form,
// // //   Input,
// // //   Typography,
// // //   message,
// // // } from "antd";
// // // import {
// // //   LockOutlined,
// // //   UserOutlined,
// // //   LoginOutlined,
// // //   CheckCircleFilled,
// // // } from "@ant-design/icons";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import { login, clearError } from "../store/slices/authSlice";
// // // import "../Login.css";

// // // const { Title, Text } = Typography;

// // // /* =========================================================
// // //    PASSWORD STRENGTH CHECK
// // //    ========================================================= */

// // // const isStrongPassword = (password) => {
// // //   return (
// // //     password.length >= 8 &&
// // //     /[A-Z]/.test(password) &&
// // //     /[a-z]/.test(password) &&
// // //     /[0-9]/.test(password) &&
// // //     /[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;']/.test(password)
// // //   );
// // // };

// // // const LoginPage = () => {
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate();

// // //   const { loading, error, token, user } = useSelector(
// // //     (state) => state.auth
// // //   );

// // //   const [username, setUsername] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   /* =========================================================
// // //      SUCCESS LOGIN / ROLE NAVIGATION
// // //      ========================================================= */

// // //   useEffect(() => {
// // //     if (token && user) {
// // //       const role = user.role;

// // //       if (role === "ROLE_ADMIN" || role === "ADMIN") {
// // //         navigate("/admin/stats");
// // //       } else {
// // //         navigate("/dashboard");
// // //       }
// // //     }
// // //   }, [token, user, navigate]);

// // //   /* =========================================================
// // //      ERROR MESSAGE
// // //      ========================================================= */

// // //   useEffect(() => {
// // //     if (error) {
// // //       const errorMsg =
// // //         typeof error === "string"
// // //           ? error
// // //           : error?.message || "Login failed";

// // //       message.error(errorMsg);
// // //       dispatch(clearError());
// // //     }
// // //   }, [error, dispatch]);

// // //   /* =========================================================
// // //      LOGIN
// // //      ========================================================= */

// // //   const handleSubmit = async () => {
// // //     if (!username.trim() || !password) {
// // //       return;
// // //     }

// // //     /*
// // //       Show warning for weak password,
// // //       BUT DO NOT BLOCK LOGIN.

// // //       This keeps existing login behavior and
// // //       prevents existing users from being locked out.
// // //     */
// // //     if (!isStrongPassword(password)) {
// // //       message.warning("Weak password");
// // //     }

// // //     try {
// // //       await dispatch(
// // //         login({
// // //           username: username.trim(),
// // //           password,
// // //         })
// // //       ).unwrap();

// // //       message.success("Login successful");
// // //     } catch (err) {
// // //       // Redux error handling displays the error message.
// // //     }
// // //   };

// // //   return (
// // //     <div className="auth-page">
// // //       <div className="auth-split-container">

// // //         {/* =====================================================
// // //             LEFT — LOGIN CARD
// // //             ===================================================== */}

// // //         <div className="auth-form-panel">
// // //           <div className="auth-form-content">

// // //             {/* BRAND */}
// // //             <div className="auth-brand">
// // //               <div className="auth-brand-mark">
// // //                 <LoginOutlined />
// // //               </div>

// // //               <div className="auth-brand-name">
// // //                 MINTMATRIX
// // //               </div>
// // //             </div>

// // //             {/* HEADING */}
// // //             <div className="auth-heading">
// // //               <Title level={1}>
// // //                 Welcome Back
// // //               </Title>

// // //               <Text type="secondary">
// // //                 Sign in to access your MintMatrix dashboard
// // //               </Text>
// // //             </div>

// // //             {/* LOGIN FORM */}
// // //             <Form
// // //               layout="vertical"
// // //               className="auth-form"
// // //               onFinish={handleSubmit}
// // //             >

// // //               {/* USERNAME */}
// // //               <Form.Item
// // //                 label="Username"
// // //                 className="auth-form-item"
// // //               >
// // //                 <Input
// // //                   prefix={<UserOutlined />}
// // //                   placeholder="Username"
// // //                   value={username}
// // //                   onChange={(e) =>
// // //                     setUsername(e.target.value)
// // //                   }
// // //                   autoComplete="off"
// // //                 />
// // //               </Form.Item>

// // //               {/* PASSWORD */}
// // //               <Form.Item
// // //                 label="Password"
// // //                 className="auth-form-item"
// // //               >
// // //                 <Input.Password
// // //                   prefix={<LockOutlined />}
// // //                   placeholder="Password"
// // //                   value={password}
// // //                   onChange={(e) =>
// // //                     setPassword(e.target.value)
// // //                   }
// // //                   autoComplete="new-password"
// // //                 />
// // //               </Form.Item>

// // //               {/* FORGOT PASSWORD */}
// // //               <div className="auth-forgot">
// // //                 <span>Forgot password?</span>
// // //               </div>

// // //               {/* LOGIN BUTTON */}
// // //               <Form.Item>
// // //                 <Button
// // //                   htmlType="submit"
// // //                   type="primary"
// // //                   block
// // //                   loading={loading}
// // //                   className="auth-submit-button"
// // //                   icon={<LoginOutlined />}
// // //                 >
// // //                   Log in
// // //                 </Button>
// // //               </Form.Item>

// // //             </Form>

// // //             {/* REGISTER */}
// // //             <div className="auth-switch">
// // //               <Text>
// // //                 Don't have an account?
// // //               </Text>

// // //               <Link to="/register">
// // //                 register now!
// // //               </Link>
// // //             </div>

// // //             {/* SECURITY */}
// // //             <div className="auth-security-note">
// // //               <CheckCircleFilled /> Secure & Private
// // //             </div>

// // //           </div>
// // //         </div>

// // //         {/* =====================================================
// // //             RIGHT — SHOWCASE CARD
// // //             ===================================================== */}

// // //         <div className="auth-showcase-panel">

// // //           <div className="showcase-content">

// // //             {/* LABEL */}
// // //             <div className="showcase-label">
// // //               <span className="showcase-dot"></span>
// // //               SMART FINANCIAL MANAGEMENT
// // //             </div>

// // //             {/* TITLE */}
// // //             <Title className="showcase-title">
// // //               Take control of your financial journey.
// // //             </Title>

// // //             {/* DESCRIPTION */}
// // //             <Text className="showcase-description">
// // //               Track your money, plan your spending, and build
// // //               better financial habits — all in one beautifully
// // //               simple platform.
// // //             </Text>

// // //             {/* FEATURES */}
// // //             <div className="showcase-features">

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Track your expenses effortlessly
// // //                 </span>
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Plan and manage monthly budgets
// // //                 </span>
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Set and monitor savings goals
// // //                 </span>
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Analyze your financial activity
// // //                 </span>
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Manage multiple currencies
// // //                 </span>
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 <CheckCircleFilled />
// // //                 <span>
// // //                   Make smarter financial decisions
// // //                 </span>
// // //               </div>

// // //             </div>

// // //           </div>

// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LoginPage;
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  App as AntdApp,
  message as staticMessage,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  ThunderboltFilled,
  ArrowRightOutlined,
  GlobalOutlined,
  PieChartOutlined,
  AimOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CrownOutlined,
  SafetyOutlined,
  CopyOutlined,
  ReloadOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { login, logout, clearError } from "../store/slices/authSlice";

const checkPasswordCriteria = (pwd = "") => {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^a-zA-Z0-9]/.test(pwd),
  };
};

const isStrongPassword = (pwd = "") => {
  if (!pwd) return false;
  const c = checkPasswordCriteria(pwd);
  return c.minLength && c.hasUpper && c.hasLower && c.hasNumber && c.hasSpecial;
};

const generateStrongPassword = () => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const specials = "!@#$%^&*()_+-=";

  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    lower[Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specials[Math.floor(Math.random() * specials.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  const allChars = upper + lower + numbers + specials;
  for (let i = 0; i < 6; i++) {
    pwd.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  for (let i = pwd.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
  }

  return pwd.join("");
};

function LoginPage() {
  let appMessage = staticMessage;
  try {
    const antdContext = AntdApp.useApp();
    if (antdContext?.message) {
      appMessage = antdContext.message;
    }
  } catch (e) {
    // Fallback to static message
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, token, user } = useSelector(
    (state) => state.auth || {}
  );

  const searchParams = new URLSearchParams(location?.search || "");
  const isAdminQuery = searchParams.get("admin") === "true";
  const isInitialAdminPath =
    (typeof location !== "undefined" &&
      location?.pathname &&
      location.pathname.includes("/admin")) ||
    isAdminQuery;

  const [isAdminMode, setIsAdminMode] = useState(Boolean(isInitialAdminPath));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState(() => generateStrongPassword());
  const [copiedSuggestion, setCopiedSuggestion] = useState(false);
  const [weakPasswordModalOpen, setWeakPasswordModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location?.search || "");
    const adminQuery = params.get("admin") === "true";
    if (location?.pathname?.includes("/admin") || adminQuery) {
      setIsAdminMode(true);
    }
  }, [location?.pathname, location?.search]);

  // Handle auto-redirect if already logged in with matching role
  useEffect(() => {
    if (token && user && !localSuccess) {
      const role = user?.role || user?.user?.role;
      const isAdminRole = role === "ROLE_ADMIN" || role === "ADMIN";

      if (isAdminMode && isAdminRole) {
        navigate("/admin/stats", { replace: true });
      } else if (!isAdminMode && !isAdminRole) {
        navigate("/dashboard", { replace: true });
      }
      // If role does not match current portal, do not auto-redirect!
    }
  }, [token, user, isAdminMode, navigate, localSuccess]);

  // Sync Redux errors to local state
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Login failed. Please verify credentials.";

      setLocalError(errorMessage);
    }
  }, [error]);

  const handleRoleSwitch = (targetAdmin) => {
    setIsAdminMode(targetAdmin);
    setLocalError(null);
    setLocalSuccess(false);
    dispatch(clearError());
  };

  const handleRegeneratePassword = () => {
    setSuggestedPassword(generateStrongPassword());
    setCopiedSuggestion(false);
  };

  const handleCopySuggestion = async (pwdToCopy) => {
    const text = pwdToCopy || suggestedPassword;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedSuggestion(true);
      if (appMessage?.success) {
        appMessage.success("Strong password copied to clipboard!");
      }
      setTimeout(() => setCopiedSuggestion(false), 2500);
    } catch (e) {
      if (appMessage?.info) {
        appMessage.info(`Copied password: ${text}`);
      }
    }
  };

  const handleUseSuggestedPassword = (pwdToUse) => {
    const chosen = pwdToUse || suggestedPassword;
    setPassword(chosen);
    setWeakPasswordModalOpen(false);
    if (localError && localError.includes("Weak password")) {
      setLocalError(null);
    }
    if (appMessage?.info) {
      appMessage.info("Applied suggested strong password to password field!");
    }
  };

  const executeLogin = async (targetUsername, targetPassword) => {
    try {
      const data = await dispatch(
        login({
          username: targetUsername.trim(),
          password: targetPassword,
        })
      ).unwrap();

      const role = data?.role || data?.user?.role;
      const isAdminRole = role === "ROLE_ADMIN" || role === "ADMIN";

      // Enforce role isolation
      if (!isAdminMode && isAdminRole) {
        // Admin entered credentials into User Login
        dispatch(logout());
        const roleError = "Admin accounts must use Admin Login.";
        setLocalError(roleError);
        if (appMessage?.error) appMessage.error(roleError);
        return;
      }

      if (isAdminMode && !isAdminRole) {
        // Normal user entered credentials into Admin Login
        dispatch(logout());
        const roleError = "User accounts cannot access Admin Login.";
        setLocalError(roleError);
        if (appMessage?.error) appMessage.error(roleError);
        return;
      }

      // Valid credentials with matching role
      setLocalSuccess(true);
      if (isAdminRole) {
        if (appMessage?.success) appMessage.success("Admin login successful.");
        navigate("/admin/stats", { replace: true });
      } else {
        if (appMessage?.success) appMessage.success("Login successful.");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      let errorMessage = "Invalid email or password.";
      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setLocalError(errorMessage);
      if (appMessage?.error) appMessage.error(errorMessage);
    }
  };

  const handleSubmit = async () => {
    setLocalError(null);
    setLocalSuccess(false);

    if (!username.trim() || !password) {
      const msg = "Please enter username and password.";
      setLocalError(msg);
      if (appMessage?.error) appMessage.error(msg);
      return;
    }

    // Check if user is trying to log in with a weak password
    if (!isStrongPassword(password)) {
      const strongSuggestion = generateStrongPassword();
      setSuggestedPassword(strongSuggestion);
      setWeakPasswordModalOpen(true);
      const weakMsg =
        "Weak password detected! MintMatrix requires strong passwords (min 8 chars, uppercase, lowercase, numbers, and symbols). A suggested strong password has been generated for you below.";
      setLocalError(weakMsg);
      if (appMessage?.warning) {
        appMessage.warning("Weak password detected! A strong password recommendation has been generated.");
      }
      return;
    }

    await executeLogin(username, password);
  };

  return (
    <div className={`auth-split-wrapper ${isAdminMode ? "admin-portal" : ""}`}>
      {/* Left Showcase Side */}
      <div className="auth-split-left">
        <div>
          {/* MintMatrix Brand Lockup */}
          <div className="auth-brand-lockup">
            <div className="auth-brand-logo-badge">
              <ThunderboltFilled />
            </div>
            <div>
              <div className="auth-brand-name">
                Mint<span>Matrix</span>
              </div>
              <div className="auth-brand-subline">
                {isAdminMode
                  ? "Enterprise Admin Console"
                  : "MULTI-CURRENCY BUDGET ANALYTICS"}
              </div>
            </div>
          </div>

          <div className="auth-hero-content">
            <div
              className={`auth-portal-badge ${isAdminMode ? "admin-badge" : "user-badge"
                }`}
            >
              {isAdminMode ? (
                <>
                  <SafetyOutlined /> Admin Console
                </>
              ) : (
                <>
                  <CrownOutlined /> USER FINANCIAL PORTAL
                </>
              )}
            </div>

            <h1 className="auth-hero-heading">
              {isAdminMode ? (
                <>
                  Control. Secure. <span>Scale.</span>
                </>
              ) : (
                <>
                  Track. Plan. <span>Grow.</span>
                </>
              )}
            </h1>

            <p className="auth-hero-desc">
              {isAdminMode
                ? "Unified administration console for MintMatrix. Securely manage platform users, exchange rates, category taxonomies, and system-wide telemetry."
                : "Take full control of your personal finances with intelligent multi-currency budgeting, real-time conversions, and precision analytics."}
            </p>

            {/* Feature Cards Grid */}
            <div className="auth-feature-grid">
              {isAdminMode ? (
                <>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <SafetyCertificateOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">User Administration</div>
                    </div>
                  </div>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <GlobalOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">Currency Management</div>
                    </div>
                  </div>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <PieChartOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">Taxonomy Controls</div>
                    </div>
                  </div>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <AimOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">System Telemetry</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <GlobalOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">Multi-Currency</div>
                      <div className="auth-feature-subtitle">USD / EUR / GBP / INR</div>
                    </div>
                  </div>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <PieChartOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">Smart Budget Analytics</div>
                    </div>
                  </div>
                  <div className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <AimOutlined />
                    </div>
                    <div className="auth-feature-text-block">
                      <div className="auth-feature-title">Financial Goal Tracking</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Tagline Banner */}
        <div className="auth-bottom-banner">
          <div className="auth-bottom-icon">
            {isAdminMode ? "🛡️" : "💳"}
          </div>
          <div>
            <div className="auth-bottom-tagline">
              {isAdminMode
                ? "Role-Gated Security Architecture"
                : "Your Finances. Your Control."}
            </div>
            <div className="auth-bottom-sub">
              {isAdminMode
                ? "Strict JWT authentication with fine-grained role authorization."
                : "Real-time exchange rates across USD, EUR, GBP, and INR."}
            </div>
          </div>
        </div>
      </div>

      {/* Right Authentication Form Side */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          {/* Interactive Role Switcher */}
          <div className="auth-role-switch-container" role="tablist">
            <button
              type="button"
              id="user-portal-tab"
              role="tab"
              aria-selected={!isAdminMode}
              className={`auth-role-btn ${!isAdminMode ? "active-user" : ""}`}
              onClick={() => handleRoleSwitch(false)}
            >
              <UserOutlined /> User Login
            </button>
            <button
              type="button"
              id="admin-portal-tab"
              role="tab"
              aria-selected={isAdminMode}
              className={`auth-role-btn ${isAdminMode ? "active-admin" : ""}`}
              onClick={() => handleRoleSwitch(true)}
            >
              <SafetyOutlined /> Admin Login
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 className="auth-form-title">
              {isAdminMode ? "Admin Portal" : "Welcome Back"}
            </h2>
            <div className="auth-form-subtitle">
              {isAdminMode
                ? "Sign in with your system administrator credentials"
                : "Sign in to access your MintMatrix dashboard"}
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="auth-demo-box">
              <span className="auth-demo-title">
                ⚡ Quick Demo Sign In:
              </span>
              <div className="auth-demo-actions">
                <button
                  type="button"
                  id="user-demo-btn"
                  className="auth-demo-btn user-demo"
                  onClick={() => {
                    handleRoleSwitch(false);
                    setUsername("user");
                    setPassword("User@123");
                  }}
                >
                  User Demo
                </button>
                <button
                  type="button"
                  id="admin-demo-btn"
                  className="auth-demo-btn admin-demo"
                  onClick={() => {
                    handleRoleSwitch(true);
                    setUsername("admin");
                    setPassword("Admin@123");
                  }}
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {localError && (
            <div className="auth-alert-box error" role="alert">
              <CloseCircleFilled className="auth-alert-icon" />
              <div className="auth-alert-text">{localError}</div>
            </div>
          )}

          {/* Success Banner */}
          {localSuccess && (
            <div className="auth-alert-box success" role="status">
              <CheckCircleFilled className="auth-alert-icon" />
              <div className="auth-alert-text">
                Authentication successful! Redirecting...
              </div>
            </div>
          )}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={
                <span className="auth-input-label">
                  {isAdminMode ? "Admin Username" : "Username"}
                </span>
              }
              required
              style={{ marginBottom: 20 }}
            >
              <div className="auth-input-wrapper">
                <Input
                  id="username"
                  prefix={<UserOutlined style={{ color: "#94a3b8", marginRight: 10, fontSize: 18 }} />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  autoComplete="username"
                  size="large"
                  disabled={loading}
                />
              </div>
            </Form.Item>

            <Form.Item
              label={
                <span className="auth-input-label">
                  Password
                </span>
              }
              required
              style={{ marginBottom: 26 }}
            >
              <div className="auth-input-wrapper">
                <Input.Password
                  id="password"
                  prefix={<LockOutlined style={{ color: "#94a3b8", marginRight: 10, fontSize: 18 }} />}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  autoComplete="current-password"
                  size="large"
                  disabled={loading}
                />
              </div>

              {/* Weak Password Live Suggestion Box */}
              {password.length > 0 && !isStrongPassword(password) && (
                <div
                  className="auth-weak-password-suggestion"
                  data-testid="weak-password-suggestion"
                >
                  <div className="suggestion-header">
                    <SafetyCertificateOutlined style={{ color: "#d97706", fontSize: 16 }} />
                    <span>Weak Password Detected:</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#92400e", marginBottom: 8, lineHeight: 1.4 }}>
                    Passwords must be at least 8 characters and include uppercase, lowercase, numbers, and special symbols. Here is a recommended strong password:
                  </div>
                  <div className="suggestion-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="suggested-password-code" data-testid="suggested-password-code">
                        {suggestedPassword}
                      </span>
                      <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={handleRegeneratePassword}
                        title="Generate another password"
                      >
                        New
                      </Button>
                    </div>
                    <div className="suggestion-actions">
                      <Button
                        size="small"
                        icon={copiedSuggestion ? <CheckOutlined style={{ color: "#16a34a" }} /> : <CopyOutlined />}
                        onClick={() => handleCopySuggestion()}
                      >
                        {copiedSuggestion ? "Copied!" : "Copy Strong Password"}
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        style={{ background: "#f59e0b", borderColor: "#d97706" }}
                        onClick={() => handleUseSuggestedPassword()}
                      >
                        Use This Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
              icon={!loading && <ArrowRightOutlined style={{ fontSize: 18, marginLeft: 6 }} />}
              iconPosition="end"
              className={`auth-submit-btn ${isAdminMode ? "admin-btn" : ""}`}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </Form>

          {/* Weak Password Security Modal */}
          <Modal
            open={weakPasswordModalOpen}
            onCancel={() => setWeakPasswordModalOpen(false)}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#b45309", fontWeight: 700, fontSize: 16 }}>
                <SafetyCertificateOutlined style={{ fontSize: 20 }} />
                <span>Weak Password Detected</span>
              </div>
            }
            footer={[
              <Button key="cancel" onClick={() => setWeakPasswordModalOpen(false)}>
                Dismiss
              </Button>,
              <Button
                key="proceed"
                onClick={() => {
                  setWeakPasswordModalOpen(false);
                  executeLogin(username, password);
                }}
              >
                Try Logging In Anyway
              </Button>,
              <Button
                key="use"
                type="primary"
                style={{ background: "#10b981", borderColor: "#059669" }}
                onClick={() => handleUseSuggestedPassword()}
              >
                Use Suggested Password
              </Button>,
            ]}
          >
            <div style={{ padding: "8px 0" }}>
              <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                The password you entered does not meet security requirements. Passwords must have at least <strong>8 characters</strong>, including <strong>uppercase</strong>, <strong>lowercase</strong>, <strong>numbers</strong>, and <strong>symbols</strong>.
              </p>

              <div
                style={{
                  background: "#fffbeb",
                  border: "1.5px solid #fde68a",
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 14,
                }}
              >
                <div style={{ fontWeight: 600, color: "#92400e", fontSize: 12, marginBottom: 6 }}>
                  RECOMMENDED STRONG PASSWORD:
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 15,
                      fontWeight: 700,
                      background: "#ffffff",
                      border: "1px dashed #f59e0b",
                      padding: "6px 12px",
                      borderRadius: 6,
                      color: "#0f172a",
                    }}
                  >
                    {suggestedPassword}
                  </span>
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRegeneratePassword}
                  >
                    New
                  </Button>
                  <Button
                    size="small"
                    icon={copiedSuggestion ? <CheckOutlined style={{ color: "#16a34a" }} /> : <CopyOutlined />}
                    onClick={() => handleCopySuggestion()}
                  >
                    {copiedSuggestion ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                💡 Tip: You can change your password anytime via <strong>Change Password</strong> inside your profile menu once signed in.
              </p>
            </div>
          </Modal>

          {/* Footer Switching / Registration Link */}
          <div
            style={{
              textAlign: "center",
              marginTop: 26,
              paddingTop: 20,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            {!isAdminMode ? (
              <div>
                <span className="auth-footer-text">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/register"
                  className="auth-footer-link"
                >
                  Register User
                </Link>
                <span style={{ margin: "0 8px", color: "#cbd5e1" }}>|</span>
                <Link
                  to="/register?admin=true"
                  className="auth-footer-link"
                  style={{ color: "#d97706", fontWeight: 600 }}
                >
                  Register Admin
                </Link>
              </div>
            ) : (
              <div>
                <span className="auth-footer-text">
                  Don't have an admin account?{" "}
                </span>
                <Link
                  to="/register?admin=true"
                  className="auth-footer-link"
                  style={{ color: "#d97706", fontWeight: 600 }}
                >
                  Register Admin
                </Link>
                <span style={{ margin: "0 8px", color: "#cbd5e1" }}>|</span>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch(false)}
                  className="auth-footer-btn"
                >
                  Go to User Login
                </button>
              </div>
            )}
          </div>

          <div className="auth-footer-copyright">
            © 2026 MintMatrix. Secure Financial Analytics
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;