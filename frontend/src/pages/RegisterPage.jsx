// import React, { useState } from "react";
// import {
//   Button,
//   Form,
//   Input,
//   Select,
//   Typography,
//   message,
// } from "antd";

// import {
//   LockOutlined,
//   UserAddOutlined,
//   CheckCircleFilled,
// } from "@ant-design/icons";

// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// import "../Login.css";

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
//       <div className="auth-split-container">

//         {/* LEFT SIDE — REGISTER */}
//         <section className="auth-form-panel">
//           <div className="auth-form-content">

//             {/* Brand */}
//             <div className="auth-brand">
//               <div className="auth-brand-mark">
//                 <UserAddOutlined />
//               </div>

//               <span className="auth-brand-name">
//                 MintMatrix
//               </span>
//             </div>

//             {/* Heading */}
//             <div className="auth-heading">
//               <Title level={1}>Create your account</Title>

//               <Text>
//                 Start your smarter financial journey
//                 with MintMatrix.
//               </Text>
//             </div>

//             {/* Registration Form */}
//             <Form
//               layout="vertical"
//               onFinish={handleSubmit}
//               className="auth-form"
//             >
//               <Form.Item
//                 label="Username"
//                 required
//                 className="auth-form-item"
//               >
//                 <Input
//                   prefix={<UserAddOutlined />}
//                   placeholder="Username"
//                   value={formData.username}
//                   onChange={(e) =>
//                     handleChange("username", e.target.value)
//                   }
//                   autoComplete="username"
//                   size="large"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Password"
//                 required
//                 className="auth-form-item"
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     handleChange("password", e.target.value)
//                   }
//                   autoComplete="new-password"
//                   size="large"
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Preferred Currency"
//                 className="auth-form-item"
//               >
//                 <Select
//                   value={formData.preferredCurrency}
//                   onChange={(value) =>
//                     handleChange("preferredCurrency", value)
//                   }
//                   size="large"
//                   className="auth-select"
//                   options={[
//                     {
//                       value: "USD",
//                       label: "USD - US Dollar",
//                     },
//                     {
//                       value: "EUR",
//                       label: "EUR - Euro",
//                     },
//                     {
//                       value: "INR",
//                       label: "INR - Indian Rupee",
//                     },
//                     {
//                       value: "GBP",
//                       label: "GBP - British Pound",
//                     },
//                   ]}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Account Type"
//                 className="auth-form-item"
//               >
//                 <Select
//                   value={formData.role}
//                   onChange={(value) =>
//                     handleChange("role", value)
//                   }
//                   size="large"
//                   className="auth-select"
//                   options={[
//                     {
//                       value: "ROLE_USER",
//                       label: "Regular User",
//                     },
//                     {
//                       value: "ROLE_ADMIN",
//                       label: "Administrator",
//                     },
//                   ]}
//                 />
//               </Form.Item>

//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 block
//                 size="large"
//                 loading={loading}
//                 className="auth-submit-button"
//               >
//                 Register
//               </Button>
//             </Form>

//             {/* Login Link */}
//             <div className="auth-switch">
//               <Text>
//                 Already have an account?{" "}
//               </Text>

//               <Link to="/login">
//                 Login
//               </Link>
//             </div>

//             <div className="auth-security-note">
//               <span>Secure financial workspace</span>
//             </div>
//           </div>
//         </section>

//         {/* RIGHT SIDE — MINTMATRIX SHOWCASE */}
//         <section className="auth-showcase-panel">

//           <div className="showcase-decoration showcase-decoration-one" />
//           <div className="showcase-decoration showcase-decoration-two" />

//           <div className="showcase-content">

//             <div className="showcase-label">
//               <span className="showcase-dot" />
//               SMART FINANCIAL MANAGEMENT
//             </div>

//             <Title level={2} className="showcase-title">
//               Build a better
//               <br />
//               <span>financial future.</span>
//             </Title>

//             <Text className="showcase-description">
//               Create your MintMatrix account and bring
//               your income, expenses, budgets, savings,
//               and currencies together in one place.
//             </Text>

//             {/* Feature list */}
//             <div className="showcase-features">

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Track your expenses effortlessly</span>
//               </div>

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Plan and manage monthly budgets</span>
//               </div>

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Set and monitor savings goals</span>
//               </div>

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Analyze your financial activity</span>
//               </div>

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Manage multiple currencies</span>
//               </div>

//               <div className="showcase-feature">
//                 <CheckCircleFilled />
//                 <span>Make smarter financial decisions</span>
//               </div>

//             </div>

//             {/* Decorative financial visual */}
//             <div className="showcase-visual">

//               <div className="visual-orbit visual-orbit-one" />
//               <div className="visual-orbit visual-orbit-two" />

//               <div className="visual-leaf visual-leaf-one">
//                 ✦
//               </div>

//               <div className="visual-leaf visual-leaf-two">
//                 ✦
//               </div>

//               <div className="visual-center">
//                 <div className="visual-center-small">
//                   MINTMATRIX
//                 </div>

//                 <div className="visual-center-title">
//                   Track.
//                   <br />
//                   Plan.
//                   <br />
//                   Grow.
//                 </div>
//               </div>

//             </div>

//           </div>

//           <div className="showcase-footer">
//             <span>Multi-Currency</span>
//             <span>•</span>
//             <span>Budget Analytics</span>
//             <span>•</span>
//             <span>Financial Goals</span>
//           </div>

//         </section>
//       </div>
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
import { LockOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Login.css";

const { Title, Text } = Typography;

const API_URL = "http://localhost:8080/api/auth";

const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;']/ .test(password)
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const [role, setRole] = useState("ROLE_USER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password) {
      message.error("Please fill in all required fields.");
      return;
    }

    // Password validation
    if (!isStrongPassword(password)) {
      message.warning(
        "Weak password. Use at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/register`, {
        username: username.trim(),
        password,
        preferredCurrency,
        role,
      });

      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Registration failed.";

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">

        {/* LEFT CARD */}
        <div className="auth-form-panel">
          <div className="auth-form-content">

            <div className="auth-brand">
              <div className="auth-brand-mark">
                <UserAddOutlined />
              </div>

              <div className="auth-brand-name">
                MINTMATRIX
              </div>
            </div>

            <div className="auth-heading">
              <Title level={1}>Create account</Title>
              <Text type="secondary">
                Start managing your finances with MintMatrix
              </Text>
            </div>

            <Form
              layout="vertical"
              className="auth-form"
              onFinish={handleSubmit}
            >

              {/* USERNAME */}
              <Form.Item
                label="Username"
                className="auth-form-item"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                />
              </Form.Item>

              {/* PASSWORD */}
              <Form.Item
                label="Password"
                className="auth-form-item"
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Form.Item>

              {/* PASSWORD RULES */}
              <div
                style={{
                  marginTop: "-8px",
                  marginBottom: "18px",
                  fontSize: "12px",
                  color: "#718076",
                  lineHeight: "1.6",
                }}
              >
                Password must contain at least 8 characters, including
                uppercase, lowercase, number, and special character.
              </div>

              {/* CURRENCY */}
              <Form.Item
                label="Preferred Currency"
                className="auth-form-item"
              >
                <Select
                  value={preferredCurrency}
                  onChange={setPreferredCurrency}
                  options={[
                    { value: "USD", label: "USD - US Dollar" },
                    { value: "EUR", label: "EUR - Euro" },
                    { value: "INR", label: "INR - Indian Rupee" },
                    { value: "GBP", label: "GBP - British Pound" },
                  ]}
                />
              </Form.Item>

              {/* ROLE */}
              <Form.Item
                label="Account Type"
                className="auth-form-item"
              >
                <Select
                  value={role}
                  onChange={setRole}
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

              {/* REGISTER */}
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  block
                  loading={loading}
                  className="auth-submit-button"
                  icon={<UserAddOutlined />}
                >
                  Register
                </Button>
              </Form.Item>

            </Form>

            <div className="auth-switch">
              <Text>Already have an account?</Text>
              <Link to="/login">Log in</Link>
            </div>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="auth-showcase-panel">
          <div className="showcase-content">

            <div className="showcase-label">
              SMART FINANCIAL MANAGEMENT
            </div>

            <Title className="showcase-title">
              Build better financial habits.
            </Title>

            <Text className="showcase-description">
              Track your money, plan your spending, and build better
              financial habits — all in one beautifully simple platform.
            </Text>

            <div className="showcase-features">
              <div className="showcase-feature">
                Track your expenses effortlessly
              </div>

              <div className="showcase-feature">
                Plan and manage monthly budgets
              </div>

              <div className="showcase-feature">
                Set and monitor savings goals
              </div>

              <div className="showcase-feature">
                Analyze your financial activity
              </div>

              <div className="showcase-feature">
                Manage multiple currencies
              </div>

              <div className="showcase-feature">
                Make smarter financial decisions
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;