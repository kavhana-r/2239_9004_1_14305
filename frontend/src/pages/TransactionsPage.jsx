import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  INR: 83.50,
  JPY: 155.0,
  CAD: 1.36,
  AUD: 1.52,
};

const getCurrencySymbol = (currency) => {
  switch (currency) {
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
  currencyCode: "USD",
  transactionType: "EXPENSE",
  transactionDate: dayjs().format("YYYY-MM-DD"),
  note: "",
  categoryId: "",
});

const REQUIRED_CURRENCIES = [
  { code: "AUD", country: "AU", name: "Australian Dollar", symbol: "AUD" },
  { code: "CAD", country: "CA", name: "Canadian Dollar", symbol: "CAD" },
  { code: "EUR", country: "EU", name: "Euro", symbol: "EUR" },
  { code: "GBP", country: "GB", name: "British Pound", symbol: "GBP" },
  { code: "INR", country: "IN", name: "Indian Rupee", symbol: "INR" },
  { code: "JPY", country: "JP", name: "Japanese Yen", symbol: "JPY" },
  { code: "USD", country: "US", name: "US Dollar", symbol: "USD" },
];

const safeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

export default function TransactionsPage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("preferredCurrency") || "USD";
  });
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successAlert, setSuccessAlert] = useState(null);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [formData, setFormData] = useState(getInitialForm());

  const handleUnauthorized = useCallback(() => {
    try {
      dispatch(logout());
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    if (axios.defaults?.headers?.common) {
      delete axios.defaults.headers.common.Authorization;
    }
    message.error("Session expired. Please login again.");
    if (typeof window !== "undefined" && window.location) {
      if (window.location.pathname !== "/login") {
        try {
          window.location.href = "/login";
        } catch (e) {}
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const handleCurrencyChange = (e) => {
      const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
      setActiveCurrency(newCurr);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/transactions");
      if (isMountedRef.current) {
        setTransactions(safeArray(response.data));
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
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      if (isMountedRef.current) {
        setCategories(safeArray(response.data));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setCategories([]);
      }
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("/api/currencies");
      const list = safeArray(response.data);
      if (isMountedRef.current) {
        setCurrencies(list);
        if (list.length > 0) {
          const ratesMap = { ...DEFAULT_EXCHANGE_RATES };
          list.forEach((c) => {
            if (c.code && c.exchangeRate) {
              ratesMap[c.code] = Number(c.exchangeRate);
            }
          });
          setExchangeRates(ratesMap);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setCurrencies([]);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchCurrencies();
  }, []);

  const convertValue = useCallback((amount, fromCurr = "USD") => {
    const num = Number(amount || 0);
    const from = fromCurr || "USD";
    const to = activeCurrency || "USD";
    if (from === to) return num;
    const fromRate = exchangeRates[from] || DEFAULT_EXCHANGE_RATES[from] || 1.0;
    const toRate = exchangeRates[to] || DEFAULT_EXCHANGE_RATES[to] || (to === "INR" ? 83.50 : 1.0);
    return (num / fromRate) * toRate;
  }, [activeCurrency, exchangeRates]);

  const handleChange = (field, value) => {
    setFormData((previous) => {
      const updated = {
        ...previous,
        [field]: value,
      };
      if (field === "transactionType") {
        updated.categoryId = "";
      }
      return updated;
    });
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    const initial = {
      ...getInitialForm(),
      currencyCode: activeCurrency,
    };
    setFormData(initial);
    try {
      form.resetFields();
    } catch (e) {}
    setModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    const values = {
      title: transaction.title || "",
      amount: transaction.amount ?? "",
      currencyCode: transaction.currency?.code || transaction.currencyCode || "USD",
      transactionType: transaction.transactionType || "EXPENSE",
      transactionDate: transaction.transactionDate || dayjs().format("YYYY-MM-DD"),
      note: transaction.note || "",
      categoryId: transaction.category?.id || transaction.categoryId || "",
    };
    setFormData(values);
    try {
      form.setFieldsValue(values);
    } catch (e) {}
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        title: formData.title || "Untitled Transaction",
        amount: Number(formData.amount),
        currencyCode: formData.currencyCode,
        transactionType: formData.transactionType,
        transactionDate: formData.transactionDate,
        note: formData.note,
        categoryId: formData.categoryId,
      };

      if (editingTransaction) {
        await axios.put(`/api/transactions/${editingTransaction.id}`, payload);
        message.success("Transaction updated successfully");
      } else {
        await axios.post("/api/transactions", payload);
        setSuccessAlert("Transaction added successfully!");
      }
      closeModal();
      fetchTransactions();
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      message.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      message.error("Unable to delete transaction");
    }
  };

  // Filters category options in the modal based on INCOME/EXPENSE type
  const formCategoryOptions = useMemo(() => {
    const list = categories.length > 0 ? categories : [
      { id: "101", name: "Food", type: "EXPENSE" },
      { id: "102", name: "Transport", type: "EXPENSE" },
      { id: "103", name: "Shopping", type: "EXPENSE" },
      { id: "104", name: "Bills", type: "EXPENSE" },
      { id: "105", name: "Salary", type: "INCOME" },
      { id: "106", name: "Others", type: "EXPENSE" },
    ];
    return list.filter(
      (cat) => String(cat.type).toUpperCase() === String(formData.transactionType).toUpperCase()
    );
  }, [categories, formData.transactionType]);

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (typeFilter !== "ALL") {
      list = list.filter((t) => t.transactionType === typeFilter);
    }
    if (categoryFilter !== "ALL") {
      list = list.filter((t) => String(t.category?.id || t.categoryId) === String(categoryFilter));
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter((t) => t.title?.toLowerCase().includes(term));
    }
    return list;
  }, [transactions, typeFilter, categoryFilter, search]);

  return (
    <div style={{ padding: "24px" }}>
      {successAlert && (
        <Tag color="success" closable onClose={() => setSuccessAlert(null)} style={{ marginBottom: 16, width: '100%', padding: 8 }}>
