import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";

import { UserAddOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    preferredCurrency: "USD",
    role: "ROLE_USER",
  });

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      message.error("Username is required.");
      return;
    }

    if (!formData.password) {
      message.error("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username: formData.username.trim(),
          password: formData.password,
          preferredCurrency: formData.preferredCurrency,
          role: formData.role,
        }
      );

      console.log("Registration response:", response.data);

      message.success("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      } else if (error.request) {
        errorMessage =
          "Cannot connect to backend. Make sure Spring Boot is running.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card
        className="auth-card"
        style={{ maxWidth: 470, width: "100%" }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div className="brand-icon">
            <UserAddOutlined />
          </div>

          <Title level={2}>Create Account</Title>

          <Text type="secondary">
            Start managing your finances with MintMatrix
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            required
          >
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                handleChange(
                  "username",
                  e.target.value
                )
              }
            />
          </Form.Item>

          <Form.Item
            label="Password"
            required
          >
            <Input.Password
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                handleChange(
                  "password",
                  e.target.value
                )
              }
            />
          </Form.Item>

          <Form.Item label="Preferred Currency">
            <Select
              value={formData.preferredCurrency}
              onChange={(value) =>
                handleChange(
                  "preferredCurrency",
                  value
                )
              }
              options={[
                {
                  value: "USD",
                  label: "USD - US Dollar",
                },
                {
                  value: "EUR",
                  label: "EUR - Euro",
                },
                {
                  value: "INR",
                  label: "INR - Indian Rupee",
                },
                {
                  value: "GBP",
                  label: "GBP - British Pound",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Account Type">
            <Select
              value={formData.role}
              onChange={(value) =>
                handleChange("role", value)
              }
              options={[
                {
                  value: "ROLE_USER",
                  label: "Regular User",
                },
                {
                  value: "ROLE_ADMIN",
                  label: "Administrator",
                },
              ]}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Register
          </Button>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <Text type="secondary">
            Already have an account?{" "}
          </Text>

          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;