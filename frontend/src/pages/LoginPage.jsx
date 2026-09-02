import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from "antd";

import {
  LockOutlined,
  UserOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { login, clearError } from "../store/slices/authSlice";

const { Title, Text } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, user } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token && user) {
      const role = user?.role;

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        navigate("/admin/stats", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Login failed";

      message.error(errorMessage);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async () => {
    if (!username.trim() || !password) {
      message.error("Please enter username and password.");
      return;
    }

    try {
      await dispatch(
        login({
          username: username.trim(),
          password,
        })
      ).unwrap();

      message.success("Login successful");
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Invalid username or password";

      message.error(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <Card
        className="auth-card"
        bordered={false}
        style={{ maxWidth: 430, width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="brand-icon">
            <LoginOutlined />
          </div>

          <Title level={2} style={{ marginBottom: 4 }}>
            MintMatrix
          </Title>

          <Text type="secondary">
            Multi-Currency Budget Analytics
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" required>
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input
              prefix={<LockOutlined />}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Log in
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text type="secondary">
            Don't have an account?{" "}
          </Text>

          <Link to="/register">register now!</Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;