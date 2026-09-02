import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [form] = Form.useForm();

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "/api/categories",
        config()
      );

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      message.error("Unable to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (values) => {
    try {
      await axios.post(
        "/api/categories",
        values,
        config()
      );

      message.success("Category added");

      setModalOpen(false);
      form.resetFields();

      await fetchCategories();
    } catch (error) {
      message.error("Unable to add category.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(
        `/api/categories/${id}`,
        config()
      );

      message.success("Category deleted");

      await fetchCategories();
    } catch (error) {
      message.error("Unable to delete category.");
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
        <Tag color={type === "INCOME" ? "green" : "red"}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this category?"
          onConfirm={() => deleteCategory(record.id)}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={2}>
          Category Management
        </Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
        />
      </Card>

      <Modal
        title="Add Category"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={createCategory}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Category name is required",
              },
            ]}
          >
            <Input placeholder="e.g. Salary, Groceries" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Type is required",
              },
            ]}
          >
            <Select placeholder="Select type">
              <Select.Option value="INCOME">
                INCOME
              </Select.Option>

              <Select.Option value="EXPENSE">
                EXPENSE
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryManagement;