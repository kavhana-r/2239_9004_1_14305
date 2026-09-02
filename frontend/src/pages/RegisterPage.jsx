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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";

const { Title } = Typography;

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.auth.loading);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await dispatch(register(values)).unwrap();

      message.success("Registration successful! Please login.");
      form.resetFields();
      navigate("/login");
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || "Registration failed";

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
      <Card style={{ width: 450, maxWidth: "100%", borderRadius: 12 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Create Account
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            preferredCurrency: "INR",
            role: "ROLE_USER",
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Preferred Currency"
            name="preferredCurrency"
            rules={[
              {
                required: true,
                message: "Preferred Currency is required",
              },
            ]}
          >
            <Select>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="EUR">EUR</Select.Option>
              <Select.Option value="INR">INR</Select.Option>
              <Select.Option value="GBP">GBP</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="role"
            rules={[
              {
                required: true,
                message: "Account Type is required",
              },
            ]}
          >
            <Select>
              <Select.Option value="ROLE_USER">
                ROLE_USER (Regular User)
              </Select.Option>

              <Select.Option value="ROLE_ADMIN">
                ROLE_ADMIN (Administrator)
              </Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Register
          </Button>
        </Form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;