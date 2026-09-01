import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message,
} from "antd";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function CategoryManagement() {

  const [rows, setRows] =
    useState([]);

  const [open, setOpen] =
    useState(false);


  const [form] =
    Form.useForm();


  const load = () => {

    axios
      .get("/api/categories")

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
          "Unable to load categories."
        );

      });

  };


  useEffect(() => {

    load();

  }, []);


  const submit = async (values) => {

    try {

      await axios.post(
        "/api/categories",
        values,
        auth()
      );


      message.success(
        "Category added successfully."
      );


      setOpen(false);

      form.resetFields();

      load();


    } catch {

      message.error(
        "Unable to add category."
      );

    }

  };


  const remove = async (id) => {

    try {

      await axios.delete(
        `/api/categories/${id}`,
        auth()
      );


      message.success(
        "Category deleted successfully"
      );


      load();

    } catch {

      message.error(
        "Unable to delete category."
      );

    }

  };


  const columns = [

    {
      title: "ID",
      dataIndex: "id",
    },

    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Type",
      dataIndex: "type",
    },

    {
      title: "Actions",

      render: (_, record) => (

        <Popconfirm
          title="Delete this category?"
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >

        <div>

          <h1 className="page-title">
            Category Management
          </h1>

          <p className="page-subtitle">
            Manage income and expense categories
          </p>

        </div>


        <Button
          type="primary"
          onClick={() =>
            setOpen(true)
          }
        >
          Add Category
        </Button>

      </div>


      <Card>

        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No categories found",
          }}
        />

      </Card>


      <Modal
        title="Add Category"
        open={open}
        onCancel={() =>
          setOpen(false)
        }
        footer={null}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
        >

          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Input
              placeholder="Category name"
            />

          </Form.Item>


          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Select
              options={[
                {
                  value: "INCOME",
                  label: "INCOME",
                },
                {
                  value: "EXPENSE",
                  label: "EXPENSE",
                },
              ]}
            />

          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Save Category
          </Button>

        </Form>

      </Modal>

    </>
  );
}