// // import React, { useEffect, useState } from "react";
// // import {
// //   Button,
// //   Card,
// //   Col,
// //   DatePicker,
// //   Input,
// //   InputNumber,
// //   Modal,
// //   Popconfirm,
// //   Progress,
// //   Row,
// //   Tag,
// //   Typography,
// //   Empty,
// //   message,
// // } from "antd";

// // import { PlusOutlined } from "@ant-design/icons";
// // import axios from "axios";
// // import dayjs from "dayjs";

// // const { Title, Text } = Typography;

// // function GoalsPage() {
// //   const [goals, setGoals] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const [createModalOpen, setCreateModalOpen] =
// //     useState(false);

// //   const [fundModalOpen, setFundModalOpen] =
// //     useState(false);

// //   const [selectedGoal, setSelectedGoal] =
// //     useState(null);

// //   const [saving, setSaving] = useState(false);

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     targetAmount: null,
// //     deadline: null,
// //   });

// //   const [fundAmount, setFundAmount] =
// //     useState(null);

// //   useEffect(() => {
// //     fetchGoals();
// //   }, []);

// //   const fetchGoals = async () => {
// //     try {
// //       setLoading(true);

// //       const response = await axios.get(
// //         "/api/goals"
// //       );

// //       const data = response?.data;

// //       setGoals(
// //         Array.isArray(data)
// //           ? data
// //           : Array.isArray(data?.content)
// //           ? data.content
// //           : []
// //       );
// //     } catch (error) {
// //       setGoals([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getSavedAmount = (goal) =>
// //     Number(
// //       goal?.savedAmount ??
// //         goal?.currentAmount ??
// //         0
// //     );

// //   const getTargetAmount = (goal) =>
// //     Number(
// //       goal?.targetAmount ?? 0
// //     );

// //   const getProgress = (goal) => {
// //     const target = getTargetAmount(goal);

// //     if (target <= 0) {
// //       return 0;
// //     }

// //     return Math.round(
// //       (getSavedAmount(goal) / target) * 100
// //     );
// //   };

// //   const openCreateModal = () => {
// //     setFormData({
// //       title: "",
// //       targetAmount: null,
// //       deadline: null,
// //     });

// //     setCreateModalOpen(true);
// //   };

// //   const handleCreate = async () => {
// //     if (!formData.title.trim()) {
// //       message.error("Title is required");
// //       return;
// //     }

// //     if (
// //       formData.targetAmount === null ||
// //       Number(formData.targetAmount) <= 0
// //     ) {
// //       message.error(
// //         "Target amount must be greater than 0"
// //       );
// //       return;
// //     }

// //     if (!formData.deadline) {
// //       message.error("Deadline is required");
// //       return;
// //     }

// //     try {
// //       setSaving(true);

// //       await axios.post("/api/goals", {
// //         title: formData.title.trim(),
// //         targetAmount: Number(
// //           formData.targetAmount
// //         ),
// //         deadline: dayjs(
// //           formData.deadline
// //         ).format("YYYY-MM-DD"),
// //         savedAmount: 0,
// //       });

// //       message.success(
// //         "Goal created successfully"
// //       );

// //       setCreateModalOpen(false);

// //       await fetchGoals();
// //     } catch (error) {
// //       message.error(
// //         error?.response?.data?.message ||
// //           "Unable to create goal."
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const openFundModal = (goal) => {
// //     setSelectedGoal(goal);
// //     setFundAmount(null);
// //     setFundModalOpen(true);
// //   };

// //   const handleAddFunds = async () => {
// //     if (
// //       fundAmount === null ||
// //       Number(fundAmount) <= 0
// //     ) {
// //       message.error(
// //         "Fund amount must be greater than 0"
// //       );
// //       return;
// //     }

// //     try {
// //       setSaving(true);

// //       await axios.put(
// //         `/api/goals/${selectedGoal.id}/add-funds?amount=${Number(
// //           fundAmount
// //         )}`
// //       );

// //       message.success(
// //         "Funds added to goal"
// //       );

// //       setFundModalOpen(false);

// //       await fetchGoals();
// //     } catch (error) {
// //       message.error(
// //         error?.response?.data?.message ||
// //           "Unable to add funds."
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async (goal) => {
// //     try {
// //       await axios.delete(
// //         `/api/goals/${goal.id}`
// //       );

// //       message.success("Goal deleted");

// //       await fetchGoals();
// //     } catch (error) {
// //       message.error(
// //         error?.response?.data?.message ||
// //           "Unable to delete goal."
// //       );
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className="page-header">
// //         <div>
// //           <Title level={2}>Savings Goals</Title>
// //           <Text type="secondary">
// //             Set targets and build your savings.
// //           </Text>
// //         </div>

// //         <Button
// //           type="primary"
// //           icon={<PlusOutlined />}
// //           onClick={openCreateModal}
// //         >
// //           Create New Goal
// //         </Button>
// //       </div>

// //       {goals.length === 0 && !loading ? (
// //         <Card>
// //           <Empty description="No savings goals yet. Set a target and start saving!" />
// //         </Card>
// //       ) : (
// //         <Row gutter={[20, 20]}>
// //           {goals.map((goal, index) => {
// //             const saved =
// //               getSavedAmount(goal);

// //             const target =
// //               getTargetAmount(goal);

// //             const progress =
// //               getProgress(goal);

// //             return (
// //               <Col
// //                 xs={24}
// //                 sm={12}
// //                 lg={8}
// //                 key={goal?.id || index}
// //               >
// //                 <Card loading={loading}>
// //                   <Title level={4}>
// //                     {goal?.title}
// //                   </Title>

// //                   <div className="goal-row">
// //                     <Text>
// //                       Target Amount
// //                     </Text>

// //                     <Text strong>
// //                       ${target.toFixed(2)}
// //                     </Text>
// //                   </div>

// //                   <div className="goal-row">
// //                     <Text>
// //                       Saved Amount
// //                     </Text>

// //                     <Text strong>
// //                       ${saved.toFixed(2)}
// //                     </Text>
// //                   </div>

// //                   <div className="goal-row">
// //                     <Text>Deadline</Text>

// //                     <Text>
// //                       {goal?.deadline
// //                         ? dayjs(
// //                             goal.deadline
// //                           ).format(
// //                             "DD MMM YYYY"
// //                           )
// //                         : "-"}
// //                     </Text>
// //                   </div>

// //                   <Progress
// //                     percent={Math.min(
// //                       progress,
// //                       100
// //                     )}
// //                   />

// //                   {progress > 100 && (
// //                     <Tag
// //                       color="green"
// //                       style={{
// //                         marginBottom: 12,
// //                       }}
// //                     >
// //                       Goal Achieved!
// //                     </Tag>
// //                   )}

// //                   <div
// //                     style={{
// //                       display: "flex",
// //                       gap: 8,
// //                     }}
// //                   >
// //                     <Button
// //                       type="primary"
// //                       onClick={() =>
// //                         openFundModal(goal)
// //                       }
// //                     >
// //                       Add Funds
// //                     </Button>

// //                     <Popconfirm
// //                       title="Delete this goal?"
// //                       onConfirm={() =>
// //                         handleDelete(goal)
// //                       }
// //                     >
// //                       <Button danger>
// //                         Delete
// //                       </Button>
// //                     </Popconfirm>
// //                   </div>
// //                 </Card>
// //               </Col>
// //             );
// //           })}
// //         </Row>
// //       )}

// //       {/* Create Goal Modal */}
// //       <Modal
// //         open={createModalOpen}
// //         title="Create New Goal"
// //         onCancel={() =>
// //           setCreateModalOpen(false)
// //         }
// //         onOk={handleCreate}
// //         confirmLoading={saving}
// //       >
// //         <div style={{ marginTop: 10 }}>
// //           <label>Title</label>

// //           <Input
// //             placeholder="e.g., New Car, Vacation"
// //             value={formData.title}
// //             onChange={(e) =>
// //               setFormData({
// //                 ...formData,
// //                 title: e.target.value,
// //               })
// //             }
// //             style={{
// //               marginTop: 6,
// //               marginBottom: 16,
// //             }}
// //           />

// //           <label>Target Amount</label>

// //           <InputNumber
// //             min={0.01}
// //             precision={2}
// //             value={formData.targetAmount}
// //             onChange={(value) =>
// //               setFormData({
// //                 ...formData,
// //                 targetAmount: value,
// //               })
// //             }
// //             style={{
// //               width: "100%",
// //               marginTop: 6,
// //               marginBottom: 16,
// //             }}
// //           />

// //           <label>Deadline</label>

// //           <DatePicker
// //             value={formData.deadline}
// //             onChange={(value) =>
// //               setFormData({
// //                 ...formData,
// //                 deadline: value,
// //               })
// //             }
// //             style={{
// //               width: "100%",
// //               marginTop: 6,
// //             }}
// //           />
// //         </div>
// //       </Modal>

// //       {/* Add Funds Modal */}
// //       <Modal
// //         open={fundModalOpen}
// //         title={`Add Funds to ${
// //           selectedGoal?.title || ""
// //         }`}
// //         onCancel={() =>
// //           setFundModalOpen(false)
// //         }
// //         onOk={handleAddFunds}
// //         confirmLoading={saving}
// //       >
// //         <div style={{ marginTop: 10 }}>
// //           <label>Amount</label>

// //           <InputNumber
// //             min={0.01}
// //             precision={2}
// //             value={fundAmount}
// //             onChange={setFundAmount}
// //             style={{
// //               width: "100%",
// //               marginTop: 6,
// //             }}
// //           />
// //         </div>
// //       </Modal>
// //     </div>
// //   );
// // }

// // export default GoalsPage;
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Typography,
  message,
  Space,
  Spin,
  Select,
  Tag,
  Empty,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  DollarCircleOutlined,
  BulbFilled,
  RocketFilled,
  LaptopOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  HomeOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;


const getGoalIcon = (title = "") => {
  const lower = title.toLowerCase();
  if (lower.includes("trip") || lower.includes("travel") || lower.includes("vacation") || lower.includes("europe")) {
    return <RocketFilled style={{ color: "#0ea5e9" }} />;
  }
  if (lower.includes("laptop") || lower.includes("pc") || lower.includes("tech") || lower.includes("phone")) {
    return <LaptopOutlined style={{ color: "#3b82f6" }} />;
  }
  if (lower.includes("emergency") || lower.includes("health") || lower.includes("fund") || lower.includes("safety")) {
    return <SafetyCertificateOutlined style={{ color: "#10b981" }} />;
  }
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("bike")) {
    return <CarOutlined style={{ color: "#f59e0b" }} />;
  }
  if (lower.includes("house") || lower.includes("home") || lower.includes("rent")) {
    return <HomeOutlined style={{ color: "#8b5cf6" }} />;
  }
  return <RocketFilled style={{ color: "#10b981" }} />;
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

function GoalsPage() {
  const location = useLocation();
  const authUser = useSelector((state) => state.auth?.user);
  const role = authUser?.role || authUser?.user?.role;
  const isAdmin =
    role === "ROLE_ADMIN" ||
    role === "ADMIN" ||
    location.pathname.startsWith("/admin");

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });

  const [goals, setGoals] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: null,
    currentAmount: null,
    deadline: null,
    userId: null,
  });

  const [fundAmount, setFundAmount] = useState(null);

  useEffect(() => {
    fetchGoals();
    if (isAdmin) {
      fetchUsers();
    }

    const handleCurrencyChange = (e) => {
      const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
      setCurrency(newCurr);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const symbol = getCurrencySymbol(currency);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const url = isAdmin ? "/api/admin/goals" : "/api/goals";
      const response = await axios.get(url);
      const data = response?.data;

      setGoals(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      const data = response?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setUsersList(list);
    } catch (error) {
      setUsersList([]);
    }
  };

  const getSavedAmount = (goal) =>
    Number(
      goal?.currentAmount ??
        goal?.savedAmount ??
        0
    );

  const getTargetAmount = (goal) =>
    Number(goal?.targetAmount ?? 0);

  const getProgress = (goal) => {
    const target = getTargetAmount(goal);
    if (target <= 0) return 0;
    return Math.round((getSavedAmount(goal) / target) * 100);
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      targetAmount: null,
      currentAmount: null,
      deadline: null,
      userId: isAdmin && usersList.length > 0 ? usersList[0].id : null,
    });
    setCreateModalOpen(true);
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title || "",
      targetAmount: goal.targetAmount != null ? Number(goal.targetAmount) : null,
      currentAmount: getSavedAmount(goal),
      deadline: goal.deadline ? dayjs(goal.deadline) : null,
      userId: goal.user?.id || goal.userId || null,
    });
    setCreateModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      message.error("Goal title is required");
      return;
    }

    if (
      formData.targetAmount === null ||
      Number(formData.targetAmount) <= 0
    ) {
      message.error("Target amount must be greater than zero");
      return;
    }

    if (isAdmin && !formData.userId) {
      message.error("Please select a user for this goal");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title.trim(),
        targetAmount: Number(formData.targetAmount),
        currentAmount:
          formData.currentAmount !== null && formData.currentAmount !== undefined
            ? Number(formData.currentAmount)
            : 0.0,
        deadline: formData.deadline
          ? formData.deadline.format("YYYY-MM-DD")
          : null,
      };

      if (isAdmin && formData.userId) {
        payload.userId = formData.userId;
      }

      if (editingGoal?.id) {
        const url = isAdmin
          ? `/api/admin/goals/${editingGoal.id}`
          : `/api/goals/${editingGoal.id}`;
        await axios.put(url, payload);
        message.success("Financial goal updated successfully");
      } else {
        const url = isAdmin ? "/api/admin/goals" : "/api/goals";
        await axios.post(url, payload);
        message.success("Financial goal created successfully");
      }

      setCreateModalOpen(false);
      setEditingGoal(null);
      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "Unable to save goal.")
      );
    } finally {
      setSaving(false);
    }
  };

  const openFundModal = (goal) => {
    setSelectedGoal(goal);
    setFundAmount(null);
    setFundModalOpen(true);
  };

  const handleAddFunds = async () => {
    if (!fundAmount || Number(fundAmount) <= 0) {
      message.error("Please enter a valid deposit amount");
      return;
    }

    try {
      setSaving(true);
      if (isAdmin) {
        const current = getSavedAmount(selectedGoal);
        await axios.put(`/api/admin/goals/${selectedGoal.id}`, {
          currentAmount: current + Number(fundAmount),
        });
      } else {
        await axios.put(
          `/api/goals/${selectedGoal.id}/add-funds?amount=${Number(fundAmount)}`
        );
      }

      message.success("Funds added successfully!");
      setFundModalOpen(false);
      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to add funds."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = isAdmin ? `/api/admin/goals/${id}` : `/api/goals/${id}`;
      await axios.delete(url);
      message.success("Goal deleted successfully");
      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "Unable to delete goal.")
      );
    }
  };

  // Demo fallback goals matching Screen 7 if user has none
  const defaultGoals = [
    {
      id: "g1",
      title: "Trip to Europe",
      targetAmount: 2000,
      currentAmount: 1200,
      deadline: "2026-12-31",
    },
    {
      id: "g2",
      title: "New Laptop",
      targetAmount: 1000,
      currentAmount: 600,
      deadline: "2026-11-15",
    },
    {
      id: "g3",
      title: "Emergency Fund",
      targetAmount: 1500,
      currentAmount: 300,
      deadline: "2026-12-31",
    },
  ];

  const filteredGoals = useMemo(() => {
    if (!searchQuery.trim()) return goals;
    const q = searchQuery.toLowerCase().trim();
    return goals.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.user?.username?.toLowerCase().includes(q) ||
        g.user?.email?.toLowerCase().includes(q)
    );
  }, [goals, searchQuery]);

  const displayGoals = isAdmin
    ? filteredGoals
    : goals.length > 0
    ? goals
    : defaultGoals;

  // Best goal for motivation banner
  const bestGoal = displayGoals[0];
  const bestGoalPct = bestGoal ? getProgress(bestGoal) || 56 : 56;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ alignItems: "center" }}>
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            {isAdmin ? "Goal Management" : "Financial Goals"}
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            {isAdmin
              ? "System-wide financial goal administration across all user accounts"
              : "Track milestone savings targets and celebrate your achievements"}
          </Text>
        </div>

        <Space size="middle" wrap>
          {isAdmin && (
            <Input
              placeholder="Search goals or user..."
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ width: 240, borderRadius: 8 }}
            />
          )}
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={openCreateModal}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                background: "#10b981",
                borderColor: "#10b981",
              }}
            >
              Add Goal
            </Button>
          )}
        </Space>
      </div>

      {/* Goal Cards Grid (Screen 7) */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 12, color: "#64748b" }}>Loading financial goals...</div>
        </div>
      ) : (
        <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
          {displayGoals.map((goal) => {
          const current = getSavedAmount(goal);
          const target = getTargetAmount(goal);
          const pct = getProgress(goal);
          const deadlineText = goal.deadline
            ? dayjs(goal.deadline).format("MMM YYYY")
            : "No deadline";

          return (
            <Col xs={24} md={12} lg={8} key={goal.id}>
              <div className="goal-card">
                <div className="goal-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="goal-icon-box">
                      {getGoalIcon(goal.title)}
                    </div>
                    {isAdmin && goal.user?.username && (
                      <Tag
                        icon={<UserOutlined />}
                        color="cyan"
                        style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}
                        title={`Assigned to: ${goal.user.username}`}
                      >
                        {goal.user.username}
                      </Tag>
                    )}
                  </div>
                  {isAdmin && (
                    <Space>
                      <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditGoal(goal)}
                        title="Edit Goal"
                      />
                      <Button
                        size="small"
                        type="dashed"
                        icon={<DollarCircleOutlined />}
                        onClick={() => openFundModal(goal)}
                        style={{ borderRadius: 6, fontSize: 12, fontWeight: 600 }}
                      >
                        Deposit
                      </Button>
                      <Popconfirm
                        title="Delete Goal"
                        description="Are you sure you want to delete this goal?"
                        onConfirm={() => handleDelete(goal.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>
                  )}
                </div>

                <div className="goal-title">{goal.title}</div>

                <div className="goal-amounts">
                  <span className="goal-current">
                    {symbol}{current.toLocaleString()}
                  </span>
                  <span className="goal-target">
                    / {symbol}{target.toLocaleString()}
                  </span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: "#64748b", fontWeight: 500 }}>Progress</span>
                    <span style={{ fontWeight: 700, color: "#10b981" }}>{pct}%</span>
                  </div>
                  <Progress
                    percent={Math.min(100, pct)}
                    strokeColor="#10b981"
                    trailColor="#f1f5f9"
                    showInfo={false}
                    strokeWidth={8}
                    style={{ margin: 0 }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                  <CalendarOutlined />
                  <span>Target Date: {deadlineText}</span>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
      )}

      {isAdmin && !loading && displayGoals.length === 0 && (
        <Empty
          description="No financial goals found matching your criteria"
          style={{ padding: "40px 0" }}
        />
      )}

      {/* Motivational Callout Banner (Screen 7 for standard users) */}
      {!isAdmin && (
        <div className="motivation-banner">
          <div className="motivation-icon">
            <BulbFilled />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#92400e" }}>
              Keep going!
            </div>
            <div style={{ fontSize: 13, color: "#b45309" }}>
              You are {bestGoalPct}% closer to your {bestGoal?.title || "Trip to Europe"} goal. Every deposit builds long-term wealth.
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        title={
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              {editingGoal ? "Edit Financial Goal" : "Add Financial Goal"}
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              {editingGoal
                ? "Update your goal parameters and savings progress"
                : "Define a savings milestone to track"}
            </span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setEditingGoal(null);
        }}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          {isAdmin && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Assigned User <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Select
                size="large"
                showSearch
                placeholder="Select a user"
                style={{ width: "100%", height: 42 }}
                value={formData.userId}
                onChange={(val) => setFormData((p) => ({ ...p, userId: val }))}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={usersList.map((u) => ({
                  value: u.id,
                  label: `${u.username} (${u.email || u.role})`,
                }))}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Goal Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Input
              size="large"
              placeholder="e.g., Trip to Europe, New Laptop"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              style={{ borderRadius: 8, height: 42 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Target Amount ({symbol}) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <InputNumber
              size="large"
              style={{ width: "100%", height: 42 }}
              min={1}
              step={100}
              placeholder="e.g., 2000"
              value={formData.targetAmount}
              onChange={(val) => setFormData((p) => ({ ...p, targetAmount: val }))}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Current Amount ({symbol})
            </label>
            <InputNumber
              size="large"
              style={{ width: "100%", height: 42 }}
              min={0}
              step={50}
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={(val) => setFormData((p) => ({ ...p, currentAmount: val }))}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Target Date (Optional)
            </label>
            <DatePicker
              size="large"
              style={{ width: "100%", height: 42 }}
              value={formData.deadline}
              onChange={(date) => setFormData((p) => ({ ...p, deadline: date }))}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button
              size="large"
              onClick={() => {
                setCreateModalOpen(false);
                setEditingGoal(null);
              }}
              style={{ borderRadius: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={saving}
              onClick={handleSave}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                background: "#10b981",
                borderColor: "#10b981",
                minWidth: 120,
              }}
            >
              {saving
                ? "Saving..."
                : editingGoal
                ? "Update Goal"
                : "Create Goal"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        title={
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Add Funds to Goal
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Deposit towards: {selectedGoal?.title}
            </span>
          </div>
        }
        open={fundModalOpen}
        onCancel={() => setFundModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Deposit Amount ({symbol}) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <InputNumber
              size="large"
              style={{ width: "100%", height: 44 }}
              min={1}
              step={50}
              placeholder="e.g., 200"
              value={fundAmount}
              onChange={(val) => setFundAmount(val)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button size="large" onClick={() => setFundModalOpen(false)} style={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={saving}
              onClick={handleAddFunds}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                background: "#10b981",
                borderColor: "#10b981",
                minWidth: 110,
              }}
            >
              Confirm Deposit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GoalsPage;