import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message,
  Space,
} from "antd";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${
      localStorage.getItem("token") || ""
    }`,
  },
});

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  // Load categories
  const loadCategories = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "/api/categories",
        getAuthConfig()
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data?.content)) {
        setCategories(data.content);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);

      message.error(
        "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Add category
  const handleSubmit = async (values) => {
    setSaving(true);

    try {
      await axios.post(
        "/api/categories",
        values,
        getAuthConfig()
      );

      message.success(
        "Category added successfully."
      );

      form.resetFields();
      setOpen(false);

      await loadCategories();
    } catch (error) {
      message.error(
        "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `/api/categories/${id}`,
        getAuthConfig()
      );

      message.success(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      message.error(
        "Unable to delete category."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },

    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name) =>
        name || "-",
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span
          style={{
            color:
              type === "INCOME"
                ? "#16a34a"
                : "#dc2626",
            fontWeight: 600,
          }}
        >
          {type || "-"}
        </span>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this category?"
          description="This action cannot be undone."
          okText="Delete"
          cancelText="Cancel"
          onConfirm={() =>
            handleDelete(record.id)
          }
        >
          <Button danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            className="page-title"
            style={{
              marginBottom: 4,
            }}
          >
            Category Management
          </h1>

          <p
            className="page-subtitle"
            style={{
              margin: 0,
              color: "#667085",
            }}
          >
            Manage income and expense
            categories
          </p>
        </div>

        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      {/* Category Table */}

      <Card>
        <Table
          rowKey={(record) =>
            record.id
          }
          loading={loading}
          columns={columns}
          dataSource={categories}
          pagination={{
            pageSize: 10,
          }}
          locale={{
            emptyText:
              "No categories found",
          }}
        />
      </Card>

      {/* Add Category Modal */}

      <Modal
        title="Add Category"
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter category name",
              },
              {
                min: 2,
                message:
                  "Category name must contain at least 2 characters",
              },
            ]}
          >
            <Input
              placeholder="Enter category name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message:
                  "Please select category type",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select type"
              options={[
                {
                  value: "INCOME",
                  label: "INCOME",
                },
                {
                  value: "EXPENSE",
                  label: "EXPENSE",
                },
              ]}
            />
          </Form.Item>

          <Space
            style={{
              width: "100%",
              justifyContent:
                "flex-end",
            }}
          >
            <Button
              onClick={() => {
                form.resetFields();
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
            >
              Save Category
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}