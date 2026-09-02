import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Tag,
  Typography,
  Empty,
  message,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [fundModalOpen, setFundModalOpen] =
    useState(false);

  const [selectedGoal, setSelectedGoal] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: null,
    deadline: null,
  });

  const [fundAmount, setFundAmount] =
    useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/goals"
      );

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

  const getSavedAmount = (goal) =>
    Number(
      goal?.savedAmount ??
        goal?.currentAmount ??
        0
    );

  const getTargetAmount = (goal) =>
    Number(
      goal?.targetAmount ?? 0
    );

  const getProgress = (goal) => {
    const target = getTargetAmount(goal);

    if (target <= 0) {
      return 0;
    }

    return Math.round(
      (getSavedAmount(goal) / target) * 100
    );
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      targetAmount: null,
      deadline: null,
    });

    setCreateModalOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      message.error("Title is required");
      return;
    }

    if (
      formData.targetAmount === null ||
      Number(formData.targetAmount) <= 0
    ) {
      message.error(
        "Target amount must be greater than 0"
      );
      return;
    }

    if (!formData.deadline) {
      message.error("Deadline is required");
      return;
    }

    try {
      setSaving(true);

      await axios.post("/api/goals", {
        title: formData.title.trim(),
        targetAmount: Number(
          formData.targetAmount
        ),
        deadline: dayjs(
          formData.deadline
        ).format("YYYY-MM-DD"),
        savedAmount: 0,
      });

      message.success(
        "Goal created successfully"
      );

      setCreateModalOpen(false);

      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to create goal."
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
    if (
      fundAmount === null ||
      Number(fundAmount) <= 0
    ) {
      message.error(
        "Fund amount must be greater than 0"
      );
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `/api/goals/${selectedGoal.id}/add-funds?amount=${Number(
          fundAmount
        )}`
      );

      message.success(
        "Funds added to goal"
      );

      setFundModalOpen(false);

      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to add funds."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (goal) => {
    try {
      await axios.delete(
        `/api/goals/${goal.id}`
      );

      message.success("Goal deleted");

      await fetchGoals();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to delete goal."
      );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={2}>Savings Goals</Title>
          <Text type="secondary">
            Set targets and build your savings.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Create New Goal
        </Button>
      </div>

      {goals.length === 0 && !loading ? (
        <Card>
          <Empty description="No savings goals yet. Set a target and start saving!" />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {goals.map((goal, index) => {
            const saved =
              getSavedAmount(goal);

            const target =
              getTargetAmount(goal);

            const progress =
              getProgress(goal);

            return (
              <Col
                xs={24}
                sm={12}
                lg={8}
                key={goal?.id || index}
              >
                <Card loading={loading}>
                  <Title level={4}>
                    {goal?.title}
                  </Title>

                  <div className="goal-row">
                    <Text>
                      Target Amount
                    </Text>

                    <Text strong>
                      ${target.toFixed(2)}
                    </Text>
                  </div>

                  <div className="goal-row">
                    <Text>
                      Saved Amount
                    </Text>

                    <Text strong>
                      ${saved.toFixed(2)}
                    </Text>
                  </div>

                  <div className="goal-row">
                    <Text>Deadline</Text>

                    <Text>
                      {goal?.deadline
                        ? dayjs(
                            goal.deadline
                          ).format(
                            "DD MMM YYYY"
                          )
                        : "-"}
                    </Text>
                  </div>

                  <Progress
                    percent={Math.min(
                      progress,
                      100
                    )}
                  />

                  {progress > 100 && (
                    <Tag
                      color="green"
                      style={{
                        marginBottom: 12,
                      }}
                    >
                      Goal Achieved!
                    </Tag>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() =>
                        openFundModal(goal)
                      }
                    >
                      Add Funds
                    </Button>

                    <Popconfirm
                      title="Delete this goal?"
                      onConfirm={() =>
                        handleDelete(goal)
                      }
                    >
                      <Button danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Create Goal Modal */}
      <Modal
        open={createModalOpen}
        title="Create New Goal"
        onCancel={() =>
          setCreateModalOpen(false)
        }
        onOk={handleCreate}
        confirmLoading={saving}
      >
        <div style={{ marginTop: 10 }}>
          <label>Title</label>

          <Input
            placeholder="e.g., New Car, Vacation"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            style={{
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Target Amount</label>

          <InputNumber
            min={0.01}
            precision={2}
            value={formData.targetAmount}
            onChange={(value) =>
              setFormData({
                ...formData,
                targetAmount: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Deadline</label>

          <DatePicker
            value={formData.deadline}
            onChange={(value) =>
              setFormData({
                ...formData,
                deadline: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
            }}
          />
        </div>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        open={fundModalOpen}
        title={`Add Funds to ${
          selectedGoal?.title || ""
        }`}
        onCancel={() =>
          setFundModalOpen(false)
        }
        onOk={handleAddFunds}
        confirmLoading={saving}
      >
        <div style={{ marginTop: 10 }}>
          <label>Amount</label>

          <InputNumber
            min={0.01}
            precision={2}
            value={fundAmount}
            onChange={setFundAmount}
            style={{
              width: "100%",
              marginTop: 6,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default GoalsPage;