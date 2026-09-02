import React, { useEffect, useState } from "react";
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
  Typography,
  message,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

function CurrencyManagement() {
  const [currencies, setCurrencies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        "/api/currencies",
        config()
      );

      setCurrencies(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      message.error("Unable to load currencies.");
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (currency) => {
    setEditing(currency);

    form.setFieldsValue({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRate: currency.exchangeRate,
    });

    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        const identifier =
          editing.id || editing.code;

        await axios.put(
          `/api/currencies/${identifier}`,
          values,
          config()
        );

        message.success("Currency updated");
      } else {
        await axios.post(
          "/api/currencies",
          values,
          config()
        );

        message.success("Currency added");
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();

      await fetchCurrencies();
    } catch (error) {
      message.error("Unable to save currency.");
    }
  };

  const deleteCurrency = async (currency) => {
    try {
      const identifier =
        currency.id || currency.code;

      await axios.delete(
        `/api/currencies/${identifier}`,
        config()
      );

      message.success("Currency deleted");

      await fetchCurrencies();
    } catch (error) {
      message.error("Unable to delete currency.");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol || "-",
    },
    {
      title: "Exchange Rate (vs USD)",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this currency?"
            onConfirm={() => deleteCurrency(record)}
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={2}>Currency Management</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
        >
          Add Currency
        </Button>
      </div>

      <Card>
        <Table
          rowKey={(record) => record.id || record.code}
          columns={columns}
          dataSource={currencies}
        />
      </Card>

      <Modal
        title={
          editing
            ? "Edit Currency"
            : "Add Currency"
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Code is required",
              },
            ]}
          >
            <Input placeholder="e.g. USD" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input placeholder="e.g. US Dollar" />
          </Form.Item>

          <Form.Item
            label="Symbol"
            name="symbol"
          >
            <Input placeholder="e.g. $" />
          </Form.Item>

          <Form.Item
            label="Exchange Rate"
            name="exchangeRate"
            rules={[
              {
                required: true,
                message: "Exchange rate is required",
              },
            ]}
          >
            <InputNumber
              step={0.01}
              precision={2}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CurrencyManagement;