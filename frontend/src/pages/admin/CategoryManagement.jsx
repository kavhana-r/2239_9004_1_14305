import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
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
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/categories"
      );

      const data = response?.data;

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      name: "",
      type: "EXPENSE",
    });

    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      message.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "/api/categories",
        {
          name: formData.name.trim(),
          type: formData.type,
        }
      );

      message.success("Category added");

      setModalOpen(false);

      await fetchCategories();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    try {
      await axios.delete(
        `/api/categories/${category.id}`
      );

      message.success("Category deleted");

      await fetchCategories();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

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
        <PopconfirmWrapper
          category={record}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>
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

      <Card>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={categories}
          loading={loading}
        />
      </Card>

      <Modal
        open={modalOpen}
        title="Add Category"
        onCancel={() =>
          setModalOpen(false)
        }
        onOk={handleSubmit}
        confirmLoading={saving}
      >
        <div style={{ marginTop: 10 }}>
          <label>Name</label>

          <Input
            placeholder="e.g. Salary, Groceries"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            style={{
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Type</label>

          <Select
            value={formData.type}
            onChange={(value) =>
              setFormData({
                ...formData,
                type: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
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

function PopconfirmWrapper({
  category,
  onDelete,
}) {
  const { Popconfirm } = require("antd");

  return (
    <Popconfirm
      title="Delete this category?"
      onConfirm={() =>
        onDelete(category)
      }
    >
      <Button
        danger
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>
    </Popconfirm>
  );
}

export default CategoryManagement;