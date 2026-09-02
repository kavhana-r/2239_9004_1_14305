import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";

const { Title, Text } = Typography;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      message.error("Please enter username and password");
      return;
    }

    try {
      const result = await dispatch(
        login({
          username,
          password,
        })
      ).unwrap();

      message.success("Login successful");

      if (result.role === "ROLE_ADMIN") {
        navigate("/admin/stats");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Invalid username or password";

      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 420,
          maxWidth: "100%",
          borderRadius: 12,
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          MintMatrix
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          Multi-Currency Budget Analytics
        </Text>

        <Form onSubmitCapture={handleSubmit} layout="vertical">
          <Form.Item label="Username" required>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Log in
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text>Don't have an account? </Text>
          <Link to="/register">register now!</Link>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;