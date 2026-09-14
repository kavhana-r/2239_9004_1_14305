// // import React, { useEffect, useState } from "react";
// // import {
// //   Card,
// //   Col,
// //   Row,
// //   Statistic,
// //   Spin,
// //   Typography,
// //   Alert,
// // } from "antd";

// // import {
// //   WalletOutlined,
// //   ArrowUpOutlined,
// //   ArrowDownOutlined,
// // } from "@ant-design/icons";

// // import axios from "axios";

// // const { Title, Text } = Typography;

// // function Dashboard() {
// //   const [summary, setSummary] = useState({
// //     totalBalance: 0,
// //     totalIncome: 0,
// //     totalExpense: 0,
// //     currency: "USD",
// //   });

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     fetchSummary();
// //   }, []);

// //   const fetchSummary = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const response = await axios.get(
// //         "/api/dashboard/summary"
// //       );

// //       const data = response?.data || {};

// //       setSummary({
// //         totalBalance: Number(data.totalBalance || 0),
// //         totalIncome: Number(data.totalIncome || 0),
// //         totalExpense: Number(data.totalExpense || 0),
// //         currency: data.currency || "USD",
// //       });
// //     } catch (err) {
// //       setError(
// //         err?.response?.data?.message ||
// //           "Unable to load financial summary."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getCurrencySymbol = (currency) => {
// //     switch (currency) {
// //       case "INR":
// //         return "₹";

// //       case "EUR":
// //         return "€";

// //       case "GBP":
// //         return "£";

// //       case "USD":
// //       default:
// //         return "$";
// //     }
// //   };

// //   const symbol = getCurrencySymbol(summary.currency);

// //   if (loading) {
// //     return (
// //       <div
// //         style={{
// //           minHeight: 400,
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Spin size="large" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       {/* Page Heading */}
// //       <div style={{ marginBottom: 24 }}>
// //         <Title level={2}>Financial Overview</Title>

// //         <Text type="secondary">
// //           Track your financial performance at a glance.
// //         </Text>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <Alert
// //           message={error}
// //           type="warning"
// //           showIcon
// //           closable
// //           style={{ marginBottom: 20 }}
// //         />
// //       )}

// //       {/* Statistics */}
// //       <Row gutter={[20, 20]}>
// //         {/* Total Balance */}
// //         <Col xs={24} md={8}>
// //           <Card>
// //             <Statistic
// //               title="Total Balance"
// //               value={summary.totalBalance}
// //               precision={2}
// //               prefix={symbol}
// //               valueStyle={{
// //                 fontWeight: 700,
// //               }}
// //             />

// //             <WalletOutlined
// //               style={{
// //                 fontSize: 22,
// //                 marginTop: 10,
// //               }}
// //             />
// //           </Card>
// //         </Col>

// //         {/* Monthly Income */}
// //         <Col xs={24} md={8}>
// //           <Card>
// //             <Statistic
// //               title="Monthly Income"
// //               value={summary.totalIncome}
// //               precision={2}
// //               prefix={symbol}
// //               valueStyle={{
// //                 fontWeight: 700,
// //               }}
// //             />

// //             <ArrowUpOutlined
// //               style={{
// //                 fontSize: 22,
// //                 marginTop: 10,
// //               }}
// //             />
// //           </Card>
// //         </Col>

// //         {/* Monthly Expenses */}
// //         <Col xs={24} md={8}>
// //           <Card>
// //             <Statistic
// //               title="Monthly Expenses"
// //               value={summary.totalExpense}
// //               precision={2}
// //               prefix={symbol}
// //               valueStyle={{
// //                 fontWeight: 700,
// //               }}
// //             />

// //             <ArrowDownOutlined
// //               style={{
// //                 fontSize: 22,
// //                 marginTop: 10,
// //               }}
// //             />
// //           </Card>
// //         </Col>
// //       </Row>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   Button,
//   Card,
//   Col,
//   InputNumber,
//   Modal,
//   Progress,
//   Row,
//   Select,
//   Typography,
//   message,
//   Tag,
//   Space,
//   Spin,
//   Popconfirm,
//   Empty,
// } from "antd";
// import {
//   PlusOutlined,
//   WalletOutlined,
//   CheckCircleOutlined,
//   ExclamationCircleOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const { Title, Text } = Typography;

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const CATEGORY_ICONS = {
//   Food: "🍔",
//   Groceries: "🛒",
//   Transport: "🚗",
//   Shopping: "🛍️",
//   Bills: "⚡",
//   Utilities: "💡",
//   Entertainment: "🎬",
//   Housing: "🏠",
//   Health: "💊",
//   Travel: "✈️",
//   Salary: "💼",
//   Freelance: "💻",
//   Investment: "📈",
//   Others: "📦",
// };

// const DEFAULT_CATEGORIES = [
//   { id: "c1", name: "Food", icon: "🍔" },
//   { id: "c2", name: "Groceries", icon: "🛒" },
//   { id: "c3", name: "Transport", icon: "🚗" },
//   { id: "c4", name: "Shopping", icon: "🛍️" },
//   { id: "c5", name: "Bills", icon: "⚡" },
//   { id: "c6", name: "Utilities", icon: "💡" },
//   { id: "c7", name: "Entertainment", icon: "🎬" },
//   { id: "c8", name: "Housing", icon: "🏠" },
//   { id: "c9", name: "Health", icon: "💊" },
//   { id: "c10", name: "Travel", icon: "✈️" },
//   { id: "c11", name: "Others", icon: "📦" },
// ];

// const DEFAULT_BUDGET_ITEMS = [
//   { id: "b1", name: "Food", icon: "🍔", limit: 800, spent: 620, remaining: 180, pct: 78 },
//   { id: "b2", name: "Transport", icon: "🚗", limit: 400, spent: 310.25, remaining: 89.75, pct: 78 },
//   { id: "b3", name: "Shopping", icon: "🛍️", limit: 500, spent: 420, remaining: 80, pct: 84 },
//   { id: "b4", name: "Bills", icon: "⚡", limit: 600, spent: 480, remaining: 120, pct: 80 },
//   { id: "b5", name: "Others", icon: "📦", limit: 200, spent: 109, remaining: 91, pct: 55 },
// ];

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

// function BudgetsPage() {
//   const authUser = useSelector((state) => state?.auth?.user);

//   const [currency, setCurrency] = useState(() => {
//     return localStorage.getItem("preferredCurrency") || authUser?.preferredCurrency || "USD";
//   });

//   const [budgets, setBudgets] = useState([]);
//   const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
//   const [loading, setLoading] = useState(false);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editingBudget, setEditingBudget] = useState(null);

//   const currentMonthName = months[new Date().getMonth()];

//   const [formData, setFormData] = useState({
//     categoryName: "Food",
//     categoryId: null,
//     month: currentMonthName,
//     year: new Date().getFullYear(),
//     limitAmount: null,
//   });

//   useEffect(() => {
//     const handleCurrencyChange = (e) => {
//       const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
//       setCurrency(newCurr);
//     };

//     window.addEventListener("currencyChange", handleCurrencyChange);
//     return () => {
//       window.removeEventListener("currencyChange", handleCurrencyChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (!localStorage.getItem("preferredCurrency")) {
//       const userCurrency = authUser?.preferredCurrency || authUser?.user?.preferredCurrency;
//       if (userCurrency) {
//         setCurrency(userCurrency);
//       }
//     }
//   }, [authUser]);

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const fetchBudgets = async () => {
//     try {
//       setLoading(true);
//       const [budgetRes, catRes, summaryRes, txRes] = await Promise.allSettled([
//         axios.get("/api/budgets"),
//         axios.get("/api/categories"),
//         axios.get("/api/dashboard/summary"),
//         axios.get("/api/transactions"),
//       ]);

//       let txList = [];
//       if (txRes.status === "fulfilled") {
//         const txData = txRes.value?.data;
//         txList = Array.isArray(txData)
//           ? txData
//           : Array.isArray(txData?.content)
//           ? txData.content
//           : [];
//       }

//       if (catRes.status === "fulfilled") {
//         const catData = catRes.value?.data;
//         const catList = Array.isArray(catData)
//           ? catData
//           : Array.isArray(catData?.content)
//           ? catData.content
//           : [];
//         if (catList.length > 0) {
//           setCategories(catList);
//         }
//       }

//       if (budgetRes.status === "fulfilled") {
//         const data = budgetRes.value?.data;
//         const list = Array.isArray(data)
//           ? data
//           : Array.isArray(data?.content)
//             ? data.content
//             : [];
        
//         const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
//         const filteredList = list.filter((b) => !deletedIds.includes(String(b.id)));
        
//         const calculatedList = filteredList.map((b) => {
//           const bMonth = typeof b.month === "number" ? b.month : months.indexOf(b.month) + 1;
//           const bYear = Number(b.year) || new Date().getFullYear();
//           const bCatId = b.category?.id;
//           const bCatName = b.category?.name || b.name;

//           let txSpent = 0;
//           txList.forEach((tx) => {
//             const isExpense = tx.transactionType === "EXPENSE" || tx.type === "EXPENSE";
//             if (!isExpense) return;

//             const txDate = tx.transactionDate ? new Date(tx.transactionDate) : null;
//             if (txDate && !isNaN(txDate.getTime())) {
//               const txMonth = txDate.getMonth() + 1;
//               const txYear = txDate.getFullYear();
//               if (txMonth !== bMonth || txYear !== bYear) return;
//             }

//             const txCatId = tx.category?.id;
//             const txCatName = tx.category?.name;
//             const catMatches =
//               (bCatId && txCatId && Number(bCatId) === Number(txCatId)) ||
//               (bCatName && txCatName && String(bCatName).toLowerCase() === String(txCatName).toLowerCase());

//             if (catMatches || !bCatId) {
//               txSpent += Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
//             }
//           });

//           return {
//             ...b,
//             spentAmount: txSpent > 0 ? txSpent : (b.spentAmount != null ? Number(b.spentAmount) : 0),
//           };
//         });

//         setBudgets(calculatedList);

//         const foundCurrency = list.find((b) => b?.user?.preferredCurrency)?.user?.preferredCurrency;
//         if (foundCurrency) {
//           setCurrency(foundCurrency);
//         }
//       } else {
//         setBudgets([]);
//       }

//       if (summaryRes.status === "fulfilled" && summaryRes.value?.data?.currency) {
//         setCurrency(summaryRes.value.data.currency);
//       }
//     } catch (error) {
//       setBudgets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openAdd = () => {
//     setEditingBudget(null);
//     const firstCat = categories.length > 0 ? categories[0] : DEFAULT_CATEGORIES[0];
//     setFormData({
//       categoryName: firstCat.name,
//       categoryId: firstCat.id,
//       month: currentMonthName,
//       year: new Date().getFullYear(),
//       limitAmount: null,
//     });
//     setModalOpen(true);
//   };

//   const openEdit = (budget) => {
//     setEditingBudget(budget);
//     const monthNum = typeof budget.month === "number" ? budget.month : months.indexOf(budget.month) + 1;
//     const monthName = months[monthNum - 1] || budget.month || currentMonthName;
//     const catName = budget.category?.name || budget.name || "Food";
//     const catObj = categories.find((c) => c.name === catName);

//     setFormData({
//       categoryName: catName,
//       categoryId: catObj?.id || budget.category?.id || null,
//       month: monthName,
//       year: budget.year || new Date().getFullYear(),
//       limitAmount: getLimit(budget),
//     });
//     setModalOpen(true);
//   };

//   const handleDelete = async (budget) => {
//     try {
//       if (budget.id && typeof budget.id === "number") {
//         try {
//           await axios.delete(`/api/budgets/${budget.id}`);
//         } catch (apiErr) {
//           console.warn("Backend DELETE API warning:", apiErr);
//         }
//       }

//       // Track deleted budget locally so it persists
//       const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
//       if (budget.id) deletedIds.push(String(budget.id));
//       if (budget.name) deletedIds.push(String(budget.name));
//       localStorage.setItem("deleted_budget_ids", JSON.stringify(deletedIds));

//       setBudgets((prev) => prev.filter((b) => b.id !== budget.id && b.name !== budget.name));
//       message.success("Budget deleted successfully");
//     } catch (error) {
//       message.error("Unable to delete budget.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.month) {
//       message.error("Month is required");
//       return;
//     }

//     if (!formData.year) {
//       message.error("Year is required");
//       return;
//     }

//     if (
//       formData.limitAmount === null ||
//       Number(formData.limitAmount) < 1
//     ) {
//       message.error("Limit amount must be at least 1");
//       return;
//     }

//     try {
//       setSaving(true);

//       const monthIdx = months.indexOf(formData.month);
//       const monthVal = monthIdx !== -1 ? monthIdx + 1 : Number(formData.month) || 1;

//       const payload = {
//         month: monthVal,
//         year: Number(formData.year),
//         limitAmount: Number(formData.limitAmount),
//       };

//       if (formData.categoryId && typeof formData.categoryId === "number") {
//         payload.category = { id: formData.categoryId, name: formData.categoryName };
//       }

//       if (editingBudget && editingBudget.id && typeof editingBudget.id === "number") {
//         try {
//           await axios.put(`/api/budgets/${editingBudget.id}`, payload);
//         } catch (err) {
//           // Fallback to POST /api/budgets which creates or updates by month & year
//           await axios.post("/api/budgets", payload);
//         }
//         message.success("Budget set successfully.");
//       } else {
//         await axios.post("/api/budgets", payload);
//         message.success("Budget set successfully.");
//       }

//       // Save category association in local storage
//       try {
//         const catMap = JSON.parse(localStorage.getItem("budget_category_map") || "{}");
//         const key = `${monthVal}_${formData.year}`;
//         catMap[key] = {
//           name: formData.categoryName,
//           icon: CATEGORY_ICONS[formData.categoryName] || "🏷️",
//         };
//         localStorage.setItem("budget_category_map", JSON.stringify(catMap));
//       } catch (e) {}

//       setModalOpen(false);
//       await fetchBudgets();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message || "Unable to save budget."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getSpent = (budget) =>
//     Number(
//       budget?.spentAmount ??
//       budget?.spent ??
//       budget?.totalSpent ??
//       0
//     );

//   const getLimit = (budget) =>
//     Number(
//       budget?.limitAmount ??
//       budget?.amount ??
//       budget?.limit ??
//       0
//     );

//   const getPercent = (budget) => {
//     const limit = getLimit(budget);
//     if (limit <= 0) return 0;
//     return Math.round((getSpent(budget) / limit) * 100);
//   };

//   const formatMonthTitle = (month, year) => {
//     if (typeof month === "number") {
//       const name = months[month - 1] || month;
//       return `${name} ${year || ""}`;
//     }
//     return `${month || ""} ${year || ""}`;
//   };

//   const symbol = getCurrencySymbol(currency);

//   const displayItems = useMemo(() => {
//     const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
//     if (budgets.length > 0) {
//       return budgets.filter((b) => !deletedIds.includes(String(b.id)));
//     }
//     return DEFAULT_BUDGET_ITEMS.filter(
//       (b) => !deletedIds.includes(String(b.id)) && !deletedIds.includes(String(b.name))
//     );
//   }, [budgets]);

//   // Overall totals calculation
//   const overallTotals = useMemo(() => {
//     let totalLimit = 0;
//     let totalSpent = 0;

//     displayItems.forEach((b) => {
//       totalLimit += getLimit(b);
//       totalSpent += getSpent(b);
//     });

//     const displayRemaining = Math.max(0, totalLimit - totalSpent);
//     const overallPct = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;

//     return {
//       limit: totalLimit,
//       spent: totalSpent,
//       remaining: displayRemaining,
//       pct: overallPct,
//       hasRealData: totalLimit > 0,
//     };
//   }, [displayItems]);

//   return (
//     <div>
//       {/* Top Page Header */}
//       <div className="page-header">
//         <div>
//           <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
//             Budgets
//           </Title>
//           <Text style={{ color: "#64748b", fontSize: 14 }}>
//             Set monthly spending limits and monitor budget utilization
//           </Text>
//         </div>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           size="large"
//           onClick={openAdd}
//           style={{
//             borderRadius: 8,
//             fontWeight: 700,
//             background: "#10b981",
//             borderColor: "#10b981",
//           }}
//         >
//           Create Budget
//         </Button>
//       </div>

//       {/* 4 Summary Metric Cards (Screen 6) */}
//       <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
//         {/* Total Budget */}
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "18px 22px" }}>
//             <div className="kpi-card-header">
//               <span className="kpi-card-label">Total Budget</span>
//               <div className="kpi-card-icon budget">
//                 <WalletOutlined />
//               </div>
//             </div>
//             <div className="kpi-card-value">
//               {symbol}
//               {overallTotals.limit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         {/* Spent */}
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "18px 22px" }}>
//             <div className="kpi-card-header">
//               <span className="kpi-card-label">Spent</span>
//               <div className="kpi-card-icon expense">
//                 <ExclamationCircleOutlined />
//               </div>
//             </div>
//             <div className="kpi-card-value" style={{ color: "#ef4444" }}>
//               {symbol}
//               {overallTotals.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         {/* Remaining */}
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "18px 22px" }}>
//             <div className="kpi-card-header">
//               <span className="kpi-card-label">Remaining</span>
//               <div className="kpi-card-icon balance">
//                 <CheckCircleOutlined />
//               </div>
//             </div>
//             <div className="kpi-card-value" style={{ color: "#10b981" }}>
//               {symbol}
//               {overallTotals.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         {/* Overall Progress */}
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div>
//               <span className="kpi-card-label">Overall Progress</span>
//               <div className="kpi-card-value" style={{ margin: "4px 0 0 0" }}>
//                 {overallTotals.pct}%
//               </div>
//               <span style={{ fontSize: 12, color: "#64748b" }}>of total cap</span>
//             </div>
//             <Progress
//               type="circle"
//               percent={overallTotals.pct}
//               width={56}
//               strokeColor="#10b981"
//               strokeWidth={10}
//               format={() => `${overallTotals.pct}%`}
//             />
//           </div>
//         </Col>
//       </Row>

//       {/* Budget List Card */}
//       <Card className="modern-card">
//         <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div>
//             <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
//               Active Category Budgets
//             </h3>
//             <span style={{ fontSize: 13, color: "#64748b" }}>
//               Real-time expenditure progress bars
//             </span>
//           </div>
//           <Tag color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
//             {currentMonthName} {new Date().getFullYear()}
//           </Tag>
//         </div>

//         {loading ? (
//           <div style={{ textAlign: "center", padding: 40 }}>
//             <Spin size="large" />
//           </div>
//         ) : displayItems.length === 0 ? (
//           <div style={{ padding: "40px 0", textAlign: "center" }}>
//             <Empty description="No budgets found. Create one to monitor your spending limits!" />
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={openAdd}
//               style={{ marginTop: 16, borderRadius: 8, background: "#10b981", borderColor: "#10b981" }}
//             >
//               Add Budget
//             </Button>
//           </div>
//         ) : (
//           <div className="custom-table" style={{ overflowX: "auto" }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Category</th>
//                   <th>Budgeted</th>
//                   <th>Spent</th>
//                   <th>Remaining</th>
//                   <th style={{ minWidth: 160 }}>Progress</th>
//                   <th style={{ textAlign: "center", width: 120 }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayItems.map((b, idx) => {
//                   let name = b.category?.name || b.name;
//                   if (!name && b.month) {
//                     try {
//                       const catMap = JSON.parse(localStorage.getItem("budget_category_map") || "{}");
//                       const monthVal = typeof b.month === "number" ? b.month : months.indexOf(b.month) + 1;
//                       const saved = catMap[`${monthVal}_${b.year}`];
//                       if (saved?.name) name = saved.name;
//                     } catch (e) {}
//                   }
//                   if (!name) name = formatMonthTitle(b.month, b.year);

//                   const icon = b.icon || CATEGORY_ICONS[name] || "🏷️";
//                   const limitVal = b.limit || getLimit(b);
//                   const spentVal = b.spent || getSpent(b);
//                   const remainingVal = b.remaining !== undefined ? b.remaining : Math.max(0, limitVal - spentVal);
//                   const pct = b.pct !== undefined ? b.pct : getPercent(b);
//                   const isOver = pct >= 100;

//                   return (
//                     <tr key={b.id || idx}>
//                       <td style={{ fontWeight: 600, color: "#0f172a" }}>
//                         <Space size="middle">
//                           <span style={{ fontSize: 20 }}>{icon}</span>
//                           <span>{name}</span>
//                         </Space>
//                       </td>
//                       <td style={{ fontWeight: 600, color: "#334155" }}>
//                         {symbol}{limitVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td style={{ fontWeight: 700, color: isOver ? "#ef4444" : "#0f172a" }}>
//                         {symbol}{spentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td style={{ fontWeight: 600, color: isOver ? "#ef4444" : "#10b981" }}>
//                         {symbol}{remainingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td>
//                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                           <Progress
//                             percent={Math.min(100, pct)}
//                             strokeColor={isOver ? "#ef4444" : "#10b981"}
//                             trailColor="#f1f5f9"
//                             showInfo={false}
//                             style={{ flex: 1, margin: 0 }}
//                           />
//                           <span
//                             style={{
//                               fontWeight: 700,
//                               fontSize: 13,
//                               color: isOver ? "#ef4444" : "#0f172a",
//                               minWidth: 40,
//                               textAlign: "right",
//                             }}
//                           >
//                             {pct}%
//                           </span>
//                         </div>
//                       </td>
//                       <td style={{ textAlign: "center" }}>
//                         <Space size="small">
//                           <button
//                             type="button"
//                             className="action-btn-circle"
//                             onClick={() => openEdit(b)}
//                             title="Edit Budget"
//                           >
//                             <EditOutlined />
//                           </button>
//                           <Popconfirm
//                             title="Delete budget"
//                             description="Are you sure you want to delete this budget?"
//                             onConfirm={() => handleDelete(b)}
//                             okText="Delete"
//                             cancelText="Cancel"
//                             okButtonProps={{ danger: true }}
//                           >
//                             <button
//                               type="button"
//                               className="action-btn-circle danger"
//                               title="Delete Budget"
//                             >
//                               <DeleteOutlined />
//                             </button>
//                           </Popconfirm>
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

//       {/* Add / Edit Budget Modal */}
//       <Modal
//         title={
//           <div>
//             <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
//               {editingBudget ? "Edit Budget" : "Create Monthly Budget"}
//             </h3>
//             <span style={{ fontSize: 13, color: "#64748b" }}>
//               Set spending limits to keep expenditures in check
//             </span>
//           </div>
//         }
//         open={modalOpen}
//         onCancel={() => setModalOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <div style={{ padding: "16px 0" }}>
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
//               Category <span style={{ color: "#ef4444" }}>*</span>
//             </label>
//             <Select
//               size="large"
//               style={{ width: "100%", height: 42 }}
//               value={formData.categoryName}
//               onChange={(name) => {
//                 const found = categories.find((c) => c.name === name);
//                 setFormData((p) => ({
//                   ...p,
//                   categoryName: name,
//                   categoryId: found?.id || null,
//                 }));
//               }}
//               options={categories.map((c) => ({
//                 value: c.name,
//                 label: `${c.icon || CATEGORY_ICONS[c.name] || "🏷️"} ${c.name}`,
//               }))}
//             />
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 16 }}>
//             <div>
//               <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
//                 Month <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <Select
//                 size="large"
//                 style={{ width: "100%", height: 42 }}
//                 value={formData.month}
//                 onChange={(value) => setFormData((p) => ({ ...p, month: value }))}
//                 options={months.map((m) => ({ value: m, label: m }))}
//               />
//             </div>

//             <div>
//               <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
//                 Year <span style={{ color: "#ef4444" }}>*</span>
//               </label>
//               <InputNumber
//                 size="large"
//                 style={{ width: "100%", height: 42 }}
//                 min={2020}
//                 max={2035}
//                 value={formData.year}
//                 onChange={(val) => setFormData((p) => ({ ...p, year: val }))}
//               />
//             </div>
//           </div>

//           <div style={{ marginBottom: 24 }}>
//             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
//               Budget Limit Amount ({symbol}) <span style={{ color: "#ef4444" }}>*</span>
//             </label>
//             <InputNumber
//               size="large"
//               style={{ width: "100%", height: 42 }}
//               min={1}
//               step={50}
//               placeholder="e.g., 2500"
//               value={formData.limitAmount}
//               onChange={(val) => setFormData((p) => ({ ...p, limitAmount: val }))}
//             />
//           </div>

//           <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
//             <Button size="large" onClick={() => setModalOpen(false)} style={{ borderRadius: 8 }}>
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               size="large"
//               loading={saving}
//               onClick={handleSubmit}
//               style={{
//                 borderRadius: 8,
//                 fontWeight: 700,
//                 background: "#10b981",
//                 borderColor: "#10b981",
//                 minWidth: 120,
//               }}
//             >
//               {editingBudget ? "Update Budget" : "Save Budget"}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default BudgetsPage;
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  Typography,
  Alert,
  Button,
  Tag,
  Space,
  Empty,
  Table,
  Progress,
} from "antd";
import {
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  AimOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const { Title, Text } = Typography;

const CATEGORY_COLORS = [
  "#10b981", // Mint green
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#64748b", // Slate
];

const DEFAULT_EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50,
  JPY: 155.0,
  CAD: 1.36,
  AUD: 1.52,
};

const DEFAULT_BUDGET_PREVIEW = [
  { id: "dp1", name: "Food & Dining", limitAmount: 800, spentAmount: 450 },
  { id: "dp2", name: "Transport", limitAmount: 400, spentAmount: 280 },
  { id: "dp3", name: "Shopping", limitAmount: 500, spentAmount: 390 },
  { id: "dp4", name: "Utilities", limitAmount: 350, spentAmount: 180 },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const username = user?.username || user?.user?.username || "Friend";

  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currency: "USD",
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetsCount, setBudgetsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();

    const handleCurrencyChange = (e) => {
      const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
      setActiveCurrency(newCurr);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryRes, transactionsRes, budgetsRes, currenciesRes] = await Promise.allSettled([
        axios.get("/api/dashboard/stats").catch(() => axios.get("/api/dashboard/summary")),
        axios.get("/api/transactions"),
        axios.get("/api/budgets"),
        axios.get("/api/currencies"),
      ]);

      if (currenciesRes.status === "fulfilled" && Array.isArray(currenciesRes.value?.data)) {
        const ratesMap = { ...DEFAULT_EXCHANGE_RATES };
        currenciesRes.value.data.forEach((c) => {
          if (c.code && c.exchangeRate) {
            ratesMap[c.code] = Number(c.exchangeRate);
          }
        });
        setExchangeRates(ratesMap);
      }

      if (summaryRes.status === "fulfilled") {
        const data = summaryRes.value?.data || {};
        const backendCurr = data.currency || "USD";
        setSummary({
          totalBalance: Number(data.totalBalance || 0),
          totalIncome: Number(data.totalIncome || 0),
          totalExpense: Number(data.totalExpense || 0),
          currency: backendCurr,
        });
        if (!localStorage.getItem("preferredCurrency")) {
          setActiveCurrency(backendCurr);
        }
      } else {
        setError(
          summaryRes.reason?.response?.data?.message ||
          "Unable to load financial summary."
        );
      }

      if (transactionsRes.status === "fulfilled") {
        const txData = transactionsRes.value?.data;
        const txList = Array.isArray(txData)
          ? txData
          : Array.isArray(txData?.content)
            ? txData.content
            : [];
        setRecentTransactions(txList);
      }

      if (budgetsRes.status === "fulfilled") {
        const bData = budgetsRes.value?.data;
        const bList = Array.isArray(bData)
          ? bData
          : Array.isArray(bData?.content)
            ? bData.content
            : [];
        setBudgets(bList);
        setBudgetsCount(bList.length);
      }
    } catch (err) {
      setError("An unexpected error occurred while loading your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const convertValue = (amount, fromCurr = summary.currency) => {
    const num = Number(amount || 0);
    if (!num) return 0;
    const from = fromCurr || "USD";
    const to = activeCurrency || "USD";
    if (from === to) return num;
    const fromRate = exchangeRates[from] || DEFAULT_EXCHANGE_RATES[from] || 1.0;
    const toRate = exchangeRates[to] || DEFAULT_EXCHANGE_RATES[to] || (to === "INR" ? 83.50 : 1.0);
    return (num / fromRate) * toRate;
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "INR":
        return "₹";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "AUD":
        return "A$";
      case "CAD":
        return "C$";
      case "USD":
      default:
        return "$";
    }
  };

  const symbol = getCurrencySymbol(activeCurrency);

  const displayBalance = convertValue(summary.totalBalance);
  const displayIncome = convertValue(summary.totalIncome);
  const displayExpense = convertValue(summary.totalExpense);

  // Group expenses by category from recent transactions
  const categorySpending = recentTransactions
    .filter((t) => t.transactionType === "EXPENSE" || t.type === "EXPENSE")
    .reduce((acc, t) => {
      const catName = t.category?.name || "General";
      const txCurr = t.currency?.code || t.currencyCode || summary.currency || "USD";
      const amount = Number(t.amount != null ? t.amount : (t.convertedAmount || 0));
      const converted = convertValue(amount, txCurr);
      acc[catName] = (acc[catName] || 0) + converted;
      return acc;
    }, {});

  const categoryNames = Object.keys(categorySpending);
  const categoryValues = Object.values(categorySpending);
  const hasExpenses = categoryNames.length > 0;

  // Donut chart data
  const previewUSD = [400, 250, 150, 100, 90];
  const donutLabels = hasExpenses ? categoryNames : ["Housing", "Food", "Transport", "Bills", "Shopping"];
  const donutValues = hasExpenses
    ? categoryValues
    : previewUSD.map((v) => Math.round(convertValue(v, "USD")));
  const totalDonutExpense = donutValues.reduce((a, b) => a + b, 0) || 1;
  const donutColors = CATEGORY_COLORS.slice(0, donutLabels.length);

  const doughnutData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutValues,
        backgroundColor: donutColors,
        hoverBackgroundColor: donutColors.map((c) => c),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Spending Overview line chart data
  const last6Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const lineData = {
    labels: last6Months,
    datasets: [
      {
        label: "Income",
        data: [
          Math.round(displayIncome * 0.7),
          Math.round(displayIncome * 0.8),
          Math.round(displayIncome * 0.75),
          Math.round(displayIncome * 0.9),
          Math.round(displayIncome * 0.85),
          Math.round(displayIncome * 0.95),
          Math.round(displayIncome * 0.9),
          Math.round(displayIncome),
        ],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Expenses",
        data: [
          Math.round(displayExpense * 0.6),
          Math.round(displayExpense * 0.75),
          Math.round(displayExpense * 0.7),
          Math.round(displayExpense * 0.8),
          Math.round(displayExpense * 0.75),
          Math.round(displayExpense * 0.85),
          Math.round(displayExpense * 0.8),
          Math.round(displayExpense),
        ],
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.08)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#06b6d4",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "#071a17",
        titleFont: { family: "'Outfit', sans-serif", size: 13 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (value) => `${symbol}${value}`,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "74%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#071a17",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.label}: ${symbol}${Number(context.raw).toLocaleString()}`,
        },
      },
    },
  };

  const recentColumns = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => (
        <span style={{ color: "#64748b", fontSize: 13 }}>
          {date ? dayjs(date).format("MMM D, YYYY") : "Recent"}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <span style={{ fontWeight: 600, color: "#0f172a" }}>
          {title || record.description || "Transaction"}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag
          style={{
            borderRadius: 20,
            padding: "2px 10px",
            fontWeight: 600,
            fontSize: 11,
            background: "#f1f5f9",
            color: "#475569",
            border: "none",
          }}
        >
          {category?.name || "General"}
        </Tag>
      ),
    },
    {
      title: `Amount (${symbol})`,
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        const isExpense = record.transactionType === "EXPENSE" || record.type === "EXPENSE";
        const txCurr = record.currency?.code || record.currencyCode || summary.currency || "USD";
        const raw = Number(record.amount != null ? record.amount : (record.convertedAmount || 0));
        const val = convertValue(raw, txCurr);
        return (
          <span
            style={{
              fontWeight: 700,
              color: isExpense ? "#ef4444" : "#10b981",
              whiteSpace: "nowrap",
            }}
          >
            {isExpense ? "-" : "+"}
            {symbol}
            {val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      title: "Currency",
      key: "currency",
      render: (_, record) => {
        const txCurr = record.currency?.code || record.currencyCode || summary.currency || "USD";
        return (
          <div style={{ whiteSpace: "nowrap" }}>
            <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 12 }}>
              {activeCurrency}
            </Tag>
            {txCurr !== activeCurrency && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Orig: {txCurr}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => {
        const isExpense = type === "EXPENSE";
        return (
          <span className={`pill-badge ${isExpense ? "expense" : "income"}`}>
            {isExpense ? "Expense" : "Income"}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Spin size="large" />
        <Text type="secondary" style={{ fontSize: 15, fontWeight: 500 }}>
          Loading MintMatrix financial overview...
        </Text>
      </div>
    );
  }

  return (
    <div>
      {/* Header Greeting Banner */}
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            Welcome, {username}! 👋
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            Here's your financial overview.
          </Text>
        </div>

        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate("/transactions")}
            style={{
              borderRadius: 8,
              fontWeight: 700,
              background: "#10b981",
              borderColor: "#10b981",
            }}
          >
            Add Transaction
          </Button>

          <Button
            size="large"
            icon={<WalletOutlined />}
            onClick={() => navigate("/budgets")}
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Budgets
          </Button>

          <Button
            size="large"
            icon={<AimOutlined />}
            onClick={() => navigate("/goals")}
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Goals
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          message={error}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      {/* 4 Statistics KPI Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Total Balance */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Balance</span>
              <div className="kpi-card-icon balance">
                <WalletOutlined />
              </div>
            </div>
            <div className="kpi-card-value">
              {symbol}
              {displayBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="kpi-trend positive">
              <ArrowUpOutlined /> +12% from last month
            </div>
          </div>
        </Col>

        {/* Total Income */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Income</span>
              <div className="kpi-card-icon income">
                <RiseOutlined />
              </div>
            </div>
            <div className="kpi-card-value">
              {symbol}
              {displayIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="kpi-trend positive">
              <ArrowUpOutlined /> +8% from last month
            </div>
          </div>
        </Col>

        {/* Total Expenses */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Expenses</span>
              <div className="kpi-card-icon expense">
                <FallOutlined />
              </div>
            </div>
            <div className="kpi-card-value">
              {symbol}
              {displayExpense.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="kpi-trend negative">
              <ArrowDownOutlined /> -5% from last month
            </div>
          </div>
        </Col>

        {/* Active Budgets */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card">
            <div className="kpi-card-header">
              <span className="kpi-card-label">Active Budgets</span>
              <div className="kpi-card-icon budget">
                <CheckCircleOutlined />
              </div>
            </div>
            <div className="kpi-card-value">{budgetsCount || 4}</div>
            <div className="kpi-trend positive">
              <CheckCircleOutlined /> 2 on track
            </div>
          </div>
        </Col>
      </Row>

      {/* Analytics Charts Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Spending Overview (Line Chart) */}
        <Col xs={24} lg={16}>
          <Card
            className="modern-card"
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                    Spending Overview
                  </span>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                    Monthly cashflow comparison
                  </div>
                </div>
                <Tag color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
                  Active Currency: {activeCurrency}
                </Tag>
              </div>
            }
          >
            <div style={{ height: 300 }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </Card>
        </Col>

        {/* Expenses by Category (Donut Chart) */}
        <Col xs={24} lg={8}>
          <Card
            className="modern-card"
            title={
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Expenses by Category
                </span>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                  Top spending buckets
                </div>
              </div>
            }
          >
            <div
              className="donut-chart-container"
              style={{
                position: "relative",
                height: 200,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div
                className="donut-center-text"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="donut-center-amount">
                  {symbol}
                  {displayExpense > 0
                    ? Math.round(displayExpense).toLocaleString()
                    : Math.round(totalDonutExpense).toLocaleString()}
                </div>
                <div className="donut-center-sub">Total Expenses</div>
              </div>
            </div>

            {/* Category breakdown legend list */}
            <div className="category-legend-list">
              {donutLabels.slice(0, 5).map((label, idx) => {
                const val = donutValues[idx] || 0;
                const pct = Math.round((val / totalDonutExpense) * 100);
                return (
                  <div key={label} className="category-legend-item">
                    <div className="category-legend-left">
                      <div
                        className="category-legend-dot"
                        style={{ background: donutColors[idx % donutColors.length] }}
                      />
                      <span className="category-legend-name">{label}</span>
                    </div>
                    <div className="category-legend-right">
                      <span className="category-legend-val">
                        {symbol}{val.toLocaleString()}
                      </span>
                      <span className="category-legend-pct">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Budget Utilization Progress Section */}
      <Card
        className="modern-card"
        style={{ marginBottom: 24 }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                Budget Utilization
              </span>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                Monthly category spending limits & active utilization
              </div>
            </div>
            <Button
              type="link"
              onClick={() => navigate("/budgets")}
              style={{ color: "#10b981", fontWeight: 700 }}
            >
              Manage Budgets
            </Button>
          </div>
        }
      >
        <Row gutter={[20, 20]}>
          {(budgets.length > 0 ? budgets : DEFAULT_BUDGET_PREVIEW).slice(0, 4).map((b, idx) => {
            const catName = b.category?.name || b.name || "Category";
            const rawLimit = Number(b.limitAmount || b.limit || b.amount || 500);
            const rawSpent = Number(b.spentAmount || b.spent || 0);
            const limit = convertValue(rawLimit, summary.currency);
            const spent = convertValue(rawSpent, summary.currency);
            const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            const strokeColor = pct > 90 ? "#ef4444" : pct > 75 ? "#f59e0b" : "#10b981";

            return (
              <Col xs={24} sm={12} lg={6} key={b.id || idx}>
                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{catName}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: strokeColor }}>{pct}%</span>
                  </div>
                  <Progress
                    percent={pct}
                    strokeColor={strokeColor}
                    trailColor="#e2e8f0"
                    strokeWidth={8}
                    showInfo={false}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#64748b" }}>
                    <span>Spent: {symbol}{Math.round(spent).toLocaleString()}</span>
                    <span>Cap: {symbol}{Math.round(limit).toLocaleString()}</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Recent Transactions List */}
      <Card
        className="modern-card"
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Recent Transactions
                </span>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                  Your latest financial activity
                </div>
              </div>
              <Tag color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
                {activeCurrency} ({symbol})
              </Tag>
            </div>
            <Button
              type="link"
              onClick={() => navigate("/transactions")}
              style={{ color: "#10b981", fontWeight: 700 }}
            >
              View All
            </Button>
          </div>
        }
      >
        {recentTransactions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text strong style={{ color: "#334155" }}>No transactions yet</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Start adding transactions to see your financial analytics.
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/transactions")}
              style={{ background: "#10b981", borderColor: "#10b981" }}
            >
              Add First Transaction
            </Button>
          </Empty>
        ) : (
          <div className="custom-table">
            <Table
              dataSource={recentTransactions.slice(0, 6)}
              columns={recentColumns}
              rowKey={(record) => record.id || Math.random()}
              pagination={false}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;