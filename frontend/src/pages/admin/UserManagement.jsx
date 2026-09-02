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
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "/api/admin/users",
        config()
      );

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `/api/admin/users/${id}`,
        config()
      );

      message.success("User deleted successfully");

      await fetchUsers();
    } catch (error) {
      message.error("Unable to delete user.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (username) => (
        <>
          <UserOutlined style={{ marginRight: 8 }} />
          {username}
        </>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ROLE_ADMIN" ? "gold" : "blue"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Preferred Currency",
      dataIndex: "preferredCurrency",
      key: "preferredCurrency",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => deleteUser(record.id)}
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
      <Title level={2}>User Management</Title>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default UserManagement;