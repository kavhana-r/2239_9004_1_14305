// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Col,
//   List,
//   Row,
//   Statistic,
//   Typography,
//   Alert,
//   Spin,
// } from "antd";

// import {
//   UserOutlined,
//   TransactionOutlined,
//   BarChartOutlined,
// } from "@ant-design/icons";

// import axios from "axios";

// const { Title, Text } = Typography;

// function AdminStats() {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalTransactions: 0,
//   });

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.get(
//         "/api/admin/stats"
//       );

//       const data = response?.data || {};

//       setStats({
//         totalUsers: Number(
//           data.totalUsers ??
//             data.totalRegisteredUsers ??
//             0
//         ),
//         totalTransactions: Number(
//           data.totalTransactions ??
//             data.totalTransactionsProcessed ??
//             0
//         ),
//       });
//     } catch (error) {
//       setError(
//         error?.response?.data?.message ||
//           "Unable to load system statistics."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: 350,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Title level={2}>
//         System Statistics & Analytics
//       </Title>

//       {error && (
//         <Alert
//           type="warning"
//           message={error}
//           showIcon
//           style={{ marginBottom: 20 }}
//         />
//       )}

//       <Row gutter={[20, 20]}>
//         <Col xs={24} md={12}>
//           <Card>
//             <Statistic
//               title="Total Registered Users"
//               value={stats.totalUsers}
//               prefix={<UserOutlined />}
//             />
//           </Card>
//         </Col>

//         <Col xs={24} md={12}>
//           <Card>
//             <Statistic
//               title="Total Transactions Processed"
//               value={stats.totalTransactions}
//               prefix={<TransactionOutlined />}
//             />
//           </Card>
//         </Col>
//       </Row>

//       <Card
//         title={
//           <span>
//             <BarChartOutlined /> System Reports
//           </span>
//         }
//         style={{ marginTop: 24 }}
//       >
//         <List
//           dataSource={[
//             "User Growth Report",
//             "Transaction Volume Report",
//             "Currency Usage Analytics",
//           ]}
//           renderItem={(item) => (
//             <List.Item>
//               <Text>{item}</Text>
//             </List.Item>
//           )}
//         />
//       </Card>
//     </div>
//   );
// }

// export default AdminStats;