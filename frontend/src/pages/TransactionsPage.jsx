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

import "../styles/TransactionsPage.css";

const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:8080/api";

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
// REQUIRED CURRENCIES
// ============================================================

const REQUIRED_CURRENCIES = [
  "USD",
  "INR",
  "EUR",
  "GBP",
];

// ============================================================
// CURRENCY SYMBOL
// ============================================================

const getCurrencySymbol = (currencyCode) => {
  const code = String(currencyCode || "USD").toUpperCase();

  const symbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  return symbols[code] || code;
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
  transactionDate: dayjs().format("YYYY-MM-DD"),
  note: "",
});

// ============================================================
// SAFE ARRAY
// ============================================================

const safeArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.categories)) {
    return value.categories;
  }

  if (Array.isArray(value?.transactions)) {
    return value.transactions;
  }

  if (Array.isArray(value?.currencies)) {
    return value.currencies;
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

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [activeCurrency, setActiveCurrency] = useState("USD");

  const [exchangeRates, setExchangeRates] = useState(
    DEFAULT_EXCHANGE_RATES
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [successAlert, setSuccessAlert] = useState("");

  const [formData, setFormData] = useState(
    getInitialForm()
  );

  const mountedRef = useRef(true);

  // ==========================================================
  // MOUNT / UNMOUNT
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ==========================================================
  // READ PREFERRED CURRENCY
  // ==========================================================

  useEffect(() => {
    try {
      const savedCurrency =
        localStorage.getItem("preferredCurrency") ||
        localStorage.getItem("currency") ||
        localStorage.getItem("activeCurrency");

      if (
        savedCurrency &&
        REQUIRED_CURRENCIES.includes(
          savedCurrency.toUpperCase()
        )
      ) {
        setActiveCurrency(
          savedCurrency.toUpperCase()
        );
      }
    } catch (error) {
      console.error(
        "Unable to read preferred currency:",
        error
      );
    }
  }, []);

  // ==========================================================
  // CURRENCY CHANGE EVENT
  // ==========================================================

  useEffect(() => {
    const handleCurrencyChange = (event) => {
      const currency =
        event?.detail?.currency ||
        event?.detail?.currencyCode ||
        event?.detail;

      if (
        typeof currency === "string" &&
        REQUIRED_CURRENCIES.includes(
          currency.toUpperCase()
        )
      ) {
        setActiveCurrency(
          currency.toUpperCase()
        );
      }
    };

    window.addEventListener(
      "mintmatrix-currency-change",
      handleCurrencyChange
    );

    return () => {
      window.removeEventListener(
        "mintmatrix-currency-change",
        handleCurrencyChange
      );
    };
  }, []);

  // ==========================================================
  // FETCH TRANSACTIONS
  // ==========================================================

  const fetchTransactions = useCallback(
    async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/transactions`
        );

        if (!mountedRef.current) {
          return;
        }

        const data = safeArray(response.data);

        setTransactions(data);
      } catch (error) {
        console.error(
          "Failed to fetch transactions:",
          error
        );

        if (!mountedRef.current) {
          return;
        }

        message.error(
          error?.response?.data?.message ||
            "Failed to load transactions."
        );
      }
    },
    []
  );

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories = useCallback(
    async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories`
        );

        if (!mountedRef.current) {
          return;
        }

        const data = safeArray(response.data);

        console.log(
          "Categories received from backend:",
          data
        );

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );

        if (!mountedRef.current) {
          return;
        }

        setCategories([]);

        message.error(
          error?.response?.data?.message ||
            "Failed to load categories."
        );
      }
    },
    []
  );

  // ==========================================================
  // FETCH CURRENCIES
  // ==========================================================

  const fetchCurrencies = useCallback(
    async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/currencies`
        );

        if (!mountedRef.current) {
          return;
        }

        const data = safeArray(response.data);

        setCurrencies(data);

        const newRates = {
          ...DEFAULT_EXCHANGE_RATES,
        };

        data.forEach((currency) => {
          const code = String(
            currency?.code ||
              currency?.currencyCode ||
              ""
          ).toUpperCase();

          const rate = Number(
            currency?.exchangeRate ??
              currency?.rate ??
              currency?.conversionRate
          );

          if (
            code &&
            Number.isFinite(rate) &&
            rate > 0
          ) {
            newRates[code] = rate;
          }
        });

        setExchangeRates(newRates);
      } catch (error) {
        console.error(
          "Failed to fetch currencies:",
          error
        );

        if (!mountedRef.current) {
          return;
        }

        setCurrencies([]);
        setExchangeRates(
          DEFAULT_EXCHANGE_RATES
        );
      }
    },
    []
  );

  // ==========================================================
  // LOAD ALL DATA
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTransactions(),
        fetchCategories(),
        fetchCurrencies(),
      ]);

      if (mountedRef.current) {
        setLoading(false);
      }
    };

    loadData();
  }, [
    fetchTransactions,
    fetchCategories,
    fetchCurrencies,
  ]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    setLoading(true);

    await Promise.all([
      fetchTransactions(),
      fetchCategories(),
      fetchCurrencies(),
    ]);

    if (mountedRef.current) {
      setLoading(false);
    }

    message.success(
      "Transactions refreshed."
    );
  };

  // ==========================================================
  // CONVERT CURRENCY
  // ==========================================================

  const convertValue = useCallback(
    (
      amount,
      fromCurrency,
      toCurrency = activeCurrency
    ) => {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount)) {
        return 0;
      }

      const from = String(
        fromCurrency || "USD"
      ).toUpperCase();

      const to = String(
        toCurrency || "USD"
      ).toUpperCase();

      if (from === to) {
        return numericAmount;
      }

      const fromRate =
        Number(exchangeRates[from]) || 1;

      const toRate =
        Number(exchangeRates[to]) || 1;

      return (
        (numericAmount / fromRate) *
        toRate
      );
    },
    [
      activeCurrency,
      exchangeRates,
    ]
  );

  // ==========================================================
  // HANDLE FORM CHANGE
  // ==========================================================

  const handleChange = (
    field,
    value
  ) => {
    setFormData((previous) => {
      const updated = {
        ...previous,
        [field]: value,
      };

      // When Income / Expense changes,
      // clear the old category.
      if (
        field === "transactionType"
      ) {
        updated.categoryId = "";
      }

      return updated;
    });
  };

  // ==========================================================
  // OPEN ADD MODAL
  // ==========================================================

  const openAddModal = () => {
    setEditingTransaction(null);

    setFormData({
      ...getInitialForm(),
      currencyCode:
        REQUIRED_CURRENCIES.includes(
          activeCurrency
        )
          ? activeCurrency
          : "USD",
    });

    setSuccessAlert("");

    setModalOpen(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const openEditModal = (
    transaction
  ) => {
    setEditingTransaction(
      transaction
    );

    const transactionCategoryId =
      transaction?.categoryId ??
      transaction?.category?.id ??
      "";

    setFormData({
      title:
        transaction?.title || "",

      amount:
        transaction?.amount !==
          undefined &&
        transaction?.amount !== null
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
        transactionCategoryId,

      transactionDate:
        transaction?.transactionDate
          ? dayjs(
              transaction.transactionDate
            ).format("YYYY-MM-DD")
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
    setEditingTransaction(null);
    setFormData(
      getInitialForm()
    );
    setSuccessAlert("");
  };

  // ==========================================================
  // SUBMIT TRANSACTION
  // ==========================================================

  const handleSubmit = async () => {
    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (!formData.title.trim()) {
      message.error(
        "Please enter a transaction title."
      );
      return;
    }

    // --------------------------------------------------------
    // AMOUNT
    // --------------------------------------------------------

    const amount = Number(
      formData.amount
    );

    if (
      !formData.amount ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      message.error(
        "Please enter a valid amount greater than 0."
      );
      return;
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (!formData.categoryId) {
      message.error(
        "Please select a category."
      );
      return;
    }

    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    if (
      !formData.transactionDate
    ) {
      message.error(
        "Please select a transaction date."
      );
      return;
    }

    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

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

      categoryId: Number(
        formData.categoryId
      ),
    };

    console.log(
      "Transaction payload:",
      payload
    );

    try {
      setSaving(true);

      // ======================================================
      // EDIT
      // ======================================================

      if (
        editingTransaction?.id
      ) {
        await axios.put(
          `${API_BASE_URL}/transactions/${editingTransaction.id}`,
          payload
        );

        message.success(
          "Transaction updated successfully."
        );
      }

      // ======================================================
      // ADD
      // ======================================================

      else {
        await axios.post(
          `${API_BASE_URL}/transactions`,
          payload
        );

        message.success(
          "Transaction added successfully."
        );
      }

      // ======================================================
      // REFRESH LIST
      // ======================================================

      await fetchTransactions();

      if (mountedRef.current) {
        setSuccessAlert(
          editingTransaction
            ? "Transaction updated successfully."
            : "Transaction added successfully."
        );

        setModalOpen(false);
        setEditingTransaction(null);
        setFormData(
          getInitialForm()
        );
      }
    } catch (error) {
      console.error(
        "Failed to save transaction:",
        error
      );

      if (!mountedRef.current) {
        return;
      }

      message.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to save transaction."
      );
    } finally {
      if (mountedRef.current) {
        setSaving(false);
      }
    }
  };

  // ==========================================================
  // DELETE TRANSACTION
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
        "Failed to delete transaction:",
        error
      );

      message.error(
        error?.response?.data?.message ||
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

      // ------------------------------------------------------
      // First try categories matching transaction type
      // ------------------------------------------------------

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
              categoryType &&
              categoryType ===
                selectedType
            );
          }
        );

      // ------------------------------------------------------
      // If backend has type information and matching
      // categories exist, show matching categories.
      // ------------------------------------------------------

      if (
        matchingCategories.length > 0
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

      // ------------------------------------------------------
      // If backend categories don't have a type field,
      // show all categories.
      // ------------------------------------------------------

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

      if (
        categoriesWithoutType.length > 0
      ) {
        return categoriesWithoutType.map(
          (category) => ({
            value: category.id,
            label:
              category.name ||
              category.categoryName ||
              `Category ${category.id}`,
          })
        );
      }

      // ------------------------------------------------------
      // No matching categories
      // ------------------------------------------------------

      return [];
    }, [
      categories,
      formData.transactionType,
    ]);

  // ==========================================================
  // CATEGORY FILTER OPTIONS
  // ==========================================================

  const categoryFilterOptions =
    useMemo(() => {
      const uniqueCategories =
        new Map();

      categories.forEach(
        (category) => {
          if (
            category?.id !==
              undefined &&
            category?.id !== null
          ) {
            uniqueCategories.set(
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
        uniqueCategories.values()
      );
    }, [categories]);

  // ==========================================================
  // CURRENCY OPTIONS
  // ==========================================================

  const currencyOptions =
    useMemo(() => {
      return [
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
    }, []);

  // ==========================================================
  // FILTER TRANSACTIONS
  // ==========================================================

  const filteredTransactions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {
          // --------------------------------------------------
          // SEARCH
          // --------------------------------------------------

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
              transaction
                ?.category?.name ||
                transaction?.categoryName ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            title.includes(
              normalizedSearch
            ) ||
            note.includes(
              normalizedSearch
            ) ||
            categoryName.includes(
              normalizedSearch
            );

          // --------------------------------------------------
          // TYPE
          // --------------------------------------------------

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

          // --------------------------------------------------
          // CATEGORY
          // --------------------------------------------------

          const transactionCategoryId =
            transaction?.categoryId ??
            transaction?.category?.id;

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
        .filter((transaction) => {
          const type =
            String(
              transaction?.transactionType ||
                transaction?.type ||
                ""
            ).toUpperCase();

          return type === "INCOME";
        })
        .reduce(
          (
            total,
            transaction
          ) => {
            const amount =
              convertValue(
                transaction?.amount,
                transaction?.currencyCode ||
                  transaction
                    ?.currency?.code ||
                  "USD"
              );

            return (
              total + amount
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
        .filter((transaction) => {
          const type =
            String(
              transaction?.transactionType ||
                transaction?.type ||
                ""
            ).toUpperCase();

          return type === "EXPENSE";
        })
        .reduce(
          (
            total,
            transaction
          ) => {
            const amount =
              convertValue(
                transaction?.amount,
                transaction?.currencyCode ||
                  transaction
                    ?.currency?.code ||
                  "USD"
              );

            return (
              total + amount
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
      getCurrencySymbol(code);

    const numericAmount =
      Number(amount) || 0;

    return `${symbol}${numericAmount.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================================
  // GET CATEGORY NAME
  // ==========================================================

  const getCategoryName = (
    transaction
  ) => {
    if (
      transaction?.category
        ?.name
    ) {
      return transaction.category.name;
    }

    if (
      transaction?.categoryName
    ) {
      return transaction.categoryName;
    }

    const categoryId =
      transaction?.categoryId;

    if (
      categoryId !==
        undefined &&
      categoryId !== null
    ) {
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
    }

    return "Uncategorized";
  };

  // ==========================================================
  // GET TRANSACTION TYPE
  // ==========================================================

  const getTransactionType = (
    transaction
  ) => {
    return String(
      transaction?.transactionType ||
        transaction?.type ||
        "EXPENSE"
    ).toUpperCase();
  };

  // ==========================================================
  // GET TRANSACTION CURRENCY
  // ==========================================================

  const getTransactionCurrency = (
    transaction
  ) => {
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
          alignItems: "center",
          justifyContent: "center",
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
  // PAGE
  // ==========================================================

  return (
    <div className="transactions-page">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="transactions-header"
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              marginBottom: 4,
            }}
          >
            Transactions
          </Title>

          <Text type="secondary">
            Track and manage your
            income and expenses.
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

      {/* ================================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================== */}

      {successAlert && (
        <div
          style={{
            marginBottom: 16,
            padding:
              "10px 14px",
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

      {/* ================================================== */}
      {/* SUMMARY */}
      {/* ================================================== */}

      <Row
        gutter={[
          16,
          16,
        ]}
        style={{
          marginBottom: 24,
        }}
      >
        <Col
          xs={24}
          sm={8}
        >
          <Card>
            <Text type="secondary">
              Total Income
            </Text>

            <Title
              level={3}
              style={{
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {formatCurrency(
                totalIncome
              )}
            </Title>
          </Card>
        </Col>

        <Col
          xs={24}
          sm={8}
        >
          <Card>
            <Text type="secondary">
              Total Expense
            </Text>

            <Title
              level={3}
              style={{
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {formatCurrency(
                totalExpense
              )}
            </Title>
          </Card>
        </Col>

        <Col
          xs={24}
          sm={8}
        >
          <Card>
            <Text type="secondary">
              Balance
            </Text>

            <Title
              level={3}
              style={{
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {formatCurrency(
                balance
              )}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* ================================================== */}
      {/* FILTERS */}
      {/* ================================================== */}

      <Card
        style={{
          marginBottom: 24,
        }}
      >
        <Row
          gutter={[
            12,
            12,
          ]}
        >
          {/* SEARCH */}

          <Col
            xs={24}
            md={8}
          >
            <Input
              allowClear
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
            />
          </Col>

          {/* TYPE FILTER */}

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
                typeFilter
              }
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
                  label:
                    "Income",
                },
                {
                  value:
                    "EXPENSE",
                  label:
                    "Expense",
                },
              ]}
            />
          </Col>

          {/* CATEGORY FILTER */}

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

          {/* CLEAR */}

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

      {/* ================================================== */}
      {/* TRANSACTIONS */}
      {/* ================================================== */}

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
                Add Your First
                Transaction
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

              const originalAmount =
                Number(
                  transaction?.amount
                ) || 0;

              const convertedAmount =
                convertValue(
                  originalAmount,
                  transactionCurrency
                );

              const isIncome =
                type === "INCOME";

              return (
                <Card
                  key={
                    transaction.id
                  }
                  className="transaction-card"
                >
                  <Row
                    gutter={[
                      16,
                      16,
                    ]}
                    align="middle"
                  >
                    {/* TITLE */}

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
                          <Text
                            type="secondary"
                          >
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

                    {/* AMOUNT */}

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
                            originalAmount,
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

                    {/* ACTIONS */}

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

      {/* ================================================== */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================== */}

      <Modal
        open={modalOpen}
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"
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
          style={{
            marginTop: 20,
          }}
        >
          {/* TITLE */}

          <Form.Item
            label="Title"
            required
          >
            <Input
              placeholder="Example: Salary"
              value={
                formData.title
              }
              onChange={(event) =>
                handleChange(
                  "title",
                  event.target
                    .value
                )
              }
              maxLength={100}
            />
          </Form.Item>

          {/* AMOUNT */}

          <Form.Item
            label="Amount"
            required
          >
            <Input
              type="number"
              placeholder="30000"
              min={0}
              step="0.01"
              value={
                formData.amount
              }
              onChange={(event) =>
                handleChange(
                  "amount",
                  event.target
                    .value
                )
              }
            />
          </Form.Item>

          {/* CURRENCY */}

          <Form.Item
            label="Currency"
            required
          >
            <Select
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
                currencyOptions
              }
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          {/* TRANSACTION TYPE */}

          <Form.Item
            label="Transaction Type"
            required
          >
            <Select
              style={{
                width: "100%",
              }}
              value={
                formData.transactionType
              }
              onChange={(value) =>
                handleChange(
                  "transactionType",
                  value
                )
              }
              options={[
                {
                  value:
                    "INCOME",
                  label:
                    "Income",
                },
                {
                  value:
                    "EXPENSE",
                  label:
                    "Expense",
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
              style={{
                width: "100%",
              }}
              placeholder="Select category..."
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

          <Form.Item
            label="Date"
            required
          >
            <Input
              type="date"
              value={
                formData.transactionDate
              }
              onChange={(event) =>
                handleChange(
                  "transactionDate",
                  event.target
                    .value
                )
              }
            />
          </Form.Item>

          {/* NOTES */}

          <Form.Item label="Notes">
            <Input.TextArea
              rows={4}
              placeholder="Optional notes..."
              value={
                formData.note
              }
              onChange={(event) =>
                handleChange(
                  "note",
                  event.target
                    .value
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
                width:
                  "100%",
                justifyContent:
                  "flex-end",
              }}
            >
              <Button
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={
                  saving
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
};

export default TransactionsPage;