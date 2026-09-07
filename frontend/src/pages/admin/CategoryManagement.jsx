import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import axios from "axios";

const { Title } = Typography;

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
  });

  // Fetch categories when page loads
  useEffect(() => {
    fetchCategories();
  }, []);

  // Get all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/categories");

      const data = response?.data;

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);

      message.error("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  // Open add category modal
  const openModal = () => {
    setFormData({
      name: "",
      type: "EXPENSE",
    });

    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    if (!saving) {
      setModalOpen(false);
    }
  };

  // Add category
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      message.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      await axios.post("/api/categories", {
        name: formData.name.trim(),
        type: formData.type,
      });

      message.success("Category added successfully");

      setModalOpen(false);

      setFormData({
        name: "",
        type: "EXPENSE",
      });

      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);

      message.error(
        error?.response?.data?.message ||
          "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (category) => {
    try {
      await axios.delete(
        `/api/categories/${category.id}`
      );

      message.success("Category deleted successfully");

      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);

      message.error(
        error?.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",

      render: (type) => (
        <Tag
          color={
            type === "INCOME"
              ? "green"
              : "red"
          }
        >
          {type}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",

      render: (_, record) => (
        <Popconfirm
          title="Delete this category?"
          description="Are you sure you want to delete this category?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            handleDelete(record)
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
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title
          level={2}
          style={{ margin: 0 }}
        >
          Category Management
        </Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openModal}
        >
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={{
            pageSize: 10,
          }}
          locale={{
            emptyText: "No categories found",
          }}
        />
      </Card>

      {/* Add Category Modal */}
      <Modal
        open={modalOpen}
        title="Add Category"
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Add Category"
        cancelText="Cancel"
      >
        <div style={{ marginTop: 10 }}>
          {/* Category Name */}
          <label
            htmlFor="category-name"
            style={{
              display: "block",
              marginBottom: 6,
            }}
          >
            Name
          </label>

          <Input
            id="category-name"
            placeholder="e.g. Salary, Groceries"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            onPressEnter={handleSubmit}
            style={{
              marginBottom: 16,
            }}
          />

          {/* Category Type */}
          <label
            htmlFor="category-type"
            style={{
              display: "block",
              marginBottom: 6,
            }}
          >
            Type
          </label>

          <Select
            id="category-type"
            value={formData.type}
            onChange={(value) =>
              setFormData({
                ...formData,
                type: value,
              })
            }
            style={{
              width: "100%",
            }}
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
        </div>
      </Modal>
    </div>
  );
}

export default CategoryManagement;
