import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Button,
  Card,
  Space,
  Typography,
  Empty,
  message,
  Row,
  Col,
  Select,
  Spin,
  Tag,
  Form,
  Input,
  Modal,
  Popconfirm,
  DatePicker,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  CloseOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import { useDispatch } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";

import { logout } from "../store/slices/authSlice";

const { Title, Text } = Typography;

const DEFAULT_EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 155.0,
  CAD: 1.36,
  AUD: 1.52,
};

const REQUIRED_CURRENCIES = [
  {
    code: "AUD",
    country: "AU",
    name: "Australian Dollar",
    symbol: "A$",
  },
  {
    code: "CAD",
    country: "CA",
    name: "Canadian Dollar",
    symbol: "C$",
  },
  {
    code: "EUR",
    country: "EU",
    name: "Euro",
    symbol: "€",
  },
  {
    code: "GBP",
    country: "GB",
    name: "British Pound",
    symbol: "£",
  },
  {
    code: "INR",
    country: "IN",
    name: "Indian Rupee",
    symbol: "₹",
  },
  {
    code: "JPY",
    country: "JP",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    code: "USD",
    country: "US",
    name: "US Dollar",
    symbol: "$",
  },
];

const getCurrencySymbol = (currency) => {
  switch (String(currency || "").toUpperCase()) {
    case "INR":
      return "₹";

    case "EUR":
      return "€";

    case "GBP":
      return "£";

    case "JPY":
      return "¥";

    case "AUD":
      return "A$";

    case "CAD":
      return "C$";

    case "USD":
    default:
      return "$";
  }
};

const getInitialForm = () => ({
  title: "",
  amount: "",
  currencyCode:
    localStorage.getItem("preferredCurrency") || "USD",
  transactionType: "EXPENSE",
  transactionDate: dayjs().format("YYYY-MM-DD"),
  note: "",
  categoryId: "",
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

export default function TransactionsPage() {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [activeCurrency, setActiveCurrency] = useState(
    () =>
      localStorage.getItem("preferredCurrency") ||
      "USD"
  );

  const [exchangeRates, setExchangeRates] = useState(
    DEFAULT_EXCHANGE_RATES
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [successAlert, setSuccessAlert] = useState(null);

  const isMountedRef = useRef(true);

  const [formData, setFormData] = useState(
    getInitialForm()
  );

  // =========================================================
  // MOUNT / UNMOUNT
  // =========================================================

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // =========================================================
  // UNAUTHORIZED
  // =========================================================

  const handleUnauthorized = useCallback(() => {
    try {
      dispatch(logout());
    } catch (error) {
      // Ignore logout errors
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");

    if (axios.defaults?.headers?.common) {
      delete axios.defaults.headers.common.Authorization;
    }

    message.error(
      "Session expired. Please login again."
    );

    if (
      typeof window !== "undefined" &&
      window.location
    ) {
      if (window.location.pathname !== "/login") {
        try {
          window.location.href = "/login";
        } catch (error) {
          // Ignore redirect errors
        }
      }
    }
  }, [dispatch]);

  // =========================================================
  // CURRENCY CHANGE EVENT
  // =========================================================

  useEffect(() => {
    const handleCurrencyChange = (event) => {
      const newCurrency =
        event.detail ||
        localStorage.getItem("preferredCurrency") ||
        "USD";

      setActiveCurrency(newCurrency);
    };

    window.addEventListener(
      "currencyChange",
      handleCurrencyChange
    );

    return () => {
      window.removeEventListener(
        "currencyChange",
        handleCurrencyChange
      );
    };
  }, []);

  // =========================================================
  // FETCH TRANSACTIONS
  // =========================================================

  const fetchTransactions = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "/api/transactions"
      );

      if (isMountedRef.current) {
        setTransactions(
          safeArray(response.data)
        );
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      if (isMountedRef.current) {
        setTransactions([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [handleUnauthorized]);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "/api/categories"
      );

      const list = safeArray(response.data);

      if (isMountedRef.current) {
        setCategories(list);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      if (isMountedRef.current) {
        setCategories([]);
      }
    }
  }, [handleUnauthorized]);

  // =========================================================
  // FETCH CURRENCIES
  // =========================================================

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await axios.get(
        "/api/currencies"
      );

      const list = safeArray(response.data);

      if (isMountedRef.current) {
        setCurrencies(list);

        if (list.length > 0) {
          const ratesMap = {
            ...DEFAULT_EXCHANGE_RATES,
          };

          list.forEach((currency) => {
            if (
              currency?.code &&
              currency?.exchangeRate
            ) {
              ratesMap[currency.code] =
                Number(currency.exchangeRate);
            }
          });

          setExchangeRates(ratesMap);
        }
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      if (isMountedRef.current) {
        setCurrencies([]);
      }
    }
  }, [handleUnauthorized]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchCurrencies();
  }, [
    fetchTransactions,
    fetchCategories,
    fetchCurrencies,
  ]);

  // =========================================================
  // CURRENCY CONVERSION
  // =========================================================

  const convertValue = useCallback(
    (amount, fromCurr = "USD") => {
      const numericAmount = Number(amount || 0);

      const from = fromCurr || "USD";
      const to = activeCurrency || "USD";

      if (from === to) {
        return numericAmount;
      }

      const fromRate =
        exchangeRates[from] ||
        DEFAULT_EXCHANGE_RATES[from] ||
        1;

      const toRate =
        exchangeRates[to] ||
        DEFAULT_EXCHANGE_RATES[to] ||
        1;

      return (
        (numericAmount / fromRate) *
        toRate
      );
    },
    [activeCurrency, exchangeRates]
  );

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((previous) => {
      const updated = {
        ...previous,
        [field]: value,
      };

      // When Income/Expense changes,
      // remove the previously selected category.
      if (field === "transactionType") {
        updated.categoryId = "";
      }

      return updated;
    });
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddModal = () => {
    setEditingTransaction(null);

    const initial = {
      ...getInitialForm(),
      currencyCode: activeCurrency,
    };

    setFormData(initial);

    form.resetFields();

    setModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);

    const values = {
      title: transaction?.title || "",

      amount:
        transaction?.amount ??
        "",

      currencyCode:
        transaction?.currency?.code ||
        transaction?.currencyCode ||
        "USD",

      transactionType:
        transaction?.transactionType ||
        "EXPENSE",

      transactionDate:
        transaction?.transactionDate ||
        dayjs().format("YYYY-MM-DD"),

      note:
        transaction?.note ||
        "",

      categoryId:
        transaction?.category?.id ||
        transaction?.categoryId ||
        "",
    };

    setFormData(values);

    form.setFieldsValue(values);

    setModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
    form.resetFields();
  };

  // =========================================================
  // SUBMIT TRANSACTION
  // =========================================================

  const handleSubmit = async () => {
    try {
      setSaving(true);

      if (!formData.title?.trim()) {
        message.warning(
          "Please enter transaction title."
        );
        return;
      }

      if (
        !formData.amount ||
        Number(formData.amount) <= 0
      ) {
        message.warning(
          "Please enter a valid amount."
        );
        return;
      }

      if (!formData.categoryId) {
        message.warning(
          "Please select a category."
        );
        return;
      }

      const payload = {
        title: formData.title.trim(),

        amount: Number(formData.amount),

        currencyCode:
          formData.currencyCode,

        transactionType:
          formData.transactionType,

        transactionDate:
          formData.transactionDate,

        note:
          formData.note
            ? formData.note.trim()
            : null,

        // Use the REAL database category ID.
        categoryId:
          Number(formData.categoryId),
      };

      if (editingTransaction) {
        await axios.put(
          `/api/transactions/${editingTransaction.id}`,
          payload
        );

        message.success(
          "Transaction updated successfully"
        );
      } else {
        await axios.post(
          "/api/transactions",
          payload
        );

        setSuccessAlert(
          "Transaction added successfully!"
        );
      }

      closeModal();

      await fetchTransactions();
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      message.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Something went wrong"
      );
    } finally {
      if (isMountedRef.current) {
        setSaving(false);
      }
    }
  };

  // =========================================================
  // DELETE TRANSACTION
  // =========================================================

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `/api/transactions/${id}`
      );

      message.success(
        "Transaction deleted successfully"
      );

      await fetchTransactions();
    } catch (error) {
      if (error?.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      message.error(
        "Unable to delete transaction"
      );
    }
  };

  // =========================================================
  // CATEGORY OPTIONS
  // =========================================================
  //
  // IMPORTANT:
  // We use categories returned from the backend.
  //
  // When transactionType = INCOME:
  // only INCOME categories are shown.
  //
  // Therefore, if the database contains:
  // Salary | INCOME
  //
  // Salary will automatically appear here.
  //
  // =========================================================

  const formCategoryOptions = useMemo(() => {
    const selectedType =
      String(
        formData.transactionType || ""
      ).toUpperCase();

    return categories
      .filter((category) => {
        if (!category) {
          return false;
        }

        if (!category.id) {
          return false;
        }

        return (
          String(
            category.type || ""
          ).toUpperCase() ===
          selectedType
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [
    categories,
    formData.transactionType,
  ]);

  // =========================================================
  // FILTERED TRANSACTIONS
  // =========================================================

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    if (typeFilter !== "ALL") {
      list = list.filter(
        (transaction) =>
          String(
            transaction?.transactionType || ""
          ).toUpperCase() ===
          String(typeFilter).toUpperCase()
      );
    }

    if (categoryFilter !== "ALL") {
      list = list.filter((transaction) => {
        const categoryId =
          transaction?.category?.id ||
          transaction?.categoryId;

        return (
          String(categoryId) ===
          String(categoryFilter)
        );
      });
    }

    if (search.trim()) {
      const term =
        search.trim().toLowerCase();

      list = list.filter((transaction) =>
        String(
          transaction?.title || ""
        )
          .toLowerCase()
          .includes(term)
      );
    }

    return list;
  }, [
    transactions,
    typeFilter,
    categoryFilter,
    search,
  ]);

  // =========================================================
  // CATEGORY FILTER OPTIONS
  // =========================================================

  const categoryFilterOptions = useMemo(() => {
    return categories
      .filter((category) => category?.id)
      .map((category) => ({
        value: String(category.id),
        label: category.name,
      }));
  }, [categories]);

  // =========================================================
  // CURRENCY OPTIONS
  // =========================================================

  const currencyOptions = useMemo(() => {
    const apiCurrencies =
      currencies.length > 0
        ? currencies
        : REQUIRED_CURRENCIES;

    return apiCurrencies.map(
      (currency) => ({
        value: currency.code,
        label: `${getCurrencySymbol(
          currency.code
        )} ${currency.code}`,
      })
    );
  }, [currencies]);

  // =========================================================
  // STYLES
  // =========================================================

  const inputStyle = {
    width: "100%",
    height: 42,
    borderRadius: 8,
  };

  const sectionCardStyle = {
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 4px 16px rgba(15, 23, 42, 0.05)",
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* SUCCESS ALERT */}
      {successAlert && (
        <Tag
          icon={<CheckCircleFilled />}
          color="success"
          closable
          onClose={() =>
            setSuccessAlert(null)
          }
          style={{
            marginBottom: 16,
            width: "100%",
            padding: "10px 14px",
            fontSize: 14,
          }}
        >
          {successAlert}
        </Tag>
      )}

      {/* HEADER */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 24,
        }}
      >
        <Col>
          <Title
            level={2}
            style={{
              margin: 0,
              color: "#0f172a",
            }}
          >
            Transactions
          </Title>

          <Text type="secondary">
            Track and manage your income
            and expenses.
          </Text>
        </Col>

        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
            size="large"
          >
            Add Transaction
          </Button>
        </Col>
      </Row>

      {/* FILTERS */}
      <Card
        style={{
          ...sectionCardStyle,
          marginBottom: 20,
        }}
      >
        <Row
          gutter={[12, 12]}
          align="middle"
        >
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={7}
          >
            <Input
              prefix={
                <SearchOutlined />
              }
              placeholder="Search transactions..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              allowClear
            />
          </Col>

          <Col
            xs={24}
            sm={12}
            md={5}
            lg={4}
          >
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "ALL",
                  label: "All Types",
                },
                {
                  value: "INCOME",
                  label: "Income",
                },
                {
                  value: "EXPENSE",
                  label: "Expense",
                },
              ]}
            />
          </Col>

          <Col
            xs={24}
            sm={12}
            md={6}
            lg={5}
          >
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{
                width: "100%",
              }}
              placeholder="Category"
              options={[
                {
                  value: "ALL",
                  label: "All Categories",
                },
                ...categoryFilterOptions,
              ]}
            />
          </Col>

          <Col
            xs={24}
            sm={12}
            md={5}
            lg={4}
          >
            <Button
              icon={<CloseOutlined />}
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
                setCategoryFilter(
                  "ALL"
                );
              }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* TRANSACTION LIST */}
      <Card
        style={sectionCardStyle}
        loading={loading}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
            }}
          >
            <Spin size="large" />
          </div>
        ) : filteredTransactions.length ===
          0 ? (
          <Empty
            description={
              transactions.length === 0
                ? "No transactions found"
                : "No transactions match your filters"
            }
          >
            {transactions.length === 0 && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddModal}
              >
                Add Transaction
              </Button>
            )}
          </Empty>
        ) : (
          <div>
            {filteredTransactions.map(
              (transaction) => {
                const transactionType =
                  String(
                    transaction?.transactionType ||
                      "EXPENSE"
                  ).toUpperCase();

                const currencyCode =
                  transaction?.currency?.code ||
                  transaction?.currencyCode ||
                  "USD";

                const amount =
                  Number(
                    transaction?.amount || 0
                  );

                const convertedAmount =
                  convertValue(
                    amount,
                    currencyCode
                  );

                const categoryName =
                  transaction?.category
                    ?.name ||
                  "Uncategorized";

                return (
                  <Card
                    key={transaction.id}
                    size="small"
                    style={{
                      marginBottom: 12,
                      borderRadius: 12,
                    }}
                  >
                    <Row
                      align="middle"
                      gutter={[
                        16,
                        12,
                      ]}
                    >
                      <Col
                        xs={24}
                        md={8}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {
                            transaction.title
                          }
                        </Text>

                        <div>
                          <Text type="secondary">
                            {transaction.transactionDate ||
                              "-"}
                          </Text>
                        </div>
                      </Col>

                      <Col
                        xs={12}
                        md={4}
                      >
                        <Tag
                          color={
                            transactionType ===
                            "INCOME"
                              ? "green"
                              : "red"
                          }
                        >
                          {
                            transactionType
                          }
                        </Tag>
                      </Col>

                      <Col
                        xs={12}
                        md={4}
                      >
                        <Tag>
                          {categoryName}
                        </Tag>
                      </Col>

                      <Col
                        xs={24}
                        md={4}
                        style={{
                          textAlign:
                            "right",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            color:
                              transactionType ===
                              "INCOME"
                                ? "#059669"
                                : "#dc2626",
                            fontSize: 16,
                          }}
                        >
                          {getCurrencySymbol(
                            activeCurrency
                          )}
                          {convertedAmount.toFixed(
                            2
                          )}
                        </Text>

                        {currencyCode !==
                          activeCurrency && (
                          <div>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: 12,
                              }}
                            >
                              {getCurrencySymbol(
                                currencyCode
                              )}
                              {amount.toFixed(
                                2
                              )}{" "}
                              {
                                currencyCode
                              }
                            </Text>
                          </div>
                        )}
                      </Col>

                      <Col
                        xs={24}
                        md={4}
                        style={{
                          textAlign:
                            "right",
                        }}
                      >
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
                          />

                          <Popconfirm
                            title="Delete transaction?"
                            description="This action cannot be undone."
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                              handleDelete(
                                transaction.id
                              )
                            }
                          >
                            <Button
                              danger
                              icon={
                                <DeleteOutlined />
                              }
                            />
                          </Popconfirm>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                );
              }
            )}
          </div>
        )}
      </Card>

      {/* ADD / EDIT MODAL */}
      <Modal
        open={modalOpen}
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"
        }
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={650}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{
            marginTop: 20,
          }}
        >
          {/* TITLE */}
          <Form.Item label="Title">
            <Input
              value={formData.title}
              placeholder="Example: Salary"
              style={inputStyle}
              onChange={(event) =>
                handleChange(
                  "title",
                  event.target.value
                )
              }
            />
          </Form.Item>

          {/* AMOUNT + CURRENCY */}
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item label="Amount">
                <Input
                  type="number"
                  min={0}
                  value={formData.amount}
                  placeholder="30000"
                  style={inputStyle}
                  onChange={(event) =>
                    handleChange(
                      "amount",
                      event.target.value
                    )
                  }
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item label="Currency">
                <Select
                  value={
                    formData.currencyCode
                  }
                  onChange={(value) =>
                    handleChange(
                      "currencyCode",
                      value
                    )
                  }
                  options={
                    currencyOptions
                  }
                  style={{
                    width: "100%",
                    height: 42,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* TYPE */}
          <Form.Item label="Transaction Type">
            <Select
              value={
                formData.transactionType
              }
              onChange={(value) =>
                handleChange(
                  "transactionType",
                  value
                )
              }
              style={{
                width: "100%",
                height: 42,
              }}
              options={[
                {
                  value: "INCOME",
                  label: "Income",
                },
                {
                  value: "EXPENSE",
                  label: "Expense",
                },
              ]}
            />
          </Form.Item>

          {/* CATEGORY */}
          <Form.Item
            label="Category"
            required
          >
            <Select
              value={
                formData.categoryId ||
                undefined
              }
              placeholder="Select category..."
              onChange={(value) =>
                handleChange(
                  "categoryId",
                  value
                )
              }
              style={{
                width: "100%",
                height: 42,
              }}
              options={formCategoryOptions.map(
                (category) => ({
                  value: String(
                    category.id
                  ),
                  label: category.name,
                })
              )}
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={`No ${
                    formData.transactionType ===
                    "INCOME"
                      ? "income"
                      : "expense"
                  } categories found`}
                />
              }
            />
          </Form.Item>

          {/* DATE */}
          <Form.Item label="Date">
            <DatePicker
              value={
                formData.transactionDate
                  ? dayjs(
                      formData.transactionDate
                    )
                  : null
              }
              onChange={(date) =>
                handleChange(
                  "transactionDate",
                  date
                    ? date.format(
                        "YYYY-MM-DD"
                      )
                    : ""
                )
              }
              format="DD-MM-YYYY"
              style={{
                width: "100%",
                height: 42,
              }}
            />
          </Form.Item>

          {/* NOTE */}
          <Form.Item label="Notes">
            <Input.TextArea
              value={formData.note}
              placeholder="Optional notes..."
              rows={3}
              onChange={(event) =>
                handleChange(
                  "note",
                  event.target.value
                )
              }
            />
          </Form.Item>

          {/* BUTTONS */}
          <Form.Item
            style={{
              marginBottom: 0,
              marginTop: 24,
            }}
          >
            <Space
              style={{
                width: "100%",
                justifyContent:
                  "flex-end",
              }}
            >
              <Button
                onClick={closeModal}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={
                  !saving ? (
                    <CheckCircleFilled />
                  ) : null
                }
              >
                {editingTransaction
                  ? "Update Transaction"
                  : "Add Transaction"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

