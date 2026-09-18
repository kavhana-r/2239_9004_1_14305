import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const API_URL = "http://localhost:8080/api/goals";

// ============================================================
// CURRENCY
// ============================================================

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

const getPreferredCurrency = () => {
  return (
    localStorage.getItem("preferredCurrency") ||
    localStorage.getItem("currency") ||
    "INR"
  );
};

// ============================================================
// AUTH HEADERS
// ============================================================

const getHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ============================================================
// GOALS PAGE
// ============================================================

const GoalsPage = () => {
  const [form] = Form.useForm();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [currency, setCurrency] = useState(getPreferredCurrency());

  // ============================================================
  // FETCH GOALS
  // ============================================================

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, {
        headers: getHeaders(),
      });

      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch goals error:", error);

      if (error.response?.status === 401) {
        message.error("Please login again.");
      } else {
        message.error("Unable to load goals.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();

    const preferredCurrency =
      localStorage.getItem("preferredCurrency") ||
      localStorage.getItem("currency") ||
      "INR";

    setCurrency(preferredCurrency);
  }, [fetchGoals]);

  // ============================================================
  // OPEN CREATE MODAL
  // ============================================================

  const openCreateModal = () => {
    setEditingGoal(null);

    form.resetFields();

    form.setFieldsValue({
      currentAmount: 0,
    });

    setModalOpen(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (goal) => {
    setEditingGoal(goal);

    form.setFieldsValue({
      name: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      targetDate: goal.deadline
        ? dayjs(goal.deadline)
        : null,
    });

    setModalOpen(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setModalOpen(false);
    setEditingGoal(null);
    form.resetFields();
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      /*
       * IMPORTANT:
       *
       * Frontend form:
       * name
       * targetDate
       *
       * Backend Goal.java:
       * title
       * deadline
       *
       * Therefore we convert the names here.
       */

      const payload = {
        title: values.name.trim(),
        targetAmount: Number(values.targetAmount),
        currentAmount: Number(values.currentAmount || 0),
        deadline: values.targetDate
          ? values.targetDate.format("YYYY-MM-DD")
          : null,
      };

      console.log("Goal payload:", payload);

      if (editingGoal) {
        // ======================================================
        // UPDATE
        // ======================================================

        await axios.put(
          `${API_URL}/${editingGoal.id}`,
          payload,
          {
            headers: getHeaders(),
          }
        );

        message.success("Goal updated successfully!");
      } else {
        // ======================================================
        // CREATE
        // ======================================================

        await axios.post(
          API_URL,
          payload,
          {
            headers: getHeaders(),
          }
        );

        message.success("Goal created successfully!");
      }

      setModalOpen(false);
      setEditingGoal(null);
      form.resetFields();

      await fetchGoals();

    } catch (error) {
      console.error("Goal submit error:", error);

      console.error(
        "Server response:",
        error.response?.data
      );

      const status = error.response?.status;

      if (status === 401) {
        message.error("Session expired. Please login again.");
      } else if (status === 403) {
        message.error(
          "You do not have permission to modify this goal."
        );
      } else if (status === 400) {
        const serverMessage = error.response?.data;

        message.error(
          typeof serverMessage === "string"
            ? serverMessage
            : "Please check the goal details."
        );
      } else if (status === 500) {
        message.error(
          "Server error while saving the goal."
        );
      } else {
        message.error(
          "Unable to submit. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteGoal = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: getHeaders(),
        }
      );

      message.success("Goal deleted successfully!");

      await fetchGoals();

    } catch (error) {
      console.error("Delete goal error:", error);

      if (error.response?.status === 403) {
        message.error(
          "You do not have permission to delete this goal."
        );
      } else {
        message.error(
          "Unable to delete goal."
        );
      }
    }
  };

  // ============================================================
  // ADD FUNDS
  // ============================================================

  const addFunds = async (goal) => {
    const amountText = window.prompt(
      `Enter amount to add to "${goal.title}":`
    );

    if (amountText === null) {
      return;
    }

    const amount = Number(amountText);

    if (!amount || amount <= 0) {
      message.error(
        "Please enter a valid amount."
      );
      return;
    }

    try {
      await axios.put(
        `${API_URL}/${goal.id}/add-funds`,
        null,
        {
          params: {
            amount,
          },
          headers: getHeaders(),
        }
      );

      message.success(
        "Funds added successfully!"
      );

      await fetchGoals();

    } catch (error) {
      console.error("Add funds error:", error);

      if (error.response?.status === 403) {
        message.error(
          "You do not have permission to modify this goal."
        );
      } else {
        message.error(
          "Unable to add funds."
        );
      }
    }
  };

  // ============================================================
  // FORMAT MONEY
  // ============================================================

  const formatMoney = (amount) => {
    const symbol =
      currencySymbols[currency] || currency;

    return `${symbol} ${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ============================================================
  // TABLE
  // ============================================================

  const columns = [
    {
      title: "Goal",
      dataIndex: "title",
      key: "title",

      render: (title) => (
        <Space>
          <WalletOutlined />
          <Text strong>{title}</Text>
        </Space>
      ),
    },

    {
      title: "Target",
      dataIndex: "targetAmount",
      key: "targetAmount",

      render: (amount) => (
        <Text strong>
          {formatMoney(amount)}
        </Text>
      ),
    },

    {
      title: "Saved",
      dataIndex: "currentAmount",
      key: "currentAmount",

      render: (amount) => (
        <Text>
          {formatMoney(amount)}
        </Text>
      ),
    },

    {
      title: "Progress",
      key: "progress",

      render: (_, record) => {
        const target =
          Number(record.targetAmount || 0);

        const current =
          Number(record.currentAmount || 0);

        const percent =
          target > 0
            ? Math.min(
                100,
                Math.round(
                  (current / target) * 100
                )
              )
            : 0;

        return (
          <Space
            direction="vertical"
            style={{ width: 150 }}
          >
            <Progress
              percent={percent}
              size="small"
            />

            <Text type="secondary">
              {percent}% completed
            </Text>
          </Space>
        );
      },
    },

    {
      title: "Target Date",
      dataIndex: "deadline",
      key: "deadline",

      render: (date) => {
        if (!date) {
          return "-";
        }

        return (
          <Tag color="blue">
            {dayjs(date).format("DD/MM/YYYY")}
          </Tag>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",

      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              addFunds(record)
            }
          >
            Add Funds
          </Button>

          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() =>
              openEditModal(record)
            }
          />

          <Popconfirm
            title="Delete this goal?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() =>
              deleteGoal(record.id)
            }
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        padding: 24,
      }}
    >
      <Card>
        <Space
          direction="vertical"
          size={4}
          style={{
            width: "100%",
          }}
        >
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div>
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
                and celebrate your achievements.
              </Text>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Goal
            </Button>
          </Space>

          <div
            style={{
              marginTop: 24,
            }}
          >
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 50,
                }}
              >
                <Spin size="large" />
              </div>
            ) : goals.length === 0 ? (
              <Empty
                description="No financial goals yet"
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openCreateModal}
                >
                  Create Your First Goal
                </Button>
              </Empty>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={goals}
                pagination={{
                  pageSize: 5,
                }}
              />
            )}
          </div>
        </Space>
      </Card>

      {/* ========================================================
          CREATE / EDIT MODAL
          ======================================================== */}

      <Modal
        title={
          editingGoal
            ? "Edit Financial Goal"
            : "Create Financial Goal"
        }
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Goal Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter a goal name",
              },
              {
                max: 100,
                message:
                  "Goal name cannot exceed 100 characters",
              },
            ]}
          >
            <Input
              placeholder="Example: Trip to Goa"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label={`Target Amount (${currency})`}
            name="targetAmount"
            rules={[
              {
                required: true,
                message:
                  "Please enter target amount",
              },
              {
                validator: (_, value) => {
                  if (
                    value !== undefined &&
                    value !== null &&
                    Number(value) > 0
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Target amount must be greater than zero"
                    )
                  );
                },
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={0.01}
              precision={2}
              prefix={
                currencySymbols[currency] ||
                currency
              }
              placeholder="50000"
            />
          </Form.Item>

          <Form.Item
            label={`Current Amount (${currency})`}
            name="currentAmount"
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={0}
              precision={2}
              prefix={
                currencySymbols[currency] ||
                currency
              }
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            label="Target Date"
            name="targetDate"
            rules={[
              {
                required: true,
                message:
                  "Please select target date",
              },
            ]}
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              format="DD/MM/YYYY"
              placeholder="Select target date"
            />
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: 0,
              marginTop: 24,
            }}
          >
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={closeModal}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
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

