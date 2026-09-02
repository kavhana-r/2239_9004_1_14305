import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  List,
  Row,
  Statistic,
  Typography,
  message,
} from "antd";
import {
  TeamOutlined,
  TransactionOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStats(response.data || {});
      } catch (error) {
        message.error("Unable to load system statistics.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Title level={2}>
        System Statistics & Analytics
      </Title>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Total Registered Users"
              value={stats.totalUsers || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Total Transactions Processed"
              value={stats.totalTransactions || 0}
              prefix={<TransactionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="System Reports"
        style={{ marginTop: 25 }}
      >
        <List
          dataSource={[
            "User Growth Report",
            "Transaction Volume Report",
            "Currency Usage Analytics",
          ]}
          renderItem={(item) => (
            <List.Item>
              <BarChartOutlined style={{ marginRight: 10 }} />
              {item}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default AdminStats;