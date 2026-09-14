// // import React, { useEffect, useMemo, useState } from "react";
// // import {
// //   Button,
// //   Card,
// //   Tag,
// //   Space,
// //   Typography,
// //   Empty,
// //   Modal,
// //   message,
// // } from "antd";
// // import {
// //   EditOutlined,
// //   DeleteOutlined,
// //   PlusOutlined,
// // } from "@ant-design/icons";
// // import axios from "axios";
// // import dayjs from "dayjs";

// // const { Title, Text } = Typography;

// // const getInitialForm = () => ({
// //   title: "",
// //   amount: "",
// //   currencyCode: "USD",
// //   transactionType: "EXPENSE",
// //   transactionDate: dayjs().format("YYYY-MM-DD"),
// //   note: "",
// //   categoryId: "",
// // });

// // const safeArray = (data) => {
// //   if (Array.isArray(data)) return data;
// //   if (Array.isArray(data?.content)) return data.content;
// //   return [];
// // };

// // export default function TransactionsPage() {
// //   const [transactions, setTransactions] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [currencies, setCurrencies] = useState([]);

// //   const [loading, setLoading] = useState(false);
// //   const [search, setSearch] = useState("");

// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [editingTransaction, setEditingTransaction] = useState(null);
// //   const [saving, setSaving] = useState(false);

// //   const [formData, setFormData] = useState(getInitialForm());

// //   // ================================
// //   // FETCH TRANSACTIONS
// //   // ================================
// //   const fetchTransactions = async () => {
// //     setLoading(true);

// //     try {
// //       const response = await axios.get("/api/transactions");

// //       setTransactions(safeArray(response.data));
// //     } catch (error) {
// //       if (error?.response?.status === 401) {
// //         return;
// //       }

// //       setTransactions([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ================================
// //   // FETCH CATEGORIES
// //   // ================================
// //   const fetchCategories = async () => {
// //     try {
// //       const response = await axios.get("/api/categories");

// //       setCategories(safeArray(response.data));
// //     } catch (error) {
// //       setCategories([]);
// //     }
// //   };

// //   // ================================
// //   // FETCH CURRENCIES
// //   // ================================
// //   const fetchCurrencies = async () => {
// //     try {
// //       const response = await axios.get("/api/currencies");

// //       setCurrencies(safeArray(response.data));
// //     } catch (error) {
// //       setCurrencies([]);
// //     }
// //   };

// //   // ================================
// //   // INITIAL LOAD
// //   // ================================
// //   useEffect(() => {
// //     fetchTransactions();
// //     fetchCategories();
// //     fetchCurrencies();
// //   }, []);

// //   // ================================
// //   // FORM CHANGE
// //   // ================================
// //   const handleChange = (field, value) => {
// //     setFormData((previous) => ({
// //       ...previous,
// //       [field]: value,
// //     }));
// //   };

// //   // ================================
// //   // OPEN ADD
// //   // ================================
// //   const openAddModal = () => {
// //     setEditingTransaction(null);
// //     setFormData(getInitialForm());
// //     setModalOpen(true);
// //   };

// //   // ================================
// //   // OPEN EDIT
// //   // ================================
// //   const openEditModal = (transaction) => {
// //     setEditingTransaction(transaction);

// //     setFormData({
// //       title: transaction.title || "",
// //       amount: transaction.amount ?? "",
// //       currencyCode:
// //         transaction.currency?.code ||
// //         transaction.currencyCode ||
// //         "USD",
// //       transactionType:
// //         transaction.transactionType || "EXPENSE",
// //       transactionDate:
// //         transaction.transactionDate ||
// //         dayjs().format("YYYY-MM-DD"),
// //       note: transaction.note || "",
// //       categoryId:
// //         transaction.category?.id ||
// //         transaction.categoryId ||
// //         "",
// //     });

// //     setModalOpen(true);
// //   };

// //   // ================================
// //   // CLOSE MODAL
// //   // ================================
// //   const closeModal = () => {
// //     setModalOpen(false);
// //     setEditingTransaction(null);
// //     setFormData(getInitialForm());
// //   };

// //   // ================================
// //   // FILTER CATEGORIES
// //   // ================================
// //   const filteredCategories = useMemo(() => {
// //     return categories.filter((category) => {
// //       return (
// //         !category.type ||
// //         category.type === formData.transactionType
// //       );
// //     });
// //   }, [categories, formData.transactionType]);

// //   // ================================
// //   // SEARCH
// //   // ================================
// //   const filteredTransactions = useMemo(() => {
// //     const searchValue = search.toLowerCase().trim();

// //     if (!searchValue) {
// //       return transactions;
// //     }

// //     return transactions.filter((transaction) => {
// //       const title = String(
// //         transaction.title || ""
// //       ).toLowerCase();

// //       const type = String(
// //         transaction.transactionType || ""
// //       ).toLowerCase();

// //       const category = String(
// //         transaction.category?.name || ""
// //       ).toLowerCase();

// //       return (
// //         title.includes(searchValue) ||
// //         type.includes(searchValue) ||
// //         category.includes(searchValue)
// //       );
// //     });
// //   }, [transactions, search]);

// //   // ================================
// //   // VALIDATE
// //   // ================================
// //   const validateForm = () => {
// //     if (!formData.title.trim()) {
// //       message.error("Title is required.");
// //       return false;
// //     }

// //     if (
// //       formData.amount === "" ||
// //       Number(formData.amount) <= 0
// //     ) {
// //       message.error("Amount must be greater than 0.");
// //       return false;
// //     }

// //     if (!formData.currencyCode) {
// //       message.error("Currency is required.");
// //       return false;
// //     }

// //     if (!formData.transactionType) {
// //       message.error("Transaction type is required.");
// //       return false;
// //     }

// //     if (!formData.categoryId) {
// //       message.error("Category is required.");
// //       return false;
// //     }

// //     if (!formData.transactionDate) {
// //       message.error("Date is required.");
// //       return false;
// //     }

// //     return true;
// //   };

// //   // ================================
// //   // BUILD PAYLOAD
// //   // ================================
// //   const buildPayload = () => {
// //     return {
// //       title: formData.title.trim(),
// //       amount: Number(formData.amount),
// //       currencyCode: formData.currencyCode,
// //       transactionType: formData.transactionType,
// //       transactionDate: formData.transactionDate,
// //       note: formData.note || "",
// //       categoryId: Number(formData.categoryId),
// //     };
// //   };

// //   // ================================
// //   // SAVE
// //   // ================================
// //   const handleSave = async () => {
// //     if (!validateForm()) {
// //       return;
// //     }

// //     setSaving(true);

// //     try {
// //       const payload = buildPayload();

// //       if (editingTransaction) {
// //         await axios.put(
// //           `/api/transactions/${editingTransaction.id}`,
// //           payload
// //         );

// //         message.success(
// //           "Transaction updated successfully"
// //         );
// //       } else {
// //         await axios.post(
// //           "/api/transactions",
// //           payload
// //         );

// //         message.success(
// //           "Transaction created successfully"
// //         );
// //       }

// //       closeModal();

// //       await fetchTransactions();
// //     } catch (error) {
// //       if (error?.response?.status === 401) {
// //         return;
// //       }

// //       message.error(
// //         error?.response?.data?.message ||
// //           "Unable to save transaction."
// //       );
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ================================
// //   // DELETE
// //   // ================================
// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(
// //         `/api/transactions/${id}`
// //       );

// //       message.success(
// //         "Transaction deleted successfully."
// //       );

// //       await fetchTransactions();
// //     } catch (error) {
// //       if (error?.response?.status === 401) {
// //         return;
// //       }

// //       message.error(
// //         "Unable to delete transaction."
// //       );
// //     }
// //   };

// //   // ================================
// //   // UI
// //   // ================================
// //   return (
// //     <div style={{ padding: 24 }}>
// //       <Card>
// //         {/* HEADER */}
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             marginBottom: 20,
// //             gap: 16,
// //           }}
// //         >
// //           <div>
// //             <Title
// //               level={2}
// //               style={{ margin: 0 }}
// //             >
// //               Transactions
// //             </Title>

// //             <Text type="secondary">
// //               Manage your income and expenses
// //             </Text>
// //           </div>

// //           <Button
// //             type="primary"
// //             icon={<PlusOutlined />}
// //             onClick={openAddModal}
// //           >
// //             Add Transaction
// //           </Button>
// //         </div>

// //         {/* SEARCH */}
// //         <div style={{ marginBottom: 20 }}>
// //           <input
// //             type="text"
// //             placeholder="Search transactions"
// //             value={search}
// //             onChange={(e) =>
// //               setSearch(e.target.value)
// //             }
// //             style={{
// //               width: "100%",
// //               height: 40,
// //               padding: "8px 12px",
// //               border: "1px solid #d9d9d9",
// //               borderRadius: 6,
// //               boxSizing: "border-box",
// //             }}
// //           />
// //         </div>

// //         {/* TRANSACTIONS */}
// //         {loading ? (
// //           <div
// //             style={{
// //               textAlign: "center",
// //               padding: 40,
// //             }}
// //           >
// //             Loading transactions...
// //           </div>
// //         ) : filteredTransactions.length === 0 ? (
// //           <Empty description="No transactions found" />
// //         ) : (
// //           <div style={{ overflowX: "auto" }}>
// //             <table
// //               style={{
// //                 width: "100%",
// //                 borderCollapse: "collapse",
// //               }}
// //             >
// //               <thead>
// //                 <tr>
// //                   <th style={headerStyle}>
// //                     Title
// //                   </th>

// //                   <th style={headerStyle}>
// //                     Type
// //                   </th>

// //                   <th style={headerStyle}>
// //                     Amount
// //                   </th>

// //                   <th style={headerStyle}>
// //                     Category
// //                   </th>

// //                   <th style={headerStyle}>
// //                     Date
// //                   </th>

// //                   <th style={headerStyle}>
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredTransactions.map(
// //                   (transaction) => (
// //                     <tr key={transaction.id}>
// //                       <td style={cellStyle}>
// //                         {transaction.title}
// //                       </td>

// //                       <td style={cellStyle}>
// //                         <Tag
// //                           color={
// //                             transaction.transactionType ===
// //                             "INCOME"
// //                               ? "green"
// //                               : "red"
// //                           }
// //                         >
// //                           {
// //                             transaction.transactionType
// //                           }
// //                         </Tag>
// //                       </td>

// //                       <td style={cellStyle}>
// //                         {transaction.amount}{" "}
// //                         {transaction.currency?.code ||
// //                           transaction.currencyCode ||
// //                           ""}
// //                       </td>

// //                       <td style={cellStyle}>
// //                         {transaction.category?.name ||
// //                           "-"}
// //                       </td>

// //                       <td style={cellStyle}>
// //                         {transaction.transactionDate ||
// //                           "-"}
// //                       </td>

// //                       <td style={cellStyle}>
// //                         <Space>
// //                           <Button
// //                             icon={
// //                               <EditOutlined />
// //                             }
// //                             onClick={() =>
// //                               openEditModal(
// //                                 transaction
// //                               )
// //                             }
// //                           >
// //                             Edit
// //                           </Button>

// //                           <Button
// //                             danger
// //                             icon={
// //                               <DeleteOutlined />
// //                             }
// //                             onClick={() =>
// //                               handleDelete(
// //                                 transaction.id
// //                               )
// //                             }
// //                           >
// //                             Delete
// //                           </Button>
// //                         </Space>
// //                       </td>
// //                     </tr>
// //                   )
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </Card>

// //       {/* ========================================
// //           NATIVE MODAL
// //           ======================================== */}
// //       {modalOpen && (
// //         <div
// //           role="dialog"
// //           aria-modal="true"
// //           style={{
// //             position: "fixed",
// //             inset: 0,
// //             backgroundColor: "rgba(0,0,0,0.45)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             zIndex: 9999,
// //             padding: 20,
// //           }}
// //         >
// //           <div
// //             style={{
// //               backgroundColor: "#fff",
// //               width: 500,
// //               maxWidth: "100%",
// //               maxHeight: "90vh",
// //               overflowY: "auto",
// //               borderRadius: 8,
// //               padding: 24,
// //               boxSizing: "border-box",
// //             }}
// //           >
// //             {/* MODAL TITLE */}
// //             <h2 style={{ marginTop: 0 }}>
// //               {editingTransaction
// //                 ? "Edit Transaction"
// //                 : "Add New Transaction"}
// //             </h2>

// //             {/* TITLE */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-title"
// //                 style={{
// //                   display: "block",
// //                   marginBottom: 6,
// //                   fontWeight: 500,
// //                 }}
// //               >
// //                 Title
// //               </label>

// //               <input
// //                 id="transaction-title"
// //                 name="title"
// //                 type="text"
// //                 placeholder="e.g., Grocery Shopping"
// //                 required
// //                 value={formData.title}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "title",
// //                     e.target.value
// //                   )
// //                 }
// //                 style={inputStyle}
// //               />
// //             </div>

// //             {/* AMOUNT */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-amount"
// //                 style={labelStyle}
// //               >
// //                 Amount
// //               </label>

// //               <input
// //                 id="transaction-amount"
// //                 type="number"
// //                 min="0"
// //                 value={formData.amount}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "amount",
// //                     e.target.value
// //                   )
// //                 }
// //                 placeholder="Enter amount"
// //                 style={inputStyle}
// //               />
// //             </div>

// //             {/* TYPE */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-type"
// //                 style={labelStyle}
// //               >
// //                 Type
// //               </label>

// //               <select
// //                 id="transaction-type"
// //                 name="transactionType"
// //                 aria-label="Type"
// //                 value={formData.transactionType}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "transactionType",
// //                     e.target.value
// //                   )
// //                 }
// //                 style={inputStyle}
// //               >
// //                 <option value="EXPENSE">
// //                   EXPENSE
// //                 </option>

// //                 <option value="INCOME">
// //                   INCOME
// //                 </option>
// //               </select>
// //             </div>

// //             {/* CURRENCY */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-currency"
// //                 style={labelStyle}
// //               >
// //                 Currency
// //               </label>

// //               <select
// //                 id="transaction-currency"
// //                 value={formData.currencyCode}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "currencyCode",
// //                     e.target.value
// //                   )
// //                 }
// //                 style={inputStyle}
// //               >
// //                 {currencies.length === 0 && (
// //                   <option value="USD">
// //                     USD
// //                   </option>
// //                 )}

// //                 {currencies.map((currency) => (
// //                   <option
// //                     key={currency.code}
// //                     value={currency.code}
// //                   >
// //                     {currency.code}
// //                     {currency.name
// //                       ? ` - ${currency.name}`
// //                       : ""}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* CATEGORY */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-category"
// //                 style={labelStyle}
// //               >
// //                 Category
// //               </label>

// //               <select
// //                 id="transaction-category"
// //                 value={formData.categoryId}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "categoryId",
// //                     e.target.value
// //                   )
// //                 }
// //                 style={inputStyle}
// //               >
// //                 <option value="">
// //                   Select category
// //                 </option>

// //                 {filteredCategories.map(
// //                   (category) => (
// //                     <option
// //                       key={category.id}
// //                       value={category.id}
// //                     >
// //                       {category.name}
// //                     </option>
// //                   )
// //                 )}
// //               </select>
// //             </div>

// //             {/* DATE */}
// //             <div style={{ marginBottom: 16 }}>
// //               <label
// //                 htmlFor="transaction-date"
// //                 style={labelStyle}
// //               >
// //                 Date
// //               </label>

// //               <input
// //                 id="transaction-date"
// //                 type="date"
// //                 value={
// //                   formData.transactionDate
// //                 }
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "transactionDate",
// //                     e.target.value
// //                   )
// //                 }
// //                 style={inputStyle}
// //               />
// //             </div>

// //             {/* NOTE */}
// //             <div style={{ marginBottom: 20 }}>
// //               <label
// //                 htmlFor="transaction-note"
// //                 style={labelStyle}
// //               >
// //                 Note
// //               </label>

// //               <textarea
// //                 id="transaction-note"
// //                 value={formData.note}
// //                 onChange={(e) =>
// //                   handleChange(
// //                     "note",
// //                     e.target.value
// //                   )
// //                 }
// //                 placeholder="Optional note..."
// //                 rows={3}
// //                 style={{
// //                   ...inputStyle,
// //                   height: "auto",
// //                   resize: "vertical",
// //                 }}
// //               />
// //             </div>

// //             {/* MODAL BUTTONS */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "flex-end",
// //                 gap: 10,
// //               }}
// //             >
// //               <button
// //                 type="button"
// //                 onClick={closeModal}
// //                 style={{
// //                   padding: "8px 16px",
// //                   border: "1px solid #d9d9d9",
// //                   background: "#fff",
// //                   borderRadius: 6,
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 Cancel
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={handleSave}
// //                 disabled={saving}
// //                 style={{
// //                   padding: "8px 16px",
// //                   border: "none",
// //                   background: "#1677ff",
// //                   color: "#fff",
// //                   borderRadius: 6,
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 {saving ? "Saving..." : "Save"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ========================================
// // // STYLES
// // // ========================================

// // const inputStyle = {
// //   display: "block",
// //   width: "100%",
// //   height: 40,
// //   padding: "8px 11px",
// //   border: "1px solid #d9d9d9",
// //   borderRadius: 6,
// //   boxSizing: "border-box",
// //   background: "#fff",
// // };

// // const labelStyle = {
// //   display: "block",
// //   marginBottom: 6,
// //   fontWeight: 500,
// // };

// // const headerStyle = {
// //   textAlign: "left",
// //   padding: 12,
// //   borderBottom: "1px solid #ddd",
// //   background: "#fafafa",
// // };

// // const cellStyle = {
// //   padding: 12,
// //   borderBottom: "1px solid #eee",
// // };
// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   Button,
//   Card,
//   Space,
//   Typography,
//   Empty,
//   message,
//   Row,
//   Col,
//   Select,
//   Spin,
//   Tag,
//   Form,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   SearchOutlined,
//   CloseOutlined,
//   CheckCircleFilled,
// } from "@ant-design/icons";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import dayjs from "dayjs";
// import { logout } from "../store/slices/authSlice";

// const { Title, Text } = Typography;

// const DEFAULT_EXCHANGE_RATES = {
//   USD: 1.0,
//   EUR: 0.92,
//   GBP: 0.79,
//   INR: 83.50,
//   JPY: 155.0,
//   CAD: 1.36,
//   AUD: 1.52,
// };

// const getCurrencySymbol = (currency) => {
//   switch (currency) {
//     case "INR":
//       return "₹";
//     case "EUR":
//       return "€";
//     case "GBP":
//       return "£";
//     case "JPY":
//       return "¥";
//     case "AUD":
//       return "A$";
//     case "CAD":
//       return "C$";
//     case "USD":
//     default:
//       return "$";
//   }
// };

// const getInitialForm = () => ({
//   title: "",
//   amount: "",
//   currencyCode: "USD",
//   transactionType: "EXPENSE",
//   transactionDate: dayjs().format("YYYY-MM-DD"),
//   note: "",
//   categoryId: "",
// });

// const REQUIRED_CURRENCIES = [
//   { code: "AUD", country: "AU", name: "Australian Dollar", symbol: "AUD" },
//   { code: "CAD", country: "CA", name: "Canadian Dollar", symbol: "CAD" },
//   { code: "EUR", country: "EU", name: "Euro", symbol: "EUR" },
//   { code: "GBP", country: "GB", name: "British Pound", symbol: "GBP" },
//   { code: "INR", country: "IN", name: "Indian Rupee", symbol: "INR" },
//   { code: "JPY", country: "JP", name: "Japanese Yen", symbol: "JPY" },
//   { code: "USD", country: "US", name: "US Dollar", symbol: "USD" },
// ];

// const safeArray = (data) => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.content)) return data.content;
//   return [];
// };

// export default function TransactionsPage() {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();

//   const [transactions, setTransactions] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [currencies, setCurrencies] = useState([]);

//   const [activeCurrency, setActiveCurrency] = useState(() => {
//     return localStorage.getItem("preferredCurrency") || "USD";
//   });
//   const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);

//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("ALL");
//   const [categoryFilter, setCategoryFilter] = useState("ALL");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingTransaction, setEditingTransaction] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [successAlert, setSuccessAlert] = useState(null);

//   const isMountedRef = useRef(true);
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   const [formData, setFormData] = useState(getInitialForm());

//   const handleUnauthorized = useCallback(() => {
//     try {
//       dispatch(logout());
//     } catch (e) {}
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     if (axios.defaults?.headers?.common) {
//       delete axios.defaults.headers.common.Authorization;
//     }
//     message.error("Session expired. Please login again.");
//     if (typeof window !== "undefined" && window.location) {
//       if (window.location.pathname !== "/login") {
//         try {
//           window.location.href = "/login";
//         } catch (e) {}
//       }
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const handleCurrencyChange = (e) => {
//       const newCurr = e.detail || localStorage.getItem("preferredCurrency") || "USD";
//       setActiveCurrency(newCurr);
//     };

//     window.addEventListener("currencyChange", handleCurrencyChange);
//     return () => {
//       window.removeEventListener("currencyChange", handleCurrencyChange);
//     };
//   }, []);

//   // ================================
//   // FETCH TRANSACTIONS
//   // ================================
//   const fetchTransactions = async () => {
//     setLoading(true);

//     try {
//       const response = await axios.get("/api/transactions");
//       if (isMountedRef.current) {
//         setTransactions(safeArray(response.data));
//       }
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }
//       if (isMountedRef.current) {
//         setTransactions([]);
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setLoading(false);
//       }
//     }
//   };

//   // ================================
//   // FETCH CATEGORIES
//   // ================================
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("/api/categories");
//       if (isMountedRef.current) {
//         setCategories(safeArray(response.data));
//       }
//     } catch (error) {
//       if (isMountedRef.current) {
//         setCategories([]);
//       }
//     }
//   };

//   // ================================
//   // FETCH CURRENCIES
//   // ================================
//   const fetchCurrencies = async () => {
//     try {
//       const response = await axios.get("/api/currencies");
//       const list = safeArray(response.data);
//       if (isMountedRef.current) {
//         setCurrencies(list);
//         if (list.length > 0) {
//           const ratesMap = { ...DEFAULT_EXCHANGE_RATES };
//           list.forEach((c) => {
//             if (c.code && c.exchangeRate) {
//               ratesMap[c.code] = Number(c.exchangeRate);
//             }
//           });
//           setExchangeRates(ratesMap);
//         }
//       }
//     } catch (error) {
//       if (isMountedRef.current) {
//         setCurrencies([]);
//       }
//     }
//   };

//   // ================================
//   // INITIAL LOAD
//   // ================================
//   useEffect(() => {
//     fetchTransactions();
//     fetchCategories();
//     fetchCurrencies();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const convertValue = useCallback((amount, fromCurr = "USD") => {
//     const num = Number(amount || 0);
//     const from = fromCurr || "USD";
//     const to = activeCurrency || "USD";
//     if (from === to) return num;
//     const fromRate = exchangeRates[from] || DEFAULT_EXCHANGE_RATES[from] || 1.0;
//     const toRate = exchangeRates[to] || DEFAULT_EXCHANGE_RATES[to] || (to === "INR" ? 83.50 : 1.0);
//     return (num / fromRate) * toRate;
//   }, [activeCurrency, exchangeRates]);

//   const symbol = getCurrencySymbol(activeCurrency);

//   // ================================
//   // FORM CHANGE
//   // ================================
//   const handleChange = (field, value) => {
//     setFormData((previous) => {
//       const updated = {
//         ...previous,
//         [field]: value,
//       };
//       if (field === "transactionType") {
//         updated.categoryId = "";
//       }
//       return updated;
//     });
//   };

//   // ================================
//   // OPEN ADD
//   // ================================
//   const openAddModal = () => {
//     setEditingTransaction(null);
//     const initial = {
//       ...getInitialForm(),
//       currencyCode: activeCurrency,
//     };
//     setFormData(initial);
//     try {
//       form.resetFields();
//     } catch (e) {}
//     setModalOpen(true);
//   };

//   // ================================
//   // OPEN EDIT
//   // ================================
//   const openEditModal = (transaction) => {
//     setEditingTransaction(transaction);

//     const values = {
//       title: transaction.title || "",
//       amount: transaction.amount ?? "",
//       currencyCode:
//         transaction.currency?.code ||
//         transaction.currencyCode ||
//         "USD",
//       transactionType:
//         transaction.transactionType || "EXPENSE",
//       transactionDate:
//         transaction.transactionDate ||
//         dayjs().format("YYYY-MM-DD"),
//       note: transaction.note || "",
//       categoryId:
//         transaction.category?.id ||
//         transaction.categoryId ||
//         "",
//     };

//     setFormData(values);
//     try {
//       form.setFieldsValue(values);
//     } catch (e) {}

//     setModalOpen(true);
//   };

//   // ================================
//   // CLOSE MODAL
//   // ================================
//   const closeModal = () => {
//     setModalOpen(false);
//     setEditingTransaction(null);
//     try {
//       form.resetFields();
//     } catch (e) {}
//     setFormData(getInitialForm());
//   };

//   // ================================
//   // FILTER CATEGORIES
//   // ================================
//   const filteredCategories = useMemo(() => {
//     return categories.filter((category) => {
//       if (!category || !category.type) return false;
//       return (
//         String(category.type).toUpperCase() ===
//         String(formData.transactionType).toUpperCase()
//       );
//     });
//   }, [categories, formData.transactionType]);

//   const availableCurrencies = useMemo(() => {
//     const list = [...currencies];
//     REQUIRED_CURRENCIES.forEach((req) => {
//       if (!list.some((c) => c.code === req.code)) {
//         list.push(req);
//       }
//     });
//     return list;
//   }, [currencies]);

//   // ================================
//   // SEARCH & FILTER TRANSACTIONS
//   // ================================
//   const filteredTransactions = useMemo(() => {
//     let result = transactions;

//     // Type filter
//     if (typeFilter !== "ALL") {
//       result = result.filter(
//         (tx) => tx.transactionType === typeFilter
//       );
//     }

//     // Category filter
//     if (categoryFilter !== "ALL") {
//       result = result.filter(
//         (tx) => String(tx.category?.id || tx.categoryId) === String(categoryFilter)
//       );
//     }

//     // Text search
//     const searchValue = search.toLowerCase().trim();
//     if (searchValue) {
//       result = result.filter((transaction) => {
//         const title = String(transaction.title || "").toLowerCase();
//         const type = String(transaction.transactionType || "").toLowerCase();
//         const category = String(transaction.category?.name || "").toLowerCase();
//         const currency = String(
//           transaction.currency?.code || transaction.currencyCode || ""
//         ).toLowerCase();

//         return (
//           title.includes(searchValue) ||
//           type.includes(searchValue) ||
//           category.includes(searchValue) ||
//           currency.includes(searchValue)
//         );
//       });
//     }

//     return result;
//   }, [transactions, search, typeFilter, categoryFilter]);

//   // Summary Metrics
//   const summaryMetrics = useMemo(() => {
//     let income = 0;
//     let expense = 0;

//     transactions.forEach((tx) => {
//       const rawAmount = Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
//       const txCurr = tx.currency?.code || tx.currencyCode || "USD";
//       const converted = convertValue(rawAmount, txCurr);
//       if (tx.transactionType === "INCOME") {
//         income += converted;
//       } else if (tx.transactionType === "EXPENSE") {
//         expense += converted;
//       }
//     });

//     return {
//       income,
//       expense,
//       net: income - expense,
//       count: transactions.length,
//     };
//   }, [transactions, convertValue]);

//   // ================================
//   // SUBMIT
//   // ================================
//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!formData.title.trim()) {
//       message.error("Title is required.");
//       return;
//     }

//     const numericAmount = Number(formData.amount);
//     if (!formData.amount || isNaN(numericAmount) || numericAmount <= 0) {
//       message.error("Please enter a valid amount greater than 0.");
//       return;
//     }

//     if (!formData.currencyCode) {
//       message.error("Please select a currency.");
//       return;
//     }

//     const payload = {
//       title: formData.title.trim(),
//       amount: numericAmount,
//       currencyCode: formData.currencyCode,
//       transactionType: formData.transactionType,
//       transactionDate: formData.transactionDate,
//       note: formData.note ? formData.note.trim() : null,
//       categoryId: formData.categoryId ? Number(formData.categoryId) : null,
//     };

//     try {
//       setSaving(true);

//       if (editingTransaction?.id) {
//         await axios.put(`/api/transactions/${editingTransaction.id}`, payload);
//         message.success("Transaction updated successfully.");
//         setSuccessAlert("Transaction updated successfully.");
//         setTimeout(() => setSuccessAlert(null), 3000);
//       } else {
//         await axios.post("/api/transactions", payload);
//         message.success("Transaction added successfully.");
//         setSuccessAlert("Transaction added successfully.");
//         setTimeout(() => setSuccessAlert(null), 3000);
//       }

//       closeModal();
//       await fetchTransactions();
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       message.error(
//         error?.response?.data?.message ||
//           "Unable to save transaction."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================================
//   // DELETE
//   // ================================
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/transactions/${id}`);
//       message.success("Transaction deleted successfully.");
//       setSuccessAlert("Transaction deleted successfully.");
//       setTimeout(() => setSuccessAlert(null), 3000);
//       await fetchTransactions();
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleUnauthorized();
//         return;
//       }
//       message.error("Unable to delete transaction.");
//     }
//   };

//   const inputStyle = {
//     width: "100%",
//     height: "44px",
//     padding: "0 14px",
//     borderRadius: "8px",
//     border: "1px solid #cbd5e1",
//     fontSize: "14px",
//     boxSizing: "border-box",
//     outline: "none",
//     background: "#ffffff",
//     fontFamily: "inherit",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "13px",
//     fontWeight: 600,
//     color: "#334155",
//     marginBottom: "6px",
//   };

//   return (
//     <div>
//       {/* Floating Success Alert */}
//       {successAlert && (
//         <div
//           id="alert"
//           role="status"
//           style={{
//             position: "fixed",
//             top: 24,
//             right: 24,
//             zIndex: 9999,
//             background: "#10b981",
//             color: "#ffffff",
//             padding: "14px 24px",
//             borderRadius: "10px",
//             boxShadow: "0 10px 25px rgba(16, 185, 129, 0.35)",
//             fontWeight: 700,
//             fontSize: "14px",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//           }}
//         >
//           <CheckCircleFilled style={{ fontSize: 18 }} />
//           <span>{successAlert}</span>
//         </div>
//       )}

//       {/* Top Header */}
//       <div className="page-header">
//         <div>
//           <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
//             Transactions
//           </Title>
//           <Text style={{ color: "#64748b", fontSize: 14 }}>
//             Monitor and manage your multi-currency cash flows
//           </Text>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <Tag
//             color="success"
//             style={{
//               borderRadius: 20,
//               fontWeight: 700,
//               padding: "5px 14px",
//               fontSize: 13,
//               border: "1px solid #10b981",
//               background: "#ecfdf5",
//               color: "#065f46",
//             }}
//           >
//             Display Currency: {activeCurrency} ({symbol})
//           </Tag>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             size="large"
//             onClick={openAddModal}
//             style={{
//               borderRadius: 8,
//               fontWeight: 700,
//               background: "#10b981",
//               borderColor: "#10b981",
//             }}
//           >
//             Add Transaction
//           </Button>
//         </div>
//       </div>

//       {/* Summary KPI Cards */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Entries</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, margin: "6px 0 0 0" }}>
//               {summaryMetrics.count}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Income ({symbol})</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, color: "#10b981", margin: "6px 0 0 0" }}>
//               +{symbol}{summaryMetrics.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Total Expenses ({symbol})</span>
//             <div className="kpi-card-value" style={{ fontSize: 24, color: "#ef4444", margin: "6px 0 0 0" }}>
//               -{symbol}{summaryMetrics.expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>

//         <Col xs={24} sm={12} lg={6}>
//           <div className="kpi-card" style={{ padding: "16px 20px" }}>
//             <span className="kpi-card-label">Net Cashflow ({symbol})</span>
//             <div
//               className="kpi-card-value"
//               style={{
//                 fontSize: 24,
//                 color: summaryMetrics.net >= 0 ? "#10b981" : "#ef4444",
//                 margin: "6px 0 0 0",
//               }}
//             >
//               {summaryMetrics.net < 0 ? "-" : "+"}{symbol}{Math.abs(summaryMetrics.net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* Main Filter & Table Card */}
//       <Card className="modern-card">
//         {/* Filter Controls Bar */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//             gap: 12,
//             marginBottom: 20,
//           }}
//         >
//           {/* Search Input */}
//           <div style={{ position: "relative" }}>
//             <SearchOutlined
//               style={{
//                 position: "absolute",
//                 left: 12,
//                 top: 14,
//                 color: "#94a3b8",
//                 fontSize: 16,
//                 zIndex: 1,
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search transactions..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 ...inputStyle,
//                 paddingLeft: 38,
//                 height: 42,
//               }}
//             />
//           </div>

//           {/* Type Filter */}
//           <Select
//             value={typeFilter}
//             onChange={(val) => setTypeFilter(val)}
//             style={{ width: "100%", height: 42 }}
//             options={[
//               { value: "ALL", label: "All Types" },
//               { value: "INCOME", label: "Income Only" },
//               { value: "EXPENSE", label: "Expenses Only" },
//             ]}
//           />

//           {/* Category Filter */}
//           <Select
//             value={categoryFilter}
//             onChange={(val) => setCategoryFilter(val)}
//             style={{ width: "100%", height: 42 }}
//             options={[
//               { value: "ALL", label: "All Categories" },
//               ...categories.map((c) => ({
//                 value: String(c.id),
//                 label: c.name,
//               })),
//             ]}
//           />

//           {/* Clear Filters */}
//           {(search || typeFilter !== "ALL" || categoryFilter !== "ALL") && (
//             <Button
//               onClick={() => {
//                 setSearch("");
//                 setTypeFilter("ALL");
//                 setCategoryFilter("ALL");
//               }}
//               style={{ height: 42, borderRadius: 8 }}
//             >
//               Reset Filters
//             </Button>
//           )}
//         </div>

//         {/* Transactions Table */}
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "60px 0" }}>
//             <Spin size="large" />
//             <div style={{ marginTop: 12, color: "#64748b" }}>Loading transactions...</div>
//           </div>
//         ) : filteredTransactions.length === 0 ? (
//           <Empty
//             image={Empty.PRESENTED_IMAGE_SIMPLE}
//             description={
//               <div>
//                 <Text strong style={{ color: "#334155" }}>No transactions found</Text>
//                 <br />
//                 <Text type="secondary" style={{ fontSize: 13 }}>
//                   Try adjusting your filters or click "+ Add Transaction" to create one.
//                 </Text>
//               </div>
//             }
//           >
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={openAddModal}
//               style={{ background: "#10b981", borderColor: "#10b981" }}
//             >
//               Add Transaction
//             </Button>
//           </Empty>
//         ) : (
//           <div className="custom-table" style={{ overflowX: "auto" }}>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Title</th>
//                   <th>Category</th>
//                   <th>Original Amount</th>
//                   <th>Converted Amount ({symbol})</th>
//                   <th>Type</th>
//                   <th style={{ textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.map((tx) => {
//                   const isExpense = tx.transactionType === "EXPENSE";
//                   const catName = tx.category?.name || "General";
//                   const rawAmount = Number(tx.amount != null ? tx.amount : (tx.convertedAmount || 0));
//                   const txCurr = tx.currency?.code || tx.currencyCode || "USD";
//                   const convertedVal = convertValue(rawAmount, txCurr);

//                   return (
//                     <tr key={tx.id || Math.random()}>
//                       <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
//                         {tx.transactionDate ? dayjs(tx.transactionDate).format("YYYY-MM-DD") : "-"}
//                       </td>
//                       <td style={{ fontWeight: 600, color: "#0f172a" }}>
//                         {tx.title || tx.description || "Mock Transaction"}
//                       </td>
//                       <td>
//                         <span
//                           style={{
//                             display: "inline-block",
//                             padding: "3px 10px",
//                             borderRadius: 20,
//                             fontSize: 12,
//                             fontWeight: 600,
//                             background: isExpense ? "#fef2f2" : "#ecfdf5",
//                             color: isExpense ? "#dc2626" : "#059669",
//                           }}
//                         >
//                           {catName}
//                         </span>
//                       </td>
//                       <td style={{ whiteSpace: "nowrap", fontWeight: 600, color: "#334155" }}>
//                         {txCurr} {Number(rawAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td
//                         style={{
//                           fontWeight: 700,
//                           color: isExpense ? "#dc2626" : "#059669",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {isExpense ? "-" : "+"}
//                         {symbol}
//                         {convertedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td>
//                         <span className={`pill-badge ${isExpense ? "expense" : "income"}`}>
//                           {isExpense ? "Expense" : "Income"}
//                         </span>
//                       </td>
//                       <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
//                         <Space size="small">
//                           <button
//                             type="button"
//                             className="action-btn-circle"
//                             onClick={() => openEditModal(tx)}
//                             title="Edit"
//                           >
//                             <EditOutlined />
//                           </button>
//                           <button
//                             type="button"
//                             className="action-btn-circle danger"
//                             onClick={() => handleDelete(tx.id)}
//                             title="Delete"
//                           >
//                             <DeleteOutlined />
//                           </button>
//                         </Space>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>

//       {/* ====================================================
//           MODAL: ADD / EDIT TRANSACTION (SCREEN 5)
//           ==================================================== */}
//       {modalOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(15, 23, 42, 0.45)",
//             backdropFilter: "blur(6px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             padding: "20px",
//           }}
//           onClick={closeModal}
//         >
//           <div
//             style={{
//               background: "#ffffff",
//               borderRadius: "16px",
//               boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
//               maxWidth: "520px",
//               width: "100%",
//               overflow: "hidden",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div
//               style={{
//                 padding: "20px 24px",
//                 borderBottom: "1px solid #f1f5f9",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div>
//                 <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
//                   {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
//                 </h2>
//                 <div style={{ fontSize: 13, color: "#64748b" }}>
//                   Enter transaction details for multi-currency tracking
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 style={{
//                   border: "none",
//                   background: "transparent",
//                   cursor: "pointer",
//                   fontSize: 16,
//                   color: "#94a3b8",
//                 }}
//               >
//                 <CloseOutlined />
//               </button>
//             </div>

//             {/* Modal Form */}
//             <Form form={form} component={false}>
//               <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
//               {/* Date & Description Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-date" style={labelStyle}>
//                     Date <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-date"
//                     type="date"
//                     required
//                     value={formData.transactionDate}
//                     onChange={(e) => handleChange("transactionDate", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-title" style={labelStyle}>
//                     Description <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-title"
//                     type="text"
//                     placeholder="e.g., Grocery Shopping, Freelance Payout"
//                     required={true}
//                     value={formData.title}
//                     onChange={(e) => handleChange("title", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>
//               </div>

//               {/* Amount & Currency Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-amount" style={labelStyle}>
//                     Amount ({getCurrencySymbol(formData.currencyCode)}) <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     id="transaction-amount"
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     placeholder="0.00"
//                     required
//                     value={formData.amount}
//                     onChange={(e) => handleChange("amount", e.target.value)}
//                     style={inputStyle}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-currency" style={labelStyle}>
//                     Currency <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <select
//                     id="transaction-currency"
//                     value={formData.currencyCode}
//                     onChange={(e) => handleChange("currencyCode", e.target.value)}
//                     style={inputStyle}
//                   >
//                     {availableCurrencies.map((c) => {
//                       const nameMap = {
//                         AUD: "Australian Dollar",
//                         CAD: "Canadian Dollar",
//                         EUR: "Euro",
//                         GBP: "British Pound",
//                         INR: "Indian Rupee",
//                         JPY: "Japanese Yen",
//                         USD: "US Dollar",
//                       };
//                       const name = nameMap[c.code] || c.name || "";
//                       return (
//                         <option key={c.code} value={c.code}>
//                           {name} ({c.code})
//                         </option>
//                       );
//                     })}
//                   </select>
//                 </div>
//               </div>

//               {/* Type & Category Row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
//                 <div>
//                   <label htmlFor="transaction-type" style={labelStyle}>
//                     Type <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <select
//                     id="transaction-type"
//                     name="transactionType"
//                     aria-label="Type"
//                     value={formData.transactionType}
//                     onChange={(e) => handleChange("transactionType", e.target.value)}
//                     style={inputStyle}
//                   >
//                     <option value="EXPENSE">Expense</option>
//                     <option value="INCOME">Income</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="transaction-category" style={labelStyle}>
//                     Category
//                   </label>
//                   <select
//                     id="transaction-category"
//                     value={formData.categoryId}
//                     onChange={(e) => handleChange("categoryId", e.target.value)}
//                     style={inputStyle}
//                   >
//                     <option value="">Select category...</option>
//                     {filteredCategories.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Notes Field */}
//               <div style={{ marginBottom: 24 }}>
//                 <label htmlFor="transaction-notes" style={labelStyle}>
//                   Notes (Optional)
//                 </label>
//                 <input
//                   id="transaction-notes"
//                   type="text"
//                   placeholder="Add a note..."
//                   value={formData.note}
//                   onChange={(e) => handleChange("note", e.target.value)}
//                   style={inputStyle}
//                 />
//               </div>

//               {/* Modal Action Buttons */}
//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
//                 <Button
//                   size="large"
//                   onClick={closeModal}
//                   style={{ borderRadius: 8, fontWeight: 600 }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   size="large"
//                   loading={saving}
//                   style={{
//                     borderRadius: 8,
//                     fontWeight: 700,
//                     background: "#10b981",
//                     borderColor: "#10b981",
//                     minWidth: 140,
//                   }}
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingTransaction
//                     ? "Update Transaction"
//                     : "Add Transaction"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//         </div>
//       )}
//     </div>
//   );
// }
