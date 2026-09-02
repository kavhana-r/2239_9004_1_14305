import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Spin,
  Typography,
  Alert,
} from "antd";

import {
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import axios from "axios";

const { Title, Text } = Typography;

function Dashboard() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currency: "USD",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/api/dashboard/summary"
      );

      const data = response?.data || {};

      setSummary({
        totalBalance: Number(data.totalBalance || 0),
        totalIncome: Number(data.totalIncome || 0),
        totalExpense: Number(data.totalExpense || 0),
        currency: data.currency || "USD",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load financial summary."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "INR":
        return "₹";

      case "EUR":
        return "€";

      case "GBP":
        return "£";

      case "USD":
      default:
        return "$";
    }
  };

  const symbol = getCurrencySymbol(summary.currency);

  if (loading) {
    return (
      <div
        style={{
          minHeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Heading */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Financial Overview</Title>

        <Text type="secondary">
          Track your financial performance at a glance.
        </Text>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          message={error}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />
      )}

      {/* Statistics */}
      <Row gutter={[20, 20]}>
        {/* Total Balance */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Balance"
              value={summary.totalBalance}
              precision={2}
              prefix={symbol}
              valueStyle={{
                fontWeight: 700,
              }}
            />

            <WalletOutlined
              style={{
                fontSize: 22,
                marginTop: 10,
              }}
            />
          </Card>
        </Col>

        {/* Monthly Income */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Monthly Income"
              value={summary.totalIncome}
              precision={2}
              prefix={symbol}
              valueStyle={{
                fontWeight: 700,
              }}
            />

            <ArrowUpOutlined
              style={{
                fontSize: 22,
                marginTop: 10,
              }}
            />
          </Card>
        </Col>

        {/* Monthly Expenses */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Monthly Expenses"
              value={summary.totalExpense}
              precision={2}
              prefix={symbol}
              valueStyle={{
                fontWeight: 700,
              }}
            />

            <ArrowDownOutlined
              style={{
                fontSize: 22,
                marginTop: 10,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;