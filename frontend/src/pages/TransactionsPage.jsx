import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Tag,
  Space,
  Typography,
  Empty,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const getInitialForm = () => ({
  title: "",
  amount: "",
  currencyCode: "USD",
  transactionType: "EXPENSE",
  transactionDate: dayjs().format("YYYY-MM-DD"),
  note: "",
  categoryId: "",
});

const safeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(getInitialForm());

  // ================================
  // FETCH TRANSACTIONS
  // ================================
  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/transactions");

      setTransactions(safeArray(response.data));
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH CATEGORIES
  // ================================
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");

      setCategories(safeArray(response.data));
    } catch (error) {
      setCategories([]);
    }
  };

  // ================================
  // FETCH CURRENCIES
  // ================================
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("/api/currencies");

      setCurrencies(safeArray(response.data));
    } catch (error) {
      setCurrencies([]);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchCurrencies();
  }, []);

  // ================================
  // FORM CHANGE
  // ================================
  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ================================
  // OPEN ADD
  // ================================
  const openAddModal = () => {
    setEditingTransaction(null);
    setFormData(getInitialForm());
    setModalOpen(true);
  };

  // ================================
  // OPEN EDIT
  // ================================
  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      title: transaction.title || "",
      amount: transaction.amount ?? "",
      currencyCode:
        transaction.currency?.code ||
        transaction.currencyCode ||
        "USD",
      transactionType:
        transaction.transactionType || "EXPENSE",
      transactionDate:
        transaction.transactionDate ||
        dayjs().format("YYYY-MM-DD"),
      note: transaction.note || "",
      categoryId:
        transaction.category?.id ||
        transaction.categoryId ||
        "",
    });

    setModalOpen(true);
  };

  // ================================
  // CLOSE MODAL
  // ================================
  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
    setFormData(getInitialForm());
  };

  // ================================
  // FILTER CATEGORIES
  // ================================
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      return (
        !category.type ||
        category.type === formData.transactionType
      );
    });
  }, [categories, formData.transactionType]);

  // ================================
  // SEARCH
  // ================================
  const filteredTransactions = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const title = String(
        transaction.title || ""
      ).toLowerCase();

      const type = String(
        transaction.transactionType || ""
      ).toLowerCase();

      const category = String(
        transaction.category?.name || ""
      ).toLowerCase();

      return (
        title.includes(searchValue) ||
        type.includes(searchValue) ||
        category.includes(searchValue)
      );
    });
  }, [transactions, search]);

  // ================================
  // VALIDATE
  // ================================
  const validateForm = () => {
    if (!formData.title.trim()) {
      message.error("Title is required.");
      return false;
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) <= 0
    ) {
      message.error("Amount must be greater than 0.");
      return false;
    }

    if (!formData.currencyCode) {
      message.error("Currency is required.");
      return false;
    }

    if (!formData.transactionType) {
      message.error("Transaction type is required.");
      return false;
    }

    if (!formData.categoryId) {
      message.error("Category is required.");
      return false;
    }

    if (!formData.transactionDate) {
      message.error("Date is required.");
      return false;
    }

    return true;
  };

  // ================================
  // BUILD PAYLOAD
  // ================================
  const buildPayload = () => {
    return {
      title: formData.title.trim(),
      amount: Number(formData.amount),
      currencyCode: formData.currencyCode,
      transactionType: formData.transactionType,
      transactionDate: formData.transactionDate,
      note: formData.note || "",
      categoryId: Number(formData.categoryId),
    };
  };

  // ================================
  // SAVE
  // ================================
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
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

      await fetchTransactions();
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }

      message.error(
        error?.response?.data?.message ||
          "Unable to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `/api/transactions/${id}`
      );

      message.success(
        "Transaction deleted successfully."
      );

      await fetchTransactions();
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }

      message.error(
        "Unable to delete transaction."
      );
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 16,
          }}
        >
          <div>
            <Title
              level={2}
              style={{ margin: 0 }}
            >
              Transactions
            </Title>

            <Text type="secondary">
              Manage your income and expenses
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
          >
            Add Transaction
          </Button>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              height: 40,
              padding: "8px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: 6,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* TRANSACTIONS */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
            }}
          >
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <Empty description="No transactions found" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>
                    Title
                  </th>

                  <th style={headerStyle}>
                    Type
                  </th>

                  <th style={headerStyle}>
                    Amount
                  </th>

                  <th style={headerStyle}>
                    Category
                  </th>

                  <th style={headerStyle}>
                    Date
                  </th>

                  <th style={headerStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (transaction) => (
                    <tr key={transaction.id}>
                      <td style={cellStyle}>
                        {transaction.title}
                      </td>

                      <td style={cellStyle}>
                        <Tag
                          color={
                            transaction.transactionType ===
                            "INCOME"
                              ? "green"
                              : "red"
                          }
                        >
                          {
                            transaction.transactionType
                          }
                        </Tag>
                      </td>

                      <td style={cellStyle}>
                        {transaction.amount}{" "}
                        {transaction.currency?.code ||
                          transaction.currencyCode ||
                          ""}
                      </td>

                      <td style={cellStyle}>
                        {transaction.category?.name ||
                          "-"}
                      </td>

                      <td style={cellStyle}>
                        {transaction.transactionDate ||
                          "-"}
                      </td>

                      <td style={cellStyle}>
                        <Space>
                          <Button
                            icon={
                              <EditOutlined />
                            }
                            onClick={() =>
                              openEditModal(
                                transaction
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            danger
                            icon={
                              <DeleteOutlined />
                            }
                            onClick={() =>
                              handleDelete(
                                transaction.id
                              )
                            }
                          >
                            Delete
                          </Button>
                        </Space>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ========================================
          NATIVE MODAL
          ======================================== */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: 500,
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: 8,
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            {/* MODAL TITLE */}
            <h2 style={{ marginTop: 0 }}>
              {editingTransaction
                ? "Edit Transaction"
                : "Add New Transaction"}
            </h2>

            {/* TITLE */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-title"
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Title
              </label>

              <input
                id="transaction-title"
                name="title"
                type="text"
                placeholder="e.g., Grocery Shopping"
                required
                value={formData.title}
                onChange={(e) =>
                  handleChange(
                    "title",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* AMOUNT */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-amount"
                style={labelStyle}
              >
                Amount
              </label>

              <input
                id="transaction-amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  handleChange(
                    "amount",
                    e.target.value
                  )
                }
                placeholder="Enter amount"
                style={inputStyle}
              />
            </div>

            {/* TYPE */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-type"
                style={labelStyle}
              >
                Type
              </label>

              <select
                id="transaction-type"
                name="transactionType"
                aria-label="Type"
                value={formData.transactionType}
                onChange={(e) =>
                  handleChange(
                    "transactionType",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="EXPENSE">
                  EXPENSE
                </option>

                <option value="INCOME">
                  INCOME
                </option>
              </select>
            </div>

            {/* CURRENCY */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-currency"
                style={labelStyle}
              >
                Currency
              </label>

              <select
                id="transaction-currency"
                value={formData.currencyCode}
                onChange={(e) =>
                  handleChange(
                    "currencyCode",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                {currencies.length === 0 && (
                  <option value="USD">
                    USD
                  </option>
                )}

                {currencies.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                  >
                    {currency.code}
                    {currency.name
                      ? ` - ${currency.name}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-category"
                style={labelStyle}
              >
                Category
              </label>

              <select
                id="transaction-category"
                value={formData.categoryId}
                onChange={(e) =>
                  handleChange(
                    "categoryId",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select category
                </option>

                {filteredCategories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DATE */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="transaction-date"
                style={labelStyle}
              >
                Date
              </label>

              <input
                id="transaction-date"
                type="date"
                value={
                  formData.transactionDate
                }
                onChange={(e) =>
                  handleChange(
                    "transactionDate",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* NOTE */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="transaction-note"
                style={labelStyle}
              >
                Note
              </label>

              <textarea
                id="transaction-note"
                value={formData.note}
                onChange={(e) =>
                  handleChange(
                    "note",
                    e.target.value
                  )
                }
                placeholder="Optional note..."
                rows={3}
                style={{
                  ...inputStyle,
                  height: "auto",
                  resize: "vertical",
                }}
              />
            </div>

            {/* MODAL BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  background: "#1677ff",
                  color: "#fff",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// STYLES
// ========================================

const inputStyle = {
  display: "block",
  width: "100%",
  height: 40,
  padding: "8px 11px",
  border: "1px solid #d9d9d9",
  borderRadius: 6,
  boxSizing: "border-box",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: 500,
};

const headerStyle = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid #ddd",
  background: "#fafafa",
};

const cellStyle = {
  padding: 12,
  borderBottom: "1px solid #eee",
};