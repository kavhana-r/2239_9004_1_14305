import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  message,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        username: values.username,
        password: values.password,
        preferredCurrency: values.preferredCurrency,
        role: values.role,
      });

      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Registration failed";

      message.error(errorMsg);
    } finally {
      setLoading(false);
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
      <Card style={{ width: 450 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Create Account
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter username",
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
                message: "Please enter password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Preferred Currency"
            name="preferredCurrency"
            rules={[
              {
                required: true,
                message: "Please select currency",
              },
            ]}
          >
            <Select placeholder="Preferred Currency">
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="INR">INR</Option>
              <Option value="GBP">GBP</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select account type",
              },
            ]}
          >
            <Select placeholder="Account Type">
              <Option value="ROLE_USER">
                ROLE_USER (Regular User)
              </Option>
              <Option value="ROLE_ADMIN">
                ROLE_ADMIN (Administrator)
              </Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Register
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}