import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Table,
  message,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;

function TransactionsPage() {
  const [form] = Form.useForm();

  const [transactions, setTransactions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [search, setSearch] = useState("");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/transactions",
        getConfig()
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setTransactions(data);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        "/api/currencies",
        getConfig()
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setCurrencies(data);
    } catch (error) {
      setCurrencies([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "/api/categories",
        getConfig()
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setCategories(data);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCurrencies();
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingTransaction(null);
    setTransactionType(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingTransaction(record);
    setTransactionType(record.transactionType);

    form.setFieldsValue({
      title: record.title,
      transactionType: record.transactionType,
      amount: record.amount,
      currencyCode: record.currencyCode,
      categoryId: record.categoryId,
      transactionDate: record.transactionDate
        ? dayjs(record.transactionDate)
        : null,
      note: record.note,
    });

    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      transactionDate: values.transactionDate
        ? values.transactionDate.format("YYYY-MM-DD")
        : null,
    };

    try {
      if (editingTransaction) {
        await axios.put(
          `/api/transactions/${editingTransaction.id}`,
          payload,
          getConfig()
        );

        message.success("Transaction updated successfully");
      } else {
        await axios.post(
          "/api/transactions",
          payload,
          getConfig()
        );

        message.success("Transaction created successfully. ");
      }

      setModalOpen(false);
      form.resetFields();
      setEditingTransaction(null);
      setTransactionType(null);

      await fetchTransactions();
    } catch (error) {
      // Prevent API errors such as HTTP 500 from crashing the page.
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Transaction",
      content: "Are you sure you want to delete this transaction?",
      onOk: async () => {
        try {
          await axios.delete(
            `/api/transactions/${id}`,
            getConfig()
          );

          message.success("Transaction deleted successfully");
          await fetchTransactions();
        } catch (error) {
          // Gracefully handle errors.
        }
      },
    });
  };

  const filteredCategories = categories.filter((category) => {
    if (!transactionType) return true;
    return category.type === transactionType;
  });

  const filteredTransactions = transactions.filter((transaction) => {
    if (!search.trim()) return true;

    const value = search.toLowerCase();

    return (
      transaction.title?.toLowerCase().includes(value) ||
      transaction.note?.toLowerCase().includes(value) ||
      transaction.currencyCode?.toLowerCase().includes(value)
    );
  });

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
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Currency",
      dataIndex: "currencyCode",
      key: "currencyCode",
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
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 16,
          }}
        >
          <h1>Transactions</h1>

          <Space>
            <Input
              placeholder="Search transactions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add Transaction
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTransactions}
          loading={loading}
        />
      </Card>

      <Modal
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add New Transaction"
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input placeholder="e.g., Grocery Shopping" />
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
            <Select
              aria-label="Type"
              placeholder="Select transaction type"
              onChange={(value) => {
                setTransactionType(value);
                form.setFieldValue("categoryId", undefined);
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
              min={0}
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
            <Select
              placeholder="Select currency"
              options={currencies.map((currency) => ({
                value: currency.code,
                label: `${currency.code} - ${
                  currency.name || ""
                }`,
              }))}
            />
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
            <Select
              placeholder="Select category"
              options={filteredCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
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
            <TextArea placeholder="Optional notes..." rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
              >
                {editingTransaction ? "Update" : "Create"}
              </Button>

              <Button
                onClick={() => {
                  setModalOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TransactionsPage;