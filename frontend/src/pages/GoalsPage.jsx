import React, { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  message,
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
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";

// ============================================================
// CURRENCY SYMBOL
// ============================================================

const getCurrencySymbol = (currency) => {
  switch (String(currency || "INR").toUpperCase()) {
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
      return "$";
    default:
      return "$";
  }
};

// ============================================================
// INITIAL FORM
// ============================================================

const getInitialForm = () => ({
  title: "",
  targetAmount: null,
  currentAmount: 0,
  deadline: null,
  userId: null,
});

// ============================================================
// GOAL ICON
// ============================================================

const getGoalIcon = (title = "") => {
  const text = String(title).toLowerCase();

  if (
    text.includes("trip") ||
    text.includes("travel") ||
    text.includes("vacation") ||
    text.includes("europe")
  ) {
    return (
      <RocketFilled
        style={{
          color: "#0ea5e9",
          fontSize: 28,
        }}
      />
    );
  }

  if (
    text.includes("laptop") ||
    text.includes("pc") ||
    text.includes("computer") ||
    text.includes("tech") ||
    text.includes("phone")
  ) {
    return (
      <LaptopOutlined
        style={{
          color: "#3b82f6",
          fontSize: 28,
        }}
      />
    );
  }

  if (
    text.includes("emergency") ||
    text.includes("health") ||
    text.includes("safety") ||
    text.includes("fund")
  ) {
    return (
      <SafetyCertificateOutlined
        style={{
          color: "#10b981",
          fontSize: 28,
        }}
      />
    );
  }

  if (
    text.includes("car") ||
    text.includes("vehicle") ||
    text.includes("bike")
  ) {
    return (
      <CarOutlined
        style={{
          color: "#f59e0b",
          fontSize: 28,
        }}
      />
    );
  }

  if (
    text.includes("house") ||
    text.includes("home") ||
    text.includes("rent")
  ) {
    return (
      <HomeOutlined
        style={{
          color: "#8b5cf6",
          fontSize: 28,
        }}
      />
    );
  }

  return (
    <RocketFilled
      style={{
        color: "#10b981",
        fontSize: 28,
      }}
    />
  );
};

// ============================================================
// GOALS PAGE
// ============================================================

function GoalsPage() {
  // ==========================================================
  // AUTH USER
  // ==========================================================

  const authUser = useSelector(
    (state) => state?.auth?.user
  );

  // ==========================================================
  // GET ROLE
  // IMPORTANT:
  // URL IS NOT USED TO DETERMINE ADMIN ACCESS
  // ==========================================================

  const getStoredUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      return null;
    }
  };

  const storedUser = getStoredUser();

  const role =
    authUser?.role ||
    authUser?.user?.role ||
    storedUser?.role ||
    storedUser?.user?.role ||
    localStorage.getItem("role") ||
    "";

  const normalizedRole = String(role)
    .trim()
    .toUpperCase();

  const isAdmin =
    normalizedRole === "ROLE_ADMIN" ||
    normalizedRole === "ADMIN";

  // ==========================================================
  // USER ID
  // ==========================================================

  const currentUserId =
    authUser?.id ||
    authUser?.user?.id ||
    storedUser?.id ||
    storedUser?.user?.id ||
    localStorage.getItem("userId") ||
    null;

  // ==========================================================
  // CURRENCY
  // ==========================================================

  const getStoredCurrency = () => {
    const stored =
      localStorage.getItem(
        "preferredCurrency"
      ) ||
      localStorage.getItem("currency") ||
      localStorage.getItem(
        "activeCurrency"
      ) ||
      authUser?.preferredCurrency ||
      authUser?.user?.preferredCurrency ||
      storedUser?.preferredCurrency ||
      "INR";

    return String(stored).toUpperCase();
  };

  const [currency, setCurrency] =
    useState(getStoredCurrency());

  // ==========================================================
  // STATE
  // ==========================================================

  const [goals, setGoals] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [goalModalOpen, setGoalModalOpen] =
    useState(false);

  const [fundModalOpen, setFundModalOpen] =
    useState(false);

  const [editingGoal, setEditingGoal] =
    useState(null);

  const [selectedGoal, setSelectedGoal] =
    useState(null);

  const [fundAmount, setFundAmount] =
    useState(null);

  const [formData, setFormData] =
    useState(getInitialForm());

  // ==========================================================
  // AUTH CONFIG
  // ==========================================================

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "application/json",
      },
    };
  };

  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  const getErrorMessage = (
    error,
    fallback
  ) => {
    const responseData =
      error?.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (
      typeof responseData === "string"
    ) {
      return responseData;
    }

    if (
      error?.response?.status === 401
    ) {
      return "Session expired. Please login again.";
    }

    if (
      error?.response?.status === 403
    ) {
      return "Access denied. Only administrators can perform this action.";
    }

    return fallback;
  };

  // ==========================================================
  // CURRENCY EVENT
  // ==========================================================

  useEffect(() => {
    const handleCurrencyChange = (
      event
    ) => {
      const newCurrency =
        event?.detail ||
        localStorage.getItem(
          "preferredCurrency"
        ) ||
        localStorage.getItem(
          "currency"
        ) ||
        localStorage.getItem(
          "activeCurrency"
        ) ||
        "INR";

      setCurrency(
        String(
          newCurrency
        ).toUpperCase()
      );
    };

    window.addEventListener(
      "currencyChange",
      handleCurrencyChange
    );

    window.addEventListener(
      "mintmatrix-currency-change",
      handleCurrencyChange
    );

    return () => {
      window.removeEventListener(
        "currencyChange",
        handleCurrencyChange
      );

      window.removeEventListener(
        "mintmatrix-currency-change",
        handleCurrencyChange
      );
    };
  }, []);

  // ==========================================================
  // NORMALIZE RESPONSE
  // ==========================================================

  const normalizeList = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (
      Array.isArray(data?.content)
    ) {
      return data.content;
    }

    if (
      Array.isArray(data?.goals)
    ) {
      return data.goals;
    }

    if (
      Array.isArray(data?.users)
    ) {
      return data.users;
    }

    if (
      Array.isArray(data?.data)
    ) {
      return data.data;
    }

    return [];
  };

  // ==========================================================
  // GET GOAL ID
  // ==========================================================

  const getGoalId = (goal) => {
    return (
      goal?.id ??
      goal?.goalId ??
      goal?._id
    );
  };

  // ==========================================================
  // GET SAVED AMOUNT
  // ==========================================================

  const getSavedAmount = (goal) => {
    const amount =
      goal?.currentAmount ??
      goal?.savedAmount ??
      goal?.amountSaved ??
      0;

    const value = Number(amount);

    return Number.isFinite(value)
      ? value
      : 0;
  };

  // ==========================================================
  // GET TARGET AMOUNT
  // ==========================================================

  const getTargetAmount = (goal) => {
    const amount =
      goal?.targetAmount ??
      goal?.target ??
      0;

    const value = Number(amount);

    return Number.isFinite(value)
      ? value
      : 0;
  };

  // ==========================================================
  // GET DEADLINE
  // ==========================================================

  const getDeadline = (goal) => {
    return (
      goal?.deadline ??
      goal?.targetDate ??
      goal?.endDate ??
      null
    );
  };

  // ==========================================================
  // GET USER NAME
  // ==========================================================

  const getGoalUserName = (goal) => {
    return (
      goal?.user?.username ||
      goal?.user?.name ||
      goal?.user?.email ||
      goal?.username ||
      goal?.userName ||
      goal?.email ||
      ""
    );
  };

  // ==========================================================
  // FETCH GOALS
  // USER + ADMIN BOTH USE GET /api/goals
  // BACKEND CONTROLS ACCESS
  // ==========================================================

  const fetchGoals = async () => {
    try {
      setLoading(true);

      const response =
        await axios.get(
          `${API_BASE_URL}/goals`,
          getAuthConfig()
        );

      const goalList =
        normalizeList(
          response?.data
        );

      setGoals(goalList);
    } catch (error) {
      console.error(
        "Fetch goals error:",
        error
      );

      setGoals([]);

      message.error(
        getErrorMessage(
          error,
          "Unable to load goals."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // FETCH USERS
  // ONLY ADMIN
  // ==========================================================

  const fetchUsers = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const response =
        await axios.get(
          `${API_BASE_URL}/admin/users`,
          getAuthConfig()
        );

      const list =
        normalizeList(
          response?.data
        );

      setUsersList(list);
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      setUsersList([]);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchGoals();

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const getProgress = (goal) => {
    const target =
      getTargetAmount(goal);

    const saved =
      getSavedAmount(goal);

    if (target <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (saved / target) * 100
        )
      )
    );
  };

  // ==========================================================
  // FORMAT MONEY
  // ==========================================================

  const formatMoney = (amount) => {
    const value = Number(
      amount || 0
    );

    return `${getCurrencySymbol(
      currency
    )}${value.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================================
  // FILTER GOALS
  // ==========================================================

  const filteredGoals = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (!query) {
      return goals;
    }

    return goals.filter(
      (goal) => {
        const title =
          String(
            goal?.title ||
              goal?.goalName ||
              ""
          ).toLowerCase();

        const username =
          String(
            getGoalUserName(goal)
          ).toLowerCase();

        return (
          title.includes(query) ||
          username.includes(query)
        );
      }
    );
  }, [goals, searchQuery]);

  // ==========================================================
  // OPEN ADD MODAL
  // ADMIN ONLY
  // ==========================================================

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      message.error(
        "Only administrators can create goals."
      );
      return;
    }

    setEditingGoal(null);

    setFormData({
      ...getInitialForm(),
      userId: null,
    });

    setGoalModalOpen(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ADMIN ONLY
  // ==========================================================

  const handleOpenEditModal = (
    goal
  ) => {
    if (!isAdmin) {
      message.error(
        "Only administrators can edit goals."
      );
      return;
    }

    const deadline =
      getDeadline(goal);

    let parsedDeadline = null;

    if (deadline) {
      const parsed =
        dayjs(deadline);

      if (parsed.isValid()) {
        parsedDeadline = parsed;
      }
    }

    setEditingGoal(goal);

    setFormData({
      title:
        goal?.title ||
        goal?.goalName ||
        "",
      targetAmount:
        getTargetAmount(goal),
      currentAmount:
        getSavedAmount(goal),
      deadline:
        parsedDeadline,
      userId:
        goal?.userId ||
        goal?.user?.id ||
        null,
    });

    setGoalModalOpen(true);
  };

  // ==========================================================
  // CLOSE GOAL MODAL
  // ==========================================================

  const handleCloseGoalModal =
    () => {
      if (saving) {
        return;
      }

      setGoalModalOpen(false);
      setEditingGoal(null);
      setFormData(
        getInitialForm()
      );
    };

  // ==========================================================
  // UPDATE FORM
  // ==========================================================

  const updateForm = (
    field,
    value
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  // ==========================================================
  // SAVE GOAL
  // ADMIN ONLY
  // ==========================================================

  const handleSaveGoal =
    async () => {
      if (!isAdmin) {
        message.error(
          "Only administrators can create or update goals."
        );
        return;
      }

      const title = String(
        formData.title || ""
      ).trim();

      const targetAmount =
        Number(
          formData.targetAmount
        );

      const currentAmount =
        formData.currentAmount ===
          null ||
        formData.currentAmount ===
          undefined ||
        formData.currentAmount ===
          ""
          ? 0
          : Number(
              formData.currentAmount
            );

      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!title) {
        message.warning(
          "Please enter a goal name."
        );
        return;
      }

      if (
        !Number.isFinite(
          targetAmount
        ) ||
        targetAmount <= 0
      ) {
        message.warning(
          "Target amount must be greater than 0."
        );
        return;
      }

      if (
        !Number.isFinite(
          currentAmount
        ) ||
        currentAmount < 0
      ) {
        message.warning(
          "Current amount cannot be negative."
        );
        return;
      }

      if (
        currentAmount >
        targetAmount
      ) {
        message.warning(
          "Current amount cannot be greater than target amount."
        );
        return;
      }

      if (
        !editingGoal &&
        !formData.userId
      ) {
        message.warning(
          "Please select a user."
        );
        return;
      }

      try {
        setSaving(true);

        const payload = {
          title,
          targetAmount,
          currentAmount,
          deadline:
            formData.deadline
              ? formData.deadline.format(
                  "YYYY-MM-DD"
                )
              : null,
        };

        // ----------------------------------------------------
        // USER ID
        // ----------------------------------------------------

        if (formData.userId) {
          payload.userId =
            Number(
              formData.userId
            );
        }

        console.log(
          "========== GOAL REQUEST =========="
        );

        console.log(
          "Admin:",
          isAdmin
        );

        console.log(
          "Payload:",
          payload
        );

        // ----------------------------------------------------
        // UPDATE
        // ----------------------------------------------------

        if (editingGoal) {
          const goalId =
            getGoalId(
              editingGoal
            );

          if (!goalId) {
            message.error(
              "Goal ID not found."
            );
            return;
          }

          await axios.put(
            `${API_BASE_URL}/goals/${goalId}`,
            payload,
            getAuthConfig()
          );

          message.success(
            "Goal updated successfully."
          );
        }

        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        else {
          await axios.post(
            `${API_BASE_URL}/goals`,
            payload,
            getAuthConfig()
          );

          message.success(
            "Goal added successfully."
          );
        }

        console.log(
          "================================="
        );

        setGoalModalOpen(false);
        setEditingGoal(null);
        setFormData(
          getInitialForm()
        );

        await fetchGoals();
      } catch (error) {
        console.error(
          "Save goal error:",
          error
        );

        console.error(
          "Status:",
          error?.response?.status
        );

        console.error(
          "Response:",
          error?.response?.data
        );

        message.error(
          getErrorMessage(
            error,
            editingGoal
              ? "Failed to update goal."
              : "Failed to add goal."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // DELETE GOAL
  // ADMIN ONLY
  // ==========================================================

  const handleDeleteGoal =
    async (goal) => {
      if (!isAdmin) {
        message.error(
          "Only administrators can delete goals."
        );
        return;
      }

      const goalId =
        getGoalId(goal);

      if (!goalId) {
        message.error(
          "Goal ID not found."
        );
        return;
      }

      try {
        setSaving(true);

        await axios.delete(
          `${API_BASE_URL}/goals/${goalId}`,
          getAuthConfig()
        );

        message.success(
          "Goal deleted successfully."
        );

        await fetchGoals();
      } catch (error) {
        console.error(
          "Delete goal error:",
          error
        );

        console.error(
          "Status:",
          error?.response?.status
        );

        console.error(
          "Response:",
          error?.response?.data
        );

        message.error(
          getErrorMessage(
            error,
            "Failed to delete goal."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // OPEN FUND MODAL
  // ADMIN ONLY
  // ==========================================================

  const handleOpenFundModal =
    (goal) => {
      if (!isAdmin) {
        message.error(
          "Only administrators can add funds."
        );
        return;
      }

      setSelectedGoal(goal);
      setFundAmount(null);
      setFundModalOpen(true);
    };

  // ==========================================================
  // CLOSE FUND MODAL
  // ==========================================================

  const handleCloseFundModal =
    () => {
      if (saving) {
        return;
      }

      setFundModalOpen(false);
      setSelectedGoal(null);
      setFundAmount(null);
    };

  // ==========================================================
  // ADD FUNDS
  // ADMIN ONLY
  // ==========================================================

  const handleAddFunds =
    async () => {
      if (!isAdmin) {
        message.error(
          "Only administrators can add funds."
        );
        return;
      }

      const amount =
        Number(fundAmount);

      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        message.warning(
          "Please enter a valid deposit amount."
        );
        return;
      }

      if (!selectedGoal) {
        message.error(
          "Goal not selected."
        );
        return;
      }

      const goalId =
        getGoalId(
          selectedGoal
        );

      if (!goalId) {
        message.error(
          "Goal ID not found."
        );
        return;
      }

      const current =
        getSavedAmount(
          selectedGoal
        );

      const target =
        getTargetAmount(
          selectedGoal
        );

      if (
        current + amount >
        target
      ) {
        message.warning(
          "Deposit cannot make the saved amount greater than the target."
        );
        return;
      }

      try {
        setSaving(true);

        // ====================================================
        // Existing backend endpoint
        // PUT /api/goals/{id}/add-funds?amount=...
        // ====================================================

        await axios.put(
          `${API_BASE_URL}/goals/${goalId}/add-funds?amount=${amount}`,
          null,
          getAuthConfig()
        );

        message.success(
          "Funds added successfully."
        );

        setFundModalOpen(false);
        setSelectedGoal(null);
        setFundAmount(null);

        await fetchGoals();
      } catch (error) {
        console.error(
          "Add funds error:",
          error
        );

        console.error(
          "Status:",
          error?.response?.status
        );

        console.error(
          "Response:",
          error?.response?.data
        );

        message.error(
          getErrorMessage(
            error,
            "Failed to add funds."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // USER OPTIONS
  // ==========================================================

  const userOptions =
    usersList
      .filter(Boolean)
      .map((user) => ({
        value: user.id,
        label:
          user.username ||
          user.name ||
          user.email ||
          `User ${user.id}`,
      }));

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{
          marginBottom: 24,
        }}
      >
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
            }}
          >
            Financial Goals
          </Title>

          <Text type="secondary">
            Track milestone savings targets
            and celebrate your achievements
          </Text>
        </Col>

        <Col>
          <Space>
            {isAdmin && (
              <Input
                allowClear
                prefix={
                  <SearchOutlined />
                }
                placeholder="Search goals..."
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target
                      .value
                  )
                }
                style={{
                  width: 220,
                }}
              />
            )}

            {/* ============================================
                ADD GOAL
                ADMIN ONLY
            ============================================ */}

            {isAdmin && (
              <Button
                type="primary"
                icon={
                  <PlusOutlined />
                }
                onClick={
                  handleOpenAddModal
                }
              >
                Add Goal
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* =====================================================
          CURRENCY
      ===================================================== */}

      <Card
        size="small"
        style={{
          marginBottom: 24,
          borderRadius: 12,
        }}
      >
        <Space>
          <DollarCircleOutlined />

          <Text strong>
            Currency
          </Text>

          <Tag color="green">
            {currency} (
            {getCurrencySymbol(
              currency
            )}
            )
          </Tag>
        </Space>
      </Card>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div
          style={{
            minHeight: 300,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : filteredGoals.length ===
        0 ? (
        /* =================================================
           EMPTY
        ================================================= */

        <Card
          style={{
            borderRadius: 16,
            textAlign: "center",
            padding: 40,
          }}
        >
          <Empty
            description={
              searchQuery
                ? "No matching goals found"
                : "No financial goals yet"
            }
          />

          {/* USER DOES NOT GET CREATE BUTTON */}

          {isAdmin &&
            !searchQuery && (
              <Button
                type="primary"
                icon={
                  <PlusOutlined />
                }
                onClick={
                  handleOpenAddModal
                }
              >
                Add Your First Goal
              </Button>
            )}
        </Card>
      ) : (
        /* =================================================
           GOALS
        ================================================= */

        <Row gutter={[20, 20]}>
          {filteredGoals.map(
            (goal) => {
              const goalId =
                getGoalId(goal);

              const saved =
                getSavedAmount(
                  goal
                );

              const target =
                getTargetAmount(
                  goal
                );

              const progress =
                getProgress(
                  goal
                );

              const achieved =
                progress >= 100;

              const deadline =
                getDeadline(
                  goal
                );

              return (
                <Col
                  xs={24}
                  sm={12}
                  lg={8}
                  key={goalId}
                >
                  <Card
                    hoverable
                    style={{
                      height:
                        "100%",
                      borderRadius:
                        18,
                    }}
                  >
                    {/* =====================================
                        TITLE
                    ===================================== */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 10,
                        marginBottom:
                          18,
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius:
                              14,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#eef9f1",
                          }}
                        >
                          {getGoalIcon(
                            goal?.title ||
                              goal?.goalName
                          )}
                        </div>

                        <div>
                          <Text
                            strong
                            style={{
                              fontSize:
                                17,
                              display:
                                "block",
                            }}
                          >
                            {goal?.title ||
                              goal?.goalName ||
                              "Untitled Goal"}
                          </Text>

                          {/* ADMIN CAN SEE USER */}

                          {isAdmin &&
                            getGoalUserName(
                              goal
                            ) && (
                              <Tag
                                icon={
                                  <UserOutlined />
                                }
                                style={{
                                  marginTop:
                                    5,
                                }}
                              >
                                {getGoalUserName(
                                  goal
                                )}
                              </Tag>
                            )}
                        </div>
                      </div>

                      {achieved && (
                        <Tag color="green">
                          Goal Achieved
                        </Tag>
                      )}
                    </div>

                    {/* =====================================
                        AMOUNT
                    ===================================== */}

                    <div
                      style={{
                        marginBottom:
                          12,
                      }}
                    >
                      <Text
                        strong
                        style={{
                          fontSize:
                            20,
                        }}
                      >
                        {formatMoney(
                          saved
                        )}
                      </Text>

                      <Text type="secondary">
                        {" "}
                        /{" "}
                        {formatMoney(
                          target
                        )}
                      </Text>
                    </div>

                    {/* =====================================
                        PROGRESS
                    ===================================== */}

                    <Text
                      type="secondary"
                      style={{
                        display:
                          "block",
                        marginBottom:
                          6,
                      }}
                    >
                      Progress
                    </Text>

                    <Progress
                      percent={
                        progress
                      }
                      status={
                        achieved
                          ? "success"
                          : "active"
                      }
                    />

                    {/* =====================================
                        DATE
                    ===================================== */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: 10,
                        marginTop:
                          8,
                        marginBottom:
                          18,
                      }}
                    >
                      <Text type="secondary">
                        {progress}%
                      </Text>

                      {deadline && (
                        <Text type="secondary">
                          <CalendarOutlined />{" "}
                          Target Date:{" "}
                          {dayjs(
                            deadline
                          ).isValid()
                            ? dayjs(
                                deadline
                              ).format(
                                "DD MMM YYYY"
                              )
                            : String(
                                deadline
                              )}
                        </Text>
                      )}
                    </div>

                    {/* =====================================
                        ACTIONS
                    ===================================== */}

                    <Space
                      style={{
                        width:
                          "100%",
                      }}
                      size="small"
                    >
                      {/* ==================================
                          ADMIN ONLY: EDIT
                      ================================== */}

                      {isAdmin && (
                        <Button
                          icon={
                            <EditOutlined />
                          }
                          onClick={() =>
                            handleOpenEditModal(
                              goal
                            )
                          }
                          disabled={
                            saving
                          }
                        >
                          Edit
                        </Button>
                      )}

                      {/* ==================================
                          ADMIN ONLY: DEPOSIT
                      ================================== */}

                      {isAdmin && (
                        <Button
                          type="primary"
                          icon={
                            <DollarCircleOutlined />
                          }
                          onClick={() =>
                            handleOpenFundModal(
                              goal
                            )
                          }
                          disabled={
                            saving ||
                            achieved
                          }
                        >
                          Deposit
                        </Button>
                      )}

                      {/* ==================================
                          ADMIN ONLY: DELETE
                      ================================== */}

                      {isAdmin && (
                        <Popconfirm
                          title="Delete this goal?"
                          description="This action cannot be undone."
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{
                            danger:
                              true,
                          }}
                          onConfirm={() =>
                            handleDeleteGoal(
                              goal
                            )
                          }
                        >
                          <Button
                            danger
                            icon={
                              <DeleteOutlined />
                            }
                            disabled={
                              saving
                            }
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  </Card>
                </Col>
              );
            }
          )}
        </Row>
      )}

      {/* =====================================================
          USER MOTIVATIONAL MESSAGE
      ===================================================== */}

      {!isAdmin &&
        filteredGoals.length >
          0 && (
          <Card
            style={{
              marginTop: 24,
              borderRadius: 16,
              background:
                "#f1faf3",
              border:
                "1px solid #d8efdd",
            }}
          >
            <Space align="start">
              <BulbFilled
                style={{
                  fontSize: 24,
                  color: "#3c8c58",
                }}
              />

              <div>
                <Text
                  strong
                  style={{
                    display:
                      "block",
                    fontSize: 16,
                  }}
                >
                  Keep going!
                </Text>

                <Text type="secondary">
                  Every deposit brings
                  you closer to your
                  financial goals.
                </Text>
              </div>
            </Space>
          </Card>
        )}

      {/* =====================================================
          ADD / EDIT GOAL MODAL
          ADMIN ONLY
      ===================================================== */}

      {isAdmin && (
        <Modal
          open={
            goalModalOpen
          }
          title={
            editingGoal
              ? "Edit Goal"
              : "Add New Goal"
          }
          onCancel={
            handleCloseGoalModal
          }
          onOk={
            handleSaveGoal
          }
          okText={
            editingGoal
              ? "Update Goal"
              : "Add Goal"
          }
          confirmLoading={
            saving
          }
        >
          {/* ===============================================
              GOAL NAME
          =============================================== */}

          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display:
                  "block",
                marginBottom: 8,
              }}
            >
              Goal Name
            </Text>

            <Input
              placeholder="Example: Trip to Europe"
              value={
                formData.title
              }
              onChange={(
                event
              ) =>
                updateForm(
                  "title",
                  event.target
                    .value
                )
              }
            />
          </div>

          {/* ===============================================
              TARGET AMOUNT
          =============================================== */}

          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display:
                  "block",
                marginBottom: 8,
              }}
            >
              Target Amount
            </Text>

            <InputNumber
              style={{
                width:
                  "100%",
              }}
              min={0}
              precision={2}
              placeholder="Enter target amount"
              value={
                formData.targetAmount
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "targetAmount",
                  value
                )
              }
              prefix={getCurrencySymbol(
                currency
              )}
            />
          </div>

          {/* ===============================================
              CURRENT AMOUNT
          =============================================== */}

          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display:
                  "block",
                marginBottom: 8,
              }}
            >
              Current Saved Amount
            </Text>

            <InputNumber
              style={{
                width:
                  "100%",
              }}
              min={0}
              precision={2}
              placeholder="Enter current amount"
              value={
                formData.currentAmount
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "currentAmount",
                  value
                )
              }
              prefix={getCurrencySymbol(
                currency
              )}
            />
          </div>

          {/* ===============================================
              TARGET DATE
          =============================================== */}

          <div
            style={{
              marginBottom: 18,
            }}
          >
            <Text
              strong
              style={{
                display:
                  "block",
                marginBottom: 8,
              }}
            >
              Target Date
            </Text>

            <DatePicker
              style={{
                width:
                  "100%",
              }}
              format="DD MMM YYYY"
              value={
                formData.deadline
              }
              onChange={(
                date
              ) =>
                updateForm(
                  "deadline",
                  date
                )
              }
              placeholder="Select target date"
            />
          </div>

          {/* ===============================================
              USER
          =============================================== */}

          <div>
            <Text
              strong
              style={{
                display:
                  "block",
                marginBottom: 8,
              }}
            >
              Assign User
            </Text>

            <Select
              showSearch
              allowClear
              style={{
                width:
                  "100%",
              }}
              placeholder="Select user"
              optionFilterProp="label"
              value={
                formData.userId
              }
              options={
                userOptions
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "userId",
                  value
                )
              }
            />
          </div>
        </Modal>
      )}

      {/* =====================================================
          DEPOSIT MODAL
          ADMIN ONLY
      ===================================================== */}

      {isAdmin && (
        <Modal
          open={
            fundModalOpen
          }
          title="Add Funds"
          onCancel={
            handleCloseFundModal
          }
          onOk={
            handleAddFunds
          }
          okText="Add Funds"
          confirmLoading={
            saving
          }
        >
          {selectedGoal && (
            <div>
              <div
                style={{
                  marginBottom:
                    18,
                }}
              >
                <Text type="secondary">
                  Goal
                </Text>

                <Text
                  strong
                  style={{
                    display:
                      "block",
                    fontSize: 18,
                  }}
                >
                  {selectedGoal?.title ||
                    selectedGoal?.goalName ||
                    "Goal"}
                </Text>
              </div>

              <div
                style={{
                  marginBottom:
                    18,
                }}
              >
                <Text type="secondary">
                  Current Progress
                </Text>

                <Text
                  strong
                  style={{
                    display:
                      "block",
                  }}
                >
                  {formatMoney(
                    getSavedAmount(
                      selectedGoal
                    )
                  )}{" "}
                  /{" "}
                  {formatMoney(
                    getTargetAmount(
                      selectedGoal
                    )
                  )}
                </Text>
              </div>

              <Text
                strong
                style={{
                  display:
                    "block",
                  marginBottom:
                    8,
                }}
              >
                Deposit Amount
              </Text>

              <InputNumber
                autoFocus
                style={{
                  width:
                    "100%",
                }}
                min={0}
                precision={2}
                placeholder="Enter deposit amount"
                value={
                  fundAmount
                }
                onChange={
                  setFundAmount
                }
                prefix={getCurrencySymbol(
                  currency
                )}
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default GoalsPage;