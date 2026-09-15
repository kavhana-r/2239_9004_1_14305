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
  const code = String(
    currencyCode || "USD"
  ).toUpperCase();

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
  transactionDate: dayjs().format(
    "YYYY-MM-DD"
  ),
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

  const [activeCurrency, setActiveCurrency] =
    useState("USD");

  const [exchangeRates, setExchangeRates] =
    useState(DEFAULT_EXCHANGE_RATES);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [successAlert, setSuccessAlert] =
    useState("");

  const [formData, setFormData] =
    useState(getInitialForm());

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
        localStorage.getItem(
          "preferredCurrency"
        ) ||
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

  const fetchTransactions =
    useCallback(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/transactions`
        );

        if (!mountedRef.current) {
          return;
        }

        setTransactions(
          safeArray(response.data)
        );
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
    }, []);

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  const fetchCategories =
    useCallback(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories`
        );

        if (!mountedRef.current) {
          return;
        }

        const data = safeArray(
          response.data
        );

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
    }, []);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTransactions(),
        fetchCategories(),
      ]);

      if (mountedRef.current) {
        setLoading(false);
      }
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

    if (mountedRef.current) {
      setLoading(false);
    }

    message.success(
      "Transactions refreshed."
    );
  };

  // ==========================================================
  // CURRENCY CONVERSION
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
        transaction?.categoryId ??
        transaction?.category?.id ??
        "",

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
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      title:
        formData.title.trim(),

      amount,

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

      // ------------------------------------------------------
      // UPDATE
      // ------------------------------------------------------

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

      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      else {
        await axios.post(
          `${API_BASE_URL}/transactions`,
          payload
        );

        message.success(
          "Transaction added successfully."
        );
      }

      // ------------------------------------------------------
      // REFRESH
      // ------------------------------------------------------

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
      // Categories matching selected type
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
      // Categories without type
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
        uniqueCategories