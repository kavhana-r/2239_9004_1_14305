// // import React, { useState } from "react";
// // import {
// //   Button,
// //   Form,
// //   Input,
// //   Select,
// //   Typography,
// //   message,
// // } from "antd";

// // import {
// //   LockOutlined,
// //   UserAddOutlined,
// //   CheckCircleFilled,
// // } from "@ant-design/icons";

// // import { useNavigate, Link } from "react-router-dom";
// // import axios from "axios";

// // import "../Login.css";

// // const { Title, Text } = Typography;

// // function RegisterPage() {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);

// //   const [formData, setFormData] = useState({
// //     username: "",
// //     password: "",
// //     preferredCurrency: "USD",
// //     role: "ROLE_USER",
// //   });

// //   const handleChange = (field, value) => {
// //     setFormData((previous) => ({
// //       ...previous,
// //       [field]: value,
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     if (!formData.username.trim()) {
// //       message.error("Username is required.");
// //       return;
// //     }

// //     if (!formData.password) {
// //       message.error("Password is required.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const response = await axios.post(
// //         "http://localhost:8080/api/auth/register",
// //         {
// //           username: formData.username.trim(),
// //           password: formData.password,
// //           preferredCurrency: formData.preferredCurrency,
// //           role: formData.role,
// //         }
// //       );

// //       console.log("Registration response:", response.data);

// //       message.success("Registration successful! Please login.");

// //       navigate("/login");
// //     } catch (error) {
// //       console.error("Registration error:", error);

// //       let errorMessage = "Registration failed.";

// //       if (error.response) {
// //         if (typeof error.response.data === "string") {
// //           errorMessage = error.response.data;
// //         } else if (error.response.data) {
// //           errorMessage =
// //             error.response.data.message ||
// //             error.response.data.error ||
// //             errorMessage;
// //         }
// //       } else if (error.request) {
// //         errorMessage =
// //           "Cannot connect to backend. Make sure Spring Boot is running.";
// //       } else {
// //         errorMessage = error.message || errorMessage;
// //       }

// //       message.error(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-page">
// //       <div className="auth-split-container">

// //         {/* LEFT SIDE — REGISTER */}
// //         <section className="auth-form-panel">
// //           <div className="auth-form-content">

// //             {/* Brand */}
// //             <div className="auth-brand">
// //               <div className="auth-brand-mark">
// //                 <UserAddOutlined />
// //               </div>

// //               <span className="auth-brand-name">
// //                 MintMatrix
// //               </span>
// //             </div>

// //             {/* Heading */}
// //             <div className="auth-heading">
// //               <Title level={1}>Create your account</Title>

// //               <Text>
// //                 Start your smarter financial journey
// //                 with MintMatrix.
// //               </Text>
// //             </div>

// //             {/* Registration Form */}
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
// //                   prefix={<UserAddOutlined />}
// //                   placeholder="Username"
// //                   value={formData.username}
// //                   onChange={(e) =>
// //                     handleChange("username", e.target.value)
// //                   }
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
// //                   value={formData.password}
// //                   onChange={(e) =>
// //                     handleChange("password", e.target.value)
// //                   }
// //                   autoComplete="new-password"
// //                   size="large"
// //                 />
// //               </Form.Item>

// //               <Form.Item
// //                 label="Preferred Currency"
// //                 className="auth-form-item"
// //               >
// //                 <Select
// //                   value={formData.preferredCurrency}
// //                   onChange={(value) =>
// //                     handleChange("preferredCurrency", value)
// //                   }
// //                   size="large"
// //                   className="auth-select"
// //                   options={[
// //                     {
// //                       value: "USD",
// //                       label: "USD - US Dollar",
// //                     },
// //                     {
// //                       value: "EUR",
// //                       label: "EUR - Euro",
// //                     },
// //                     {
// //                       value: "INR",
// //                       label: "INR - Indian Rupee",
// //                     },
// //                     {
// //                       value: "GBP",
// //                       label: "GBP - British Pound",
// //                     },
// //                   ]}
// //                 />
// //               </Form.Item>

// //               <Form.Item
// //                 label="Account Type"
// //                 className="auth-form-item"
// //               >
// //                 <Select
// //                   value={formData.role}
// //                   onChange={(value) =>
// //                     handleChange("role", value)
// //                   }
// //                   size="large"
// //                   className="auth-select"
// //                   options={[
// //                     {
// //                       value: "ROLE_USER",
// //                       label: "Regular User",
// //                     },
// //                     {
// //                       value: "ROLE_ADMIN",
// //                       label: "Administrator",
// //                     },
// //                   ]}
// //                 />
// //               </Form.Item>

// //               <Button
// //                 type="primary"
// //                 htmlType="submit"
// //                 block
// //                 size="large"
// //                 loading={loading}
// //                 className="auth-submit-button"
// //               >
// //                 Register
// //               </Button>
// //             </Form>

// //             {/* Login Link */}
// //             <div className="auth-switch">
// //               <Text>
// //                 Already have an account?{" "}
// //               </Text>

// //               <Link to="/login">
// //                 Login
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
// //               Build a better
// //               <br />
// //               <span>financial future.</span>
// //             </Title>

// //             <Text className="showcase-description">
// //               Create your MintMatrix account and bring
// //               your income, expenses, budgets, savings,
// //               and currencies together in one place.
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

// //               <div className="visual-leaf visual-leaf-one">
// //                 ✦
// //               </div>

// //               <div className="visual-leaf visual-leaf-two">
// //                 ✦
// //               </div>

// //               <div className="visual-center">
// //                 <div className="visual-center-small">
// //                   MINTMATRIX
// //                 </div>

// //                 <div className="visual-center-title">
// //                   Track.
// //                   <br />
// //                   Plan.
// //                   <br />
// //                   Grow.
// //                 </div>
// //               </div>

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

// // export default RegisterPage;

// // // import React, { useState } from "react";
// // // import {
// // //   Button,
// // //   Form,
// // //   Input,
// // //   Select,
// // //   Typography,
// // //   message,
// // // } from "antd";
// // // import { LockOutlined, UserOutlined, UserAddOutlined } from "@ant-design/icons";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import axios from "axios";
// // // import "../Login.css";

// // // const { Title, Text } = Typography;

// // // const API_URL = "http://localhost:8080/api/auth";

// // // const isStrongPassword = (password) => {
// // //   return (
// // //     password.length >= 8 &&
// // //     /[A-Z]/.test(password) &&
// // //     /[a-z]/.test(password) &&
// // //     /[0-9]/.test(password) &&
// // //     /[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;']/.test(password)
// // //   );
// // // };

// // // const RegisterPage = () => {
// // //   const navigate = useNavigate();

// // //   const [username, setUsername] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [preferredCurrency, setPreferredCurrency] = useState("USD");
// // //   const [role, setRole] = useState("ROLE_USER");
// // //   const [loading, setLoading] = useState(false);

// // //   const handleSubmit = async () => {
// // //     if (!username.trim() || !password) {
// // //       message.error("Please fill in all required fields.");
// // //       return;
// // //     }

// // //     // Password validation
// // //     if (!isStrongPassword(password)) {
// // //       message.warning(
// // //         "Weak password. Use at least 8 characters with uppercase, lowercase, number, and special character."
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);

// // //       await axios.post(`${API_URL}/register`, {
// // //         username: username.trim(),
// // //         password,
// // //         preferredCurrency,
// // //         role,
// // //       });

// // //       message.success("Registration successful! Please login.");
// // //       navigate("/login");
// // //     } catch (error) {
// // //       const errorMsg =
// // //         error?.response?.data?.message ||
// // //         error?.response?.data ||
// // //         "Registration failed.";

// // //       message.error(errorMsg);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="auth-page">
// // //       <div className="auth-split-container">

// // //         {/* LEFT CARD */}
// // //         <div className="auth-form-panel">
// // //           <div className="auth-form-content">

// // //             <div className="auth-brand">
// // //               <div className="auth-brand-mark">
// // //                 <UserAddOutlined />
// // //               </div>

// // //               <div className="auth-brand-name">
// // //                 MINTMATRIX
// // //               </div>
// // //             </div>

// // //             <div className="auth-heading">
// // //               <Title level={1}>Create account</Title>
// // //               <Text type="secondary">
// // //                 Start managing your finances with MintMatrix
// // //               </Text>
// // //             </div>

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
// // //                   onChange={(e) => setUsername(e.target.value)}
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
// // //                   onChange={(e) => setPassword(e.target.value)}
// // //                   autoComplete="new-password"
// // //                 />
// // //               </Form.Item>

// // //               {/* PASSWORD RULES */}
// // //               <div
// // //                 style={{
// // //                   marginTop: "-8px",
// // //                   marginBottom: "18px",
// // //                   fontSize: "12px",
// // //                   color: "#718076",
// // //                   lineHeight: "1.6",
// // //                 }}
// // //               >
// // //                 Password must contain at least 8 characters, including
// // //                 uppercase, lowercase, number, and special character.
// // //               </div>

// // //               {/* CURRENCY */}
// // //               <Form.Item
// // //                 label="Preferred Currency"
// // //                 className="auth-form-item"
// // //               >
// // //                 <Select
// // //                   value={preferredCurrency}
// // //                   onChange={setPreferredCurrency}
// // //                   options={[
// // //                     { value: "USD", label: "USD - US Dollar" },
// // //                     { value: "EUR", label: "EUR - Euro" },
// // //                     { value: "INR", label: "INR - Indian Rupee" },
// // //                     { value: "GBP", label: "GBP - British Pound" },
// // //                   ]}
// // //                 />
// // //               </Form.Item>

// // //               {/* ROLE */}
// // //               <Form.Item
// // //                 label="Account Type"
// // //                 className="auth-form-item"
// // //               >
// // //                 <Select
// // //                   value={role}
// // //                   onChange={setRole}
// // //                   options={[
// // //                     {
// // //                       value: "ROLE_USER",
// // //                       label: "Regular User",
// // //                     },
// // //                     {
// // //                       value: "ROLE_ADMIN",
// // //                       label: "Administrator",
// // //                     },
// // //                   ]}
// // //                 />
// // //               </Form.Item>

// // //               {/* REGISTER */}
// // //               <Form.Item>
// // //                 <Button
// // //                   htmlType="submit"
// // //                   type="primary"
// // //                   block
// // //                   loading={loading}
// // //                   className="auth-submit-button"
// // //                   icon={<UserAddOutlined />}
// // //                 >
// // //                   Register
// // //                 </Button>
// // //               </Form.Item>

// // //             </Form>

// // //             <div className="auth-switch">
// // //               <Text>Already have an account?</Text>
// // //               <Link to="/login">Log in</Link>
// // //             </div>

// // //           </div>
// // //         </div>

// // //         {/* RIGHT CARD */}
// // //         <div className="auth-showcase-panel">
// // //           <div className="showcase-content">

// // //             <div className="showcase-label">
// // //               SMART FINANCIAL MANAGEMENT
// // //             </div>

// // //             <Title className="showcase-title">
// // //               Build better financial habits.
// // //             </Title>

// // //             <Text className="showcase-description">
// // //               Track your money, plan your spending, and build better
// // //               financial habits — all in one beautifully simple platform.
// // //             </Text>

// // //             <div className="showcase-features">
// // //               <div className="showcase-feature">
// // //                 Track your expenses effortlessly
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 Plan and manage monthly budgets
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 Set and monitor savings goals
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 Analyze your financial activity
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 Manage multiple currencies
// // //               </div>

// // //               <div className="showcase-feature">
// // //                 Make smarter financial decisions
// // //               </div>
// // //             </div>

// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default RegisterPage;

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   Button,
//   Card,
//   Space,
//   Typography,
//   Empty,
//   message,
//   Row,
//   Col,
//   Select,
//   Spin,
//   Tag,
//   Form,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   SearchOutlined,
//   CloseOutlined,
//   CheckCircleFilled,
// } from "@ant-design/icons";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import dayjs from "dayjs";
// import { logout } from "../store/slices/authSlice";

// const { Title, Text } = Typography;

// const DEFAULT_EXCHANGE_RATES = {
//   USD: 1.0,
//   EUR: 0.92,
//   GBP: 0.79,
//   INR: 83.50,
//   JPY: 155.0,
//   CAD: 1.36,
//   AUD: 1.52,
// };

// const getCurrencySymbol = (currency) => {
//   switch (currency) {
//     case "INR":
//       return "₹";
//     case "EUR":
//       return "€";
//     case "GBP":
//       return "£";
//     case "JPY":
//       return "¥";
//     case "AUD":
//       return "A$";
//     case "CAD":
//       return "C$";
//     case "USD":
//     default:
//       return "$";
//   }
// };

// const getInitialForm = () => ({
//   title: "",
//   amount: "",
//   currencyCode: "USD",
//   transactionType: "EXPENSE",
//   transactionDate: dayjs().format("YYYY-MM-DD"),
//   note: "",
//   categoryId: "",
// });

// const REQUIRED_CURRENCIES = [
//   { code: "AUD", country: "AU", name: "Australian Dollar", symbol: "AUD" },
//   { code: "CAD", country: "CA", name: "Canadian Dollar", symbol: "CAD" },
//   { code: "EUR", country: "EU", name: "Euro", symbol: "EUR" },
//   { code: "GBP", country: "GB", name: "British Pound", symbol: "GBP" },
//   { code: "INR", country: "IN", name: "Indian Rupee", symbol: "INR" },
//   { code: "JPY", country: "JP", name: "Japanese Yen", symbol: "JPY" },
//   { code: "USD", country: "US", name: "US Dollar", symbol: "USD" },
// ];

// const safeArray = (data) => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.content)) return data.content;
//   return [];
// };

// export default function TransactionsPage() {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   const [transactions, setTransactions] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [currencies, setCurrencies] = useState([]);

//   const [activeCurrency, setActiveCurrency] = useState(() => {
//     return localStorage.getItem("preferredCurrency") || "USD";
//   });
//   const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("ALL");
//   const [categoryFilter, setCategoryFilter] = useState("ALL");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingTransaction, setEditingTransaction] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [successAlert, setSuccessAlert] = useState(null);

//   const isMountedRef = useRef(true);
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   const [formData, setFormData] = useState(getInitialForm());

//   const handleUnauthorized = useCallback(() => {
//     try {
//       dispatch(logout());
//     } catch (e) {}
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     if (axios.defaults?.headers?.common) {
//       delete axios.defaults.headers.common.Authorization;
//     }
//     message.error("Session expired. Please login again.");
//     if (typeof window !== "undefined" && window.location) {
//       if (window.location.pathname !== "/login") {
//         try {
//           window.location.href = "/login";
//         } catch (e) {}
//       }
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const handleCurrencyChange = (e) => {
//       const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
//       setActiveCurrency(newCurr);
//     };

//     window.addEventListener("currencyChange", handleCurrencyChange);
//     return () => {
//       window.removeEventListener("currencyChange", handleCurrencyChange);
//     };
//   }, []);

//   // ================================
//   // FETCH TRANSACTIONS
//   // ================================
//   const fetchTransactions = async () => {
//     setLoading(true);

//     try {
//       const response = await axios.get("/api/transactions");
//       if (isMountedRef.current) {
//         setTransactions(safeArray(response.data));
//       }
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }
//       if (isMountedRef.current) {
//         setTransactions([]);
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setLoading(false);
//       }
//     }
//   };

//   // ================================
//   // FETCH CATEGORIES
//   // ================================
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("/api/categories");
//       if (isMountedRef.current) {
//         setCategories(safeArray(response.data));
//       }
//     } catch (error) {
//       if (isMountedRef.current) {
//         setCategories([]);
//       }
//     }
//   };

//   // ================================
//   // FETCH CURRENCIES
//   // ================================
//   const fetchCurrencies = async () => {
//     try {
//       const response = await axios.get("/api/currencies");
//       const list = safeArray(response.data);
//       if (isMountedRef.current) {
//         setCurrencies(list);
//         if (list.length > 0) {
//           const ratesMap = { ...DEFAULT_EXCHANGE_RATES };
//           list.forEach((c) => {
//             if (c.code && c.exchangeRate) {
//               ratesMap[c.code] = Number(c.exchangeRate);
//             }
//           });
//           setExchangeRates(ratesMap);
//         }
//       }
//     } catch (error) {
//       if (isMountedRef.current) {
//         setCurrencies([]);
//       }
//     }
//   };

//   // ================================
//   // INITIAL LOAD
//   // ================================
//   useEffect(() => {
//     fetchTransactions();
//     fetchCategories();
//     fetchCurrencies();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const convertValue = useCallback((amount, fromCurr = "USD") => {
//     const num = Number(amount || 0);
//     const from = fromCurr || "USD";
//     const to = activeCurrency || "USD";
//     if (from === to) return num;
//     const fromRate = exchangeRates[from] || DEFAULT_EXCHANGE_RATES[from] || 1.0;
//     const toRate = exchangeRates[to] || DEFAULT_EXCHANGE_RATES[to] || (to === "INR" ? 83.50 : 1.0);
//     return (num / fromRate) * toRate;
//   }, [activeCurrency, exchangeRates]);

//   const symbol = getCurrencySymbol(activeCurrency);

//   // ================================
//   // FORM CHANGE
//   // ================================
//   const handleChange = (field, value) => {
//     setFormData((previous) => {
//       const updated = {
//         ...previous,
//         [field]: value,
//       };
//       if (field === "transactionType") {
//         updated.categoryId = "";
//       }
//       return updated;
//     });
//   };

//   // ================================
//   // OPEN ADD
//   // ================================
//   const openAddModal = () => {
//     setEditingTransaction(null);
//     const initial = {
//       ...getInitialForm(),
//       currencyCode: activeCurrency,
//     };
//     setFormData(initial);
//     try {
//       form.resetFields();
//     } catch (e) {}
//     setModalOpen(true);
//   };

//   // ================================
//   // OPEN EDIT
//   // ================================
//   const openEditModal = (transaction) => {
//     setEditingTransaction(transaction);

//     const values = {
//       title: transaction.title || "",
//       amount: transaction.amount ?? "",
//       currencyCode:
//         transaction.currency?.code ||
//         transaction.currencyCode ||
//         "USD",
//       transactionType:
//         transaction.transactionType || "EXPENSE",
//       transactionDate:
//         transaction.transactionDate ||
//         dayjs().format("YYYY-MM-DD"),
//       note: transaction.note || "",
//       categoryId:
//         transaction.category?.id ||
//         transaction.categoryId ||
//         "",
//     };

//     setFormData(values);
//     try {
//       form.setFieldsValue(values);
//     } catch (e) {}

//     setModalOpen(true);
//   };

//   // ================================
//   // CLOSE MODAL
//   // ================================
//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingTransaction(null);
//     try {
//       form.resetFields();
//     } catch (e) {}
//     setFormData(getInitialForm());
//   };

//   // ================================
//   // FILTER CATEGORIES
//   // ================================
//   const filteredCategories = useMemo(() => {
//     return categories.filter((category) => {
//       if (!category || !category.type) return false;
//       return (
//         String(category.type).toUpperCase() ===
//         String(formData.transactionType).toUpperCase()
//       );
//     });
//   }, [categories, formData.transactionType]);

//   const availableCurrencies = useMemo(() => {
//     const list = [...currencies];
//     REQUIRED_CURRENCIES.forEach((req) => {
//       if (!list.some((c) => c.code === req.code)) {
//         list.push(req);
//       }
//     });
//     return list;
//   }, [currencies]);

//   // ================================
//   // SEARCH & FILTER TRANSACTIONS
//   // ================================
//   const filteredTransactions = useMemo(() => {
//     let result = transactions;

//     // Type filter
//     if (typeFilter !== "ALL") {
//       result = result.filter(
//         (tx) => tx.transactionType === typeFilter
//       );
//     }

//     // Category filter
//     if (categoryFilter !== "ALL") {
//       result = result.filter(
//         (tx) => String(tx.category?.id || tx.categoryId) === String(categoryFilter)
//       );
//     }

//     // Text search
//     const searchValue = search.toLowerCase().trim();
//     if (searchValue) {
//       result = result.filter((transaction) => {
//         const title = String(transaction.title || "").toLowerCase();
//         const type = String(transaction.transactionType || "").toLowerCase();
//         const category = String(transaction.category?.name || "").toLowerCase();
//         const currency = String(
//           transaction.currency?.code || transaction.currencyCode || ""
//         ).toLowerCase();

//         return (
//           title.includes(searchValue) ||
//           type.includes(searchValue) ||
//           category.includes(searchValue) ||
//           currency.includes(searchValue)
//         );
//       });
//     }

//     return result;
//   }, [transactions, search, typeFilter, categoryFilter]);

//   // Summary Metrics
//   const summaryMetrics = useMemo(() => {
//     let income = 0;
//     let expense = 0;

//     transactions.forEach((tx) => {
//       const rawAmount = Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
//       const txCurr = tx.currency?.code || tx.currencyCode || "USD";
//       const converted = convertValue(rawAmount, txCurr);
//       if (tx.transactionType === "INCOME") {
//         income += converted;
//       } else if (tx.transactionType === "EXPENSE") {
//         expense += converted;
//       }
//     });

//     return {
//       income,
//       expense,
//       net: income - expense,
//       count: transactions.length,
//     };
//   }, [transactions, convertValue]);

//   // ================================
//   // SUBMIT
//   // ================================
//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!formData.title.trim()) {
//       message.error("Title is required.");
//       return;
//     }

//     const numericAmount = Number(formData.amount);
//     if (!formData.amount || isNaN(numericAmount) || numericAmount <= 0) {
//       message.error("Please enter a valid amount greater than 0.");
//       return;
//     }

//     if (!formData.currencyCode) {
//       message.error("Please select a currency.");
//       return;
//     }

//     const payload = {
//       title: formData.title.trim(),
//       amount: numericAmount,
//       currencyCode: formData.currencyCode,
//       transactionType: formData.transactionType,
//       transactionDate: formData.transactionDate,
//       note: formData.note ? formData.note.trim() : null,
//       categoryId: formData.categoryId ? Number(formData.categoryId) : null,
//     };

//     try {
//       setSaving(true);

//       if (editingTransaction?.id) {
//         await axios.put(`/api/transactions/${editingTransaction.id}`, payload);
//         message.success("Transaction updated successfully.");
//         setSuccessAlert("Transaction updated successfully.");
//         setTimeout(() => setSuccessAlert(null), 3000);
//       } else {
//         await axios.post("/api/transactions", payload);
//         message.success("Transaction added successfully.");
//         setSuccessAlert("Transaction added successfully.");
//         setTimeout(() => setSuccessAlert(null), 3000);
//       }

//       closeModal();
//       await fetchTransactions();
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       message.error(
//         error?.response?.data?.message ||
//           "Unable to save transaction."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================================
//   // DELETE
//   // ================================
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/transactions/${id}`);
//       message.success("Transaction deleted successfully.");
//       setSuccessAlert("Transaction deleted successfully.");
//       setTimeout(() => setSuccessAlert(null), 3000);
//       await fetchTransactions();
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }
//       message.error("Unable to delete transaction.");
//     }
//   };

//   const inputStyle = {
//     width: "100%",
//     height: "44px",
//     padding: "0 14px",
//     borderRadius: "8px",
//     border: "1px solid #cbd5e1",
//     fontSize: "14px",
//     boxSizing: "border-box",
//     outline: "none",
//     background: "#ffffff",
//     fontFamily: "inherit",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "13px",
//     fontWeight: 600,
//     color: "#334155",
//     marginBottom: "6px",
//   };

//   return (
//     <div>
//       {/* Floating Success Alert */}
//       {successAlert && (
//         <div
//           id="alert"
//           role="status"
//           style={{
//             position: "fixed",
//             top: 24,
//             right: 24,
//             zIndex: 9999,
//             background: "#10b981",
//             color: "#ffffff",
//             padding: "14px 24px",
//             borderRadius: "10px",
//             boxShadow: "0 10px 25px rgba(16, 185, 129, 0.35)",
//             fontWeight: 700,
//             fontSize: "14px",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <CheckCircleFilled style={{ fontSize: 18 }} />
//           <span>{successAlert}</span>
//         </div>
//       )}

//       {/* Top Header */}
//       <div className="page-header">
//         <div>
//           <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
//             Transactions
//           </Title>
//           <Text style={{ color: "#64748b", fontSize: 14 }}>
//             Monitor and manage your multi-currency cash flows
//           </Text>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <Tag
//             color="success"
//             style={{
//               borderRadius: 20,
//               fontWeight: 700,
//               padding: "5px 14px",
//               fontSize: 13,
//               border: "1px solid #10b981",
//               background: "#ecfdf5",
//               color: "#065f46",
//             }}
//           >
//             Display Currency: {activeCurrency} ({symbol})
//           </Tag>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             size="large"
//             onClick={openAddModal}
//             style={{
//               borderRadius: 8,
//               fontWeight: 700,
//               background: "#10b981",
//               borderColor: "#10b981",
//             }}
//           >
//             Add Transaction
//           </Button>
//         </div>
//       </div>

//       {/* Summary KPI Cards */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Entries</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, margin: "6px 0 0 0" }}>
//               {summaryMetrics.count}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Income ({symbol})</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, color: "#10b981", margin: "6px 0 0 0" }}>
//               +{symbol}{summaryMetrics.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Expenses ({symbol})</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, color: "#ef4444", margin: "6px 0 0 0" }}>
//               -{symbol}{summaryMetrics.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Net Cashflow ({symbol})</span>
//             <div
//               className="kpi-card-value"
//               style={{
//                 fontSize: 24,
//                 color: summaryMetrics.net >= 0 ? "#10b981" : "#ef4444",
//                 margin: "6px 0 0 0",
//               }}
//             >
//               {summaryMetrics.net < 0 ? "-" : "+"}{symbol}{Math.abs(summaryMetrics.net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* Main Filter & Table Card */}
//       <Card className="modern-card">
//         {/* Filter Controls Bar */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//             gap: 12,
//             marginBottom: 20,
//           }}
//         >
//           {/* Search Input */}
//           <div style={{ position: "relative" }}>
//             <SearchOutlined
//               style={{
//                 position: "absolute",
//                 left: 12,
//                 top: 14,
//                 color: "#94a3b8",
//                 fontSize: 16,
//                 zIndex: 1,
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search transactions..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 ...inputStyle,
//                 paddingLeft: 38,
//                 height: 42,
//               }}
//             />
//           </div>

//           {/* Type Filter */}
//           <Select
//             value={typeFilter}
//             onChange={(val) => setTypeFilter(val)}
//             style={{ width: "100%", height: 42 }}
//             options={[
//               { value: "ALL", label: "All Types" },
//               { value: "INCOME", label: "Income Only" },
//               { value: "EXPENSE", label: "Expenses Only" },
//             ]}
//           />

//           {/* Category Filter */}
//           <Select
//             value={categoryFilter}
//             onChange={(val) => setCategoryFilter(val)}
//             style={{ width: "100%", height: 42 }}
//             options={[
//               { value: "ALL", label: "All Categories" },
//               ...categories.map((c) => ({
//                 value: String(c.id),
//                 label: c.name,
//               })),
//             ]}
//           />

//           {/* Clear Filters */}
//           {(search || typeFilter !== "ALL" || categoryFilter !== "ALL") && (
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setTypeFilter("ALL");
//                 setCategoryFilter("ALL");
//               }}
//               style={{ height: 42, borderRadius: 8 }}
//             >
//               Reset Filters
//             </Button>
//           )}
//         </div>

//         {/* Transactions Table */}
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "60px 0" }}>
//             <Spin size="large" />
//             <div style={{ marginTop: 12, color: "#64748b" }}>Loading transactions...</div>
//           </div>
//         ) : filteredTransactions.length === 0 ? (
//           <Empty
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//             description={
//               <div>
//                 <Text strong style={{ color: "#334155" }}>No transactions found</Text>
//                 <br />
//                 <Text type="secondary" style={{ fontSize: 13 }}>
//                   Try adjusting your filters or click "+ Add Transaction" to create one.
//                 </Text>
//               </div>
//             }
//           >
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={openAddModal}
//               style={{ background: "#10b981", borderColor: "#10b981" }}
//             >
//               Add Transaction
//             </Button>
//           </Empty>
//         ) : (
//           <div className="custom-table" style={{ overflowX: "auto" }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Title</th>
//                   <th>Category</th>
//                   <th>Original Amount</th>
//                   <th>Converted Amount ({symbol})</th>
//                   <th>Type</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.map((tx) => {
//                   const isExpense = tx.transactionType === "EXPENSE";
//                   const catName = tx.category?.name || "General";
//                   const rawAmount = Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
//                   const txCurr = tx.currency?.code || tx.currencyCode || "USD";
//                   const convertedVal = convertValue(rawAmount, txCurr);

//                   return (
//                     <tr key={tx.id || Math.random()}>
//                       <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
//                         {tx.transactionDate ? dayjs(tx.transactionDate).format("YYYY-MM-DD") : "-"}
//                       </td>
//                       <td style={{ fontWeight: 600, color: "#0f172a" }}>
//                         {tx.title || tx.description || "Mock Transaction"}
//                       </td>
//                       <td>
//                         <span
//                           style={{
//                             display: "inline-block",
//                             padding: "3px 10px",
//                             borderRadius: 20,
//                             fontSize: 12,
//                             fontWeight: 600,
//                             background: isExpense ? "#fef2f2" : "#ecfdf5",
//                             color: isExpense ? "#dc2626" : "#059669",
//                           }}
//                         >
//                           {catName}
//                         </span>
//                       </td>
//                       <td style={{ whiteSpace: "nowrap", fontWeight: 600, color: "#334155" }}>
//                         {txCurr} {Number(rawAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td
//                         style={{
//                           fontWeight: 700,
//                           color: isExpense ? "#dc2626" : "#059669",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {isExpense ? "-" : "+"}
//                         {symbol}
//                         {convertedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td>
//                         <span className={`pill-badge ${isExpense ? "expense" : "income"}`}>
//                           {isExpense ? "Expense" : "Income"}
//                         </span>
//                       </td>
//                       <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
//                         <Space size="small">
//                           <button
//                             type="button"
//                             className="action-btn-circle"
//                             onClick={() => openEditModal(tx)}
//                             title="Edit"
//                           >
//                             <EditOutlined />
//                           </button>
//                           <button
//                             type="button"
//                             className="action-btn-circle danger"
//                             onClick={() => handleDelete(tx.id)}
//                             title="Delete"
//                           >
//                             <DeleteOutlined />
//                           </button>
//                         </Space>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>

//       {/* ====================================================
//           MODAL: ADD / EDIT TRANSACTION (SCREEN 5)
//           ==================================================== */}
//       {modalOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(15, 23, 42, 0.45)",
//             backdropFilter: "blur(6px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             padding: "20px",
//           }}
//           onClick={closeModal}
//         >
//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "16px",
//               boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
//               maxWidth: "520px",
//               width: "100%",
//               overflow: "hidden",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #f1f5f9",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div>
//                 <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
//                   {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
//                 </h2>
//                 <div style={{ fontSize: 13, color: "#64748b" }}>
//                   Enter transaction details for multi-currency tracking
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   cursor: "pointer",
//                   fontSize: 16,
//                   color: "#94a3b8",
//                 }}
//               >
//                 <CloseOutlined />
//               </button>
//             </div>

//             {/* Modal Form */}
//             <Form form={form} component={false}>
//               <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
//               {/* Date & Description Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-date" style={labelStyle}>
//                     Date <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-date"
//                     type="date"
//                     required
//                     value={formData.transactionDate}
//                     onChange={(e) => handleChange("transactionDate", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-title" style={labelStyle}>
//                     Description <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-title"
//                     type="text"
//                     placeholder="e.g., Grocery Shopping, Freelance Payout"
//                     required={true}
//                     value={formData.title}
//                     onChange={(e) => handleChange("title", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>
//               </div>

//               {/* Amount & Currency Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-amount" style={labelStyle}>
//                     Amount ({getCurrencySymbol(formData.currencyCode)}) <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-amount"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     placeholder="0.00"
//                     required
//                     value={formData.amount}
//                     onChange={(e) => handleChange("amount", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-currency" style={labelStyle}>
//                     Currency <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <select
//                     id="transaction-currency"
//                     value={formData.currencyCode}
//                     onChange={(e) => handleChange("currencyCode", e.target.value)}
//                     style={inputStyle}
//                   >
//                     {availableCurrencies.map((c) => {
//                       const nameMap = {
//                         AUD: "Australian Dollar",
//                         CAD: "Canadian Dollar",
//                         EUR: "Euro",
//                         GBP: "British Pound",
//                         INR: "Indian Rupee",
//                         JPY: "Japanese Yen",
//                         USD: "US Dollar",
//                       };
//                       const name = nameMap[c.code] || c.name || "";
//                       return (
//                         <option key={c.code} value={c.code}>
//                           {name} ({c.code})
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//               </div>

//               {/* Type & Category Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-type" style={labelStyle}>
//                     Type <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <select
//                     id="transaction-type"
//                     name="transactionType"
//                     aria-label="Type"
//                     value={formData.transactionType}
//                     onChange={(e) => handleChange("transactionType", e.target.value)}
//                     style={inputStyle}
//                   >
//                     <option value="EXPENSE">Expense</option>
//                     <option value="INCOME">Income</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-category" style={labelStyle}>
//                     Category
//                   </label>
//                   <select
//                     id="transaction-category"
//                     value={formData.categoryId}
//                     onChange={(e) => handleChange("categoryId", e.target.value)}
//                     style={inputStyle}
//                   >
//                     <option value="">Select category...</option>
//                     {filteredCategories.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Notes Field */}
//               <div style={{ marginBottom: 24 }}>
//                 <label htmlFor="transaction-notes" style={labelStyle}>
//                   Notes (Optional)
//                 </label>
//                 <input
//                   id="transaction-notes"
//                   type="text"
//                   placeholder="Add a note..."
//                   value={formData.note}
//                   onChange={(e) => handleChange("note", e.target.value)}
//                   style={inputStyle}
//                 />
//               </div>

//               {/* Modal Action Buttons */}
//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
//                 <Button
//                   size="large"
//                   onClick={closeModal}
//                   style={{ borderRadius: 8, fontWeight: 600 }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   size="large"
//                   loading={saving}
//                   style={{
//                     borderRadius: 8,
//                     fontWeight: 700,
//                     background: "#10b981",
//                     borderColor: "#10b981",
//                     minWidth: 140,
//                   }}
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingTransaction
//                     ? "Update Transaction"
//                     : "Add Transaction"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { Form, Input, Button, Select, Card, Typography, Alert, Switch } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// IMPORTANT:
// If authSlice.js is inside src/redux/, keep this.
// If it is inside src/store/, change to:
// import { register } from "../store/authSlice";
import { register } from "../slices/authSlice";

const { Title, Text } = Typography;


const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // =========================
  // PASSWORD VALIDATION
  // =========================

  const checkPassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (values) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await dispatch(
        register({
          username: values.username.trim(),
          password: values.password,
          preferredCurrency: values.preferredCurrency || "USD",

          role: isAdminRegister
            ? "ROLE_ADMIN"
            : "ROLE_USER",
        })
      ).unwrap();

      console.log("Registration successful:", result);

      setSuccess("Registration successful! Redirecting to login...");

      form.resetFields();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      let message = "Registration failed. Please try again.";

      if (typeof err === "string") {
        message = err;
      } else if (err?.message) {
        message = err.message;
      } else if (err?.error) {
        message = err.error;
      } else if (err?.data?.message) {
        message = err.data.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PASSWORD CRITERIA UI
  // =========================

  const criteriaItem = (valid, text) => (
    <div
      style={{
        fontSize: "13px",
        marginBottom: "4px",
        color: valid ? "#389e0d" : "#8c8c8c",
      }}
    >
      {valid ? "✓" : "○"} {text}
    </div>
  );

  // =========================
  // PAGE
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: "35px",
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: "8px",
              color: "#2f5d50",
            }}
          >
            Create Account
          </Title>

          <Text type="secondary">
            Create your MintMatrix account
          </Text>
        </div>

        {/* =========================
            SUCCESS
        ========================= */}

        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            style={{
              marginBottom: "20px",
            }}
          />
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            style={{
              marginBottom: "20px",
            }}
          />
        )}

        {/* =========================
            ADMIN SWITCH
        ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            marginBottom: "24px",
            background: "#f6ffed",
            border: "1px solid #d9f7be",
            borderRadius: "10px",
          }}
        >
          <div>
            <Text strong>
              Register as Administrator
            </Text>

            <br />

            <Text
              type="secondary"
              style={{ fontSize: "12px" }}
            >
              {isAdminRegister
                ? "Administrator account"
                : "Standard user account"}
            </Text>
          </div>

          <Switch
            checked={isAdminRegister}
            onChange={(checked) => {
              setIsAdminRegister(checked);
            }}
          />
        </div>

        {/* =========================
            FORM
        ========================= */}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          autoComplete="off"
        >
          {/* USERNAME */}

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username",
              },
              {
                min: 3,
                message: "Username must contain at least 3 characters",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username"
              size="large"
            />
          </Form.Item>

          {/* PASSWORD */}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                min: 8,
                message: "Password must contain at least 8 characters",
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const valid =
                    value.length >= 8 &&
                    /[A-Z]/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[^A-Za-z0-9]/.test(value);

                  if (!valid) {
                    return Promise.reject(
                      new Error(
                        "Password does not meet all requirements"
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
              onChange={(e) => checkPassword(e.target.value)}
            />
          </Form.Item>

          {/* PASSWORD REQUIREMENTS */}

          <div
            style={{
              marginTop: "-12px",
              marginBottom: "20px",
              padding: "12px 14px",
              background: "#fafafa",
              borderRadius: "8px",
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: "8px",
              }}
            >
              Password requirements
            </Text>

            {criteriaItem(
              passwordCriteria.length,
              "At least 8 characters"
            )}

            {criteriaItem(
              passwordCriteria.uppercase,
              "One uppercase letter"
            )}

            {criteriaItem(
              passwordCriteria.lowercase,
              "One lowercase letter"
            )}

            {criteriaItem(
              passwordCriteria.number,
              "One number"
            )}

            {criteriaItem(
              passwordCriteria.special,
              "One special character"
            )}
          </div>

          {/* PREFERRED CURRENCY */}

          <Form.Item
            label="Preferred Currency"
            name="preferredCurrency"
            initialValue="USD"
            rules={[
              {
                required: true,
                message: "Please select your preferred currency",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select currency"
              options={[
                {
                  value: "USD",
                  label: "USD - US Dollar ($)",
                },
                {
                  value: "EUR",
                  label: "EUR - Euro (€)",
                },
                {
                  value: "GBP",
                  label: "GBP - British Pound (£)",
                },
                {
                  value: "INR",
                  label: "INR - Indian Rupee (₹)",
                },
                {
                  value: "JPY",
                  label: "JPY - Japanese Yen (¥)",
                },
                {
                  value: "CAD",
                  label: "CAD - Canadian Dollar",
                },
                {
                  value: "AUD",
                  label: "AUD - Australian Dollar",
                },
              ]}
            />
          </Form.Item>

          {/* ROLE DISPLAY */}

          <div
            style={{
              padding: "12px 14px",
              marginBottom: "22px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Text type="secondary">
              Account type:{" "}
            </Text>

            <Text strong>
              {isAdminRegister
                ? "Administrator"
                : "Standard User"}
            </Text>
          </div>

          {/* REGISTER BUTTON */}

          <Form.Item style={{ marginBottom: "15px" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: "48px",
                borderRadius: "8px",
                background: "#2f5d50",
                borderColor: "#2f5d50",
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </Form.Item>

          {/* LOGIN */}

          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text type="secondary">
              Already have an account?{" "}
            </Text>

            <Button
              type="link"
              onClick={() => navigate("/login")}
              style={{
                padding: 0,
              }}
            >
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;