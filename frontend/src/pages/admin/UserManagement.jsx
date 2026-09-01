import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Button,
  Card,
  Popconfirm,
  Table,
  message,
} from "antd";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function UserManagement() {

  const [rows, setRows] =
    useState([]);


  const load = () => {

    axios
      .get(
        "/api/admin/users",
        auth()
      )

      .then((response) => {

        setRows(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      })

      .catch(() => {

        message.error(
          "Unable to load users."
        );

      });

  };


  useEffect(() => {

    load();

  }, []);


  const remove = async (id) => {

    try {

      await axios.delete(
        `/api/admin/users/${id}`,
        auth()
      );


      message.success(
        "User deleted successfully"
      );


      load();

    } catch {

      message.error(
        "Unable to delete user."
      );

    }

  };


  const columns = [

    {
      title: "ID",
      dataIndex: "id",
    },

    {
      title: "Username",
      dataIndex: "username",
    },

    {
      title: "Role",
      dataIndex: "role",
    },

    {
      title: "Preferred Currency",
      dataIndex: "preferredCurrency",
    },

    {
      title: "Actions",

      render: (_, record) => (

        <Popconfirm
          title="Delete this user?"
          onConfirm={() =>
            remove(record.id)
          }
        >

          <Button danger>
            Delete
          </Button>

        </Popconfirm>

      ),
    },

  ];


  return (
    <>

      <h1 className="page-title">
        User Management
      </h1>

      <p className="page-subtitle">
        Manage registered users
      </p>


      <Card>

        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No users found",
          }}
        />

      </Card>

    </>
  );
}