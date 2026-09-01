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
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function CurrencyManagement() {

  const [rows, setRows] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);


  const [form] =
    Form.useForm();


  const load = () => {

    axios
      .get("/api/currencies")

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
          "Unable to load currencies."
        );

      });

  };


  useEffect(() => {

    load();

  }, []);


  const submit = async (values) => {

    try {

      if (editing) {

        await axios.put(
          `/api/currencies/${editing.id}`,
          values,
          auth()
        );


        message.success(
          "Currency updated successfully."
        );

      } else {

        await axios.post(
          "/api/currencies",
          values,
          auth()
        );


        message.success(
          "Currency added successfully."
        );

      }


      setOpen(false);

      setEditing(null);

      form.resetFields();

      load();


    } catch {

      message.error(
        "Currency operation failed."
      );

    }

  };


  const remove = async (id) => {

    try {

      await axios.delete(
        `/api/currencies/${id}`,
        auth()
      );


      message.success(
        "Currency deleted successfully"
      );


      load();

    } catch {

      message.error(
        "Unable to delete currency."
      );

    }

  };


  const edit = (record) => {

    setEditing(record);

    form.setFieldsValue(record);

    setOpen(true);

  };


  const columns = [

    {
      title: "Code",
      dataIndex: "code",
    },

    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Exchange Rate",
      dataIndex: "exchangeRate",
    },

    {
      title: "Actions",

      render: (_, record) => (

        <Space>

          <Button
            size="small"
            onClick={() =>
              edit(record)
            }
          >
            Edit
          </Button>


          <Popconfirm
            title="Delete this currency?"
            onConfirm={() =>
              remove(
                record.id ||
                record.code
              )
            }
          >

            <Button
              danger
              size="small"
            >
              Delete
            </Button>

          </Popconfirm>

        </Space>

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
            Currency Management
          </h1>

          <p className="page-subtitle">
            Manage supported currencies and exchange rates
          </p>

        </div>


        <Button
          type="primary"
          onClick={() => {

            setEditing(null);

            form.resetFields();

            setOpen(true);

          }}
        >
          Add Currency
        </Button>

      </div>


      <Card>

        <Table
          rowKey={(record) =>
            record.id ||
            record.code
          }
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No currencies found",
          }}
        />

      </Card>


      <Modal
        title={
          editing
            ? "Edit Currency"
            : "Add Currency"
        }
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
            label="Code"
            name="code"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Input
              placeholder="USD"
            />

          </Form.Item>


          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Input
              placeholder="US Dollar"
            />

          </Form.Item>


          <Form.Item
            label="Exchange Rate"
            name="exchangeRate"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <InputNumber
              min={0}
              style={{
                width: "100%",
              }}
              placeholder="Exchange rate"
            />

          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Save Currency
          </Button>

        </Form>

      </Modal>

    </>
  );
}