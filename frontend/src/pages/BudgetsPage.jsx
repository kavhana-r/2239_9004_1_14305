import React, { useEffect, useState } from "react";
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
  Empty,
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
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    month: "January",
    year: new Date().getFullYear(),
    limitAmount: null,
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/budgets"
      );

      const data = response?.data;

      setBudgets(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      month: "January",
      year: new Date().getFullYear(),
      limitAmount: null,
    });

    setModalOpen(true);
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
      message.error(
        "Limit amount must be at least 1"
      );
      return;
    }

    try {
      setSaving(true);

      await axios.post("/api/budgets", {
        month: formData.month,
        year: Number(formData.year),
        limitAmount: Number(
          formData.limitAmount
        ),
      });

      message.success(
        "Budget set successfully"
      );

      setModalOpen(false);

      await fetchBudgets();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to set budget."
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

    if (limit <= 0) {
      return 0;
    }

    return Math.round(
      (getSpent(budget) / limit) * 100
    );
  };

  const getProgressStatus = (percent) => {
    if (percent >= 100) {
      return "exception";
    }

    if (percent >= 80) {
      return "active";
    }

    return "success";
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={2}>Budget Planning</Title>
          <Text type="secondary">
            Set monthly spending limits and monitor your progress.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openModal}
        >
          Set Monthly Budget
        </Button>
      </div>

      {budgets.length === 0 && !loading ? (
        <Card>
          <Empty description="No budgets set yet. Start by setting a monthly limit." />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {budgets.map((budget, index) => {
            const spent = getSpent(budget);
            const limit = getLimit(budget);
            const percent = getPercent(budget);

            return (
              <Col
                xs={24}
                sm={12}
                lg={8}
                key={budget?.id || index}
              >
                <Card
                  title={`${budget?.month || ""} ${
                    budget?.year || ""
                  }`}
                  loading={loading}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Spent</Text>
                    <Text strong>
                      ${spent.toFixed(2)}
                    </Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <Text>Limit</Text>
                    <Text strong>
                      ${limit.toFixed(2)}
                    </Text>
                  </div>

                  <Progress
                    percent={Math.min(
                      percent,
                      100
                    )}
                    status={getProgressStatus(
                      percent
                    )}
                  />

                  {percent >= 100 && (
                    <Text
                      type="danger"
                      strong
                    >
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
        open={modalOpen}
        title="Set Monthly Budget"
        onCancel={() =>
          setModalOpen(false)
        }
        onOk={handleSubmit}
        confirmLoading={saving}
      >
        <div style={{ marginTop: 10 }}>
          <label>Month</label>

          <Select
            value={formData.month}
            onChange={(value) =>
              setFormData({
                ...formData,
                month: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 16,
            }}
            options={months.map((month) => ({
              value: month,
              label: month,
            }))}
          />

          <label>Year</label>

          <InputNumber
            value={formData.year}
            onChange={(value) =>
              setFormData({
                ...formData,
                year: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Limit Amount</label>

          <InputNumber
            min={1}
            precision={2}
            value={formData.limitAmount}
            onChange={(value) =>
              setFormData({
                ...formData,
                limitAmount: value,
              })
            }
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

export default BudgetsPage;