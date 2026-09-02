import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
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

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [form] = Form.useForm();

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(
        "/api/budgets",
        getConfig()
      );

      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setBudgets([]);
      message.error("Unable to load budgets.");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await axios.post(
        "/api/budgets",
        values,
        getConfig()
      );

      message.success("Budget set successfully");

      setModalOpen(false);
      form.resetFields();

      await fetchBudgets();
    } catch (error) {
      message.error("Unable to save budget.");
    }
  };

  const getMonthName = (month) => {
    return months[Number(month) - 1] || month;
  };

  const getProgressStatus = (percentage) => {
    if (percentage >= 100) return "exception";
    if (percentage >= 80) return "active";
    return "success";
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>Budget Planning</Title>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Set Monthly Budget
          </Button>
        </Col>
      </Row>

      {budgets.length === 0 ? (
        <Card style={{ marginTop: 25 }}>
          <Text>
            No budgets set yet. Start by setting a monthly limit.
          </Text>
        </Card>
      ) : (
        <Row gutter={[20, 20]} style={{ marginTop: 25 }}>
          {budgets.map((budget) => {
            const spent = Number(budget.spentAmount || 0);
            const limit = Number(budget.limitAmount || 0);

            const percentage =
              limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

            const overBudget = limit > 0 && spent >= limit;

            return (
              <Col xs={24} md={12} lg={8} key={budget.id}>
                <Card
                  title={`${getMonthName(budget.month)} ${budget.year}`}
                >
                  <div style={{ marginBottom: 10 }}>
                    <Text>
                      Spent: <strong>{spent.toFixed(2)}</strong>
                    </Text>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <Text>
                      Limit: <strong>{limit.toFixed(2)}</strong>
                    </Text>
                  </div>

                  <Progress
                    percent={Number(percentage.toFixed(1))}
                    status={getProgressStatus(percentage)}
                  />

                  {overBudget && (
                    <Text type="danger" strong>
                      Over budget!
                    </Text>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title="Set Monthly Budget"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Month"
            name="month"
            rules={[
              {
                required: true,
                message: "Month is required",
              },
            ]}
          >
            <Select placeholder="Select month">
              {months.map((month, index) => (
                <Select.Option
                  key={month}
                  value={index + 1}
                >
                  {month}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Year"
            name="year"
            rules={[
              {
                required: true,
                message: "Year is required",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={2020}
              max={2100}
            />
          </Form.Item>

          <Form.Item
            label="Limit Amount"
            name="limitAmount"
            rules={[
              {
                required: true,
                message: "Limit amount is required",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              precision={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BudgetsPage;