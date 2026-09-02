import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Typography,
  message,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [createForm] = Form.useForm();
  const [fundForm] = Form.useForm();

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchGoals = async () => {
    try {
      const response = await axios.get(
        "/api/goals",
        config()
      );

      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setGoals([]);
      message.error("Unable to load savings goals.");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const createGoal = async (values) => {
    try {
      const payload = {
        title: values.title,
        targetAmount: values.targetAmount,
        currentAmount: 0,
        deadline: values.deadline
          ? values.deadline.format("YYYY-MM-DD")
          : null,
      };

      await axios.post(
        "/api/goals",
        payload,
        config()
      );

      message.success("Goal created successfully");

      setCreateOpen(false);
      createForm.resetFields();

      await fetchGoals();
    } catch (error) {
      message.error("Unable to create goal.");
    }
  };

  const openFundModal = (goal) => {
    setSelectedGoal(goal);
    fundForm.resetFields();
    setFundOpen(true);
  };

  const addFunds = async (values) => {
    if (!selectedGoal) return;

    try {
      await axios.put(
        `/api/goals/${selectedGoal.id}/add-funds?amount=${values.amount}`,
        {},
        config()
      );

      message.success("Funds added to goal");

      setFundOpen(false);
      setSelectedGoal(null);

      await fetchGoals();
    } catch (error) {
      message.error("Unable to add funds.");
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(
        `/api/goals/${id}`,
        config()
      );

      message.success("Goal deleted");

      await fetchGoals();
    } catch (error) {
      message.error("Unable to delete goal.");
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>Savings Goals</Title>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              createForm.resetFields();
              setCreateOpen(true);
            }}
          >
            Create New Goal
          </Button>
        </Col>
      </Row>

      {goals.length === 0 ? (
        <Card style={{ marginTop: 25 }}>
          <Text>
            No savings goals yet. Set a target and start saving!
          </Text>
        </Card>
      ) : (
        <Row gutter={[20, 20]} style={{ marginTop: 25 }}>
          {goals.map((goal) => {
            const target = Number(goal.targetAmount || 0);
            const saved = Number(
              goal.currentAmount ?? goal.savedAmount ?? 0
            );

            const percentage =
              target > 0 ? Math.min((saved / target) * 100, 100) : 0;

            const achieved =
              target > 0 && saved > target;

            return (
              <Col xs={24} md={12} lg={8} key={goal.id}>
                <Card title={goal.title}>
                  <p>
                    Target: <strong>{target.toFixed(2)}</strong>
                  </p>

                  <p>
                    Saved: <strong>{saved.toFixed(2)}</strong>
                  </p>

                  <p>
                    Deadline:{" "}
                    {goal.deadline
                      ? dayjs(goal.deadline).format("DD MMM YYYY")
                      : "-"}
                  </p>

                  <Progress
                    percent={Number(percentage.toFixed(1))}
                    status={
                      achieved ? "success" : "active"
                    }
                  />

                  {achieved && (
                    <div style={{ marginBottom: 15 }}>
                      <Tag color="green">
                        Goal Achieved!
                      </Tag>
                    </div>
                  )}

                  <Row gutter={10}>
                    <Col flex="auto">
                      <Button
                        type="primary"
                        block
                        onClick={() => openFundModal(goal)}
                      >
                        Add Funds
                      </Button>
                    </Col>

                    <Col>
                      <Popconfirm
                        title="Delete this goal?"
                        onConfirm={() => deleteGoal(goal.id)}
                      >
                        <Button danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title="Create New Goal"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => createForm.submit()}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={createGoal}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Goal title is required",
              },
            ]}
          >
            <Input placeholder="e.g., New Car, Vacation" />
          </Form.Item>

          <Form.Item
            label="Target Amount"
            name="targetAmount"
            rules={[
              {
                required: true,
                message: "Target amount is required",
              },
            ]}
          >
            <InputNumber
              min={0.01}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[
              {
                required: true,
                message: "Deadline is required",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          selectedGoal
            ? `Add Funds to ${selectedGoal.title}`
            : "Add Funds"
        }
        open={fundOpen}
        onCancel={() => setFundOpen(false)}
        onOk={() => fundForm.submit()}
      >
        <Form
          form={fundForm}
          layout="vertical"
          onFinish={addFunds}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Amount is required",
              },
            ]}
          >
            <InputNumber
              min={0.01}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default GoalsPage;