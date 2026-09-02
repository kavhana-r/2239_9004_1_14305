import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Popconfirm,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import axios from "axios";

const { Title } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/admin/users"
      );

      const data = response?.data;

      setUsers(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user) => {
    try {
      await axios.delete(
        `/api/admin/users/${user.id}`
      );

      message.success(
        "User deleted successfully"
      );

      await fetchUsers();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to delete user."
      );
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (username) => (
        <span>
          <UserOutlined
            style={{ marginRight: 8 }}
          />
          {username}
        </span>
      ),
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const isAdmin =
          role === "ROLE_ADMIN" ||
          role === "ADMIN";

        return (
          <Tag color={isAdmin ? "gold" : "blue"}>
            {isAdmin ? "ADMIN" : "USER"}
          </Tag>
        );
      },
    },

    {
      title: "Preferred Currency",
      dataIndex: "preferredCurrency",
      key: "preferredCurrency",
      render: (currency, record) =>
        currency ||
        record?.currency ||
        "-",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this user?"
          onConfirm={() =>
            deleteUser(record)
          }
        >
          <Button
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        User Management
      </Title>

      <Card>
        <Table
          rowKey={(record) => record.id}
          loading={loading}
          columns={columns}
          dataSource={users}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}

export default UserManagement;