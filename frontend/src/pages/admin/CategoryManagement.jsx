import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";

import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------
   Automatically attach JWT token
------------------------------------------------------- */
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

/* -------------------------------------------------------
   Currency symbols
------------------------------------------------------- */
const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

/* -------------------------------------------------------
   Get logged-in user's role
------------------------------------------------------- */
const getUserRole = () => {
  const possibleRoleKeys = [
    "role",
    "userRole",
    "authority",
  ];

  for (const key of possibleRoleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value.replace("ROLE_", "").toUpperCase();
    }
  }

  const possibleUserKeys = [
    "user",
    "currentUser",
    "authUser",
  ];

  for (const key of possibleUserKeys) {
    const value = localStorage.getItem(key);

    if (!value) continue;

    try {
      const user = JSON.parse(value);

      if (user?.role) {
        return String(user.role)
          .replace("ROLE_", "")
          .toUpperCase();
      }

      if (user?.authorities?.length > 0) {
        const authority =
          user.authorities[0]?.authority ||
          user.authorities[0];

        return String(authority)
          .replace("ROLE_", "")
          .toUpperCase();
      }
    } catch (error) {
      // Ignore invalid JSON
    }
  }

  return "";
};

/* -------------------------------------------------------
   Category icon
------------------------------------------------------- */
const getCategoryIcon = (type) => {
  if (type === "INCOME") {
    return "💰";
  }

  return "💸";
};

/* -------------------------------------------------------
   Category Management
------------------------------------------------------- */
const CategoryManagement = () => {
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [typeFilter, setTypeFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [userRole, setUserRole] = useState("");

  /* -------------------------------------------------------
     Check admin
  ------------------------------------------------------- */
  const isAdmin = userRole === "ADMIN";

  /* -------------------------------------------------------
     Get preferred currency
  ------------------------------------------------------- */
  const getPreferredCurrency = () => {
    const currency =
      localStorage.getItem("preferredCurrency") ||
      localStorage.getItem("currency") ||
      "INR";

    return currency.toUpperCase();
  };

  /* -------------------------------------------------------
     Fetch categories
  ------------------------------------------------------- */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/categories");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setCategories(data);
    } catch (error) {
      console.error("Fetch categories error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          message.error(
            "Authentication required. Please login again."
          );
        } else if (error.response.status === 403) {
          message.error(
            "You do not have permission to view categories."
          );
        } else {
          message.error(
            `Unable to load categories. Server returned ${error.response.status}.`
          );
        }
      } else {
        message.error(
          "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     Load page
  ------------------------------------------------------- */
  useEffect(() => {
    const role = getUserRole();

    console.log("Logged-in role:", role);

    setUserRole(role);

    fetchCategories();
  }, [fetchCategories]);

  /* -------------------------------------------------------
     Open Add Modal
  ------------------------------------------------------- */
  const openAddModal = () => {
    if (!isAdmin) {
      message.warning(
        "Only Admin can add categories."
      );
      return;
    }

    setEditingCategory(null);

    form.resetFields();

    form.setFieldsValue({
      type: "INCOME",
    });

    setIsModalOpen(true);
  };

  /* -------------------------------------------------------
     Open Edit Modal
  ------------------------------------------------------- */
  const openEditModal = (category) => {
    if (!isAdmin) {
      message.warning(
        "Only Admin can edit categories."
      );
      return;
    }

    setEditingCategory(category);

    form.setFieldsValue({
      name: category.name,
      type: category.type,
    });

    setIsModalOpen(true);
  };

  /* -------------------------------------------------------
     Close Modal
  ------------------------------------------------------- */
  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);

    setEditingCategory(null);

    form.resetFields();
  };

  /* -------------------------------------------------------
     Add / Update Category
  ------------------------------------------------------- */
  const handleSubmit = async (values) => {
    if (!isAdmin) {
      message.error(
        "Only Admin can add or update categories."
      );
      return;
    }

    const name = values.name?.trim();

    if (!name) {
      message.error(
        "Please enter a category name."
      );
      return;
    }

    if (!values.type) {
      message.error(
        "Please select a category type."
      );
      return;
    }

    const payload = {
      name: name,
      type: values.type,
    };

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      console.log("=================================");
      console.log("CATEGORY SAVE");
      console.log("URL:", API_BASE_URL);
      console.log("Payload:", payload);
      console.log("Token exists:", !!token);
      console.log("Role:", userRole);
      console.log("=================================");

      let response;

      if (editingCategory) {
        response = await api.put(
          `/api/categories/${editingCategory.id}`,
          payload
        );

        console.log(
          "UPDATE RESPONSE:",
          response.status,
          response.data
        );

        message.success(
          "Category updated successfully."
        );
      } else {
        response = await api.post(
          "/api/categories",
          payload
        );

        console.log(
          "CREATE RESPONSE:",
          response.status,
          response.data
        );

        message.success(
          "Category added successfully."
        );
      }

      closeModal();

      await fetchCategories();
    } catch (error) {
      console.error(
        "CATEGORY SAVE ERROR:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Status:",
        error.response?.status
      );

      if (error.response) {
        const status =
          error.response.status;

        if (status === 401) {
          message.error(
            "401 Unauthorized: Please login again."
          );
        } else if (status === 403) {
          message.error(
            "403 Forbidden: Admin permission is required."
          );
        } else if (status === 400) {
          message.error(
            "400 Bad Request: Check category name and type."
          );
        } else if (status === 409) {
          message.error(
            "Category already exists."
          );
        } else if (status === 500) {
          message.error(
            "500 Server Error: Check the Spring Boot console."
          );
        } else {
          message.error(
            `Unable to save category. Server returned ${status}.`
          );
        }
      } else {
        message.error(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     Delete Category
  ------------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!isAdmin) {
      message.warning(
        "Only Admin can delete categories."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.delete(
        `/api/categories/${id}`
      );

      console.log(
        "DELETE RESPONSE:",
        response.status,
        response.data
      );

      message.success(
        "Category deleted successfully."
      );

      await fetchCategories();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      if (error.response) {
        const status =
          error.response.status;

        if (status === 401) {
          message.error(
            "401 Unauthorized: Please login again."
          );
        } else if (status === 403) {
          message.error(
            "403 Forbidden: Admin permission is required."
          );
        } else if (status === 404) {
          message.error(
            "Category not found."
          );
        } else if (status === 500) {
          message.error(
            "Cannot delete this category. It may be used by existing transactions."
          );
        } else {
          message.error(
            `Unable to delete category. Server returned ${status}.`
          );
        }
      } else {
        message.error(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     Filter categories
  ------------------------------------------------------- */
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          );

      const matchesType =
        typeFilter === "ALL" ||
        category.type === typeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [
    categories,
    searchText,
    typeFilter,
  ]);

  /* -------------------------------------------------------
     Currency
  ------------------------------------------------------- */
  const preferredCurrency =
    getPreferredCurrency();

  const currencySymbol =
    CURRENCY_SYMBOLS[
      preferredCurrency
    ] || preferredCurrency;

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          marginBottom: 24,
        }}
      >
        <Col>
          <Space align="center">
            <AppstoreOutlined
              style={{
                fontSize: 30,
              }}
            />

            <div>
              <Title
                level={2}
                style={{
                  margin: 0,
                }}
              >
                Categories
              </Title>

              <Text type="secondary">
                Manage your income and expense
                categories
              </Text>
            </div>
          </Space>
        </Col>

        {isAdmin && (
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Add Category
            </Button>
          </Col>
        )}
      </Row>

      {/* Admin information */}
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <Row
          justify="space-between"
          align="middle"
        >
          <Col>
            <Space>
              <Text strong>
                Current Role:
              </Text>

              <Tag
                color={
                  isAdmin
                    ? "gold"
                    : "blue"
                }
              >
                {userRole || "USER"}
              </Tag>
            </Space>
          </Col>

          <Col>
            <Text type="secondary">
              Currency:{" "}
              <strong>
                {currencySymbol}{" "}
                {preferredCurrency}
              </strong>
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col
            xs={24}
            sm={16}
            md={18}
          >
            <Input
              allowClear
              prefix={
                <SearchOutlined />
              }
              placeholder="Search category..."
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />
          </Col>

          <Col
            xs={24}
            sm={8}
            md={6}
          >
            <Select
              style={{
                width: "100%",
              }}
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  label: "All Categories",
                  value: "ALL",
                },
                {
                  label: "Income",
                  value: "INCOME",
                },
                {
                  label: "Expense",
                  value: "EXPENSE",
                },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* Category List */}
      <Card>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
            }}
          >
            <Spin size="large" />

            <div
              style={{
                marginTop: 16,
              }}
            >
              Loading categories...
            </div>
          </div>
        ) : filteredCategories.length ===
          0 ? (
          <Empty
            description={
              categories.length === 0
                ? "No categories found"
                : "No matching categories"
            }
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredCategories.map(
              (category) => (
                <Col
                  key={category.id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                >
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 30,
                            marginBottom: 8,
                          }}
                        >
                          {getCategoryIcon(
                            category.type
                          )}
                        </div>

                        <Title
                          level={4}
                          style={{
                            margin:
                              "0 0 8px 0",
                          }}
                        >
                          {category.name}
                        </Title>

                        <Tag
                          color={
                            category.type ===
                            "INCOME"
                              ? "green"
                              : "red"
                          }
                        >
                          {category.type ===
                          "INCOME"
                            ? "Income"
                            : "Expense"}
                        </Tag>
                      </div>

                      {isAdmin && (
                        <Space>
                          <Button
                            type="text"
                            icon={
                              <EditOutlined />
                            }
                            onClick={() =>
                              openEditModal(
                                category
                              )
                            }
                          />

                          <Popconfirm
                            title="Delete this category?"
                            description="This action cannot be undone."
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                              handleDelete(
                                category.id
                              )
                            }
                          >
                            <Button
                              type="text"
                              danger
                              icon={
                                <DeleteOutlined />
                              }
                            />
                          </Popconfirm>
                        </Space>
                      )}
                    </div>
                  </Card>
                </Col>
              )
            )}
          </Row>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={
          editingCategory
            ? "Edit Category"
            : "Add Category"
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Category name */}
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter category name.",
              },
              {
                min: 2,
                message:
                  "Category name must contain at least 2 characters.",
              },
            ]}
          >
            <Input
              placeholder="Example: Salary"
              maxLength={50}
            />
          </Form.Item>

          {/* Type */}
          <Form.Item
            label="Category Type"
            name="type"
            rules={[
              {
                required: true,
                message:
                  "Please select category type.",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Income Category",
                  value: "INCOME",
                },
                {
                  label: "Expense Category",
                  value: "EXPENSE",
                },
              ]}
            />
          </Form.Item>

          {/* Currency */}
          <Form.Item label="Currency">
            <Select
              value={preferredCurrency}
              disabled
              options={[
                {
                  label: `${currencySymbol} ${preferredCurrency}`,
                  value: preferredCurrency,
                },
              ]}
            />
          </Form.Item>

          {/* Buttons */}
          <Form.Item
            style={{
              marginBottom: 0,
              textAlign: "right",
            }}
          >
            <Space>
              <Button
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
              >
                {editingCategory
                  ? "Update Category"
                  : "Save Category"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;