// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Form,
//   Input,
//   Typography,
//   message,
// } from "antd";

// import {
//   LockOutlined,
//   UserOutlined,
//   LoginOutlined,
// } from "@ant-design/icons";

// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";

// import { login, clearError } from "../store/slices/authSlice";

// const { Title, Text } = Typography;

// function LoginPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, error, token, user } = useSelector(
//     (state) => state.auth
//   );

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (token && user) {
//       const role = user?.role;

//       if (role === "ROLE_ADMIN" || role === "ADMIN") {
//         navigate("/admin/stats", { replace: true });
//       } else {
//         navigate("/dashboard", { replace: true });
//       }
//     }
//   }, [token, user, navigate]);

//   useEffect(() => {
//     if (error) {
//       const errorMessage =
//         typeof error === "string"
//           ? error
//           : error?.message || "Login failed";

//       message.error(errorMessage);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = async () => {
//     if (!username.trim() || !password) {
//       message.error("Please enter username and password.");
//       return;
//     }

//     try {
//       await dispatch(
//         login({
//           username: username.trim(),
//           password,
//         })
//       ).unwrap();

//       message.success("Login successful");
//     } catch (err) {
//       const errorMessage =
//         typeof err === "string"
//           ? err
//           : err?.message || "Invalid username or password";

//       message.error(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <Card
//         className="auth-card"
//         bordered={false}
//         style={{ maxWidth: 430, width: "100%" }}
//       >
//         <div style={{ textAlign: "center", marginBottom: 28 }}>
//           <div className="brand-icon">
//             <LoginOutlined />
//           </div>

//           <Title level={2} style={{ marginBottom: 4 }}>
//             MintMatrix
//           </Title>

//           <Text type="secondary">
//             Multi-Currency Budget Analytics
//           </Text>
//         </div>

//         <Form layout="vertical" onFinish={handleSubmit}>
//           <Form.Item label="Username" required>
//             <Input
//               prefix={<UserOutlined />}
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               autoComplete="username"
//             />
//           </Form.Item>

//           <Form.Item label="Password" required>
//             <Input
//               prefix={<LockOutlined />}
//               placeholder="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               autoComplete="current-password"
//             />
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             size="large"
//             loading={loading}
//           >
//             Log in
//           </Button>
//         </Form>

//         <div style={{ textAlign: "center", marginTop: 20 }}>
//           <Text type="secondary">
//             Don't have an account?{" "}
//           </Text>

//           <Link to="/register">register now!</Link>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default LoginPage;


import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  message,
} from "antd";

import {
  LockOutlined,
  UserOutlined,
  LoginOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { login, clearError } from "../store/slices/authSlice";

import "../Login.css";

const { Title, Text } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, user } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token && user) {
      const role = user?.role;

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        navigate("/admin/stats", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Login failed";

      message.error(errorMessage);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async () => {
    if (!username.trim() || !password) {
      message.error("Please enter username and password.");
      return;
    }

    try {
      await dispatch(
        login({
          username: username.trim(),
          password,
        })
      ).unwrap();

      message.success("Login successful");
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Invalid username or password";

      message.error(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">

        {/* LEFT SIDE — LOGIN */}
        <section className="auth-form-panel">
          <div className="auth-form-content">

            {/* Brand */}
            <div className="auth-brand">
              <div className="auth-brand-mark">
                <LoginOutlined />
              </div>

              <span className="auth-brand-name">
                MintMatrix
              </span>
            </div>

            {/* Heading */}
            <div className="auth-heading">
              <Title level={1}>Welcome back</Title>

              <Text>
                Sign in to continue managing your finances
                with MintMatrix.
              </Text>
            </div>

            {/* Login Form */}
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              className="auth-form"
            >
              <Form.Item
                label="Username"
                required
                className="auth-form-item"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                required
                className="auth-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  size="large"
                />
              </Form.Item>

              <div className="auth-forgot">
                <span>Forgot password?</span>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="auth-submit-button"
              >
                Log in
              </Button>
            </Form>

            {/* Register */}
            <div className="auth-switch">
              <Text>
                Don't have an account?{" "}
              </Text>

              <Link to="/register">
                REGISTER NOW!
              </Link>
            </div>

            <div className="auth-security-note">
              <span>Secure financial workspace</span>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE — MINTMATRIX SHOWCASE */}
        <section className="auth-showcase-panel">

          <div className="showcase-decoration showcase-decoration-one" />
          <div className="showcase-decoration showcase-decoration-two" />

          <div className="showcase-content">

            <div className="showcase-label">
              <span className="showcase-dot" />
              SMART FINANCIAL MANAGEMENT
            </div>

            <Title level={2} className="showcase-title">
              Take control of your
              <br />
              <span>financial journey.</span>
            </Title>

            <Text className="showcase-description">
              Track your money, plan your spending, and
              build better financial habits — all in one
              beautifully simple platform.
            </Text>

            {/* Feature list */}
            <div className="showcase-features">

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Track your expenses effortlessly</span>
              </div>

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Plan and manage monthly budgets</span>
              </div>

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Set and monitor savings goals</span>
              </div>

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Analyze your financial activity</span>
              </div>

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Manage multiple currencies</span>
              </div>

              <div className="showcase-feature">
                <CheckCircleFilled />
                <span>Make smarter financial decisions</span>
              </div>

            </div>

            {/* Decorative financial visual */}
            <div className="showcase-visual">

              <div className="visual-orbit visual-orbit-one" />
              <div className="visual-orbit visual-orbit-two" />

              
              
            </div>

          </div>

          <div className="showcase-footer">
            <span>Multi-Currency</span>
            <span>•</span>
            <span>Budget Analytics</span>
            <span>•</span>
            <span>Financial Goals</span>
          </div>

        </section>
      </div>
    </div>
  );
}

export default LoginPage;