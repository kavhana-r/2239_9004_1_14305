import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Progress,
  Table,
  message,
} from "antd";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function BudgetsPage() {

  const [rows, setRows] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const [form] =
    Form.useForm();


  const load = () => {

    axios
      .get(
        "/api/budgets",
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

        setError(
          "Unable to load budgets."
        );

      });

  };


  useEffect(() => {

    load();

  }, []);


  const submit = async (values) => {

    setLoading(true);


    try {

      await axios.post(
        "/api/budgets",
        {
          limitAmount:
            values.limitAmount,

          spentAmount: 0,

          month:
            values.month,

          year:
            values.year,
        },
        auth()
      );


      message.success(
        "Budget saved successfully."
      );


      setOpen(false);

      form.resetFields();

      load();


    } catch (error) {

      message.error(
        error?.response?.data?.message ||
        "Unable to save budget."
      );


    } finally {

      setLoading(false);

    }

  };


  const columns = [

    {
      title: "Month",
      dataIndex: "month",
    },

    {
      title: "Year",
      dataIndex: "year",
    },

    {
      title: "Limit",
      dataIndex: "limitAmount",

      render: (value) =>
        Number(value || 0).toFixed(2),
    },

    {
      title: "Spent",
      dataIndex: "spentAmount",

      render: (value) =>
        Number(value || 0).toFixed(2),
    },

    {
      title: "Usage",

      render: (_, record) => {

        const limit =
          Number(
            record.limitAmount || 0
          );

        const spent =
          Number(
            record.spentAmount || 0
          );

        const percent =
          limit > 0
            ? Math.min(
                100,
                Math.round(
                  (spent / limit) * 100
                )
              )
            : 0;


        return (
          <Progress
            percent={percent}
          />
        );

      },
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
            Budgets
          </h1>

          <p className="page-subtitle">
            Set and monitor monthly spending limits
          </p>

        </div>


        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Budget
        </Button>

      </div>


      {error && (
        <Alert
          message={error}
          type="warning"
          showIcon
          style={{
            marginBottom: 16,
          }}
        />
      )}


      <Card>

        <Table
          rowKey={(record) =>
            `${record.id || record.month}-${record.year}`
          }
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No budgets found",
          }}
        />

      </Card>


      <Modal
        title="Add Budget"
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
            label="Budget Limit"
            name="limitAmount"
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
              placeholder="Limit amount"
            />

          </Form.Item>


          <Form.Item
            label="Month"
            name="month"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <InputNumber
              min={1}
              max={12}
              style={{
                width: "100%",
              }}
              placeholder="1-12"
            />

          </Form.Item>


          <Form.Item
            label="Year"
            name="year"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <InputNumber
              min={2020}
              style={{
                width: "100%",
              }}
              placeholder="Year"
            />

          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Save Budget
          </Button>

        </Form>

      </Modal>

    </>
  );
}