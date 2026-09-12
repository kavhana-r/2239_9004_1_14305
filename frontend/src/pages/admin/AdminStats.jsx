// // import React, { useEffect, useState } from "react";
// // import {
// //   Card,
// //   Col,
// //   List,
// //   Row,
// //   Statistic,
// //   Typography,
// //   Alert,
// //   Spin,
// // } from "antd";

// // import {
// //   UserOutlined,
// //   TransactionOutlined,
// //   BarChartOutlined,
// // } from "@ant-design/icons";

// // import axios from "axios";

// // const { Title, Text } = Typography;

// // function AdminStats() {
// //   const [stats, setStats] = useState({
// //     totalUsers: 0,
// //     totalTransactions: 0,
// //   });

// //   const [loading, setLoading] =
// //     useState(true);

// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     fetchStats();
// //   }, []);

// //   const fetchStats = async () => {
// //     try {
// //       setLoading(true);

// //       const response = await axios.get(
// //         "/api/admin/stats"
// //       );

// //       const data = response?.data || {};

// //       setStats({
// //         totalUsers: Number(
// //           data.totalUsers ??
// //             data.totalRegisteredUsers ??
// //             0
// //         ),
// //         totalTransactions: Number(
// //           data.totalTransactions ??
// //             data.totalTransactionsProcessed ??
// //             0
// //         ),
// //       });
// //     } catch (error) {
// //       setError(
// //         error?.response?.data?.message ||
// //           "Unable to load system statistics."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div
// //         style={{
// //           minHeight: 350,
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
// //       <Title level={2}>
// //         System Statistics & Analytics
// //       </Title>

// //       {error && (
// //         <Alert
// //           type="warning"
// //           message={error}
// //           showIcon
// //           style={{ marginBottom: 20 }}
// //         />
// //       )}

// //       <Row gutter={[20, 20]}>
// //         <Col xs={24} md={12}>
// //           <Card>
// //             <Statistic
// //               title="Total Registered Users"
// //               value={stats.totalUsers}
// //               prefix={<UserOutlined />}
// //             />
// //           </Card>
// //         </Col>

// //         <Col xs={24} md={12}>
// //           <Card>
// //             <Statistic
// //               title="Total Transactions Processed"
// //               value={stats.totalTransactions}
// //               prefix={<TransactionOutlined />}
// //             />
// //           </Card>
// //         </Col>
// //       </Row>

// //       <Card
// //         title={
// //           <span>
// //             <BarChartOutlined /> System Reports
// //           </span>
// //         }
// //         style={{ marginTop: 24 }}
// //       >
// //         <List
// //           dataSource={[
// //             "User Growth Report",
// //             "Transaction Volume Report",
// //             "Currency Usage Analytics",
// //           ]}
// //           renderItem={(item) => (
// //             <List.Item>
// //               <Text>{item}</Text>
// //             </List.Item>
// //           )}
// //         />
// //       </Card>
// //     </div>
// //   );
// // }

// // export default AdminStats;
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Col,
//   Row,
//   Typography,
//   Alert,
//   Spin,
//   Button,
//   Tag,
//   Select,
//   Space,
// } from "antd";
// import {
//   UserOutlined,
//   TransactionOutlined,
//   GlobalOutlined,
//   AppstoreOutlined,
//   RiseOutlined,
// } from "@ant-design/icons";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );

// const { Title, Text } = Typography;

// const CATEGORY_COLORS = [
//   "#10b981", // Mint
//   "#3b82f6", // Blue
//   "#f59e0b", // Amber
//   "#ef4444", // Red
//   "#8b5cf6", // Purple
//   "#06b6d4", // Cyan
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

// function AdminStats() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isReportsView = location.pathname === "/reports";

//   const [currency, setCurrency] = useState(() => {
//     return localStorage.getItem("preferredCurrency") || "USD";
//   });

//   const [timeRange, setTimeRange] = useState("6m");
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalTransactions: 0,
//   });

//   const [transactions, setTransactions] = useState([]);
//   const [summary, setSummary] = useState({
//     totalBalance: 0,
//     totalIncome: 0,
//     totalExpense: 0,
//     currency: "USD",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchData();

//     const handleCurrencyChange = (e) => {
//       const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
//       setCurrency(newCurr);
//     };

//     window.addEventListener("currencyChange", handleCurrencyChange);
//     return () => {
//       window.removeEventListener("currencyChange", handleCurrencyChange);
//     };
//   }, []);

//   const symbol = getCurrencySymbol(currency);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const [statsRes, txRes, summaryRes] = await Promise.allSettled([
//         axios.get("/api/admin/stats"),
//         axios.get("/api/transactions"),
//         axios.get("/api/dashboard/summary"),
//       ]);

//       if (statsRes.status === "fulfilled") {
//         const data = statsRes.value?.data || {};
//         setStats({
//           totalUsers: Number(data.totalUsers ?? data.totalRegisteredUsers ?? 0),
//           totalTransactions: Number(data.totalTransactions ?? data.totalTransactionsProcessed ?? 0),
//         });
//       }

//       if (txRes.status === "fulfilled") {
//         const txData = txRes.value?.data;
//         const txList = Array.isArray(txData)
//           ? txData
//           : Array.isArray(txData?.content)
//           ? txData.content
//           : [];
//         setTransactions(txList);
//       }

//       if (summaryRes.status === "fulfilled") {
//         const sData = summaryRes.value?.data || {};
//         setSummary({
//           totalBalance: Number(sData.totalBalance || 0),
//           totalIncome: Number(sData.totalIncome || 0),
//           totalExpense: Number(sData.totalExpense || 0),
//           currency: sData.currency || "USD",
//         });
//       }
//     } catch (err) {
//       setError("Unable to load platform analytics.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Monthly spending chart data
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
//   const monthlySpendingData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Spending Amount ($)",
//         data: [1200, 1500, 1100, 1800, 1400, 1939, 1600, 1750],
//         backgroundColor: "#06b6d4",
//         borderRadius: 6,
//       },
//     ],
//   };

//   const monthlySpendingOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: "#071a17",
//         cornerRadius: 8,
//       },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: { grid: { color: "#f1f5f9" } },
//     },
//   };

//   // Expense breakdown donut chart data
//   const categoryLabels = ["Food", "Transport", "Shopping", "Bills", "Others"];
//   const categoryPercentages = [32, 18, 15, 12, 23];
//   const categoryValues = [620, 310, 420, 480, 109];

//   const breakdownDonutData = {
//     labels: categoryLabels,
//     datasets: [
//       {
//         data: categoryValues,
//         backgroundColor: CATEGORY_COLORS.slice(0, 5),
//         borderWidth: 2,
//         borderColor: "#ffffff",
//       },
//     ],
//   };

//   const breakdownDonutOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "70%",
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: "#071a17",
//         cornerRadius: 8,
//       },
//     },
//   };

//   // Currency distribution bar chart data
//   const currencyDistributionData = {
//     labels: ["USD", "EUR", "GBP", "INR"],
//     datasets: [
//       {
//         label: "Share (%)",
//         data: [45, 25, 18, 12],
//         backgroundColor: "#3b82f6",
//         borderRadius: 6,
//       },
//     ],
//   };

//   const currencyDistributionOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: "#071a17",
//         cornerRadius: 8,
//         callbacks: {
//           label: (ctx) => ` Share: ${ctx.raw}%`,
//         },
//       },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: {
//         grid: { color: "#f1f5f9" },
//         ticks: { callback: (v) => `${v}%` },
//       },
//     },
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: 450,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: 16,
//         }}
//       >
//         <Spin size="large" />
//         <Text type="secondary" style={{ fontSize: 14 }}>Loading analytics telemetry...</Text>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Page Header */}
//       <div className="page-header">
//         <div>
//           <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
//             {isReportsView ? "Reports & Analytics" : "System Statistics & Analytics"}
//           </Title>
//           <Text style={{ color: "#64748b", fontSize: 14 }}>
//             {isReportsView
//               ? "Comprehensive multi-currency spending analysis and trends"
//               : "Live platform metrics, user registry volumes, and administrative controls"}
//           </Text>
//         </div>

//         <Space>
//           <Select
//             value={timeRange}
//             onChange={(v) => setTimeRange(v)}
//             style={{ width: 140, height: 40 }}
//             options={[
//               { value: "3m", label: "Last 3 Months" },
//               { value: "6m", label: "Last 6 Months" },
//               { value: "1y", label: "Last 1 Year" },
//             ]}
//           />
//           {!isReportsView && (
//             <Tag color="gold" style={{ fontSize: 13, padding: "6px 14px", borderRadius: 20, fontWeight: 700 }}>
//               Administrator Console
//             </Tag>
//           )}
//         </Space>
//       </div>

//       {error && (
//         <Alert
//           type="warning"
//           message={error}
//           showIcon
//           style={{ marginBottom: 24, borderRadius: 10 }}
//         />
//       )}

//       {/* If viewed in admin mode, show System KPI metrics */}
//       {!isReportsView && (
//         <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
//           <Col xs={24} md={12}>
//             <div className="kpi-card">
//               <div className="kpi-card-header">
//                 <span className="kpi-card-label">Registered Users</span>
//                 <div className="kpi-card-icon income">
//                   <UserOutlined />
//                 </div>
//               </div>
//               <div className="kpi-card-value">
//                 {stats.totalUsers || 1}
//               </div>
//               <div className="kpi-trend positive">
//                 <RiseOutlined /> Platform user base
//               </div>
//             </div>
//           </Col>

//           <Col xs={24} md={12}>
//             <div className="kpi-card">
//               <div className="kpi-card-header">
//                 <span className="kpi-card-label">Total Transactions</span>
//                 <div className="kpi-card-icon balance">
//                   <TransactionOutlined />
//                 </div>
//               </div>
//               <div className="kpi-card-value">
//                 {stats.totalTransactions || transactions.length || 0}
//               </div>
//               <div className="kpi-trend positive">
//                 <RiseOutlined /> Ledger entries tracked
//               </div>
//             </div>
//           </Col>
//         </Row>
//       )}

//       {/* Visualizations Row matching Screen 10 (Reports & Analytics) */}
//       <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
//         {/* Monthly Spending */}
//         <Col xs={24} lg={8}>
//           <Card
//             className="modern-card"
//             title={
//               <div>
//                 <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
//                   Monthly Spending
//                 </span>
//                 <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
//                   Volume per month
//                 </div>
//               </div>
//             }
//           >
//             <div style={{ height: 240 }}>
//               <Bar data={monthlySpendingData} options={monthlySpendingOptions} />
//             </div>
//           </Card>
//         </Col>

//         {/* Expense Breakdown */}
//         <Col xs={24} lg={8}>
//           <Card
//             className="modern-card"
//             title={
//               <div>
//                 <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
//                   Expense Breakdown
//                 </span>
//                 <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
//                   Category percentage share
//                 </div>
//               </div>
//             }
//           >
//             <div
//               className="donut-chart-container"
//               style={{
//                 position: "relative",
//                 height: 170,
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Doughnut data={breakdownDonutData} options={breakdownDonutOptions} />
//               <div
//                 className="donut-center-text"
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   textAlign: "center",
//                   pointerEvents: "none",
//                   zIndex: 2,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <div className="donut-center-amount">
//                   {symbol}{summary.totalExpense > 0 ? Math.round(summary.totalExpense).toLocaleString() : "1,939"}
//                 </div>
//                 <div className="donut-center-sub">Expenses</div>
//               </div>
//             </div>

//             <div className="category-legend-list" style={{ marginTop: 14 }}>
//               {categoryLabels.map((cat, idx) => (
//                 <div key={cat} className="category-legend-item">
//                   <div className="category-legend-left">
//                     <div
//                       className="category-legend-dot"
//                       style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
//                     />
//                     <span className="category-legend-name">{cat}</span>
//                   </div>
//                   <div className="category-legend-right">
//                     <span className="category-legend-pct">{categoryPercentages[idx]}%</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </Col>

//         {/* Currency Distribution */}
//         <Col xs={24} lg={8}>
//           <Card
//             className="modern-card"
//             title={
//               <div>
//                 <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
//                   Currency Distribution
//                 </span>
//                 <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
//                   Active portfolio exposure
//                 </div>
//               </div>
//             }
//           >
//             <div style={{ height: 240 }}>
//               <Bar data={currencyDistributionData} options={currencyDistributionOptions} />
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* Administrative Telemetry Quick Actions (for Admin view) */}
//       {!isReportsView && (
//         <Card className="modern-card">
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
//             <div>
//               <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
//                 Platform Operations
//               </h4>
//               <span style={{ fontSize: 13, color: "#64748b" }}>
//                 Manage system resources and platform configuration
//               </span>
//             </div>
//             <Space>
//               <Button
//                 icon={<UserOutlined />}
//                 onClick={() => navigate("/admin/users")}
//                 style={{ borderRadius: 8, fontWeight: 600 }}
//               >
//                 Manage Users
//               </Button>
//               <Button
//                 icon={<GlobalOutlined />}
//                 onClick={() => navigate("/admin/currencies")}
//                 style={{ borderRadius: 8, fontWeight: 600 }}
//               >
//                 Currencies
//               </Button>
//               <Button
//                 icon={<AppstoreOutlined />}
//                 onClick={() => navigate("/admin/categories")}
//                 style={{ borderRadius: 8, fontWeight: 600 }}
//               >
//                 Categories
//               </Button>
//             </Space>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// }

// export default AdminStats;
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Alert,
  Spin,
  Button,
  Tag,
  Select,
  Space,
} from "antd";
import {
  UserOutlined,
  TransactionOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const { Title, Text } = Typography;

const CATEGORY_COLORS = [
  "#10b981", // Mint
  "#3b82f6", // Blue
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
];

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

function AdminStats() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReportsView = location.pathname === "/reports";

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });

  const [timeRange, setTimeRange] = useState("6m");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currency: "USD",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();

    const handleCurrencyChange = (e) => {
      const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
      setCurrency(newCurr);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  const symbol = getCurrencySymbol(currency);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, txRes, summaryRes] = await Promise.allSettled([
        axios.get("/api/admin/stats"),
        axios.get("/api/transactions"),
        axios.get("/api/dashboard/summary"),
      ]);

      if (statsRes.status === "fulfilled") {
        const data = statsRes.value?.data || {};
        setStats({
          totalUsers: Number(data.totalUsers ?? data.totalRegisteredUsers ?? 0),
          totalTransactions: Number(data.totalTransactions ?? data.totalTransactionsProcessed ?? 0),
        });
      }

      if (txRes.status === "fulfilled") {
        const txData = txRes.value?.data;
        const txList = Array.isArray(txData)
          ? txData
          : Array.isArray(txData?.content)
          ? txData.content
          : [];
        setTransactions(txList);
      }

      if (summaryRes.status === "fulfilled") {
        const sData = summaryRes.value?.data || {};
        setSummary({
          totalBalance: Number(sData.totalBalance || 0),
          totalIncome: Number(sData.totalIncome || 0),
          totalExpense: Number(sData.totalExpense || 0),
          currency: sData.currency || "USD",
        });
      }
    } catch (err) {
      setError("Unable to load platform analytics.");
    } finally {
      setLoading(false);
    }
  };

  // Monthly spending chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const monthlySpendingData = {
    labels: months,
    datasets: [
      {
        label: "Spending Amount ($)",
        data: [1200, 1500, 1100, 1800, 1400, 1939, 1600, 1750],
        backgroundColor: "#06b6d4",
        borderRadius: 6,
      },
    ],
  };

  const monthlySpendingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#071a17",
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" } },
    },
  };

  // Expense breakdown donut chart data
  const categoryLabels = ["Food", "Transport", "Shopping", "Bills", "Others"];
  const categoryPercentages = [32, 18, 15, 12, 23];
  const categoryValues = [620, 310, 420, 480, 109];

  const breakdownDonutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: CATEGORY_COLORS.slice(0, 5),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const breakdownDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#071a17",
        cornerRadius: 8,
      },
    },
  };

  // Currency distribution bar chart data
  const currencyDistributionData = {
    labels: ["USD", "EUR", "GBP", "INR"],
    datasets: [
      {
        label: "Share (%)",
        data: [45, 25, 18, 12],
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const currencyDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#071a17",
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` Share: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { callback: (v) => `${v}%` },
      },
    },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: 450,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Spin size="large" />
        <Text type="secondary" style={{ fontSize: 14 }}>Loading analytics telemetry...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            {isReportsView ? "Reports & Analytics" : "System Statistics & Analytics"}
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            {isReportsView
              ? "Comprehensive multi-currency spending analysis and trends"
              : "Live platform metrics, user registry volumes, and administrative controls"}
          </Text>
        </div>

        <Space>
          <Select
            value={timeRange}
            onChange={(v) => setTimeRange(v)}
            style={{ width: 140, height: 40 }}
            options={[
              { value: "3m", label: "Last 3 Months" },
              { value: "6m", label: "Last 6 Months" },
              { value: "1y", label: "Last 1 Year" },
            ]}
          />
          {!isReportsView && (
            <Tag color="gold" style={{ fontSize: 13, padding: "6px 14px", borderRadius: 20, fontWeight: 700 }}>
              Administrator Console
            </Tag>
          )}
        </Space>
      </div>

      {error && (
        <Alert
          type="warning"
          message={error}
          showIcon
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      {/* If viewed in admin mode, show System KPI metrics */}
      {!isReportsView && (
        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-label">Registered Users</span>
                <div className="kpi-card-icon income">
                  <UserOutlined />
                </div>
              </div>
              <div className="kpi-card-value">
                {stats.totalUsers || 1}
              </div>
              <div className="kpi-trend positive">
                <RiseOutlined /> Platform user base
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="kpi-card">
              <div className="kpi-card-header">
                <span className="kpi-card-label">Total Transactions</span>
                <div className="kpi-card-icon balance">
                  <TransactionOutlined />
                </div>
              </div>
              <div className="kpi-card-value">
                {stats.totalTransactions || transactions.length || 0}
              </div>
              <div className="kpi-trend positive">
                <RiseOutlined /> Ledger entries tracked
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Visualizations Row matching Screen 10 (Reports & Analytics) */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Monthly Spending */}
        <Col xs={24} lg={8}>
          <Card
            className="modern-card"
            title={
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Monthly Spending
                </span>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                  Volume per month
                </div>
              </div>
            }
          >
            <div style={{ height: 240 }}>
              <Bar data={monthlySpendingData} options={monthlySpendingOptions} />
            </div>
          </Card>
        </Col>

        {/* Expense Breakdown */}
        <Col xs={24} lg={8}>
          <Card
            className="modern-card"
            title={
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Expense Breakdown
                </span>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                  Category percentage share
                </div>
              </div>
            }
          >
            <div
              className="donut-chart-container"
              style={{
                position: "relative",
                height: 170,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Doughnut data={breakdownDonutData} options={breakdownDonutOptions} />
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
                  {symbol}{summary.totalExpense > 0 ? Math.round(summary.totalExpense).toLocaleString() : "1,939"}
                </div>
                <div className="donut-center-sub">Expenses</div>
              </div>
            </div>

            <div className="category-legend-list" style={{ marginTop: 14 }}>
              {categoryLabels.map((cat, idx) => (
                <div key={cat} className="category-legend-item">
                  <div className="category-legend-left">
                    <div
                      className="category-legend-dot"
                      style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    />
                    <span className="category-legend-name">{cat}</span>
                  </div>
                  <div className="category-legend-right">
                    <span className="category-legend-pct">{categoryPercentages[idx]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Currency Distribution */}
        <Col xs={24} lg={8}>
          <Card
            className="modern-card"
            title={
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Currency Distribution
                </span>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                  Active portfolio exposure
                </div>
              </div>
            }
          >
            <div style={{ height: 240 }}>
              <Bar data={currencyDistributionData} options={currencyDistributionOptions} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Administrative Telemetry Quick Actions (for Admin view) */}
      {!isReportsView && (
        <Card className="modern-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Platform Operations
              </h4>
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Manage system resources and platform configuration
              </span>
            </div>
            <Space>
              <Button
                icon={<UserOutlined />}
                onClick={() => navigate("/admin/users")}
                style={{ borderRadius: 8, fontWeight: 600 }}
              >
                Manage Users
              </Button>
              <Button
                icon={<GlobalOutlined />}
                onClick={() => navigate("/admin/currencies")}
                style={{ borderRadius: 8, fontWeight: 600 }}
              >
                Currencies
              </Button>
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => navigate("/admin/categories")}
                style={{ borderRadius: 8, fontWeight: 600 }}
              >
                Categories
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AdminStats;

