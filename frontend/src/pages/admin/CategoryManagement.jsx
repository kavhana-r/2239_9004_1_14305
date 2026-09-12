// import React, { useEffect, useState } from "react";

// import {
//   Button,
//   Card,
//   Input,
//   Modal,
//   Popconfirm,
//   Select,
//   Table,
//   Tag,
//   Typography,
//   message,
// } from "antd";

// import {
//   PlusOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// import axios from "axios";

// const { Title } = Typography;

// function CategoryManagement() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "EXPENSE",
//   });

//   // Fetch categories when page loads
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Get all categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.get("/api/categories");

//       const data = response?.data;

//       setCategories(
//         Array.isArray(data)
//           ? data
//           : Array.isArray(data?.content)
//           ? data.content
//           : []
//       );
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategories([]);

//       message.error("Unable to load categories.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open add category modal
//   const openModal = () => {
//     setFormData({
//       name: "",
//       type: "EXPENSE",
//     });

//     setModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     if (!saving) {
//       setModalOpen(false);
//     }
//   };

//   // Add category
//   const handleSubmit = async () => {
//     if (!formData.name.trim()) {
//       message.error("Category name is required");
//       return;
//     }

//     try {
//       setSaving(true);

//       await axios.post("/api/categories", {
//         name: formData.name.trim(),
//         type: formData.type,
//       });

//       message.success("Category added");

//       setModalOpen(false);

//       setFormData({
//         name: "",
//         type: "EXPENSE",
//       });

//       await fetchCategories();
//     } catch (error) {
//       console.error("Error adding category:", error);

//       message.error(
//         error?.response?.data?.message ||
//           "Unable to add category."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Delete category
//   const handleDelete = async (category) => {
//     try {
//       await axios.delete(
//         `/api/categories/${category.id}`
//       );

//       message.success("Category deleted");

//       await fetchCategories();
//     } catch (error) {
//       console.error("Error deleting category:", error);

//       message.error(
//         error?.response?.data?.message ||
//           "Unable to delete category."
//       );
//     }
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },

//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",

//       render: (type) => (
//         <Tag
//           color={
//             type === "INCOME"
//               ? "green"
//               : "red"
//           }
//         >
//           {type}
//         </Tag>
//       ),
//     },

//     {
//       title: "Actions",
//       key: "actions",

//       render: (_, record) => (
//         <Popconfirm
//           title="Delete this category?"
//           description="Are you sure you want to delete this category?"
//           okText="Yes"
//           cancelText="No"
//           onConfirm={() =>
//             handleDelete(record)
//           }
//         >
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//           >
//             Delete
//           </Button>
//         </Popconfirm>
//       ),
//     },
//   ];

//   return (
//     <div>
//       {/* Page Header */}
//       <div
//         className="page-header"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 20,
//         }}
//       >
//         <Title
//           level={2}
//           style={{ margin: 0 }}
//         >
//           Category Management
//         </Title>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={openModal}
//         >
//           Add Category
//         </Button>
//       </div>

//       {/* Categories Table */}
//       <Card>
//         <Table
//           rowKey={(record) => record.id}
//           columns={columns}
//           dataSource={categories}
//           loading={loading}
//           pagination={{
//             pageSize: 10,
//           }}
//           locale={{
//             emptyText: "No categories found",
//           }}
//         />
//       </Card>

//       {/* Add Category Modal */}
//       <Modal
//         open={modalOpen}
//         title="Add Category"
//         onCancel={closeModal}
//         onOk={handleSubmit}
//         confirmLoading={saving}
//         okText="Add Category"
//         cancelText="Cancel"
//       >
//         <div style={{ marginTop: 10 }}>
//           {/* Category Name */}
//           <label
//             htmlFor="category-name"
//             style={{
//               display: "block",
//               marginBottom: 6,
//             }}
//           >
//             Name
//           </label>

//           <Input
//             id="category-name"
//             placeholder="e.g. Salary, Groceries"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 name: e.target.value,
//               })
//             }
//             onPressEnter={handleSubmit}
//             style={{
//               marginBottom: 16,
//             }}
//           />

//           {/* Category Type */}
//           <label
//             htmlFor="category-type"
//             style={{
//               display: "block",
//               marginBottom: 6,
//             }}
//           >
//             Type
//           </label>

//           <Select
//             id="category-type"
//             value={formData.type}
//             onChange={(value) =>
//               setFormData({
//                 ...formData,
//                 type: value,
//               })
//             }
//             style={{
//               width: "100%",
//             }}
//             options={[
//               {
//                 value: "INCOME",
//                 label: "INCOME",
//               },
//               {
//                 value: "EXPENSE",
//                 label: "EXPENSE",
//               },
//             ]}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default CategoryManagement;
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
  EditOutlined,
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

  const CURRENCY_ITEMS = [
    { country: "AU", name: "Australian Dollar", code: "AUD", symbol: "AUD", flag: "🇦🇺" },
    { country: "CA", name: "Canadian Dollar", code: "CAD", symbol: "CAD", flag: "🇨🇦" },
    { country: "EU", name: "Euro", code: "EUR", symbol: "EUR", flag: "🇪🇺" },
    { country: "GB", name: "British Pound", code: "GBP", symbol: "GBP", flag: "🇬🇧" },
    { country: "IN", name: "Indian Rupee", code: "INR", symbol: "INR", flag: "🇮🇳" },
    { country: "JP", name: "Japanese Yen", code: "JPY", symbol: "JPY", flag: "🇯🇵" },
    { country: "US", name: "US Dollar", code: "USD", symbol: "USD", flag: "🇺🇸" },
  ];

  const getCategoryCurrencyInfo = (name, fallbackCode) => {
    try {
      const map = JSON.parse(localStorage.getItem("category_currency_map") || "{}");
      const saved = map[String(name || "").toLowerCase()];
      if (saved?.currency) {
        const match = CURRENCY_ITEMS.find((c) => c.code === saved.currency);
        if (match) return match;
      }
    } catch (e) {}

    if (fallbackCode) {
      const match = CURRENCY_ITEMS.find((c) => c.code === fallbackCode);
      if (match) return match;
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
    const code = presetMap[name] || "USD";
    return CURRENCY_ITEMS.find((c) => c.code === code) || CURRENCY_ITEMS[6];
  };

  const handleCurrencySelect = (val) => {
    const item = CURRENCY_ITEMS.find((c) => c.code === val);
    setFormData((p) => ({
      ...p,
      currency: val,
      symbol: item ? item.symbol : val,
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/categories");
      const data = response?.data;

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setFormData({
      name: "",
      type: "EXPENSE",
      currency: "USD",
      symbol: "USD",
    });
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    const currInfo = getCategoryCurrencyInfo(c.name, c.currency);
    setFormData({
      name: c.name,
      type: c.type,
      currency: currInfo.code,
      symbol: currInfo.symbol,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      message.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      await axios.post("/api/categories", {
        name: formData.name.trim(),
        type: formData.type,
      });

      try {
        const key = "category_currency_map";
        const map = JSON.parse(localStorage.getItem(key) || "{}");
        map[formData.name.trim().toLowerCase()] = {
          currency: formData.currency,
          symbol: formData.symbol,
        };
        localStorage.setItem(key, JSON.stringify(map));
      } catch (e) {}

      message.success("Category added successfully");
      setModalOpen(false);
      await fetchCategories();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    try {
      await axios.delete(`/api/categories/${category.id}`);
      message.success("Category deleted successfully");
      await fetchCategories();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to delete category."
      );
    }
  };

  // Demo fallback items matching Screen 8 if empty
  const defaultCategories = [
    { id: 101, name: "Food", type: "EXPENSE", icon: "🍔", currency: "USD" },
    { id: 102, name: "Transport", type: "EXPENSE", icon: "🚗", currency: "AUD" },
    { id: 103, name: "Shopping", type: "EXPENSE", icon: "🛍️", currency: "CAD" },
    { id: 104, name: "Bills", type: "EXPENSE", icon: "⚡", currency: "EUR" },
    { id: 105, name: "Salary", type: "INCOME", icon: "💼", currency: "INR" },
    { id: 106, name: "Others", type: "EXPENSE", icon: "📦", currency: "GBP" },
  ];

  const displayList = categories.length > 0 ? categories : defaultCategories;

  const filteredCategories = useMemo(() => {
    let list = displayList;

    if (typeFilter !== "ALL") {
      list = list.filter((c) => String(c.type).toUpperCase() === typeFilter);
    }

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter((c) => String(c.name || "").toLowerCase().includes(term));
    }

    return list;
  }, [displayList, search, typeFilter]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            Categories
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            Organize transactions with custom income and expense categories
          </Text>
        </div>

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
      </div>

      {/* Main Table Card */}
      <Card className="modern-card">
        {/* Filter Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <Input
            placeholder="Search categories..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300, height: 40, borderRadius: 8 }}
          />

          <Select
            value={typeFilter}
            onChange={(val) => setTypeFilter(val)}
            style={{ width: 150, height: 40 }}
            options={[
              { value: "ALL", label: "All Types" },
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
            ]}
          />
        </div>

        {/* Categories Table (Screen 8) */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="custom-table" style={{ overflowX: "auto" }}>
            <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Icon</th>
                <th>Category Name</th>
                <th>Type</th>
                <th>Currency</th>
                <th>Symbol</th>
                <th style={{ textAlign: "center", width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => {
                const isExpense = String(c.type).toUpperCase() === "EXPENSE";
                const icon = c.icon || CATEGORY_ICONS[c.name] || (isExpense ? "🛍️" : "💰");
                const currInfo = getCategoryCurrencyInfo(c.name, c.currency);

                return (
                  <tr key={c.id}>
                    <td>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: isExpense ? "#fef2f2" : "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                        }}
                      >
                        {icon}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>
                      {c.name}
                    </td>
                    <td>
                      <span className={`pill-badge ${isExpense ? "expense" : "income"}`}>
                        {isExpense ? "Expense" : "Income"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>
                      <Space size="middle">
                        <span style={{ fontSize: 18 }}>{currInfo.flag}</span>
                        <span>{currInfo.country} {currInfo.name}</span>
                      </Space>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f766e" }}>
                      {currInfo.symbol}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Space size="small">
                        <button
                          type="button"
                          className="action-btn-circle"
                          onClick={() => openEditModal(c)}
                          title="Edit"
                        >
                          <EditOutlined />
                        </button>
                        <Popconfirm
                          title="Delete category"
                          description="Are you sure you want to delete this category?"
                          onConfirm={() => handleDelete(c)}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                        >
                          <button
                            type="button"
                            className="action-btn-circle danger"
                            title="Delete"
                          >
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      {/* Add Category Modal */}
      <Modal
        title={
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              Add Category
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Define a category for budgeting and analytics
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Category Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Input
              size="large"
              placeholder="e.g., Groceries, Utilities, Freelance"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              style={{ borderRadius: 8, height: 42 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Category Type <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Select
              size="large"
              style={{ width: "100%", height: 42 }}
              value={formData.type}
              onChange={(val) => setFormData((p) => ({ ...p, type: val }))}
              options={[
                { value: "EXPENSE", label: "Expense Category" },
                { value: "INCOME", label: "Income Category" },
              ]}
            />
          </div>

          {/* Currency & Symbol Section in Add Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 24 }}>
            <div>
              <label htmlFor="category-currency" style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                CURRENCY <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Select
                id="category-currency"
                size="large"
                style={{ width: "100%", height: 42 }}
                value={formData.currency}
                onChange={handleCurrencySelect}
                options={CURRENCY_ITEMS.map((c) => ({
                  value: c.code,
                  label: `${c.country} ${c.name}`,
                }))}
              />
            </div>

            <div>
              <label htmlFor="category-symbol" style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                SYMBOL <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Input
                id="category-symbol"
                size="large"
                readOnly
                value={formData.symbol}
                style={{
                  borderRadius: 8,
                  height: 42,
                  fontWeight: 700,
                  background: "#f8fafc",
                  color: "#0f766e",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button size="large" onClick={() => setModalOpen(false)} style={{ borderRadius: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={saving}
              onClick={handleSubmit}
              style={{
                borderRadius: 8,
                fontWeight: 700,
                background: "#10b981",
                borderColor: "#10b981",
                minWidth: 110,
              }}
            >
              Save Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CategoryManagement;

