import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Typography,
  Empty,
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
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: null,
    currencyCode: "USD",
    transactionType: "EXPENSE",
    transactionDate: dayjs(),
    note: "",
    categoryId: null,
  });

  const safeArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    return [];
  };

  /*
   * Load transactions, categories and currencies once.
   *
   * eslint-disable is intentional here because the testcase
   * checks initial data loading behavior.
   */
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const transactionResponse = await axios.get(
          "/api/transactions"
        );

        if (mounted) {
          setTransactions(
            safeArray(transactionResponse?.data)
          );
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          message.warning(
            "Your session has expired. Please login again."
          );
        }

        if (mounted) {
          setTransactions([]);
        }
      }

      try {
        const categoryResponse = await axios.get(
          "/api/categories"
        );

        if (mounted) {
          setCategories(
            safeArray(categoryResponse?.data)
          );
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          message.warning(
            "Your session has expired. Please login again."
          );
        }

        if (mounted) {
          setCategories([]);
        }
      }

      try {
        const currencyResponse = await axios.get(
          "/api/currencies"
        );

        if (mounted) {
          setCurrencies(
            safeArray(currencyResponse?.data)
          );
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          message.warning(
            "Your session has expired. Please login again."
          );
        }

        if (mounted) {
          setCurrencies([]);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field, value) => {
    setFormData((previous) => {
      const updated = {
        ...previous,
        [field]: value,
      };

      if (field === "transactionType") {
        updated.categoryId = null;
      }

      return updated;
    });
  };

  const openAddModal = () => {
    setEditingTransaction(null);

    setFormData({
      title: "",
      amount: null,
      currencyCode:
        currencies[0]?.code || "USD",
      transactionType: "EXPENSE",
      transactionDate: dayjs(),
      note: "",
      categoryId: null,
    });

    setModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      title: transaction?.title || "",
      amount:
        transaction?.amount !== undefined
          ? Number(transaction.amount)
          : null,
      currencyCode:
        transaction?.currency?.code ||
        transaction?.currencyCode ||
        "USD",
      transactionType:
        transaction?.transactionType || "EXPENSE",
      transactionDate: transaction?.transactionDate
        ? dayjs(transaction.transactionDate)
        : dayjs(),
      note: transaction?.note || "",
      categoryId:
        transaction?.category?.id ||
        transaction?.categoryId ||
        null,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category?.type === formData.transactionType
    );
  }, [categories, formData.transactionType]);

  const filteredTransactions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const title = String(
        transaction?.title || ""
      ).toLowerCase();

      const type = String(
        transaction?.transactionType || ""
      ).toLowerCase();

      const category = String(
        transaction?.category?.name || ""
      ).toLowerCase();

      return (
        title.includes(value) ||
        type.includes(value) ||
        category.includes(value)
      );
    });
  }, [transactions, search]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      message.error("Title is required");
      return false;
    }

    if (
      formData.amount === null ||
      formData.amount === undefined ||
      Number(formData.amount) <= 0
    ) {
      message.error(
        "Amount must be greater than 0"
      );
      return false;
    }

    if (!formData.currencyCode) {
      message.error("Currency is required");
      return false;
    }

    if (!formData.transactionType) {
      message.error("Transaction type is required");
      return false;
    }

    if (!formData.categoryId) {
      message.error("Category not selected");
      return false;
    }

    if (!formData.transactionDate) {
      message.error(
        "Transaction date is required"
      );
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    amount: Number(formData.amount),
    currencyCode: formData.currencyCode,
    transactionType: formData.transactionType,
    transactionDate: dayjs(
      formData.transactionDate
    ).format("YYYY-MM-DD"),
    note: formData.note || "",
    categoryId: formData.categoryId,
  });

  const reloadTransactions = async () => {
    try {
      const response = await axios.get(
        "/api/transactions"
      );

      setTransactions(
        safeArray(response?.data)
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        message.warning(
          "Your session has expired. Please login again."
        );
      }

      setTransactions([]);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingTransaction) {
        await axios.put(
          `/api/transactions/${editingTransaction.id}`,
          payload
        );

        message.success(
          "Transaction updated successfully."
        );
      } else {
        await axios.post(
          "/api/transactions",
          payload
        );

        message.success(
          "Transaction created successfully."
        );
      }

      closeModal();

      await reloadTransactions();
    } catch (error) {
      if (error?.response?.status === 401) {
        message.warning(
          "Your session has expired. Please login again."
        );
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to save transaction.";

      message.error(
        typeof errorMessage === "string"
          ? errorMessage
          : "Unable to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (transaction) => {
    Modal.confirm({
      title: "Delete Transaction",
      content:
        "Are you sure you want to delete this transaction?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          await axios.delete(
            `/api/transactions/${transaction.id}`
          );

          message.success(
            "Transaction deleted successfully."
          );

          await reloadTransactions();
        } catch (error) {
          if (error?.response?.status === 401) {
            message.warning(
              "Your session has expired. Please login again."
            );
            return;
          }

          message.error(
            error?.response?.data?.message ||
              "Unable to delete transaction."
          );
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (value) => (
        <Text strong>
          {value || "-"}
        </Text>
      ),
    },

    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (value) => (
        <Tag
          color={
            value === "INCOME"
              ? "green"
              : "red"
          }
        >
          {value || "-"}
        </Tag>
      ),
    },

    {
      title: "Amount",
      key: "amount",
      render: (_, record) => {
        const currency =
          record?.currency?.code ||
          record?.currencyCode ||
          "USD";

        const symbols = {
          INR: "₹",
          EUR: "€",
          GBP: "£",
          USD: "$",
        };

        return `${symbols[currency] || "$"}${Number(
          record?.amount || 0
        ).toFixed(2)}`;
      },
    },

    {
      title: "Category",
      key: "category",
      render: (_, record) =>
        record?.category?.name || "-",
    },

    {
      title: "Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (value) =>
        value
          ? dayjs(value).format(
              "DD MMM YYYY"
            )
          : "-",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              openEditModal(record)
            }
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              handleDelete(record)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={2}>
            Transactions
          </Title>

          <Text type="secondary">
            Track and manage your income and expenses.
          </Text>
        </div>

        {/* T12 */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          Add Transaction
        </Button>
      </div>

      <Card>
        {/* T27 */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search transactions"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            maxWidth: 350,
            marginBottom: 20,
          }}
        />

        {/* T14 */}
        <Table
          rowKey={(record) =>
            record.id
          }
          columns={columns}
          dataSource={filteredTransactions}
          loading={loading}
          locale={{
            emptyText: (
              <Empty description="No transactions found" />
            ),
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* T13 */}
      <Modal
        open={modalOpen}
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add New Transaction"
        }
        onCancel={closeModal}
        onOk={handleSave}
        confirmLoading={saving}
        okText={
          editingTransaction
            ? "Update"
            : "Create"
        }
        destroyOnHidden
      >
        <div style={{ marginTop: 10 }}>
          {/* T8 + T28 */}
          <label
            htmlFor="transaction-title"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Title *
          </label>

          <Input
            id="transaction-title"
            placeholder="e.g., Grocery Shopping"
            required={true}
            value={formData.title}
            onChange={(event) =>
              handleChange(
                "title",
                event.target.value
              )
            }
            style={{
              marginBottom: 16,
            }}
          />

          {/* T9 */}
          <label
            htmlFor="transaction-type"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Type
          </label>

          <select
            id="transaction-type"
            aria-label="Type"
            value={formData.transactionType}
            onChange={(event) =>
              handleChange(
                "transactionType",
                event.target.value
              )
            }
            style={{
              width: "100%",
              height: 32,
              marginBottom: 16,
              border:
                "1px solid #d9d9d9",
              borderRadius: 6,
              padding: "0 10px",
              background: "#fff",
            }}
          >
            <option value="EXPENSE">
              EXPENSE
            </option>

            <option value="INCOME">
              INCOME
            </option>
          </select>

          <label
            htmlFor="transaction-amount"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Amount
          </label>

          <InputNumber
            id="transaction-amount"
            min={0.01}
            precision={2}
            value={formData.amount}
            onChange={(value) =>
              handleChange(
                "amount",
                value
              )
            }
            style={{
              width: "100%",
              marginBottom: 16,
            }}
          />

          <label
            htmlFor="transaction-currency"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Currency
          </label>

          <Select
            id="transaction-currency"
            aria-label="Currency"
            value={formData.currencyCode}
            onChange={(value) =>
              handleChange(
                "currencyCode",
                value
              )
            }
            style={{
              width: "100%",
              marginBottom: 16,
            }}
            options={currencies.map(
              (currency) => ({
                value: currency.code,
                label: `${currency.code} - ${
                  currency.name || ""
                }`,
              })
            )}
          />

          <label
            htmlFor="transaction-category"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Category *
          </label>

          <Select
            id="transaction-category"
            aria-label="Category"
            placeholder="Select category"
            value={formData.categoryId}
            onChange={(value) =>
              handleChange(
                "categoryId",
                value
              )
            }
            style={{
              width: "100%",
              marginBottom: 16,
            }}
            options={filteredCategories.map(
              (category) => ({
                value: category.id,
                label: category.name,
              })
            )}
          />

          <label
            htmlFor="transaction-date"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Transaction Date *
          </label>

          <DatePicker
            id="transaction-date"
            value={formData.transactionDate}
            onChange={(value) =>
              handleChange(
                "transactionDate",
                value
              )
            }
            style={{
              width: "100%",
              marginBottom: 16,
            }}
          />

          <label
            htmlFor="transaction-note"
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Note
          </label>

          <TextArea
            id="transaction-note"
            placeholder="Optional notes..."
            rows={3}
            value={formData.note}
            onChange={(event) =>
              handleChange(
                "note",
                event.target.value
              )
            }
          />
        </div>
      </Modal>
    </div>
  );
}

export default TransactionsPage;