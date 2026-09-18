import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

// =========================================================
// API URL
// =========================================================

const API_URL = "http://localhost:8080/api/goals";

// =========================================================
// Currency symbols
// =========================================================

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

// =========================================================
// Get JWT token
// =========================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken")
  );
};

// =========================================================
// Get preferred currency
// =========================================================

const getPreferredCurrency = () => {
  return (
    localStorage.getItem("preferredCurrency") ||
    localStorage.getItem("currency") ||
    "INR"
  );
};

// =========================================================
// Format currency
// =========================================================

const formatAmount = (amount, currency) => {
  const value = Number(amount || 0);

  const symbol =
    CURRENCY_SYMBOLS[currency] || `${currency} `;

  return `${symbol}${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// =========================================================
// Goals Page
// =========================================================

const GoalsPage = () => {
  const [form] = Form.useForm();

  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingGoal, setEditingGoal] = useState(null);

  const [preferredCurrency, setPreferredCurrency] =
    useState(getPreferredCurrency());

  // =======================================================
  // Axios headers
  // =======================================================

  const getHeaders = useCallback(() => {
    const token = getToken();

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    }

    return {
      "Content-Type": "application/json",
    };
  }, []);

  // =======================================================
  // GET /api/goals
  // =======================================================

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, {
        headers: getHeaders(),
      });

      console.log("GET /api/goals response:", response.data);

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data?.content)) {
        data = response.data.content;
      } else if (Array.isArray(response.data?.data)) {
        data = response.data.data;
      }

      setGoals(data);
    } catch (error) {
      console.error("GET goals error:", error);

      if (error.response?.status === 401) {
        message.error(
          "Session expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        message.error(
          "You do not have permission to view goals."
        );
      } else if (error.response?.status === 404) {
        message.error(
          "Goals API was not found. Check the backend."
        );
      } else {
        message.error(
          "Unable to load financial goals."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // =======================================================
  // Initial load
  // =======================================================

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // =======================================================
  // Update preferred currency if changed
  // =======================================================

  useEffect(() => {
    const handleStorageChange = () => {
      setPreferredCurrency(
        getPreferredCurrency()
      );
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =======================================================
  // Open Add Goal modal
  // =======================================================

  const handleAddGoal = () => {
    setEditingGoal(null);

    form.resetFields();

    form.setFieldsValue({
      currentAmount: 0,
    });

    setModalOpen(true);
  };

  // =======================================================
  // Open Edit Goal modal
  // =======================================================

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);

    form.setFieldsValue({
      name:
        goal.name ||
        goal.goalName ||
        "",

      targetAmount: Number(
        goal.targetAmount || 0
      ),

      currentAmount: Number(
        goal.currentAmount || 0
      ),

      targetDate: goal.targetDate
        ? dayjs(goal.targetDate)
        : null,

      description:
        goal.description || "",
    });

    setModalOpen(true);
  };

  // =======================================================
  // Close modal
  // =======================================================

  const handleCancel = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditingGoal(null);

    form.resetFields();
  };

  // =======================================================
  // POST / PUT
  // =======================================================

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = {
        name: values.name.trim(),

        targetAmount: Number(
          values.targetAmount
        ),

        currentAmount: Number(
          values.currentAmount || 0
        ),

        targetDate: values.targetDate
          ? values.targetDate.format(
              "YYYY-MM-DD"
            )
          : null,

        description:
          values.description?.trim() || "",
      };

      console.log(
        "Goal request payload:",
        payload
      );

      // =================================================
      // UPDATE
      // =================================================

      if (editingGoal) {
        console.log(
          `PUT ${API_URL}/${editingGoal.id}`
        );

        await axios.put(
          `${API_URL}/${editingGoal.id}`,
          payload,
          {
            headers: getHeaders(),
          }
        );

        message.success(
          "Goal updated successfully."
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        console.log(
          `POST ${API_URL}`
        );

        await axios.post(
          API_URL,
          payload,
          {
            headers: getHeaders(),
          }
        );

        message.success(
          "Goal created successfully."
        );
      }

      setModalOpen(false);

      setEditingGoal(null);

      form.resetFields();

      await fetchGoals();
    } catch (error) {
      console.error(
        "Create/Update goal error:",
        error
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data;

      if (error.response?.status === 400) {
        message.error(
          typeof backendMessage === "string"
            ? backendMessage
            : "Invalid goal data."
        );
      } else if (
        error.response?.status === 401
      ) {
        message.error(
          "Session expired. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        message.error(
          "You do not have permission to modify goals."
        );
      } else if (
        error.response?.status === 404
      ) {
        message.error(
          "Goal API endpoint was not found."
        );
      } else {
        message.error(
          editingGoal
            ? "Unable to update goal."
            : "Unable to create goal."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // DELETE /api/goals/{id}
  // =======================================================

  const handleDelete = async (goalId) => {
    try {
      console.log(
        `DELETE ${API_URL}/${goalId}`
      );

      await axios.delete(
        `${API_URL}/${goalId}`,
        {
          headers: getHeaders(),
        }
      );

      message.success(
        "Goal deleted successfully."
      );

      await fetchGoals();
    } catch (error) {
      console.error(
        "DELETE goal error:",
        error
      );

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (
        error.response?.status === 401
      ) {
        message.error(
          "Session expired. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        message.error(
          "You do not have permission to delete this goal."
        );
      } else if (
        error.response?.status === 404
      ) {
        message.error(
          "Goal was not found."
        );
      } else {
        message.error(
          backendMessage ||
            "Unable to delete goal."
        );
      }
    }
  };

  // =======================================================
  // Calculate progress
  // =======================================================

  const calculateProgress = (goal) => {
    const target = Number(
      goal.targetAmount || 0
    );

    const current = Number(
      goal.currentAmount || 0
    );

    if (target <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (current / target) * 100
        )
      )
    );
  };

  // =======================================================
  // Statistics
  // =======================================================

  const statistics = useMemo(() => {
    let target = 0;

    let current = 0;

    goals.forEach((goal) => {
      target += Number(
        goal.targetAmount || 0
      );

      current += Number(
        goal.currentAmount || 0
      );
    });

    const progress =
      target > 0
        ? Math.min(
            100,
            Math.round(
              (current / target) * 100
            )
          )
        : 0;

    return {
      target,
      current,
      progress,
    };
  }, [goals]);

  // =======================================================
  // Loading screen
  // =======================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Space
          direction="vertical"
          align="center"
        >
          <Spin size="large" />

          <Text type="secondary">
            Loading financial goals...
          </Text>
        </Space>
      </div>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 24,
        }}
      >
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
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
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddGoal}
          >
            Add Goal
          </Button>
        </Col>
      </Row>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      {goals.length > 0 && (
        <Row
          gutter={[16, 16]}
          style={{
            marginBottom: 24,
          }}
        >
          <Col
            xs={24}
            sm={8}
          >
            <Card
              style={{
                borderRadius: 12,
              }}
            >
              <Text type="secondary">
                Total Goals
              </Text>

              <Title
                level={3}
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {goals.length}
              </Title>
            </Card>
          </Col>

          <Col
            xs={24}
            sm={8}
          >
            <Card
              style={{
                borderRadius: 12,
              }}
            >
              <Text type="secondary">
                Total Saved
              </Text>

              <Title
                level={3}
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {formatAmount(
                  statistics.current,
                  preferredCurrency
                )}
              </Title>
            </Card>
          </Col>

          <Col
            xs={24}
            sm={8}
          >
            <Card
              style={{
                borderRadius: 12,
              }}
            >
              <Text type="secondary">
                Total Target
              </Text>

              <Title
                level={3}
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {formatAmount(
                  statistics.target,
                  preferredCurrency
                )}
              </Title>
            </Card>
          </Col>
        </Row>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {goals.length === 0 ? (
        <Card
          style={{
            borderRadius: 14,
            textAlign: "center",
            padding: "50px 20px",
          }}
        >
          <Empty
            image={
              <TrophyOutlined
                style={{
                  fontSize: 60,
                  opacity: 0.45,
                }}
              />
            }
            description={
              <Space
                direction="vertical"
                size={4}
              >
                <Text strong>
                  No financial goals yet
                </Text>

                <Text type="secondary">
                  Create your first savings goal
                  to start tracking your progress.
                </Text>
              </Space>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddGoal}
            >
              Create Your First Goal
            </Button>
          </Empty>
        </Card>
      ) : (
        /* =================================================
           GOAL CARDS
        ================================================= */

        <Row gutter={[20, 20]}>
          {goals.map((goal) => {
            const progress =
              calculateProgress(goal);

            const goalName =
              goal.name ||
              goal.goalName ||
              "Financial Goal";

            const targetAmount =
              Number(
                goal.targetAmount || 0
              );

            const currentAmount =
              Number(
                goal.currentAmount || 0
              );

            return (
              <Col
                xs={24}
                sm={12}
                lg={8}
                key={goal.id}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 14,
                  }}
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() =>
                        handleEditGoal(goal)
                      }
                    >
                      Edit
                    </Button>,

                    <Popconfirm
                      key="delete"
                      title="Delete this goal?"
                      description={`Are you sure you want to delete "${goalName}"?`}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{
                        danger: true,
                      }}
                      onConfirm={() =>
                        handleDelete(
                          goal.id
                        )
                      }
                    >
                      <Button
                        type="text"
                        danger
                        icon={
                          <DeleteOutlined />
                        }
                      >
                        Delete
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  {/* Goal Header */}

                  <Space
                    align="start"
                    style={{
                      width: "100%",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          "rgba(82, 196, 26, 0.12)",
                      }}
                    >
                      <TrophyOutlined
                        style={{
                          fontSize: 21,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Title
                        level={4}
                        style={{
                          margin: 0,
                        }}
                      >
                        {goalName}
                      </Title>

                      {goal.targetDate && (
                        <Text type="secondary">
                          Target:{" "}
                          {dayjs(
                            goal.targetDate
                          ).format(
                            "DD MMM YYYY"
                          )}
                        </Text>
                      )}
                    </div>

                    <Tag
                      color={
                        progress >= 100
                          ? "green"
                          : "blue"
                      }
                    >
                      {progress}%
                    </Tag>
                  </Space>

                  {/* Progress */}

                  <Progress
                    percent={progress}
                    status={
                      progress >= 100
                        ? "success"
                        : "active"
                    }
                    strokeWidth={10}
                  />

                  {/* Amount */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginTop: 10,
                      marginBottom: 12,
                    }}
                  >
                    <Text strong>
                      {formatAmount(
                        currentAmount,
                        preferredCurrency
                      )}
                    </Text>

                    <Text type="secondary">
                      /{" "}
                      {formatAmount(
                        targetAmount,
                        preferredCurrency
                      )}
                    </Text>
                  </div>

                  {/* Description */}

                  {goal.description && (
                    <Paragraph
                      type="secondary"
                      ellipsis={{
                        rows: 2,
                      }}
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      {goal.description}
                    </Paragraph>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <Modal
        open={modalOpen}
        title={
          editingGoal
            ? "Edit Financial Goal"
            : "Create Financial Goal"
        }
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Goal Name */}

          <Form.Item
            label="Goal Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter a goal name.",
              },
              {
                max: 100,
                message:
                  "Goal name cannot exceed 100 characters.",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="e.g. Emergency Fund"
            />
          </Form.Item>

          {/* Target Amount */}

          <Form.Item
            label={`Target Amount (${preferredCurrency})`}
            name="targetAmount"
            rules={[
              {
                required: true,
                message:
                  "Please enter the target amount.",
              },
              {
                validator: (_, value) => {
                  if (
                    value === undefined ||
                    value === null
                  ) {
                    return Promise.resolve();
                  }

                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error(
                        "Target amount must be greater than 0."
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              size="large"
              style={{
                width: "100%",
              }}
              min={0}
              precision={2}
              placeholder="100000"
              prefix={
                CURRENCY_SYMBOLS[
                  preferredCurrency
                ] ||
                preferredCurrency
              }
            />
          </Form.Item>

          {/* Current Amount */}

          <Form.Item
            label={`Current Amount (${preferredCurrency})`}
            name="currentAmount"
            rules={[
              {
                validator: (_, value) => {
                  if (
                    value === undefined ||
                    value === null
                  ) {
                    return Promise.resolve();
                  }

                  if (Number(value) < 0) {
                    return Promise.reject(
                      new Error(
                        "Current amount cannot be negative."
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              size="large"
              style={{
                width: "100%",
              }}
              min={0}
              precision={2}
              placeholder="0"
              prefix={
                CURRENCY_SYMBOLS[
                  preferredCurrency
                ] ||
                preferredCurrency
              }
            />
          </Form.Item>

          {/* Target Date */}

          <Form.Item
            label="Target Date"
            name="targetDate"
            rules={[
              {
                required: true,
                message:
                  "Please select a target date.",
              },
            ]}
          >
            <DatePicker
              size="large"
              style={{
                width: "100%",
              }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          {/* Description */}

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="Add a short description for this goal..."
            />
          </Form.Item>

          {/* Buttons */}

          <Form.Item
            style={{
              marginBottom: 0,
              textAlign: "right",
            }}
          >
            <Space>
              <Button
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
              >
                {editingGoal
                  ? "Update Goal"
                  : "Create Goal"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
