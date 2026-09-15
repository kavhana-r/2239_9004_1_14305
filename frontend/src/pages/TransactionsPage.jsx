import React, {
  useCallback,
  useEffect,
  useMemo,
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
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:8080/api";

// ============================================================
// CURRENCY OPTIONS
// ============================================================

const CURRENCY_OPTIONS = [
  {
    value: "USD",
    label: "$ USD",
  },
  {
    value: "INR",
    label: "₹ INR",
  },
  {
    value: "EUR",
    label: "€ EUR",
  },
  {
    value: "GBP",
    label: "£ GBP",
  },
];

// ============================================================
// DEFAULT EXCHANGE RATES
// ============================================================

const DEFAULT_EXCHANGE_RATES = {
  USD: 1,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
};

// ============================================================
// CURRENCY SYMBOL
// ============================================================

const getCurrencySymbol = (currencyCode) => {
  const code = String(
    currencyCode || "USD"
  ).toUpperCase();

  switch (code) {
    case "USD":
      return "$";

    case "INR":
      return "₹";

    case "EUR":
      return "€";

    case "GBP":
      return "£";

    default:
      return code;
  }
};

// ============================================================
// INITIAL FORM
// ============================================================

const getInitialForm = () => ({
  title: "",
  amount: "",
  currencyCode: "USD",
  transactionType: "EXPENSE",
  categoryId: "",
  transactionDate: dayjs().format(
    "YYYY-MM-DD"
  ),
  note: "",
});

// ============================================================
// SAFE ARRAY
// ============================================================

const safeArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.categories)) {
    return data.categories;
  }

  if (Array.isArray(data?.transactions)) {
    return data.transactions;
  }

  return [];
};

// ============================================================
// COMPONENT
// ============================================================

const TransactionsPage = () => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [transactions, setTransactions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [activeCurrency, setActiveCurrency] =
    useState("USD");

  const [exchangeRates] = useState(
    DEFAULT_EXCHANGE_RATES
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState(null);

  const [successAlert, setSuccessAlert] =
    useState("");

  const [formData, setFormData] =
    useState(getInitialForm());

  // ==========================================================
  // READ SAVED CURRENCY
  // ==========================================================

  useEffect(() => {
    try {
      const savedCurrency =
        localStorage.getItem(
          "preferredCurrency"
        ) ||
        localStorage.getItem(
          "currency"
        ) ||
        localStorage.getItem(
          "activeCurrency"
        );

      if (savedCurrency) {
        const currency =
          String(
            savedCurrency
          ).toUpperCase();

        if (
          [
            "USD",
            "INR",
            "EUR",
            "GBP",
          ].includes(currency)
        ) {
          setActiveCurrency(
            currency
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not read currency:",
        error
      );
    }
  }, []);

  // ==========================================================
  // CURRENCY EVENT
  // ==========================================================

  useEffect(() => {
    const handleCurrencyChange = (
      event
    ) => {
      const currency =
        event?.detail?.currency ||
        event?.detail?.currencyCode ||
        event?.detail;

      if (
        typeof currency === "string"
      ) {
        const code =
          currency.toUpperCase();

        if (
          [
            "USD",
            "INR",
            "EUR",
            "GBP",
          ].includes(code)
        ) {
          setActiveCurrency(code);
        }
      }
    };

    window.addEventListener(
      "mintmatrix-currency-change",
      handleCurrencyChange
    );

    window.addEventListener(
      "currencyChange",
      handleCurrencyChange
    );

    return () => {
      window.removeEventListener(
        "mintmatrix-currency-change",
        handleCurrencyChange
      );

      window.removeEventListener(
        "currencyChange",
        handleCurrencyChange
      );
    };
  }, []);

  // ==========================================================
  // FETCH TRANSACTIONS
  // ==========================================================

  const fetchTransactions =
    useCallback(async () => {
      try {
        const response =
          await axios.get(
            `${API_BASE_URL}/transactions`
          );

        const data = safeArray(
          response.data
        );

        setTransactions(data);
      } catch (error) {
        console.error(
          "Error loading transactions:",
          error
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to load transactions."
        );
      }
    }, []);

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories =
    useCallback(async () => {
      try {
        const response =
          await axios.get(
            `${API_BASE_URL}/categories`
          );

        const data = safeArray(
          response.data
        );

        setCategories(data);
      } catch (error) {
        console.error(
          "Error loading categories:",
          error
        );

        setCategories([]);

        message.error(
          error?.response?.data?.message ||
            "Failed to load categories."
        );
      }
    }, []);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    const loadData =
      async () => {
        setLoading(true);

        await Promise.all([
          fetchTransactions(),
          fetchCategories(),
        ]);

        setLoading(false);
      };

    loadData();
  }, [
    fetchTransactions,
    fetchCategories,
  ]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    setLoading(true);

    await Promise.all([
      fetchTransactions(),
      fetchCategories(),
    ]);

    setLoading(false);

    message.success(
      "Transactions refreshed."
    );
  };

  // ==========================================================
  // CURRENCY CONVERSION
  // ==========================================================

  const convertValue =
    useCallback(
      (
        amount,
        fromCurrency,
        toCurrency = activeCurrency
      ) => {
        const value =
          Number(amount);

        if (
          !Number.isFinite(value)
        ) {
          return 0;
        }

        const from = String(
          fromCurrency || "USD"
        ).toUpperCase();

        const to = String(
          toCurrency || "USD"
        ).toUpperCase();

        if (from === to) {
          return value;
        }

        const fromRate =
          Number(
            exchangeRates[from]
          ) || 1;

        const toRate =
          Number(
            exchangeRates[to]
          ) || 1;

        return (
          (value / fromRate) *
          toRate
        );
      },
      [
        activeCurrency,
        exchangeRates,
      ]
    );

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (
    field,
    value
  ) => {
    setFormData(
      (previous) => {
        const updated = {
          ...previous,
          [field]: value,
        };

        if (
          field ===
          "transactionType"
        ) {
          updated.categoryId =
            "";
        }

        return updated;
      }
    );
  };

  // ==========================================================
  // ADD TRANSACTION
  // ==========================================================

  const openAddModal = () => {
    setEditingTransaction(
      null
    );

    setFormData({
      ...getInitialForm(),
      currencyCode:
        activeCurrency,
    });

    setSuccessAlert("");

    setModalOpen(true);
  };

  // ==========================================================
  // EDIT TRANSACTION
  // ==========================================================

  const openEditModal = (
    transaction
  ) => {
    setEditingTransaction(
      transaction
    );

    setFormData({
      title:
        transaction?.title || "",

      amount:
        transaction?.amount !==
          undefined &&
        transaction?.amount !==
          null
          ? String(
              transaction.amount
            )
          : "",

      currencyCode:
        transaction?.currencyCode ||
        transaction?.currency?.code ||
        "USD",

      transactionType:
        transaction?.transactionType ||
        transaction?.type ||
        "EXPENSE",

      categoryId:
        transaction?.categoryId ??
        transaction?.category?.id ??
        "",

      transactionDate:
        transaction?.transactionDate
          ? dayjs(
              transaction.transactionDate
            ).format(
              "YYYY-MM-DD"
            )
          : dayjs().format(
              "YYYY-MM-DD"
            ),

      note:
        transaction?.note || "",
    });

    setSuccessAlert("");

    setModalOpen(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    setEditingTransaction(
      null
    );

    setFormData(
      getInitialForm()
    );

    setSuccessAlert("");
  };

  // ==========================================================
  // SUBMIT CREATE / UPDATE
  // ==========================================================

  const handleSubmit =
    async () => {
      // ------------------------------------------------------
      // TITLE
      // ------------------------------------------------------

      if (
        !formData.title.trim()
      ) {
        message.error(
          "Please enter a transaction title."
        );

        return;
      }

      // ------------------------------------------------------
      // AMOUNT
      // ------------------------------------------------------

      const amount =
        Number(
          formData.amount
        );

      if (
        !formData.amount ||
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        message.error(
          "Please enter a valid amount greater than 0."
        );

        return;
      }

      // ------------------------------------------------------
      // TYPE
      // ------------------------------------------------------

      if (
        !formData.transactionType
      ) {
        message.error(
          "Please select transaction type."
        );

        return;
      }

      // ------------------------------------------------------
      // CATEGORY
      // ------------------------------------------------------

      if (
        !formData.categoryId
      ) {
        message.error(
          "Please select a category."
        );

        return;
      }

      // ------------------------------------------------------
      // DATE
      // ------------------------------------------------------

      if (
        !formData.transactionDate
      ) {
        message.error(
          "Please select a transaction date."
        );

        return;
      }

      // ------------------------------------------------------
      // PAYLOAD
      // ------------------------------------------------------

      const payload = {
        title:
          formData.title.trim(),

        amount: amount,

        currencyCode:
          formData.currencyCode,

        transactionType:
          formData.transactionType,

        transactionDate:
          formData.transactionDate,

        note: formData.note
          ? formData.note.trim()
          : null,

        categoryId:
          Number(
            formData.categoryId
          ),
      };

      try {
        setSaving(true);

        // ----------------------------------------------------
        // UPDATE
        // ----------------------------------------------------

        if (
          editingTransaction?.id
        ) {
          await axios.put(
            `${API_BASE_URL}/transactions/${editingTransaction.id}`,
            payload
          );

          message.success(
            "Transaction updated successfully"
          );

          setSuccessAlert(
            "Transaction updated successfully"
          );
        }

        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        else {
          await axios.post(
            `${API_BASE_URL}/transactions`,
            payload
          );

          message.success(
            "Transaction created successfully."
          );

          setSuccessAlert(
            "Transaction created successfully."
          );
        }

        // ----------------------------------------------------
        // REFRESH
        // ----------------------------------------------------

        await fetchTransactions();

        setModalOpen(false);

        setEditingTransaction(
          null
        );

        setFormData(
          getInitialForm()
        );
      } catch (error) {
        console.error(
          "Error saving transaction:",
          error
        );

        message.error(
          error?.response
            ?.data?.message ||
            error?.response?.data ||
            "Failed to save transaction."
        );
      } finally {
        setSaving(false);
      }
    };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    transactionId
  ) => {
    if (!transactionId) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/transactions/${transactionId}`
      );

      message.success(
        "Transaction deleted successfully."
      );

      await fetchTransactions();
    } catch (error) {
      console.error(
        "Error deleting transaction:",
        error
      );

      message.error(
        error?.response
          ?.data?.message ||
          error?.response?.data ||
          "Failed to delete transaction."
      );
    }
  };

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const formCategoryOptions =
    useMemo(() => {
      const selectedType =
        String(
          formData.transactionType ||
            ""
        ).toUpperCase();

      const validCategories =
        categories.filter(
          (category) =>
            category &&
            category.id !==
              undefined &&
            category.id !== null
        );

      const matchingCategories =
        validCategories.filter(
          (category) => {
            const categoryType =
              String(
                category?.type ||
                  category?.transactionType ||
                  category?.categoryType ||
                  ""
              ).toUpperCase();

            return (
              categoryType ===
              selectedType
            );
          }
        );

      if (
        matchingCategories.length >
        0
      ) {
        return matchingCategories.map(
          (category) => ({
            value: category.id,
            label:
              category.name ||
              category.categoryName ||
              `Category ${category.id}`,
          })
        );
      }

      const categoriesWithoutType =
        validCategories.filter(
          (category) => {
            const categoryType =
              String(
                category?.type ||
                  category?.transactionType ||
                  category?.categoryType ||
                  ""
              ).trim();

            return !categoryType;
          }
        );

      return categoriesWithoutType.map(
        (category) => ({
          value: category.id,
          label:
            category.name ||
            category.categoryName ||
            `Category ${category.id}`,
        })
      );
    }, [
      categories,
      formData.transactionType,
    ]);

  // ==========================================================
  // CATEGORY FILTER OPTIONS
  // ==========================================================

  const categoryFilterOptions =
    useMemo(() => {
      const map = new Map();

      categories.forEach(
        (category) => {
          if (
            category?.id !==
              undefined &&
            category?.id !== null
          ) {
            map.set(
              String(category.id),
              {
                value: String(
                  category.id
                ),
                label:
                  category.name ||
                  category.categoryName ||
                  `Category ${category.id}`,
              }
            );
          }
        }
      );

      return Array.from(
        map.values()
      );
    }, [categories]);

  // ==========================================================
  // FILTER TRANSACTIONS
  // ==========================================================

  const filteredTransactions =
    useMemo(() => {
      const text =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {
          const title =
            String(
              transaction?.title ||
                ""
            ).toLowerCase();

          const note =
            String(
              transaction?.note ||
                ""
            ).toLowerCase();

          const categoryName =
            String(
              transaction?.category
                ?.name ||
                transaction?.categoryName ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !text ||
            title.includes(
              text
            ) ||
            note.includes(
              text
            ) ||
            categoryName.includes(
              text
            );

          const transactionType =
            String(
              transaction?.transactionType ||
                transaction?.type ||
                ""
            ).toUpperCase();

          const matchesType =
            typeFilter === "ALL" ||
            transactionType ===
              typeFilter;

          const transactionCategoryId =
            transaction?.categoryId ??
            transaction?.category
              ?.id;

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            String(
              transactionCategoryId
            ) ===
              String(
                categoryFilter
              );

          return (
            matchesSearch &&
            matchesType &&
            matchesCategory
          );
        }
      );
    }, [
      transactions,
      search,
      typeFilter,
      categoryFilter,
    ]);

  // ==========================================================
  // TOTAL INCOME
  // ==========================================================

  const totalIncome =
    useMemo(() => {
      return transactions
        .filter(
          (transaction) => {
            const type =
              String(
                transaction?.transactionType ||
                  transaction?.type ||
                  ""
              ).toUpperCase();

            return (
              type === "INCOME"
            );
          }
        )
        .reduce(
          (total, transaction) => {
            return (
              total +
              convertValue(
                transaction?.amount,
                transaction?.currencyCode ||
                  transaction?.currency?.code ||
                  "USD"
              )
            );
          },
          0
        );
    }, [
      transactions,
      convertValue,
    ]);

  // ==========================================================
  // TOTAL EXPENSE
  // ==========================================================

  const totalExpense =
    useMemo(() => {
      return transactions
        .filter(
          (transaction) => {
            const type =
              String(
                transaction?.transactionType ||
                  transaction?.type ||
                  ""
              ).toUpperCase();

            return (
              type === "EXPENSE"
            );
          }
        )
        .reduce(
          (total, transaction) => {
            return (
              total +
              convertValue(
                transaction?.amount,
                transaction?.currencyCode ||
                  transaction?.currency?.code ||
                  "USD"
              )
            );
          },
          0
        );
    }, [
      transactions,
      convertValue,
    ]);

  // ==========================================================
  // BALANCE
  // ==========================================================

  const balance =
    totalIncome - totalExpense;

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (
    amount,
    currency = activeCurrency
  ) => {
    const code =
      String(
        currency || "USD"
      ).toUpperCase();

    const symbol =
      getCurrencySymbol(
        code
      );

    const value =
      Number(amount) || 0;

    return `${symbol}${value.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================================
  // CATEGORY NAME
  // ==========================================================

  const getCategoryName =
    (transaction) => {
      if (
        transaction?.category
          ?.name
      ) {
        return transaction
          .category.name;
      }

      if (
        transaction?.categoryName
      ) {
        return transaction.categoryName;
      }

      const categoryId =
        transaction?.categoryId;

      const category =
        categories.find(
          (item) =>
            String(item?.id) ===
            String(categoryId)
        );

      if (category?.name) {
        return category.name;
      }

      if (
        category?.categoryName
      ) {
        return category.categoryName;
      }

      return "Uncategorized";
    };

  // ==========================================================
  // TRANSACTION TYPE
  // ==========================================================

  const getTransactionType =
    (transaction) => {
      return String(
        transaction?.transactionType ||
          transaction?.type ||
          "EXPENSE"
      ).toUpperCase();
    };

  // ==========================================================
  // TRANSACTION CURRENCY
  // ==========================================================

  const getTransactionCurrency =
    (transaction) => {
      return String(
        transaction?.currencyCode ||
          transaction?.currency?.code ||
          "USD"
      ).toUpperCase();
    };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <Space
          direction="vertical"
          align="center"
        >
          <Spin size="large" />

          <Text>
            Loading transactions...
          </Text>
        </Space>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        width: "100%",
        padding: "8px 0",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
            }}
          >
            Transactions
          </Title>

          <Text type="secondary">
            Track and manage your income
            and expenses.
          </Text>
        </div>

        <Space>
          <Button
            icon={
              <ReloadOutlined />
            }
            onClick={
              handleRefresh
            }
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={
              <PlusOutlined />
            }
            onClick={
              openAddModal
            }
          >
            Add Transaction
          </Button>
        </Space>
      </div>

      {/* SUCCESS ALERT */}

      {successAlert && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            marginBottom: 16,
            borderRadius: 8,
            background:
              "#f6ffed",
            border:
              "1px solid #b7eb8f",
          }}
        >
          <Text type="success">
            {successAlert}
          </Text>
        </div>
      )}

      {/* SUMMARY */}

      <Row
        gutter={[16, 16]}
        style={{
          marginBottom: 24,
        }}
      >
        <Col xs={24} sm={8}>
          <Card>
            <Text type="secondary">
              Total Income
            </Text>

            <Title
              level={3}
              style={{
                margin:
                  "8px 0 0",
              }}
            >
              {formatCurrency(
                totalIncome
              )}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Text type="secondary">
              Total Expense
            </Text>

            <Title
              level={3}
              style={{
                margin:
                  "8px 0 0",
              }}
            >
              {formatCurrency(
                totalExpense
              )}
            </Title>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Text type="secondary">
              Balance
            </Text>

            <Title
              level={3}
              style={{
                margin:
                  "8px 0 0",
              }}
            >
              {formatCurrency(
                balance
              )}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* FILTERS */}

      <Card
        style={{
          marginBottom: 24,
        }}
      >
        <Row
          gutter={[12, 12]}
        >
          <Col
            xs={24}
            md={8}
          >
            <Input
              allowClear
              prefix={
                <SearchOutlined />
              }
              placeholder="Search transactions"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </Col>

          <Col
            xs={24}
            sm={12}
            md={6}
          >
            <Select
              style={{
                width: "100%",
              }}
              value={typeFilter}
              onChange={
                setTypeFilter
              }
              suffixIcon={
                <FilterOutlined />
              }
              options={[
                {
                  value: "ALL",
                  label:
                    "All Types",
                },
                {
                  value:
                    "INCOME",
                  label: "Income",
                },
                {
                  value:
                    "EXPENSE",
                  label: "Expense",
                },
              ]}
            />
          </Col>

          <Col
            xs={24}
            sm={12}
            md={6}
          >
            <Select
              style={{
                width: "100%",
              }}
              value={
                categoryFilter
              }
              onChange={
                setCategoryFilter
              }
              placeholder="Filter by category"
              options={[
                {
                  value: "ALL",
                  label:
                    "All Categories",
                },
                ...categoryFilterOptions,
              ]}
              showSearch
              optionFilterProp="label"
            />
          </Col>

          <Col
            xs={24}
            md={4}
          >
            <Button
              block
              onClick={() => {
                setSearch("");
                setTypeFilter(
                  "ALL"
                );
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

      {filteredTransactions.length ===
      0 ? (
        <Card>
          <Empty
            description={
              transactions.length ===
              0
                ? "No transactions found"
                : "No transactions match your filters"
            }
          />

          {transactions.length ===
            0 && (
            <div
              style={{
                textAlign:
                  "center",
                marginTop: 16,
              }}
            >
              <Button
                type="primary"
                icon={
                  <PlusOutlined />
                }
                onClick={
                  openAddModal
                }
              >
                Add Your First Transaction
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Space
          direction="vertical"
          size={16}
          style={{
            width: "100%",
          }}
        >
          {filteredTransactions.map(
            (transaction) => {
              const type =
                getTransactionType(
                  transaction
                );

              const transactionCurrency =
                getTransactionCurrency(
                  transaction
                );

              const categoryName =
                getCategoryName(
                  transaction
                );

              const amount =
                Number(
                  transaction?.amount
                ) || 0;

              const convertedAmount =
                convertValue(
                  amount,
                  transactionCurrency
                );

              const isIncome =
                type === "INCOME";

              return (
                <Card
                  key={
                    transaction.id
                  }
                >
                  <Row
                    gutter={[
                      16,
                      16,
                    ]}
                    align="middle"
                  >
                    <Col
                      xs={24}
                      md={10}
                    >
                      <Space
                        direction="vertical"
                        size={6}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 17,
                          }}
                        >
                          {transaction.title ||
                            "Untitled Transaction"}
                        </Text>

                        <Space wrap>
                          <Tag
                            color={
                              isIncome
                                ? "green"
                                : "red"
                            }
                          >
                            {isIncome
                              ? "INCOME"
                              : "EXPENSE"}
                          </Tag>

                          <Tag>
                            {
                              categoryName
                            }
                          </Tag>
                        </Space>

                        {transaction.note && (
                          <Text type="secondary">
                            {
                              transaction.note
                            }
                          </Text>
                        )}

                        {transaction.transactionDate && (
                          <Text type="secondary">
                            {dayjs(
                              transaction.transactionDate
                            ).format(
                              "DD MMM YYYY"
                            )}
                          </Text>
                        )}
                      </Space>
                    </Col>

                    <Col
                      xs={24}
                      md={6}
                    >
                      <Space
                        direction="vertical"
                        size={2}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: 18,
                          }}
                        >
                          {formatCurrency(
                            amount,
                            transactionCurrency
                          )}
                        </Text>

                        {transactionCurrency !==
                          activeCurrency && (
                          <Text type="secondary">
                            ≈{" "}
                            {formatCurrency(
                              convertedAmount,
                              activeCurrency
                            )}
                          </Text>
                        )}
                      </Space>
                    </Col>

                    <Col
                      xs={24}
                      md={8}
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
                        >
                          Edit
                        </Button>

                        <Popconfirm
                          title="Delete transaction?"
                          description="This transaction will be permanently deleted."
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{
                            danger:
                              true,
                          }}
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
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              );
            }
          )}
        </Space>
      )}

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      <Modal
        open={modalOpen}
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add New Transaction"
        }
        onCancel={
          closeModal
        }
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={
            handleSubmit
          }
        >
          {/* ==================================================
              TITLE
              Native required input is intentional for T28.
          ================================================== */}

          <Form.Item label="Title">
            <input
              id="transaction-title"
              name="title"
              type="text"
              placeholder="e.g., Grocery Shopping"
              required
              value={
                formData.title
              }
              onChange={(event) =>
                handleChange(
                  "title",
                  event.target.value
                )
              }
              style={{
                width: "100%",
                height: 40,
                padding:
                  "0 11px",
                border:
                  "1px solid #d9d9d9",
                borderRadius: 6,
                boxSizing:
                  "border-box",
                fontSize: 14,
                outline: "none",
              }}
            />
          </Form.Item>

          {/* AMOUNT */}

          <Form.Item label="Amount">
            <Input
              id="transaction-amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="Enter amount"
              value={
                formData.amount
              }
              onChange={(event) =>
                handleChange(
                  "amount",
                  event.target.value
                )
              }
            />
          </Form.Item>

          {/* CURRENCY */}

          <Form.Item label="Currency">
            <Select
              id="transaction-currency"
              style={{
                width: "100%",
              }}
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
                CURRENCY_OPTIONS
              }
            />
          </Form.Item>

          {/* ==================================================
              TYPE

              IMPORTANT:
              This is a native select because T9 uses:

              getByLabelText(/Type/i)
              fireEvent.change(...)
          ================================================== */}

          <Form.Item label="Type">
            <label
              htmlFor="transaction-type"
              style={{
                position:
                  "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow:
                  "hidden",
                clip:
                  "rect(0, 0, 0, 0)",
                whiteSpace:
                  "nowrap",
                border: 0,
              }}
            >
              Type
            </label>

            <select
              id="transaction-type"
              name="transactionType"
              aria-label="Type"
              required
              value={
                formData.transactionType
              }
              onChange={(event) =>
                handleChange(
                  "transactionType",
                  event.target.value
                )
              }
              style={{
                width: "100%",
                height: 40,
                padding:
                  "0 11px",
                border:
                  "1px solid #d9d9d9",
                borderRadius: 6,
                background:
                  "#ffffff",
                fontSize: 14,
                cursor:
                  "pointer",
              }}
            >
              <option value="">
                Select transaction type
              </option>

              <option value="INCOME">
                Income
              </option>

              <option value="EXPENSE">
                Expense
              </option>
            </select>
          </Form.Item>

          {/* CATEGORY */}

          <Form.Item label="Category">
            <Select
              id="transaction-category"
              style={{
                width: "100%",
              }}
              placeholder="Select category"
              value={
                formData.categoryId ||
                undefined
              }
              onChange={(value) =>
                handleChange(
                  "categoryId",
                  value
                )
              }
              options={
                formCategoryOptions
              }
              showSearch
              optionFilterProp="label"
              notFoundContent={
                categories.length ===
                0
                  ? "No categories found"
                  : "No matching categories"
              }
            />
          </Form.Item>

          {/* DATE */}

          <Form.Item label="Date">
            <Input
              id="transaction-date"
              type="date"
              value={
                formData.transactionDate
              }
              onChange={(event) =>
                handleChange(
                  "transactionDate",
                  event.target.value
                )
              }
            />
          </Form.Item>

          {/* NOTES */}

          <Form.Item label="Notes">
            <Input.TextArea
              id="transaction-note"
              rows={4}
              placeholder="Optional notes..."
              value={
                formData.note
              }
              onChange={(event) =>
                handleChange(
                  "note",
                  event.target.value
                )
              }
              maxLength={500}
              showCount
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
                onClick={
                  closeModal
                }
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
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
};

export default TransactionsPage;