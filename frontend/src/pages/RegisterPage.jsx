import React, {
  useState,
} from "react";

import axios from "axios";

import {
  Alert,
  Button,
  Form,
  Input,
  Select,
  Typography,
} from "antd";

import {
  Link,
  useNavigate,
} from "react-router-dom";


export default function RegisterPage() {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const navigate = useNavigate();


  const submit = async (values) => {

    setLoading(true);
    setError("");
    setSuccess("");


    try {

      const response =
        await axios.post(
          "/api/auth/register",
          {
            username: values.username,
            password: values.password,
            preferredCurrency:
              values.preferredCurrency,
            role: "ROLE_USER",
          }
        );


      const data = response.data;


      setSuccess(
        typeof data === "string"
          ? data
          : "User registered successfully"
      );


      setTimeout(() => {
        navigate("/login");
      }, 500);


    } catch (error) {

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Registration failed";


      setError(
        typeof message === "string"
          ? message
          : "Registration failed"
      );


    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="brand">
          Mint
          <span>Matrix</span>
        </div>

        <Typography.Paragraph>
          Create your account
        </Typography.Paragraph>


        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{
              marginBottom: 12,
            }}
          />
        )}


        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            style={{
              marginBottom: 12,
            }}
          />
        )}


        <Form
          layout="vertical"
          onFinish={submit}
          initialValues={{
            preferredCurrency: "USD",
          }}
        >

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message:
                  "Please enter your username",
              },
            ]}
          >
            <Input
              placeholder="Username"
            />
          </Form.Item>


          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 4,
                message:
                  "Password must contain at least 4 characters",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
            />
          </Form.Item>


          <Form.Item
            label="Preferred Currency"
            name="preferredCurrency"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Select
              options={[
                {
                  value: "USD",
                  label: "USD - US Dollar",
                },
                {
                  value: "INR",
                  label: "INR - Indian Rupee",
                },
                {
                  value: "EUR",
                  label: "EUR - Euro",
                },
                {
                  value: "GBP",
                  label: "GBP - Pound Sterling",
                },
              ]}
            />

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


        <div
          style={{
            textAlign: "center",
            marginTop: 18,
          }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}