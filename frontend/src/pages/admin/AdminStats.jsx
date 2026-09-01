import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Alert,
  Card,
  Col,
  Row,
  Statistic,
} from "antd";

import {
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function AdminStats() {

  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalTransactions: 0,
    });


  const [error, setError] =
    useState("");


  useEffect(() => {

    axios
      .get(
        "/api/admin/stats",
        auth()
      )

      .then((response) => {

        setStats(
          response.data || {}
        );

      })

      .catch(() => {

        setError(
          "Unable to load admin statistics."
        );

      });

  }, []);


  return (
    <>

      <h1 className="page-title">
        Admin Stats
      </h1>

      <p className="page-subtitle">
        System overview
      </p>


      {error && (
        <Alert
          message={error}
          type="warning"
          showIcon
          style={{
            marginBottom: 18,
          }}
        />
      )}


      <Row gutter={[18, 18]}>

        <Col xs={24} md={12}>

          <Card>

            <Statistic
              title="Total Users"
              value={
                stats.totalUsers || 0
              }
              prefix={
                <TeamOutlined />
              }
            />

          </Card>

        </Col>


        <Col xs={24} md={12}>

          <Card>

            <Statistic
              title="Total Transactions"
              value={
                stats.totalTransactions || 0
              }
              prefix={
                <TransactionOutlined />
              }
            />

          </Card>

        </Col>

      </Row>

    </>
  );
}