// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Popconfirm,
//   Table,
//   Tag,
//   Typography,
//   message,
// } from "antd";

// import {
//   UserOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// import axios from "axios";

// const { Title } = Typography;

// function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);

//       const response = await axios.get(
//         "/api/admin/users"
//       );

//       const data = response?.data;

//       setUsers(
//         Array.isArray(data)
//           ? data
//           : Array.isArray(data?.content)
//           ? data.content
//           : []
//       );
//     } catch (error) {
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteUser = async (user) => {
//     try {
//       await axios.delete(
//         `/api/admin/users/${user.id}`
//       );

//       message.success(
//         "User deleted successfully"
//       );

//       await fetchUsers();
//     } catch (error) {
//       message.error(
//         error?.response?.data?.message ||
//           "Unable to delete user."
//       );
//     }
//   };

//   const columns = [
//     {
//       title: "Username",
//       dataIndex: "username",
//       key: "username",
//       render: (username) => (
//         <span>
//           <UserOutlined
//             style={{ marginRight: 8 }}
//           />
//           {username}
//         </span>
//       ),
//     },

//     {
//       title: "Role",
//       dataIndex: "role",
//       key: "role",
//       render: (role) => {
//         const isAdmin =
//           role === "ROLE_ADMIN" ||
//           role === "ADMIN";

//         return (
//           <Tag color={isAdmin ? "gold" : "blue"}>
//             {isAdmin ? "ADMIN" : "USER"}
//           </Tag>
//         );
//       },
//     },

//     {
//       title: "Preferred Currency",
//       dataIndex: "preferredCurrency",
//       key: "preferredCurrency",
//       render: (currency, record) =>
//         currency ||
//         record?.currency ||
//         "-",
//     },

//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Popconfirm
//           title="Delete this user?"
//           onConfirm={() =>
//             deleteUser(record)
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
//       <Title level={2}>
//         User Management
//       </Title>

//       <Card>
//         <Table
//           rowKey={(record) => record.id}
//           loading={loading}
//           columns={columns}
//           dataSource={users}
//           scroll={{ x: 700 }}
//         />
//       </Card>
//     </div>
//   );
// }

// export default UserManagement;

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Popconfirm,
  Table,
  Tag,
  Typography,
  message,
  Avatar,
  Row,
  Col,
  Input,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";

const { Title, Text } = Typography;

function UserManagement() {
  const authUser = useSelector((state) => state.auth?.user);

  // Admin User Management State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users");
      const data = response?.data;

      setUsers(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user) => {
    try {
      await axios.delete(`/api/admin/users/${user.id}`);
      message.success("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Unable to delete user."
      );
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase().trim();
    return users.filter((u) => {
      const uname = String(u.username || "").toLowerCase();
      const role = String(u.role || "").toLowerCase();
      const curr = String(u.preferredCurrency || u.currency || "").toLowerCase();
      return uname.includes(term) || role.includes(term) || curr.includes(term);
    });
  }, [users, search]);

  const userMetrics = useMemo(() => {
    let admins = 0;
    let standard = 0;

    users.forEach((u) => {
      if (u.role === "ROLE_ADMIN" || u.role === "ADMIN") {
        admins++;
      } else {
        standard++;
      }
    });

    return { total: users.length, admins, standard };
  }, [users]);

  // ====================================================
  // ADMIN USER MANAGEMENT VIEW
  // ====================================================
  const columns = [
    {
      title: "User Profile",
      dataIndex: "username",
      key: "username",
      render: (username, record) => {
        const isAdmin = record.role === "ROLE_ADMIN" || record.role === "ADMIN";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              style={{
                backgroundColor: isAdmin ? "#f59e0b" : "#10b981",
                fontWeight: 700,
              }}
            >
              {username ? username.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a" }}>{username}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>ID: #{record.id || "N/A"}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Preferred Currency",
      dataIndex: "preferredCurrency",
      key: "preferredCurrency",
      render: (curr, record) => (
        <span style={{ fontWeight: 700, color: "#475569" }}>
          {curr || record.currency || "USD"}
        </span>
      ),
    },
    {
      title: "Role & Access",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";
        return (
          <Tag color={isAdmin ? "gold" : "success"} style={{ borderRadius: 20, fontWeight: 600 }}>
            {isAdmin ? "Administrator" : "Standard User"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isCurrentAuthUser = record.username === authUser?.username;
        return (
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to permanently delete this user?"
            onConfirm={() => deleteUser(record)}
            okText="Delete"
            cancelText="Cancel"
            disabled={isCurrentAuthUser}
            okButtonProps={{ danger: true }}
          >
            <button
              type="button"
              className="action-btn-circle danger"
              disabled={isCurrentAuthUser}
              title={isCurrentAuthUser ? "Cannot delete yourself" : "Delete user"}
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            User Management
          </Title>
          <Text style={{ color: "#64748b", fontSize: 14 }}>
            Administrative directory of registered accounts and system privileges
          </Text>
        </div>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <div className="kpi-card">
            <span className="kpi-card-label">Total Accounts</span>
            <div className="kpi-card-value">{userMetrics.total}</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="kpi-card">
            <span className="kpi-card-label">Standard Users</span>
            <div className="kpi-card-value" style={{ color: "#10b981" }}>{userMetrics.standard}</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="kpi-card">
            <span className="kpi-card-label">Admin Privileges</span>
            <div className="kpi-card-value" style={{ color: "#f59e0b" }}>{userMetrics.admins}</div>
          </div>
        </Col>
      </Row>

      <Card className="modern-card">
        <div style={{ marginBottom: 20 }}>
          <Input
            placeholder="Search accounts by username, role, currency..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, height: 40, borderRadius: 8 }}
          />
        </div>

        <div className="custom-table">
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey={(r) => r.id || r.username}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
}

export default UserManagement;
