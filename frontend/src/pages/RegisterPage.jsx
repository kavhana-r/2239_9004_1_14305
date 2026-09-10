// import React, { useState } from "react";
// import {
//   Button,
//   Card,
//   Form,
//   Input,
//   Select,
//   Typography,
//   message,
// } from "antd";

// import { UserAddOutlined } from "@ant-design/icons";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// const { Title, Text } = Typography;

// function RegisterPage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     preferredCurrency: "USD",
//     role: "ROLE_USER",
//   });

//   const handleChange = (field, value) => {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.username.trim()) {
//       message.error("Username is required.");
//       return;
//     }

//     if (!formData.password) {
//       message.error("Password is required.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:8080/api/auth/register",
//         {
//           username: formData.username.trim(),
//           password: formData.password,
//           preferredCurrency: formData.preferredCurrency,
//           role: formData.role,
//         }
//       );

//       console.log("Registration response:", response.data);

//       message.success("Registration successful! Please login.");

//       navigate("/login");
//     } catch (error) {
//       console.error("Registration error:", error);

//       let errorMessage = "Registration failed.";

//       if (error.response) {
//         if (typeof error.response.data === "string") {
//           errorMessage = error.response.data;
//         } else if (error.response.data) {
//           errorMessage =
//             error.response.data.message ||
//             error.response.data.error ||
//             errorMessage;
//         }
//       } else if (error.request) {
//         errorMessage =
//           "Cannot connect to backend. Make sure Spring Boot is running.";
//       } else {
//         errorMessage = error.message || errorMessage;
//       }

//       message.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <Card
//         className="auth-card"
//         style={{ maxWidth: 470, width: "100%" }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             marginBottom: 24,
//           }}
//         >
//           <div className="brand-icon">
//             <UserAddOutlined />
//           </div>

//           <Title level={2}>Create Account</Title>

//           <Text type="secondary">
//             Start managing your finances with MintMatrix
//           </Text>
//         </div>

//         <Form
//           layout="vertical"
//           onFinish={handleSubmit}
//         >
//           <Form.Item
//             label="Username"
//             required
//           >
//             <Input
//               placeholder="Username"
//               value={formData.username}
//               onChange={(e) =>
//                 handleChange(
//                   "username",
//                   e.target.value
//                 )
//               }
//             />
//           </Form.Item>

//           <Form.Item
//             label="Password"
//             required
//           >
//             <Input.Password
//               placeholder="Password"
//               value={formData.password}
//               onChange={(e) =>
//                 handleChange(
//                   "password",
//                   e.target.value
//                 )
//               }
//             />
//           </Form.Item>

//           <Form.Item label="Preferred Currency">
//             <Select
//               value={formData.preferredCurrency}
//               onChange={(value) =>
//                 handleChange(
//                   "preferredCurrency",
//                   value
//                 )
//               }
//               options={[
//                 {
//                   value: "USD",
//                   label: "USD - US Dollar",
//                 },
//                 {
//                   value: "EUR",
//                   label: "EUR - Euro",
//                 },
//                 {
//                   value: "INR",
//                   label: "INR - Indian Rupee",
//                 },
//                 {
//                   value: "GBP",
//                   label: "GBP - British Pound",
//                 },
//               ]}
//             />
//           </Form.Item>

//           <Form.Item label="Account Type">
//             <Select
//               value={formData.role}
//               onChange={(value) =>
//                 handleChange("role", value)
//               }
//               options={[
//                 {
//                   value: "ROLE_USER",
//                   label: "Regular User",
//                 },
//                 {
//                   value: "ROLE_ADMIN",
//                   label: "Administrator",
//                 },
//               ]}
//             />
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             size="large"
//             loading={loading}
//           >
//             Register
//           </Button>
//         </Form>

//         <div
//           style={{
//             textAlign: "center",
//             marginTop: 20,
//           }}
//         >
//           <Text type="secondary">
//             Already have an account?{" "}
//           </Text>

//           <Link to="/login">Login</Link>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default RegisterPage;


import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";

import {
  LockOutlined,
  UserAddOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import "../Login.css";

const { Title, Text } = Typography;

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    preferredCurrency: "USD",
    role: "ROLE_USER",
  });

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      message.error("Username is required.");
      return;
    }

    if (!formData.password) {
      message.error("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username: formData.username.trim(),
          password: formData.password,
          preferredCurrency: formData.preferredCurrency,
          role: formData.role,
        }
      );

      console.log("Registration response:", response.data);

      message.success("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      } else if (error.request) {
        errorMessage =
          "Cannot connect to backend. Make sure Spring Boot is running.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">

        {/* LEFT SIDE — REGISTER */}
        <section className="auth-form-panel">
          <div className="auth-form-content">

            {/* Brand */}
            <div className="auth-brand">
              <div className="auth-brand-mark">
                <UserAddOutlined />
              </div>

              <span className="auth-brand-name">
                MintMatrix
              </span>
            </div>

            {/* Heading */}
            <div className="auth-heading">
              <Title level={1}>Create your account</Title>

              <Text>
                Start your smarter financial journey
                with MintMatrix.
              </Text>
            </div>

            {/* Registration Form */}
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
                  prefix={<UserAddOutlined />}
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    handleChange("username", e.target.value)
                  }
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
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  autoComplete="new-password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Preferred Currency"
                className="auth-form-item"
              >
                <Select
                  value={formData.preferredCurrency}
                  onChange={(value) =>
                    handleChange("preferredCurrency", value)
                  }
                  size="large"
                  className="auth-select"
                  options={[
                    {
                      value: "USD",
                      label: "USD - US Dollar",
                    },
                    {
                      value: "EUR",
                      label: "EUR - Euro",
                    },
                    {
                      value: "INR",
                      label: "INR - Indian Rupee",
                    },
                    {
                      value: "GBP",
                      label: "GBP - British Pound",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Account Type"
                className="auth-form-item"
              >
                <Select
                  value={formData.role}
                  onChange={(value) =>
                    handleChange("role", value)
                  }
                  size="large"
                  className="auth-select"
                  options={[
                    {
                      value: "ROLE_USER",
                      label: "Regular User",
                    },
                    {
                      value: "ROLE_ADMIN",
                      label: "Administrator",
                    },
                  ]}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="auth-submit-button"
              >
                Register
              </Button>
            </Form>

            {/* Login Link */}
            <div className="auth-switch">
              <Text>
                Already have an account?{" "}
              </Text>

              <Link to="/login">
                Login
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
              Build a better
              <br />
              <span>financial future.</span>
            </Title>

            <Text className="showcase-description">
              Create your MintMatrix account and bring
              your income, expenses, budgets, savings,
              and currencies together in one place.
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

              <div className="visual-leaf visual-leaf-one">
                ✦
              </div>

              <div className="visual-leaf visual-leaf-two">
                ✦
              </div>

              <div className="visual-center">
                <div className="visual-center-small">
                  MINTMATRIX
                </div>

                <div className="visual-center-title">
                  Track.
                  <br />
                  Plan.
                  <br />
                  Grow.
                </div>
              </div>

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

export default RegisterPage;