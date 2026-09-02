import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import dayjs from "dayjs";

import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";


const auth = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token") || ""}`,
  },
});


export default function TransactionsPage() {

  const [rows, setRows] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [currencies, setCurrencies] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const [form] =
    Form.useForm();


  const load = async () => {

    try {

      const [
        transactions,
        categoriesResponse,
        currenciesResponse,
      ] = await Promise.all([

        axios.get(
          "/api/transactions",
          auth()
        ),

        axios.get(
          "/api/categories"
        ),

        axios.get(
          "/api/currencies"
        ),

      ]);


      setRows(
        Array.isArray(
          transactions.data
        )
          ? transactions.data
          : []
      );


      setCategories(
        Array.isArray(
          categoriesResponse.data
        )
          ? categoriesResponse.data
          : []
      );


      setCurrencies(
        Array.isArray(
          currenciesResponse.data
        )
          ? currenciesResponse.data
          : []
      );


    } catch (error) {

      setError(
        "Unable to load transactions."
      );

    }

  };


  useEffect(() => {

    load();

  }, []);


  const submit = async (values) => {

    setLoading(true);


    const payload = {

      title: values.title,

      amount: values.amount,

      currencyCode:
        values.currencyCode,

      transactionType:
        values.transactionType,

      transactionDate:
        values.transactionDate
          .format("YYYY-MM-DD"),

      note: values.note || "",

      categoryId:
        values.categoryId,

    };


    try {

      if (editing) {

        await axios.put(
          `/api/transactions/${editing.id}`,
          payload,
          auth()
        );

        message.success(
          "Transaction updated successfully."
        );

      } else {

        await axios.post(
          "/api/transactions",
          payload,
          auth()
        );

        message.success(
          "Transaction created successfully."
        );

      }


      setOpen(false);

      form.resetFields();

      setEditing(null);

      load();


    } catch (error) {

      message.error(
        error?.response?.data?.message ||
        error?.response?.data ||
        "Transaction operation failed."
      );


    } finally {

      setLoading(false);

    }

  };


  const edit = (record) => {

    setEditing(record);


    form.setFieldsValue({

      ...record,

      transactionDate:
        record.transactionDate
          ? dayjs(record.transactionDate)
          : dayjs(),

      categoryId:
        record.category?.id ||
        record.categoryId,

      currencyCode:
        record.currency?.code ||
        record.currencyCode,

    });


    setOpen(true);

  };


  const remove = async (id) => {

    try {

      await axios.delete(
        `/api/transactions/${id}`,
        auth()
      );

      message.success(
        "Transaction deleted successfully."
      );

      load();

    } catch {

      message.error(
        "Unable to delete transaction."
      );

    }

  };


  const openNew = () => {

    setEditing(null);

    form.resetFields();

    form.setFieldsValue({

      transactionDate: dayjs(),

      transactionType: "EXPENSE",

      currencyCode: "USD",

    });

    setOpen(true);

  };


  const columns = [

    {
      title: "Title",
      dataIndex: "title",
    },

    {
      title: "Amount",
      dataIndex: "amount",

      render: (value) =>
        Number(value || 0).toFixed(2),
    },

    {
      title: "Type",
      dataIndex: "transactionType",

      render: (value) => (

        <Tag
          color={
            value === "INCOME"
              ? "green"
              : "red"
          }
        >
          {value}
        </Tag>

      ),
    },

    {
      title: "Date",
      dataIndex: "transactionDate",
    },

    {
      title: "Category",

      render: (_, record) =>
        record.category?.name ||
        record.categoryName ||
        "-",
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
            title="Delete this transaction?"
            onConfirm={() =>
              remove(record.id)
            }
          >

            <Button
              size="small"
              danger
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
            Transactions
          </h1>

          <p className="page-subtitle">
            Manage your income and expenses
          </p>

        </div>


        <Button
          type="primary"
          onClick={openNew}
        >
          Add Transaction
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
          rowKey="id"
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No transactions found",
          }}
        />

      </Card>


      <Modal
        title={
          editing
            ? "Edit Transaction"
            : "Add Transaction"
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Input
              placeholder="Transaction title"
            />

          </Form.Item>


          <Form.Item
            label="Amount"
            name="amount"
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
              placeholder="Amount"
            />

          </Form.Item>


          <Form.Item
            label="Currency"
            name="currencyCode"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Select
              options={currencies.map(
                (currency) => ({
                  value: currency.code,
                  label:
                    `${currency.code} - ${
                      currency.name || ""
                    }`,
                })
              )}
            />

          </Form.Item>


          <Form.Item
            label="Transaction Type"
            name="transactionType"
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


          <Form.Item
            label="Transaction Date"
            name="transactionDate"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <DatePicker
              style={{
                width: "100%",
              }}
            />

          </Form.Item>


          <Form.Item
            label="Category"
            name="categoryId"
          >

            <Select
              allowClear
              options={categories.map(
                (category) => ({
                  value: category.id,
                  label: category.name,
                })
              )}
            />

          </Form.Item>


          <Form.Item
            label="Note"
            name="note"
          >

            <Input.TextArea
              placeholder="Note"
              rows={3}
            />

          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Save Transaction
          </Button>

        </Form>

      </Modal>

    </>
  );
}