import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Alert,
  Switch,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../store/slices/authSlice";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // =========================
  // PASSWORD CHECK
  // =========================

  const checkPassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  // =========================
  // PASSWORD CRITERIA
  // =========================

  const criteriaItem = (valid, text) => (
    <div
      style={{
        fontSize: "13px",
        marginBottom: "4px",
        color: valid ? "#389e0d" : "#8c8c8c",
      }}
    >
      {valid ? "✓" : "○"} {text}
    </div>
  );

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (values) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await dispatch(
        register({
          username: values.username.trim(),
          password: values.password,
          preferredCurrency: values.preferredCurrency || "USD",
          role: isAdminRegister ? "ROLE_ADMIN" : "ROLE_USER",
        })
      ).unwrap();

      console.log("Registration successful:", result);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      form.resetFields();

      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      let message = "Registration failed. Please try again.";

      if (typeof err === "string") {
        message = err;
      } else if (err?.message) {
        message = err.message;
      } else if (err?.error) {
        message = err.error;
      } else if (err?.data?.message) {
        message = err.data.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        }}
        styles={{
          body: {
            padding: "35px",
          },
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: "8px",
              color: "#2f5d50",
            }}
          >
            Create Account
          </Title>

          <Text type="secondary">
            Create your MintMatrix account
          </Text>
        </div>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            style={{
              marginBottom: "20px",
            }}
          />
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            style={{
              marginBottom: "20px",
            }}
          />
        )}

        {/* =========================
            ADMIN SWITCH
        ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            marginBottom: "24px",
            background: "#f6ffed",
            border: "1px solid #d9f7be",
            borderRadius: "10px",
          }}
        >
          <div>
            <Text strong>
              Register as Administrator
            </Text>

            <br />

            <Text
              type="secondary"
              style={{
                fontSize: "12px",
              }}
            >
              {isAdminRegister
                ? "Administrator account"
                : "Standard user account"}
            </Text>
          </div>

          <Switch
            checked={isAdminRegister}
            onChange={(checked) => {
              setIsAdminRegister(checked);
            }}
          />
        </div>

        {/* =========================
            FORM
        ========================= */}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          autoComplete="off"
        >
          {/* USERNAME */}

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username",
              },
              {
                min: 3,
                message:
                  "Username must contain at least 3 characters",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username"
              size="large"
            />
          </Form.Item>

          {/* PASSWORD */}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                min: 8,
                message:
                  "Password must contain at least 8 characters",
              },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const valid =
                    value.length >= 8 &&
                    /[A-Z]/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[^A-Za-z0-9]/.test(value);

                  if (!valid) {
                    return Promise.reject(
                      new Error(
                        "Password does not meet all requirements"
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
              onChange={(e) =>
                checkPassword(e.target.value)
              }
            />
          </Form.Item>

          {/* PASSWORD REQUIREMENTS */}

          <div
            style={{
              marginTop: "-12px",
              marginBottom: "20px",
              padding: "12px 14px",
              background: "#fafafa",
              borderRadius: "8px",
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                marginBottom: "8px",
              }}
            >
              Password requirements
            </Text>

            {criteriaItem(
              passwordCriteria.length,
              "At least 8 characters"
            )}

            {criteriaItem(
              passwordCriteria.uppercase,
              "One uppercase letter"
            )}

            {criteriaItem(
              passwordCriteria.lowercase,
              "One lowercase letter"
            )}

            {criteriaItem(
              passwordCriteria.number,
              "One number"
            )}

            {criteriaItem(
              passwordCriteria.special,
              "One special character"
            )}
          </div>

          {/* PREFERRED CURRENCY */}

          <Form.Item
            label="Preferred Currency"
            name="preferredCurrency"
            initialValue="USD"
            rules={[
              {
                required: true,
                message:
                  "Please select your preferred currency",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select currency"
              options={[
                {
                  value: "USD",
                  label: "USD - US Dollar ($)",
                },
                {
                  value: "EUR",
                  label: "EUR - Euro (€)",
                },
                {
                  value: "GBP",
                  label: "GBP - British Pound (£)",
                },
                {
                  value: "INR",
                  label: "INR - Indian Rupee (₹)",
                },
                {
                  value: "JPY",
                  label: "JPY - Japanese Yen (¥)",
                },
                {
                  value: "CAD",
                  label: "CAD - Canadian Dollar",
                },
                {
                  value: "AUD",
                  label: "AUD - Australian Dollar",
                },
              ]}
            />
          </Form.Item>

          {/* ACCOUNT TYPE */}

          <div
            style={{
              padding: "12px 14px",
              marginBottom: "22px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Text type="secondary">
              Account type:{" "}
            </Text>

            <Text strong>
              {isAdminRegister
                ? "Administrator"
                : "Standard User"}
            </Text>
          </div>

          {/* REGISTER BUTTON */}

          <Form.Item
            style={{
              marginBottom: "15px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: "48px",
                borderRadius: "8px",
                background: "#2f5d50",
                borderColor: "#2f5d50",
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </Form.Item>

          {/* LOGIN LINK */}

          <div
            style={{
              textAlign: "center",
            }}
          >
            <Text type="secondary">
              Already have an account?{" "}
            </Text>

            <Button
              type="link"
              onClick={() => navigate("/login")}
              style={{
                padding: 0,
              }}
            >
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;