import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, clearError } from "../store/slices/authSlice";

const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [form] = Form.useForm();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Login failed";

      message.error(errorMsg);
      setLocalError(errorMsg);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (values) => {
    setLocalError(null);

    try {
      const result = await dispatch(
        login({
          username: values.username,
          password: values.password,
        })
      ).unwrap();

      message.success("Login successful");

      const role = result?.role;

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        navigate("/admin/stats");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.message ||
            err?.response?.data?.message ||
            "Login failed";

      message.error(errorMsg);
      setLocalError(errorMsg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          MintMatrix
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username",
              },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              type="password"
            />
          </Form.Item>

          {localError && (
            <div style={{ color: "red", marginBottom: 10 }}>
              {localError}
            </div>
          )}

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Log in
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          Don't have an account? <Link to="/register">register now!</Link>
        </div>
      </Card>
    </div>
  );
}