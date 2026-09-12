// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Input,
//   InputNumber,
//   Modal,
//   Space,
//   Table,
//   Typography,
//   message,
// } from "antd";

// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// import axios from "axios";

// const { Title } = Typography;

// function CurrencyManagement() {
//   const [currencies, setCurrencies] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(false);

//   const [modalOpen, setModalOpen] =
//     useState(false);

//   const [saving, setSaving] =
//     useState(false);

//   const [editingCurrency, setEditingCurrency] =
//     useState(null);

//   const [formData, setFormData] = useState({
//     code: "",
//     name: "",
//     symbol: "",
//     exchangeRate: null,
//   });

//   useEffect(() => {
//     fetchCurrencies();
//   }, []);

//   const fetchCurrencies = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.get(
//         "/api/currencies"
//       );

//       const data = response?.data;

//       setCurrencies(
//         Array.isArray(data)
//           ? data
//           : Array.isArray(data?.content)
//           ? data.content
//           : []
//       );
//     } catch (error) {
//       setCurrencies([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrencyId = (currency) =>
//     currency?.id ?? currency?.code;

//   const openAdd = () => {
//     setEditingCurrency(null);

//     setFormData({
//       code: "",
//       name: "",
//       symbol: "",
//       exchangeRate: null,
//     });

//     setModalOpen(true);
//   };

//   const openEdit = (currency) => {
//     setEditingCurrency(currency);

//     setFormData({
//       code: currency?.code || "",
//       name: currency?.name || "",
//       symbol: currency?.symbol || "",
//       exchangeRate:
//         currency?.exchangeRate !== undefined
//           ? Number(currency.exchangeRate)
//           : null,
//     });

//     setModalOpen(true);
//   };

//   const handleSubmit = async () => {
//     if (!formData.code.trim()) {
//       message.error("Currency code is required");
//       return;
//     }

//     if (!formData.name.trim()) {
//       message.error("Currency name is required");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         code: formData.code
//           .trim()
//           .toUpperCase(),
//         name: formData.name.trim(),
//         symbol: formData.symbol,
//         exchangeRate:
//           Number(formData.exchangeRate) || 1,
//       };

//       if (editingCurrency) {
//         await axios.put(
//           `/api/currencies/${getCurrencyId(
//             editingCurrency
//           )}`,
//           payload
//         );

//         message.success(
//           "Currency updated"
//         );
//       } else {
//         await axios.post(
//           "/api/currencies",
//           payload
//         );

//         message.success("Currency added");
//       }

//       setModalOpen(false);

//       await fetchCurrencies();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message ||
//           "Unable to save currency."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (currency) => {
//     try {
//       await axios.delete(
//         `/api/currencies/${getCurrencyId(
//           currency
//         )}`
//       );

//       message.success("Currency deleted");

//       await fetchCurrencies();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message ||
//           "Unable to delete currency."
//       );
//     }
//   };

//   const columns = [
//     {
//       title: "Code",
//       dataIndex: "code",
//       key: "code",
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Symbol",
//       dataIndex: "symbol",
//       key: "symbol",
//       render: (value) => value || "-",
//     },
//     {
//       title: "Exchange Rate (vs USD)",
//       dataIndex: "exchangeRate",
//       key: "exchangeRate",
//       render: (value) =>
//         Number(value || 0).toFixed(4),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() =>
//               openEdit(record)
//             }
//           >
//             Edit
//           </Button>

//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() =>
//               Modal.confirm({
//                 title: "Delete Currency",
//                 content:
//                   "Are you sure you want to delete this currency?",
//                 okType: "danger",
//                 onOk: () =>
//                   handleDelete(record),
//               })
//             }
//           >
//             Delete
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="page-header">
//         <Title level={2}>
//           Currency Management
//         </Title>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={openAdd}
//         >
//           Add Currency
//         </Button>
//       </div>

//       <Card>
//         <Table
//           rowKey={(record) =>
//             getCurrencyId(record)
//           }
//           columns={columns}
//           dataSource={currencies}
//           loading={loading}
//           scroll={{ x: 700 }}
//         />
//       </Card>

//       <Modal
//         open={modalOpen}
//         title={
//           editingCurrency
//             ? "Edit Currency"
//             : "Add Currency"
//         }
//         onCancel={() =>
//           setModalOpen(false)
//         }
//         onOk={handleSubmit}
//         confirmLoading={saving}
//       >
//         <div style={{ marginTop: 10 }}>
//           <label>Code</label>

//           <Input
//             placeholder="e.g. USD"
//             value={formData.code}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 code: e.target.value,
//               })
//             }
//             style={{
//               marginTop: 6,
//               marginBottom: 16,
//             }}
//           />

//           <label>Name</label>

//           <Input
//             placeholder="e.g. US Dollar"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 name: e.target.value,
//               })
//             }
//             style={{
//               marginTop: 6,
//               marginBottom: 16,
//             }}
//           />

//           <label>Symbol</label>

//           <Input
//             placeholder="e.g. $"
//             value={formData.symbol}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 symbol: e.target.value,
//               })
//             }
//             style={{
//               marginTop: 6,
//               marginBottom: 16,
//             }}
//           />

//           <label>Exchange Rate</label>

//           <InputNumber
//             step={0.01}
//             min={0}
//             value={formData.exchangeRate}
//             onChange={(value) =>
//               setFormData({
//                 ...formData,
//                 exchangeRate: value,
//               })
//             }
//             style={{
//               width: "100%",
//               marginTop: 6,
//             }}
//           />
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default CurrencyManagement;

import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
  message,
  Popconfirm,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const CURRENCY_COUNTRY = {
  AUD: "AU",
  CAD: "CA",
  EUR: "EU",
  GBP: "GB",
  INR: "IN",
  JPY: "JP",
  USD: "US",
};

const CURRENCY_DISPLAY_NAMES = {
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  USD: "US Dollar",
};

const PRESET_CURRENCIES = [
  { code: "AUD", country: "AU", name: "Australian Dollar", symbol: "AUD", exchangeRate: 1.52 },
  { code: "CAD", country: "CA", name: "Canadian Dollar", symbol: "CAD", exchangeRate: 1.37 },
  { code: "EUR", country: "EU", name: "Euro", symbol: "EUR", exchangeRate: 0.92 },
  { code: "GBP", country: "GB", name: "British Pound", symbol: "GBP", exchangeRate: 0.79 },
  { code: "INR", country: "IN", name: "Indian Rupee", symbol: "INR", exchangeRate: 83.21 },
  { code: "JPY", country: "JP", name: "Japanese Yen", symbol: "JPY", exchangeRate: 155.0 },
  { code: "USD", country: "US", name: "US Dollar", symbol: "USD", exchangeRate: 1.0 },
];

function CurrencyManagement() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);

  // Quick Calculator State
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcFrom, setCalcFrom] = useState("USD");
  const [calcTo, setCalcTo] = useState("EUR");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: null,
  });

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/currencies");
      const data = response?.data;

      setCurrencies(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingCurrency(null);
    setFormData({
      code: "",
      name: "",
      symbol: "",
      exchangeRate: null,
    });
    setModalOpen(true);
  };

  const openEdit = (currency) => {
    setEditingCurrency(currency);
    const rawName = currency?.name || "";
    const cleaned = rawName.replace(/^[A-Z]{2}\s+/i, "");
    const name = CURRENCY_DISPLAY_NAMES[currency?.code] || cleaned || "";
    setFormData({
      code: currency?.code || "",
      name: name,
      symbol: currency?.symbol || currency?.code || "",
      exchangeRate:
        currency?.exchangeRate !== undefined
          ? Number(currency.exchangeRate)
          : null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.code.trim()) {
      message.error("Currency code is required");
      return;
    }

    if (!formData.name.trim()) {
      message.error("Currency name is required");
      return;
    }

    if (
      formData.exchangeRate === null ||
      Number(formData.exchangeRate) <= 0
    ) {
      message.error("Exchange rate must be greater than zero");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        symbol: formData.symbol || formData.code.trim().toUpperCase(),
        exchangeRate: Number(formData.exchangeRate),
      };

      if (editingCurrency) {
        await axios.put(
          `/api/currencies/${editingCurrency.code}`,
          payload
        );
        message.success("Currency updated successfully");
      } else {
        await axios.post("/api/currencies", payload);
        message.success("Currency added successfully");
      }

      setModalOpen(false);
      await fetchCurrencies();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to save currency."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (currency) => {
    try {
      await axios.delete(`/api/currencies/${currency.code}`);
      message.success("Currency deleted successfully");
      await fetchCurrencies();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to delete currency."
      );
    }
  };

  // Comprehensive display list with all 7 currencies guaranteed
  const displayList = useMemo(() => {
    const list = [...currencies];
    PRESET_CURRENCIES.forEach((preset) => {
      const exists = list.some((item) => item.code === preset.code);
      if (!exists) {
        list.push(preset);
      }
    });

    // Sort according to standard order: AUD, CAD, EUR, GBP, INR, JPY, USD
    const order = ["AUD", "CAD", "EUR", "GBP", "INR", "JPY", "USD"];
    list.sort((a, b) => {
      const idxA = order.indexOf(a.code);
      const idxB = order.indexOf(b.code);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.code.localeCompare(b.code);
    });

    return list;
  }, [currencies]);

  // Real-time conversion calculation
  const convertedResult = useMemo(() => {
    const fromRate = displayList.find((c) => c.code === calcFrom)?.exchangeRate || 1;
    const toRate = displayList.find((c) => c.code === calcTo)?.exchangeRate || 1;
    if (!fromRate || !toRate) return 0;
    // Base is USD: amount / fromRate * toRate
    return ((Number(calcAmount) / fromRate) * toRate).toFixed(2);
  }, [calcAmount, calcFrom, calcTo, displayList]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            Currencies
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            Manage exchange rates and cross-border currency conversions
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openAdd}
          style={{
            borderRadius: 8,
            fontWeight: 700,
            background: "#10b981",
            borderColor: "#10b981",
          }}
        >
          Add Currency
        </Button>
      </div>

      {/* Main Currency Table (Screen 9) */}
      <Card className="modern-card" style={{ marginBottom: 24 }}>
        {loading && currencies.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="custom-table" style={{ overflowX: "auto" }}>
            <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Symbol</th>
                <th>Exchange Rate (USD)</th>
                <th style={{ textAlign: "center", width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((c) => {
                const country = CURRENCY_COUNTRY[c.code] || c.code.slice(0, 2);
                const rawName = c.name || "";
                const cleaned = rawName.replace(/^[A-Z]{2}\s+/i, "");
                const displayName = CURRENCY_DISPLAY_NAMES[c.code] || cleaned;
                const symbolCode = c.symbol || c.code;
                const rate = Number(c.exchangeRate || 1).toFixed(4);

                return (
                  <tr key={c.code}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>
                      <Space size="middle">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#ecfdf5",
                            color: "#059669",
                            fontWeight: 700,
                            fontSize: 12,
                            border: "1px solid #a7f3d0",
                          }}
                        >
                          {country}
                        </span>
                        <span>{displayName}</span>
                      </Space>
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f766e" }}>
                      {symbolCode}
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>
                      {rate}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Space size="small">
                        <button
                          type="button"
                          className="action-btn-circle"
                          onClick={() => openEdit(c)}
                          title="Edit Rate"
                        >
                          <EditOutlined />
                        </button>
                        <Popconfirm
                          title="Delete currency"
                          description="Are you sure you want to delete this currency?"
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

      {/* Quick Interactive Exchange Calculator */}
      <Card
        className="modern-card"
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SwapOutlined style={{ color: "#10b981", fontSize: 18 }} />
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
              Quick Exchange Calculator
            </span>
          </div>
        }
      >
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} sm={8}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
              AMOUNT
            </label>
            <InputNumber
              size="large"
              value={calcAmount}
              onChange={(val) => setCalcAmount(val || 0)}
              style={{ width: "100%", height: 44 }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
              FROM CURRENCY
            </label>
            <select
              value={calcFrom}
              onChange={(e) => setCalcFrom(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                padding: "0 12px",
                fontSize: 14,
                fontWeight: 600,
                background: "#ffffff",
              }}
            >
              {displayList.map((c) => {
                const rawName = c.name || "";
                const cleaned = rawName.replace(/^[A-Z]{2}\s+/i, "");
                const displayName = CURRENCY_DISPLAY_NAMES[c.code] || cleaned;
                return (
                  <option key={c.code} value={c.code}>
                    {displayName} ({c.code})
                  </option>
                );
              })}
            </select>
          </Col>

          <Col xs={24} sm={8}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
              TO CURRENCY
            </label>
            <select
              value={calcTo}
              onChange={(e) => setCalcTo(e.target.value)}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                padding: "0 12px",
                fontSize: 14,
                fontWeight: 600,
                background: "#ffffff",
              }}
            >
              {displayList.map((c) => {
                const rawName = c.name || "";
                const cleaned = rawName.replace(/^[A-Z]{2}\s+/i, "");
                const displayName = CURRENCY_DISPLAY_NAMES[c.code] || cleaned;
                return (
                  <option key={c.code} value={c.code}>
                    {displayName} ({c.code})
                  </option>
                );
              })}
            </select>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: "#f0fdf4",
            borderRadius: 12,
            border: "1px solid rgba(16, 185, 129, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, color: "#065f46", fontWeight: 600 }}>
            Estimated Conversion:
          </span>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#059669",
            }}
          >
            {calcAmount} {calcFrom} = {convertedResult} {calcTo}
          </span>
        </div>
      </Card>

      {/* Add / Edit Currency Modal */}
      <Modal
        title={
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              {editingCurrency ? "Edit Currency" : "Add Currency"}
            </h3>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Define exchange rate relative to USD
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ padding: "16px 0" }}>
          {!editingCurrency && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                Preset Currency Quick-Select
              </label>
              <Select
                size="large"
                placeholder="Choose standard currency..."
                style={{ width: "100%", height: 42 }}
                onChange={(val) => {
                  const found = PRESET_CURRENCIES.find((p) => p.code === val);
                  if (found) {
                    setFormData({
                      code: found.code,
                      name: found.name,
                      symbol: found.symbol,
                      exchangeRate: found.exchangeRate,
                    });
                  }
                }}
                options={PRESET_CURRENCIES.map((p) => ({
                  value: p.code,
                  label: `${p.name} (${p.symbol})`,
                }))}
              />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Currency Code <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Input
                size="large"
                placeholder="e.g., AUD, CAD, JPY"
                disabled={!!editingCurrency}
                value={formData.code}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                style={{ borderRadius: 8, height: 42 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                SYMBOL <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <Input
                size="large"
                placeholder="e.g., AUD, USD"
                value={formData.symbol}
                onChange={(e) => setFormData((p) => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                style={{ borderRadius: 8, height: 42 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Currency Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <Input
              size="large"
              placeholder="e.g., Australian Dollar"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              style={{ borderRadius: 8, height: 42 }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              Exchange Rate against USD <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <InputNumber
              size="large"
              style={{ width: "100%", height: 42 }}
              min={0.0001}
              step={0.01}
              placeholder="e.g., 1.3700"
              value={formData.exchangeRate}
              onChange={(val) => setFormData((p) => ({ ...p, exchangeRate: val }))}
            />
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
              Save Currency
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CurrencyManagement;

