import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Typography,
  message,
  Popconfirm,
  Space,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const CATEGORY_ICONS = {
  Food: "🍔",
  Dining: "🍽️",
  Groceries: "🛒",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "⚡",
  Utilities: "💡",
  Entertainment: "🎬",
  Housing: "🏠",
  Health: "💊",
  Travel: "✈️",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Others: "📦",
};

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE",
    currency: "USD",
    symbol: "USD",
  });

  // =====================================================
  // CURRENCIES
  // =====================================================

  const CURRENCY_ITEMS = [
    {
      country: "AU",
      name: "Australian Dollar",
      code: "AUD",
      symbol: "AUD",
      flag: "🇦🇺",
    },
    {
      country: "CA",
      name: "Canadian Dollar",
      code: "CAD",
      symbol: "CAD",
      flag: "🇨🇦",
    },
    {
      country: "EU",
      name: "Euro",
      code: "EUR",
      symbol: "EUR",
      flag: "🇪🇺",
    },
    {
      country: "GB",
      name: "British Pound",
      code: "GBP",
      symbol: "GBP",
      flag: "🇬🇧",
    },
    {
      country: "IN",
      name: "Indian Rupee",
      code: "INR",
      symbol: "INR",
      flag: "🇮🇳",
    },
    {
      country: "JP",
      name: "Japanese Yen",
      code: "JPY",
      symbol: "JPY",
      flag: "🇯🇵",
    },
    {
      country: "US",
      name: "US Dollar",
      code: "USD",
      symbol: "USD",
      flag: "🇺🇸",
    },
  ];

  // =====================================================
  // ROLE
  // =====================================================

  const getUserRole = () => {
    const possibleRoles = [
      localStorage.getItem("role"),
      localStorage.getItem("userRole"),
    ];

    for (const role of possibleRoles) {
      if (role) {
        return role.toUpperCase();
      }
    }

    // Check user object if role is stored inside it
    const possibleUserKeys = [
      "user",
      "currentUser",
      "authUser",
    ];

    for (const key of possibleUserKeys) {
      try {
        const user = JSON.parse(
          localStorage.getItem(key) || "null"
        );

        if (user?.role) {
          return String(user.role).toUpperCase();
        }
      } catch (error) {
        // Ignore invalid localStorage JSON
      }
    }

    return "USER";
  };

  const role = getUserRole();

  const isAdmin =
    role === "ADMIN" ||
    role === "ROLE_ADMIN";

  // =====================================================
  // CATEGORY CURRENCY INFORMATION
  // =====================================================

  const getCategoryCurrencyInfo = (
    name,
    fallbackCode
  ) => {
    try {
      const map = JSON.parse(
        localStorage.getItem(
          "category_currency_map"
        ) || "{}"
      );

      const saved =
        map[String(name || "").toLowerCase()];

      if (saved?.currency) {
        const match = CURRENCY_ITEMS.find(
          (c) => c.code === saved.currency
        );

        if (match) {
          return match;
        }
      }
    } catch (error) {
      // Ignore invalid stored data
    }

    if (fallbackCode) {
      const match = CURRENCY_ITEMS.find(
        (c) => c.code === fallbackCode
      );

      if (match) {
        return match;
      }
    }

    const presetMap = {
      Food: "USD",
      Transport: "AUD",
      Shopping: "CAD",
      Bills: "EUR",
      Salary: "INR",
      Others: "GBP",
      Entertainment: "JPY",
    };

    const code =
      presetMap[name] || "USD";

    return (
      CURRENCY_ITEMS.find(
        (c) => c.code === code
      ) || CURRENCY_ITEMS[6]
    );
  };

  // =====================================================
  // CURRENCY SELECT
  // =====================================================

  const handleCurrencySelect = (value) => {
    const item = CURRENCY_ITEMS.find(
      (c) => c.code === value
    );

    setFormData((previous) => ({
      ...previous,
      currency: value,
      symbol: item
        ? item.symbol
        : value,
    }));
  };

  // =====================================================
  // GET CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "/api/categories",
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {}
      );

      const data = response?.data;

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      console.error(
        "GET categories error:",
        error
      );

      setCategories([]);

      message.error(
        error?.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =====================================================
  // OPEN ADD CATEGORY MODAL
  // =====================================================

  const openModal = () => {
    if (!isAdmin) {
      message.error(
        "Only admin can add categories."
      );
      return;
    }

    setFormData({
      name: "",
      type: "EXPENSE",
      currency: "USD",
      symbol: "USD",
    });

    setModalOpen(true);
  };

  // =====================================================
  // CREATE CATEGORY - POST
  // =====================================================

  const handleSubmit = async () => {
    if (!isAdmin) {
      message.error(
        "Only admin can create categories."
      );
      return;
    }

    if (!formData.name.trim()) {
      message.error(
        "Category name is required."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      await axios.post(
        "/api/categories",
        {
          name: formData.name.trim(),
          type: formData.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Save currency information locally
      try {
        const key =
          "category_currency_map";

        const map = JSON.parse(
          localStorage.getItem(key) || "{}"
        );

        map[
          formData.name
            .trim()
            .toLowerCase()
        ] = {
          currency: formData.currency,
          symbol: formData.symbol,
        };

        localStorage.setItem(
          key,
          JSON.stringify(map)
        );
      } catch (error) {
        // Ignore localStorage error
      }

      message.success(
        "Category added successfully."
      );

      setModalOpen(false);

      setFormData({
        name: "",
        type: "EXPENSE",
        currency: "USD",
        symbol: "USD",
      });

      await fetchCategories();
    } catch (error) {
      console.error(
        "POST category error:",
        error
      );

      message.error(
        error?.response?.data?.message ||
          "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDelete = async (category) => {
    if (!isAdmin) {
      message.error(
        "Only admin can delete categories."
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `/api/categories/${category.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "DELETE category error:",
        error
      );

      message.error(
        error?.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  // =====================================================
  // FALLBACK DATA
  // =====================================================

  const defaultCategories = [
    {
      id: 101,
      name: "Food",
      type: "EXPENSE",
      icon: "🍔",
      currency: "USD",
    },
    {
      id: 102,
      name: "Transport",
      type: "EXPENSE",
      icon: "🚗",
      currency: "AUD",
    },
    {
      id: 103,
      name: "Shopping",
      type: "EXPENSE",
      icon: "🛍️",
      currency: "CAD",
    },
    {
      id: 104,
      name: "Bills",
      type: "EXPENSE",
      icon: "⚡",
      currency: "EUR",
    },
    {
      id: 105,
      name: "Salary",
      type: "INCOME",
      icon: "💼",
      currency: "INR",
    },
    {
      id: 106,
      name: "Others",
      type: "EXPENSE",
      icon: "📦",
      currency: "GBP",
    },
  ];

  /*
   * IMPORTANT:
   * Don't show demo categories when the backend
   * successfully returns an empty list.
   *
   * Otherwise deleted categories can appear again.
   */
  const displayList =
    categories;

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCategories =
    useMemo(() => {
      let list = displayList;

      if (typeFilter !== "ALL") {
        list = list.filter(
          (category) =>
            String(category.type)
              .toUpperCase() ===
            typeFilter
        );
      }

      if (search.trim()) {
        const term =
          search
            .toLowerCase()
            .trim();

        list = list.filter(
          (category) =>
            String(
              category.name || ""
            )
              .toLowerCase()
              .includes(term)
        );
      }

      return list;
    }, [
      displayList,
      search,
      typeFilter,
    ]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            Categories
          </Title>

          <Text
            style={{
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Organize transactions with
            custom income and expense
            categories
          </Text>
        </div>

        {/* ADMIN ONLY */}

        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openModal}
            style={{
              borderRadius: 8,
              fontWeight: 700,
              background: "#10b981",
              borderColor: "#10b981",
            }}
          >
            Add Category
          </Button>
        )}
      </div>

      {/* MAIN CARD */}

      <Card className="modern-card">
        {/* FILTER BAR */}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Search categories..."
            prefix={
              <SearchOutlined
                style={{
                  color: "#94a3b8",
                }}
              />
            }
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              maxWidth: 300,
              height: 40,
              borderRadius: 8,
            }}
          />

          <Select
            value={typeFilter}
            onChange={(value) =>
              setTypeFilter(value)
            }
            style={{
              width: 150,
              height: 40,
            }}
            options={[
              {
                value: "ALL",
                label: "All Types",
              },
              {
                value: "EXPENSE",
                label: "Expense",
              },
              {
                value: "INCOME",
                label: "Income",
              },
            ]}
          />
        </div>

        {/* TABLE */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div
            className="custom-table"
            style={{
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>
                    Icon
                  </th>

                  <th>
                    Category Name
                  </th>

                  <th>Type</th>

                  <th>Currency</th>

                  <th>Symbol</th>

                  {/* ADMIN ONLY */}

                  {isAdmin && (
                    <th
                      style={{
                        textAlign:
                          "center",
                        width: 120,
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={
                        isAdmin
                          ? 6
                          : 5
                      }
                      style={{
                        textAlign:
                          "center",
                        padding: 40,
                        color: "#64748b",
                      }}
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(
                    (category) => {
                      const isExpense =
                        String(
                          category.type
                        ).toUpperCase() ===
                        "EXPENSE";

                      const icon =
                        category.icon ||
                        CATEGORY_ICONS[
                          category.name
                        ] ||
                        (isExpense
                          ? "🛍️"
                          : "💰");

                      const currInfo =
                        getCategoryCurrencyInfo(
                          category.name,
                          category.currency
                        );

                      return (
                        <tr
                          key={
                            category.id
                          }
                        >
                          {/* ICON */}

                          <td>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background:
                                  isExpense
                                    ? "#fef2f2"
                                    : "#ecfdf5",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontSize: 18,
                              }}
                            >
                              {icon}
                            </div>
                          </td>

                          {/* NAME */}

                          <td
                            style={{
                              fontWeight: 600,
                              color:
                                "#0f172a",
                            }}
                          >
                            {category.name}
                          </td>

                          {/* TYPE */}

                          <td>
                            <span
                              className={`pill-badge ${
                                isExpense
                                  ? "expense"
                                  : "income"
                              }`}
                            >
                              {isExpense
                                ? "Expense"
                                : "Income"}
                            </span>
                          </td>

                          {/* CURRENCY */}

                          <td
                            style={{
                              fontWeight: 600,
                              color:
                                "#0f172a",
                            }}
                          >
                            <Space size="middle">
                              <span
                                style={{
                                  fontSize: 18,
                                }}
                              >
                                {
                                  currInfo.flag
                                }
                              </span>

                              <span>
                                {
                                  currInfo.country
                                }{" "}
                                {
                                  currInfo.name
                                }
                              </span>
                            </Space>
                          </td>

                          {/* SYMBOL */}

                          <td
                            style={{
                              fontWeight: 700,
                              color:
                                "#0f766e",
                            }}
                          >
                            {
                              currInfo.symbol
                            }
                          </td>

                          {/* ADMIN DELETE */}

                          {isAdmin && (
                            <td
                              style={{
                                textAlign:
                                  "center",
                              }}
                            >
                              <Popconfirm
                                title="Delete category"
                                description="Are you sure you want to delete this category?"
                                onConfirm={() =>
                                  handleDelete(
                                    category
                                  )
                                }
                                okText="Delete"
                                cancelText="Cancel"
                                okButtonProps={{
                                  danger: true,
                                }}
                              >
                                <button
                                  type="button"
                                  className="action-btn-circle danger"
                                  title="Delete"
                                >
                                  <DeleteOutlined />
                                </button>
                              </Popconfirm>
                            </td>
                          )}
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ADD CATEGORY MODAL - ADMIN ONLY */}

      {isAdmin && (
        <Modal
          title={
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Add Category
              </h3>

              <span
                style={{
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                Define a category for
                budgeting and analytics
              </span>
            </div>
          }
          open={modalOpen}
          onCancel={() =>
            setModalOpen(false)
          }
          footer={null}
          destroyOnClose
        >
          <div
            style={{
              padding: "16px 0",
            }}
          >
            {/* CATEGORY NAME */}

            <div
              style={{
                marginBottom: 16,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Category Name{" "}
                <span
                  style={{
                    color: "#ef4444",
                  }}
                >
                  *
                </span>
              </label>

              <Input
                size="large"
                placeholder="e.g., Groceries, Utilities, Freelance"
                value={
                  formData.name
                }
                onChange={(e) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      name: e.target
                        .value,
                    })
                  )
                }
                style={{
                  borderRadius: 8,
                  height: 42,
                }}
              />
            </div>

            {/* TYPE */}

            <div
              style={{
                marginBottom: 16,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: 6,
                }}
              >
                Category Type{" "}
                <span
                  style={{
                    color: "#ef4444",
                  }}
                >
                  *
                </span>
              </label>

              <Select
                size="large"
                style={{
                  width: "100%",
                  height: 42,
                }}
                value={
                  formData.type
                }
                onChange={(value) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      type: value,
                    })
                  )
                }
                options={[
                  {
                    value:
                      "EXPENSE",
                    label:
                      "Expense Category",
                  },
                  {
                    value:
                      "INCOME",
                    label:
                      "Income Category",
                  },
                ]}
              />
            </div>

            {/* CURRENCY */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1.4fr 1fr",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div>
                <label
                  style={{
                    display:
                      "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      "#334155",
                    marginBottom: 6,
                  }}
                >
                  CURRENCY{" "}
                  <span
                    style={{
                      color:
                        "#ef4444",
                    }}
                  >
                    *
                  </span>
                </label>

                <Select
                  size="large"
                  style={{
                    width:
                      "100%",
                    height: 42,
                  }}
                  value={
                    formData.currency
                  }
                  onChange={
                    handleCurrencySelect
                  }
                  options={CURRENCY_ITEMS.map(
                    (currency) => ({
                      value:
                        currency.code,
                      label: `${currency.country} ${currency.name}`,
                    })
                  )}
                />
              </div>

              {/* SYMBOL */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      "#334155",
                    marginBottom: 6,
                  }}
                >
                  SYMBOL{" "}
                  <span
                    style={{
                      color:
                        "#ef4444",
                    }}
                  >
                    *
                  </span>
                </label>

                <Input
                  size="large"
                  readOnly
                  value={
                    formData.symbol
                  }
                  style={{
                    borderRadius: 8,
                    height: 42,
                    fontWeight: 700,
                    background:
                      "#f8fafc",
                    color:
                      "#0f766e",
                  }}
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 12,
              }}
            >
              <Button
                size="large"
                onClick={() =>
                  setModalOpen(false)
                }
                style={{
                  borderRadius: 8,
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                size="large"
                loading={saving}
                onClick={
                  handleSubmit
                }
                style={{
                  borderRadius: 8,
                  fontWeight: 700,
                  background:
                    "#10b981",
                  borderColor:
                    "#10b981",
                  minWidth: 110,
                }}
              >
                Save Category
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CategoryManagement;