import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import axios from "axios";

const { Title } = Typography;

function CurrencyManagement() {
  const [currencies, setCurrencies] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editingCurrency, setEditingCurrency] =
    useState(null);

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

      const response = await axios.get(
        "/api/currencies"
      );

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

  const getCurrencyId = (currency) =>
    currency?.id ?? currency?.code;

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

    setFormData({
      code: currency?.code || "",
      name: currency?.name || "",
      symbol: currency?.symbol || "",
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

    try {
      setSaving(true);

      const payload = {
        code: formData.code
          .trim()
          .toUpperCase(),
        name: formData.name.trim(),
        symbol: formData.symbol,
        exchangeRate:
          Number(formData.exchangeRate) || 1,
      };

      if (editingCurrency) {
        await axios.put(
          `/api/currencies/${getCurrencyId(
            editingCurrency
          )}`,
          payload
        );

        message.success(
          "Currency updated"
        );
      } else {
        await axios.post(
          "/api/currencies",
          payload
        );

        message.success("Currency added");
      }

      setModalOpen(false);

      await fetchCurrencies();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to save currency."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (currency) => {
    try {
      await axios.delete(
        `/api/currencies/${getCurrencyId(
          currency
        )}`
      );

      message.success("Currency deleted");

      await fetchCurrencies();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Unable to delete currency."
      );
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
      render: (value) => value || "-",
    },
    {
      title: "Exchange Rate (vs USD)",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
      render: (value) =>
        Number(value || 0).toFixed(4),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              openEdit(record)
            }
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: "Delete Currency",
                content:
                  "Are you sure you want to delete this currency?",
                okType: "danger",
                onOk: () =>
                  handleDelete(record),
              })
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>
          Currency Management
        </Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
        >
          Add Currency
        </Button>
      </div>

      <Card>
        <Table
          rowKey={(record) =>
            getCurrencyId(record)
          }
          columns={columns}
          dataSource={currencies}
          loading={loading}
          scroll={{ x: 700 }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={
          editingCurrency
            ? "Edit Currency"
            : "Add Currency"
        }
        onCancel={() =>
          setModalOpen(false)
        }
        onOk={handleSubmit}
        confirmLoading={saving}
      >
        <div style={{ marginTop: 10 }}>
          <label>Code</label>

          <Input
            placeholder="e.g. USD"
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value,
              })
            }
            style={{
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Name</label>

          <Input
            placeholder="e.g. US Dollar"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            style={{
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Symbol</label>

          <Input
            placeholder="e.g. $"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({
                ...formData,
                symbol: e.target.value,
              })
            }
            style={{
              marginTop: 6,
              marginBottom: 16,
            }}
          />

          <label>Exchange Rate</label>

          <InputNumber
            step={0.01}
            min={0}
            value={formData.exchangeRate}
            onChange={(value) =>
              setFormData({
                ...formData,
                exchangeRate: value,
              })
            }
            style={{
              width: "100%",
              marginTop: 6,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default CurrencyManagement;