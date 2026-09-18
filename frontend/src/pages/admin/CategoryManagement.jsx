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

const CURRENCY_ITEMS = [
  {
    country: "AU",
    name: "Australian Dollar",
    code: "AUD",
    symbol: "A$",
    flag: "🇦🇺",
  },
  {
    country: "CA",
    name: "Canadian Dollar",
    code: "CAD",
    symbol: "C$",
    flag: "🇨🇦",
  },
  {
    country: "EU",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    flag: "🇪🇺",
  },
  {
    country: "GB",
    name: "British Pound",
    code: "GBP",
    symbol: "£",
    flag: "🇬🇧",
  },
  {
    country: "IN",
    name: "Indian Rupee",
    code: "INR",
    symbol: "₹",
    flag: "🇮🇳",
  },
  {
    country: "JP",
    name: "Japanese Yen",
    code: "JPY",
    symbol: "¥",
    flag: "🇯🇵",
  },
  {
    country: "US",
    name: "US Dollar",
    code: "USD",
    symbol: "$",
    flag: "🇺🇸",
  },
];

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
    symbol: "$",
  });

  // =====================================================
  // ROLE
  // =====================================================

  const getUserRole = () => {
    const role =
      localStorage.getItem("role") ||
      localStorage.getItem("userRole");

    if (role) {
      return String(role).toUpperCase();
    }

    const userKeys = [
      "user",
      "currentUser",
      "authUser",
    ];

    for (const key of userKeys) {
      try {
        const user = JSON.parse(
          localStorage.getItem(key) || "null"
        );

        if (user?.role) {
          return String(user.role).toUpperCase();
        }
      } catch (error) {
        // Ignore invalid localStorage data
      }
    }

    return "USER";
  };

  const role = getUserRole();

  const isAdmin =
    role === "ADMIN" ||
    role === "ROLE_ADMIN";

  // =====================================================
  // GET CATEGORIES
  // USER + ADMIN
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

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (
        Array.isArray(data?.content)
      ) {
        setCategories(data.content);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(
        "GET /api/categories error:",
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
  // CURRENCY INFORMATION
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
        map[
          String(name || "").toLowerCase()
        ];

      if (saved?.currency) {
        const found =
          CURRENCY_ITEMS.find(
            (currency) =>
              currency.code ===
              saved.currency
          );

        if (found) {
          return found;
        }
      }
    } catch (error) {
      // Ignore invalid currency map
    }

    if (fallbackCode) {
      const found =
        CURRENCY_ITEMS.find(
          (currency) =>
            currency.code ===
            fallbackCode
        );

      if (found) {
        return found;
      }
    }

    return CURRENCY_ITEMS.find(
      (currency) =>
        currency.code === "USD"
    );
  };

  // =====================================================
  // CURRENCY SELECT
  // =====================================================

  const handleCurrencySelect = (value) => {
    const currency =
      CURRENCY_ITEMS.find(
        (item) => item.code === value
      );

    setFormData((previous) => ({
      ...previous,
      currency: value,
      symbol:
        currency?.symbol || "$",
    }));
  };

  // =====================================================
  // OPEN ADD MODAL
  // ADMIN ONLY
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
      symbol: "$",
    });

    setModalOpen(true);
  };

  // =====================================================
  // POST CATEGORY
  // ADMIN ONLY
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
            "Content-Type":
              "application/json",
          },
        }
      );

      // Save currency information
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
        symbol: "$",
      });

      await fetchCategories();
    } catch (error) {
      console.error(
        "POST /api/categories error:",
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
  // ADMIN ONLY
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
        "DELETE /api/categories error:",
        error
      );

      message.error(
        error?.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCategories =
    useMemo(() => {
      let result = [...categories];

      if (typeFilter !== "ALL") {
        result = result.filter(
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

        result = result.filter(
          (category) =>
            String(
              category.name || ""
            )
              .toLowerCase()
              .includes(term)
        );
      }

      return result;
    }, [
      categories,
      search,
      typeFilter,
    ]);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div>
      {/* HEADER */}

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

      {/* CARD */}

      <Card className="modern-card">
        {/* FILTER */}

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
            onChange={setTypeFilter}
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

        {/* LOADING */}

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
                    ICON
                  </th>

                  <th>
                    CATEGORY NAME
                  </th>

                  <th>
                    TYPE
                  </th>

                  <th>
                    CURRENCY
                  </th>

                  <th>
                    SYMBOL
                  </th>

                  {/* ADMIN ONLY */}

                  {isAdmin && (
                    <th
                      style={{
                        textAlign:
                          "center",
                        width: 120,
                      }}
                    >
                      ACTIONS
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
                        isAdmin ? 6 : 5
                      }
                      style={{
                        textAlign:
                          "center",
                        padding: 40,
                        color:
                          "#64748b",
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

                      const currency =
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
                            {
                              category.name
                            }
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
                                  currency.flag
                                }
                              </span>

                              <span>
                                {
                                  currency.country
                                }{" "}
                                {
                                  currency.name
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
                              currency.symbol
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

      {/* =========================================
          ADMIN ADD CATEGORY MODAL
      ========================================== */}

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
            {/* NAME */}

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
                placeholder="e.g. Food, Salary, Transport"
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
                    width: "100%",
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
                      label: `${currency.flag} ${currency.country} ${currency.name}`,
                    })
                  )}
                />
              </div>

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