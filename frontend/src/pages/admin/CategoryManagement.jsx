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

/*
 * =========================================================
 * BACKEND URL
 * =========================================================
 */

const API_BASE_URL = "http://localhost:8080";

/*
 * =========================================================
 * CATEGORY ICONS
 * =========================================================
 */

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

/*
 * =========================================================
 * CURRENCIES
 * =========================================================
 */

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

/*
 * =========================================================
 * AXIOS INSTANCE
 * =========================================================
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Automatically attach JWT token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

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

  /*
   * =========================================================
   * GET ROLE
   * =========================================================
   */

  const getUserRole = () => {
    const possibleRoleKeys = [
      "role",
      "userRole",
    ];

    for (const key of possibleRoleKeys) {
      const value = localStorage.getItem(key);

      if (value) {
        return String(value)
          .replace("ROLE_", "")
          .toUpperCase();
      }
    }

    const userKeys = [
      "user",
      "currentUser",
      "authUser",
    ];

    for (const key of userKeys) {
      try {
        const storedUser = localStorage.getItem(key);

        if (!storedUser) {
          continue;
        }

        const user = JSON.parse(storedUser);

        if (user?.role) {
          return String(user.role)
            .replace("ROLE_", "")
            .toUpperCase();
        }

        if (user?.authorities?.length > 0) {
          const authority =
            user.authorities[0]?.authority;

          if (authority) {
            return String(authority)
              .replace("ROLE_", "")
              .toUpperCase();
          }
        }
      } catch (error) {
        console.error(
          `Unable to read ${key} from localStorage`,
          error
        );
      }
    }

    return "USER";
  };

  const role = getUserRole();

  const isAdmin = role === "ADMIN";

  /*
   * =========================================================
   * ERROR MESSAGE HELPER
   * =========================================================
   */

  const getErrorMessage = (error, defaultMessage) => {
    console.error(error);

    if (error?.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Response:",
        error.response.data
      );

      if (
        typeof error.response.data === "string"
      ) {
        return error.response.data;
      }

      if (
        error.response.data?.message
      ) {
        return error.response.data.message;
      }

      if (
        error.response.data?.error
      ) {
        return error.response.data.error;
      }

      if (
        error.response.status === 401
      ) {
        return "Authentication required. Please login again.";
      }

      if (
        error.response.status === 403
      ) {
        return "Access denied. Admin permission is required.";
      }
    }

    if (error?.request) {
      return "Unable to connect to server. Make sure Spring Boot is running on port 8080.";
    }

    return defaultMessage;
  };

  /*
   * =========================================================
   * GET ALL CATEGORIES
   * =========================================================
   */

  const fetchCategories = async () => {
    try {
      setLoading(true);

      console.log(
        "Loading categories from:",
        `${API_BASE_URL}/api/categories`
      );

      const response = await api.get(
        "/api/categories"
      );

      console.log(
        "GET categories response:",
        response.data
      );

      const data = response.data;

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
        "GET /api/categories failed:",
        error
      );

      setCategories([]);

      message.error(
        getErrorMessage(
          error,
          "Unable to load categories."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * LOAD CATEGORIES WHEN PAGE OPENS
   * =========================================================
   */

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
   * =========================================================
   * CURRENCY INFORMATION
   * =========================================================
   */

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
      console.error(
        "Unable to read category currency map",
        error
      );
    }

    if (fallbackCode) {
      const found =
        CURRENCY_ITEMS.find(
          (currency) =>
            currency.code ===
            String(
              fallbackCode
            ).toUpperCase()
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

  /*
   * =========================================================
   * CURRENCY CHANGE
   * =========================================================
   */

  const handleCurrencySelect = (
    value
  ) => {
    const currency =
      CURRENCY_ITEMS.find(
        (item) =>
          item.code === value
      );

    setFormData((previous) => ({
      ...previous,
      currency: value,
      symbol:
        currency?.symbol || "$",
    }));
  };

  /*
   * =========================================================
   * OPEN ADD MODAL
   * =========================================================
   */

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

  /*
   * =========================================================
   * CREATE CATEGORY
   * =========================================================
   */

  const handleSubmit = async () => {
    if (!isAdmin) {
      message.error(
        "Only admin can create categories."
      );
      return;
    }

    const categoryName =
      formData.name.trim();

    if (!categoryName) {
      message.error(
        "Category name is required."
      );
      return;
    }

    if (!formData.type) {
      message.error(
        "Category type is required."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      message.error(
        "Login token not found. Please login again."
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * IMPORTANT:
       * Backend Category entity contains only:
       * id
       * name
       * type
       *
       * Therefore send only these fields.
       */

      const payload = {
        name: categoryName,
        type: formData.type,
      };

      console.log(
        "POST /api/categories payload:",
        payload
      );

      const response = await api.post(
        "/api/categories",
        payload
      );

      console.log(
        "POST category response:",
        response.data
      );

      /*
       * Save currency information locally
       * because current Category entity does
       * not have currency/symbol fields.
       */

      try {
        const key =
          "category_currency_map";

        const map = JSON.parse(
          localStorage.getItem(key) || "{}"
        );

        map[
          categoryName.toLowerCase()
        ] = {
          currency:
            formData.currency,
          symbol:
            formData.symbol,
        };

        localStorage.setItem(
          key,
          JSON.stringify(map)
        );
      } catch (storageError) {
        console.error(
          "Unable to save category currency",
          storageError
        );
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

      /*
       * Reload categories
       */

      await fetchCategories();
    } catch (error) {
      console.error(
        "POST /api/categories failed:",
        error
      );

      message.error(
        getErrorMessage(
          error,
          "Unable to add category."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * DELETE CATEGORY
   * =========================================================
   */

  const handleDelete = async (
    category
  ) => {
    if (!isAdmin) {
      message.error(
        "Only admin can delete categories."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      message.error(
        "Login token not found. Please login again."
      );
      return;
    }

    try {
      console.log(
        "DELETE:",
        `${API_BASE_URL}/api/categories/${category.id}`
      );

      await api.delete(
        `/api/categories/${category.id}`
      );

      /*
       * Remove local currency information
       */

      try {
        const key =
          "category_currency_map";

        const map = JSON.parse(
          localStorage.getItem(key) || "{}"
        );

        delete map[
          String(
            category.name || ""
          ).toLowerCase()
        ];

        localStorage.setItem(
          key,
          JSON.stringify(map)
        );
      } catch (storageError) {
        console.error(
          "Unable to update currency map",
          storageError
        );
      }

      message.success(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "DELETE /api/categories failed:",
        error
      );

      message.error(
        getErrorMessage(
          error,
          "Unable to delete category."
        )
      );
    }
  };

  /*
   * =========================================================
   * FILTER CATEGORIES
   * =========================================================
   */

  const filteredCategories =
    useMemo(() => {
      let result = [
        ...categories,
      ];

      if (
        typeFilter !== "ALL"
      ) {
        result =
          result.filter(
            (category) =>
              String(
                category.type || ""
              ).toUpperCase() ===
              typeFilter
          );
      }

      if (
        search.trim()
      ) {
        const term =
          search
            .toLowerCase()
            .trim();

        result =
          result.filter(
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

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div>
      {/* =====================================================
          HEADER
      ====================================================== */}

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

      {/* =====================================================
          CATEGORY CARD
      ====================================================== */}

      <Card className="modern-card">
        {/* FILTERS */}

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
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            style={{
              maxWidth: 300,
              height: 40,
              borderRadius: 8,
            }}
          />

          <Select
            value={typeFilter}
            onChange={
              setTypeFilter
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

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
            }}
          >
            <Spin size="large" />

            <div
              style={{
                marginTop: 12,
                color: "#64748b",
              }}
            >
              Loading categories...
            </div>
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
                  <th
                    style={{
                      width: 80,
                    }}
                  >
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
                        isAdmin
                          ? 6
                          : 5
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
                          category.type ||
                            ""
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

                          {/* DELETE */}

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

      {/* =====================================================
          ADD CATEGORY MODAL
      ====================================================== */}

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
                placeholder="e.g. Food, Salary, Transport"
                value={
                  formData.name
                }
                onChange={(event) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      name:
                        event.target
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

            {/* CATEGORY TYPE */}

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
                  setModalOpen(
                    false
                  )
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