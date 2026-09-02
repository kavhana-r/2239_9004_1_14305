import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const [transactionResponse, categoryResponse, currencyResponse] =
        await Promise.all([
          axios.get("/api/transactions", authConfig),
          axios.get("/api/categories", authConfig),
          axios.get("/api/currencies", authConfig),
        ]);

      setTransactions(
        Array.isArray(transactionResponse.data)
          ? transactionResponse.data
          : []
      );

      setCategories(
        Array.isArray(categoryResponse.data)
          ? categoryResponse.data
          : []
      );

      setCurrencies(
        Array.isArray(currencyResponse.data)
          ? currencyResponse.data
          : []
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        message.error("Session expired. Please login again.");
      } else if (error?.response?.status === 500) {
        message.error("Unable to load transaction data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);

    form.resetFields();

    form.setFieldsValue({
      transactionType: "EXPENSE",
      transactionDate: dayjs(),
      currencyCode:
        currencies.length > 0 ? currencies[0].code : undefined,
    });

    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingId(record.id);

    form.setFieldsValue({
      title: record.title,
      amount: record.amount,
      transactionType: record.transactionType,
      currencyCode: record.currency?.code || record.currencyCode,
      categoryId: record.category?.id || record.categoryId,
      transactionDate: record.transactionDate
        ? dayjs(record.transactionDate)
        : null,
      note: record.note || "",
    });

    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    if (!values.categoryId) {
      message.error("Category not selected");
      return;
    }

    const payload = {
      title: values.title,
      amount: values.amount,
      currencyCode: values.currencyCode,
      transactionType: values.transactionType,
      transactionDate: values.transactionDate
        ? values.transactionDate.format("YYYY-MM-DD")
        : null,
      note: values.note || "",
      categoryId: values.categoryId,
    };

    try {
      if (editingId) {
        await axios.put(
          `/api/transactions/${editingId}`,
          payload,
          authConfig
        );

        message.success("Transaction updated successfully.");
      } else {
        await axios.post("/api/transactions", payload, authConfig);

        message.success("Transaction created successfully.");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingId(null);

      await loadData();
    } catch (error) {
      if (error?.response?.status === 500) {
        message.error("Server error. Please try again.");
      } else if (error?.response?.status === 401) {
        message.error("Session expired. Please login again.");
      } else {
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data ||
          "Transaction operation failed";

        message.error(
          typeof errorMsg === "string" ? errorMsg : "Transaction operation failed"
        );
      }
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Transaction",
      content:
        "Are you sure you want to delete this transaction?",
      okText: "OK",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(
            `/api/transactions/${id}`,
            authConfig
          );

          message.success("Transaction deleted successfully.");

          await loadData();
        } catch (error) {
          message.error("Unable to delete transaction.");
        }
      },
    });
  };

  const filteredCategories = useMemo(() => {
    const selectedType = form.getFieldValue("transactionType");

    if (!selectedType) {
      return categories;
    }

    return categories.filter(
      (category) => category.type === selectedType
    );
  }, [categories, form]);

  const filteredTransactions = transactions.filter((transaction) => {
    const value = search.toLowerCase();

    return (
      transaction.title?.toLowerCase().includes(value) ||
      transaction.category?.name?.toLowerCase().includes(value) ||
      transaction.transactionType?.toLowerCase().includes(value)
    );
  });

  const currencySymbol = (code) => {
    if (code === "INR") return "₹";
    if (code === "EUR") return "€";
    if (code === "GBP") return "£";
    return "$";
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => (
        <Tag color={type === "INCOME" ? "green" : "red"}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <Text strong>
          {currencySymbol(record.currency?.code)}
          {Number(record.amount || 0).toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (_, record) => record.category?.name || "-",
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={2}>Transactions</Title>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Add Transaction
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 20 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTransactions}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingId ? "Edit Transaction" : "Add New Transaction"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingId ? "Update" : "Create"}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input
              required
              placeholder="e.g., Grocery Shopping"
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="transactionType"
            rules={[
              {
                required: true,
                message: "Transaction type is required",
              },
            ]}
          >
            <select
              aria-label="Type"
              style={{
                width: "100%",
                height: 32,
                borderRadius: 6,
                border: "1px solid #d9d9d9",
                padding: "0 10px",
              }}
              onChange={(e) => {
                form.setFieldsValue({
                  transactionType: e.target.value,
                  categoryId: undefined,
                });
              }}
              value={form.getFieldValue("transactionType")}
            >
              <option value="EXPENSE">EXPENSE</option>
              <option value="INCOME">INCOME</option>
            </select>
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Amount is required",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="Currency"
            name="currencyCode"
            rules={[
              {
                required: true,
                message: "Currency is required",
              },
            ]}
          >
            <Select placeholder="Select currency">
              {currencies.map((currency) => (
                <Select.Option
                  key={currency.code}
                  value={currency.code}
                >
                  {currency.code} - {currency.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Category not selected",
              },
            ]}
          >
            <Select placeholder="Select category">
              {filteredCategories.map((category) => (
                <Select.Option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Transaction Date"
            name="transactionDate"
            rules={[
              {
                required: true,
                message: "Transaction date is required",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Note" name="note">
            <TextArea placeholder="Optional notes..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TransactionsPage;