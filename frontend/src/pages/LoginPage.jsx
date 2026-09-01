import React, { useState } from "react";

import axios from "axios";

import {
  Alert,
  Button,
  Form,
  Input,
  Typography,
} from "antd";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import {
  login,
} from "../store/slices/authSlice";


export default function LoginPage() {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const navigate = useNavigate();
  const dispatch = useDispatch();


  const submit = async (values) => {

    setLoading(true);
    setError("");


    try {

      const response =
        await axios.post(
          "/api/auth/login",
          {
            username: values.username,
            password: values.password,
          }
        );


      const data = response.data;


      dispatch(
        login({
          token: data.token,

          user: {
            username:
              data.username ||
              values.username,

            role:
              data.role ||
              "ROLE_USER",
          },
        })
      );


      const role = String(
        data.role || ""
      ).toUpperCase();


      if (role.includes("ADMIN")) {

        navigate(
          "/admin/stats",
          { replace: true }
        );

      } else {

        navigate(
          "/dashboard",
          { replace: true }
        );

      }

    } catch (error) {

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid username or password";

      setError(
        typeof message === "string"
          ? message
          : "Invalid username or password"
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
          Multi-Currency Budget Analytics Platform
        </Typography.Paragraph>


        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{
              marginBottom: 16,
            }}
          />
        )}


        <Form
          layout="vertical"
          onFinish={submit}
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
                message:
                  "Please enter your password",
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
            />
          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Login
          </Button>

        </Form>


        <div
          style={{
            textAlign: "center",
            marginTop: 18,
          }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}