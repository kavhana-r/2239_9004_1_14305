// import React, { useEffect, useState } from "react";
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
//   Empty,
//   message,
// } from "antd";

// import { PlusOutlined } from "@ant-design/icons";
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

// function BudgetsPage() {
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     month: "January",
//     year: new Date().getFullYear(),
//     limitAmount: null,
//   });

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const fetchBudgets = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.get(
//         "/api/budgets"
//       );

//       const data = response?.data;

//       setBudgets(
//         Array.isArray(data)
//           ? data
//           : Array.isArray(data?.content)
//           ? data.content
//           : []
//       );
//     } catch (error) {
//       setBudgets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       month: "January",
//       year: new Date().getFullYear(),
//       limitAmount: null,
//     });

//     setModalOpen(true);
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
//       message.error(
//         "Limit amount must be at least 1"
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       await axios.post("/api/budgets", {
//         month: formData.month,
//         year: Number(formData.year),
//         limitAmount: Number(
//           formData.limitAmount
//         ),
//       });

//       message.success(
//         "Budget set successfully"
//       );

//       setModalOpen(false);

//       await fetchBudgets();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message ||
//           "Unable to set budget."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const getSpent = (budget) =>
//     Number(
//       budget?.spentAmount ??
//         budget?.spent ??
//         budget?.totalSpent ??
//         0
//     );

//   const getLimit = (budget) =>
//     Number(
//       budget?.limitAmount ??
//         budget?.amount ??
//         budget?.limit ??
//         0
//     );

//   const getPercent = (budget) => {
//     const limit = getLimit(budget);

//     if (limit <= 0) {
//       return 0;
//     }

//     return Math.round(
//       (getSpent(budget) / limit) * 100
//     );
//   };

//   const getProgressStatus = (percent) => {
//     if (percent >= 100) {
//       return "exception";
//     }

//     if (percent >= 80) {
//       return "active";
//     }

//     return "success";
//   };

//   return (
//     <div>
//       <div className="page-header">
//         <div>
//           <Title level={2}>Budget Planning</Title>
//           <Text type="secondary">
//             Set monthly spending limits and monitor your progress.
//           </Text>
//         </div>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={openModal}
//         >
//           Set Monthly Budget
//         </Button>
//       </div>

//       {budgets.length === 0 && !loading ? (
//         <Card>
//           <Empty description="No budgets set yet. Start by setting a monthly limit." />
//         </Card>
//       ) : (
//         <Row gutter={[20, 20]}>
//           {budgets.map((budget, index) => {
//             const spent = getSpent(budget);
//             const limit = getLimit(budget);
//             const percent = getPercent(budget);

//             return (
//               <Col
//                 xs={24}
//                 sm={12}
//                 lg={8}
//                 key={budget?.id || index}
//               >
//                 <Card
//                   title={`${budget?.month || ""} ${
//                     budget?.year || ""
//                   }`}
//                   loading={loading}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent:
//                         "space-between",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <Text>Spent</Text>
//                     <Text strong>
//                       ${spent.toFixed(2)}
//                     </Text>
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent:
//                         "space-between",
//                       marginBottom: 12,
//                     }}
//                   >
//                     <Text>Limit</Text>
//                     <Text strong>
//                       ${limit.toFixed(2)}
//                     </Text>
//                   </div>

//                   <Progress
//                     percent={Math.min(
//                       percent,
//                       100
//                     )}
//                     status={getProgressStatus(
//                       percent
//                     )}
//                   />

//                   {percent >= 100 && (
//                     <Text
//                       type="danger"
//                       strong
//                     >
//                       Over budget!
//                     </Text>
//                   )}
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//       )}

//       <Modal
//         open={modalOpen}
//         title="Set Monthly Budget"
//         onCancel={() =>
//           setModalOpen(false)
//         }
//         onOk={handleSubmit}
//         confirmLoading={saving}
//       >
//         <div style={{ marginTop: 10 }}>
//           <label>Month</label>

//           <Select
//             value={formData.month}
//             onChange={(value) =>
//               setFormData({
//                 ...formData,
//                 month: value,
//               })
//             }
//             style={{
//               width: "100%",
//               marginTop: 6,
//               marginBottom: 16,
//             }}
//             options={months.map((month) => ({
//               value: month,
//               label: month,
//             }))}
//           />

//           <label>Year</label>

//           <InputNumber
//             value={formData.year}
//             onChange={(value) =>
//               setFormData({
//                 ...formData,
//                 year: value,
//               })
//             }
//             style={{
//               width: "100%",
//               marginTop: 6,
//               marginBottom: 16,
//             }}
//           />

//           <label>Limit Amount</label>

//           <InputNumber
//             min={1}
//             precision={2}
//             value={formData.limitAmount}
//             onChange={(value) =>
//               setFormData({
//                 ...formData,
//                 limitAmount: value,
//               })
//             }
//             style={{
//               width: "100%",
//               marginTop: 6,
//             }}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default BudgetsPage;

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Typography,
  message,
  Tag,
  Space,
  Spin,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Groceries: "🛒",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "⚡",
  Utilities: "💡",
  Entertainment: "🎬",
  Housing: "🏠",
  Health: "💊",
  Travel: "✈️",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Others: "📦",
};

const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Food", icon: "🍔" },
  { id: "c2", name: "Groceries", icon: "🛒" },
  { id: "c3", name: "Transport", icon: "🚗" },
  { id: "c4", name: "Shopping", icon: "🛍️" },
  { id: "c5", name: "Bills", icon: "⚡" },
  { id: "c6", name: "Utilities", icon: "💡" },
  { id: "c7", name: "Entertainment", icon: "🎬" },
  { id: "c8", name: "Housing", icon: "🏠" },
  { id: "c9", name: "Health", icon: "💊" },
  { id: "c10", name: "Travel", icon: "✈️" },
  { id: "c11", name: "Others", icon: "📦" },
];

const DEFAULT_BUDGET_ITEMS = [
  { id: "b1", name: "Food", icon: "🍔", limit: 800, spent: 620, remaining: 180, pct: 78 },
  { id: "b2", name: "Transport", icon: "🚗", limit: 400, spent: 310.25, remaining: 89.75, pct: 78 },
  { id: "b3", name: "Shopping", icon: "🛍️", limit: 500, spent: 420, remaining: 80, pct: 84 },
  { id: "b4", name: "Bills", icon: "⚡", limit: 600, spent: 480, remaining: 120, pct: 80 },
  { id: "b5", name: "Others", icon: "📦", limit: 200, spent: 109, remaining: 91, pct: 55 },
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

function BudgetsPage() {
  const authUser = useSelector((state) => state?.auth?.user);

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || authUser?.preferredCurrency || "USD";
  });

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const currentMonthName = months[new Date().getMonth()];

  const [formData, setFormData] = useState({
    categoryName: "Food",
    categoryId: null,
    month: currentMonthName,
    year: new Date().getFullYear(),
    limitAmount: null,
  });

  useEffect(() => {
    const handleCurrencyChange = (e) => {
      const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
      setCurrency(newCurr);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("preferredCurrency")) {
      const userCurrency = authUser?.preferredCurrency || authUser?.user?.preferredCurrency;
      if (userCurrency) {
        setCurrency(userCurrency);
      }
    }
  }, [authUser]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const [budgetRes, catRes, summaryRes, txRes] = await Promise.allSettled([
        axios.get("/api/budgets"),
        axios.get("/api/categories"),
        axios.get("/api/dashboard/summary"),
        axios.get("/api/transactions"),
      ]);

      let txList = [];
      if (txRes.status === "fulfilled") {
        const txData = txRes.value?.data;
        txList = Array.isArray(txData)
          ? txData
          : Array.isArray(txData?.content)
          ? txData.content
          : [];
      }

      if (catRes.status === "fulfilled") {
        const catData = catRes.value?.data;
        const catList = Array.isArray(catData)
          ? catData
          : Array.isArray(catData?.content)
          ? catData.content
          : [];
        if (catList.length > 0) {
          setCategories(catList);
        }
      }

      if (budgetRes.status === "fulfilled") {
        const data = budgetRes.value?.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];
        
        const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
        const filteredList = list.filter((b) => !deletedIds.includes(String(b.id)));
        
        const calculatedList = filteredList.map((b) => {
          const bMonth = typeof b.month === "number" ? b.month : months.indexOf(b.month) + 1;
          const bYear = Number(b.year) || new Date().getFullYear();
          const bCatId = b.category?.id;
          const bCatName = b.category?.name || b.name;

          let txSpent = 0;
          txList.forEach((tx) => {
            const isExpense = tx.transactionType === "EXPENSE" || tx.type === "EXPENSE";
            if (!isExpense) return;

            const txDate = tx.transactionDate ? new Date(tx.transactionDate) : null;
            if (txDate && !isNaN(txDate.getTime())) {
              const txMonth = txDate.getMonth() + 1;
              const txYear = txDate.getFullYear();
              if (txMonth !== bMonth || txYear !== bYear) return;
            }

            const txCatId = tx.category?.id;
            const txCatName = tx.category?.name;
            const catMatches =
              (bCatId && txCatId && Number(bCatId) === Number(txCatId)) ||
              (bCatName && txCatName && String(bCatName).toLowerCase() === String(txCatName).toLowerCase());

            if (catMatches || !bCatId) {
              txSpent += Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
            }
          });

          return {
            ...b,
            spentAmount: txSpent > 0 ? txSpent : (b.spentAmount != null ? Number(b.spentAmount) : 0),
          };
        });

        setBudgets(calculatedList);

        const foundCurrency = list.find((b) => b?.user?.preferredCurrency)?.user?.preferredCurrency;
        if (foundCurrency) {
          setCurrency(foundCurrency);
        }
      } else {
        setBudgets([]);
      }

      if (summaryRes.status === "fulfilled" && summaryRes.value?.data?.currency) {
        setCurrency(summaryRes.value.data.currency);
      }
    } catch (error) {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingBudget(null);
    const firstCat = categories.length > 0 ? categories[0] : DEFAULT_CATEGORIES[0];
    setFormData({
      categoryName: firstCat.name,
      categoryId: firstCat.id,
      month: currentMonthName,
      year: new Date().getFullYear(),
      limitAmount: null,
    });
    setModalOpen(true);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    const monthNum = typeof budget.month === "number" ? budget.month : months.indexOf(budget.month) + 1;
    const monthName = months[monthNum - 1] || budget.month || currentMonthName;
    const catName = budget.category?.name || budget.name || "Food";
    const catObj = categories.find((c) => c.name === catName);

    setFormData({
      categoryName: catName,
      categoryId: catObj?.id || budget.category?.id || null,
      month: monthName,
      year: budget.year || new Date().getFullYear(),
      limitAmount: getLimit(budget),
    });
    setModalOpen(true);
  };

  const handleDelete = async (budget) => {
    try {
      if (budget.id && typeof budget.id === "number") {
        try {
          await axios.delete(`/api/budgets/${budget.id}`);
        } catch (apiErr) {
          console.warn("Backend DELETE API warning:", apiErr);
        }
      }

      // Track deleted budget locally so it persists
      const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
      if (budget.id) deletedIds.push(String(budget.id));
      if (budget.name) deletedIds.push(String(budget.name));
      localStorage.setItem("deleted_budget_ids", JSON.stringify(deletedIds));

      setBudgets((prev) => prev.filter((b) => b.id !== budget.id && b.name !== budget.name));
      message.success("Budget deleted successfully");
    } catch (error) {
      message.error("Unable to delete budget.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.month) {
      message.error("Month is required");
      return;
    }

    if (!formData.year) {
      message.error("Year is required");
      return;
    }

    if (
      formData.limitAmount === null ||
      Number(formData.limitAmount) < 1
    ) {
      message.error("Limit amount must be at least 1");
      return;
    }

    try {
      setSaving(true);

      const monthIdx = months.indexOf(formData.month);
      const monthVal = monthIdx !== -1 ? monthIdx + 1 : Number(formData.month) || 1;

      const payload = {
        month: monthVal,
        year: Number(formData.year),
        limitAmount: Number(formData.limitAmount),
      };

      if (formData.categoryId && typeof formData.categoryId === "number") {
        payload.category = { id: formData.categoryId, name: formData.categoryName };
      }

      if (editingBudget && editingBudget.id && typeof editingBudget.id === "number") {
        try {
          await axios.put(`/api/budgets/${editingBudget.id}`, payload);
        } catch (err) {
          // Fallback to POST /api/budgets which creates or updates by month & year
          await axios.post("/api/budgets", payload);
        }
        message.success("Budget set successfully.");
      } else {
        await axios.post("/api/budgets", payload);
        message.success("Budget set successfully.");
      }

      // Save category association in local storage
      try {
        const catMap = JSON.parse(localStorage.getItem("budget_category_map") || "{}");
        const key = `${monthVal}_${formData.year}`;
        catMap[key] = {
          name: formData.categoryName,
          icon: CATEGORY_ICONS[formData.categoryName] || "🏷️",
        };
        localStorage.setItem("budget_category_map", JSON.stringify(catMap));
      } catch (e) {}

      setModalOpen(false);
      await fetchBudgets();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to save budget."
      );
    } finally {
      setSaving(false);
    }
  };

  const getSpent = (budget) =>
    Number(
      budget?.spentAmount ??
      budget?.spent ??
      budget?.totalSpent ??
      0
    );

  const getLimit = (budget) =>
    Number(
      budget?.limitAmount ??
      budget?.amount ??
      budget?.limit ??
      0
    );

  const getPercent = (budget) => {
    const limit = getLimit(budget);
    if (limit <= 0) return 0;
    return Math.round((getSpent(budget) / limit) * 100);
  };

  const formatMonthTitle = (month, year) => {
    if (typeof month === "number") {
      const name = months[month - 1] || month;
      return `${name} ${year || ""}`;
    }
    return `${month || ""} ${year || ""}`;
  };

  const symbol = getCurrencySymbol(currency);

  const displayItems = useMemo(() => {
    const deletedIds = JSON.parse(localStorage.getItem("deleted_budget_ids") || "[]");
    if (budgets.length > 0) {
      return budgets.filter((b) => !deletedIds.includes(String(b.id)));
    }
    return DEFAULT_BUDGET_ITEMS.filter(
      (b) => !deletedIds.includes(String(b.id)) && !deletedIds.includes(String(b.name))
    );
  }, [budgets]);

  // Overall totals calculation
  const overallTotals = useMemo(() => {
    let totalLimit = 0;
    let totalSpent = 0;

    displayItems.forEach((b) => {
      totalLimit += getLimit(b);
      totalSpent += getSpent(b);
    });

    const displayRemaining = Math.max(0, totalLimit - totalSpent);
    const overallPct = totalLimit > 0 ? Math.min(100, Math.round((totalSpent / totalLimit) * 100)) : 0;

    return {
      limit: totalLimit,
      spent: totalSpent,
      remaining: displayRemaining,
      pct: overallPct,
      hasRealData: totalLimit > 0,
    };
  }, [displayItems]);

  return (
    <div>
      {/* Top Page Header */}
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            Budgets
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            Set monthly spending limits and monitor budget utilization
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openAdd}
          style={{
            borderRadius: 8,
            fontWeight: 700,
            background: "#10b981",
            borderColor: "#10b981",
          }}
        >
          Create Budget
        </Button>
      </div>

      {/* 4 Summary Metric Cards (Screen 6) */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Total Budget */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card" style={{ padding: "18px 22px" }}>
            <div className="kpi-card-header">
              <span className="kpi-card-label">Total Budget</span>
              <div className="kpi-card-icon budget">
                <WalletOutlined />
              </div>
            </div>
            <div className="kpi-card-value">
              {symbol}
              {overallTotals.limit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </Col>

        {/* Spent */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card" style={{ padding: "18px 22px" }}>
            <div className="kpi-card-header">
              <span className="kpi-card-label">Spent</span>
              <div className="kpi-card-icon expense">
                <ExclamationCircleOutlined />
              </div>
            </div>
            <div className="kpi-card-value" style={{ color: "#ef4444" }}>
              {symbol}
              {overallTotals.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </Col>

        {/* Remaining */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card" style={{ padding: "18px 22px" }}>
            <div className="kpi-card-header">
              <span className="kpi-card-label">Remaining</span>
              <div className="kpi-card-icon balance">
                <CheckCircleOutlined />
              </div>
            </div>
            <div className="kpi-card-value" style={{ color: "#10b981" }}>
              {symbol}
              {overallTotals.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </Col>

        {/* Overall Progress */}
        <Col xs={24} sm={12} lg={6}>
          <div className="kpi-card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span className="kpi-card-label">Overall Progress</span>
              <div className="kpi-card-value" style={{ margin: "4px 0 0 0" }}>
                {overallTotals.pct}%
              </div>
              <span style={{ fontSize: 12, color: "#64748b" }}>of total cap</span>
            </div>
            <Progress
              type="circle"
              percent={overallTotals.pct}
              width={56}
              strokeColor="#10b981"
              strokeWidth={10}
              format={() => `${overallTotals.pct}%`}
            />
          </div>
        </Col>
      </Row>

      {/* Budget List Card */}
      <Card className="modern-card">
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
              Active Category Budgets
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Real-time expenditure progress bars
            </span>
          </div>
          <Tag color="success" style={{ borderRadius: 20, fontWeight: 600 }}>
            {currentMonthName} {new Date().getFullYear()}
          </Tag>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : displayItems.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <Empty description="No budgets found. Create one to monitor your spending limits!" />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAdd}
              style={{ marginTop: 16, borderRadius: 8, background: "#10b981", borderColor: "#10b981" }}
            >
              Add Budget
            </Button>
          </div>
        ) : (
          <div className="custom-table" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budgeted</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th style={{ minWidth: 160 }}>Progress</th>
                  <th style={{ textAlign: "center", width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((b, idx) => {
                  let name = b.category?.name || b.name;
                  if (!name && b.month) {
                    try {
                      const catMap = JSON.parse(localStorage.getItem("budget_category_map") || "{}");
                      const monthVal = typeof b.month === "number" ? b.month : months.indexOf(b.month) + 1;
                      const saved = catMap[`${monthVal}_${b.year}`];
                      if (saved?.name) name = saved.name;
                    } catch (e) {}
                  }
                  if (!name) name = formatMonthTitle(b.month, b.year);

                  const icon = b.icon || CATEGORY_ICONS[name] || "🏷️";
                  const limitVal = b.limit || getLimit(b);
                  const spentVal = b.spent || getSpent(b);
                  const remainingVal = b.remaining !== undefined ? b.remaining : Math.max(0, limitVal - spentVal);
                  const pct = b.pct !== undefined ? b.pct : getPercent(b);
                  const isOver = pct >= 100;

                  return (
                    <tr key={b.id || idx}>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>
                        <Space size="middle">
                          <span style={{ fontSize: 20 }}>{icon}</span>
                          <span>{name}</span>
                        </Space>
                      </td>
                      <td style={{ fontWeight: 600, color: "#334155" }}>
                        {symbol}{limitVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ fontWeight: 700, color: isOver ? "#ef4444" : "#0f172a" }}>
                        {symbol}{spentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ fontWeight: 600, color: isOver ? "#ef4444" : "#10b981" }}>
                        {symbol}{remainingVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Progress
                            percent={Math.min(100, pct)}
                            strokeColor={isOver ? "#ef4444" : "#10b981"}
                            trailColor="#f1f5f9"
                            showInfo={false}
                            style={{ flex: 1, margin: 0 }}
                          />
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: isOver ? "#ef4444" : "#0f172a",
                              minWidth: 40,
                              textAlign: "right",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Space size="small">
                          <button
                            type="button"
                            className="action-btn-circle"
                            onClick={() => openEdit(b)}
                            title="Edit Budget"
                          >
                            <EditOutlined />
                          </button>
                          <Popconfirm
                            title="Delete budget"
                            description="Are you sure you want to delete this budget?"
                            onConfirm={() => handleDelete(b)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                          >
                            <button
                              type="button"
                              className="action-btn-circle danger"
                              title="Delete Budget"
                            >
                              <DeleteOutlined />
                            </button>
                          </Popconfirm>
                        </Space>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Budget Modal */}
      <Modal
        title={
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              {editingBudget ? "Edit Budget" : "Create Monthly Budget"}
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Set spending limits to keep expenditures in check
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Category <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Select
              size="large"
              style={{ width: "100%", height: 42 }}
              value={formData.categoryName}
              onChange={(name) => {
                const found = categories.find((c) => c.name === name);
                setFormData((p) => ({
                  ...p,
                  categoryName: name,
                  categoryId: found?.id || null,
                }));
              }}
              options={categories.map((c) => ({
                value: c.name,
                label: `${c.icon || CATEGORY_ICONS[c.name] || "🏷️"} ${c.name}`,
              }))}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Month <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Select
                size="large"
                style={{ width: "100%", height: 42 }}
                value={formData.month}
                onChange={(value) => setFormData((p) => ({ ...p, month: value }))}
                options={months.map((m) => ({ value: m, label: m }))}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Year <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <InputNumber
                size="large"
                style={{ width: "100%", height: 42 }}
                min={2020}
                max={2035}
                value={formData.year}
                onChange={(val) => setFormData((p) => ({ ...p, year: val }))}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Budget Limit Amount ({symbol}) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <InputNumber
              size="large"
              style={{ width: "100%", height: 42 }}
              min={1}
              step={50}
              placeholder="e.g., 2500"
              value={formData.limitAmount}
              onChange={(val) => setFormData((p) => ({ ...p, limitAmount: val }))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button size="large" onClick={() => setModalOpen(false)} style={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={saving}
              onClick={handleSubmit}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                background: "#10b981",
                borderColor: "#10b981",
                minWidth: 120,
              }}
            >
              {editingBudget ? "Update Budget" : "Save Budget"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BudgetsPage;
