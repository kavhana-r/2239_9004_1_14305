import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import dayjs from "dayjs";

import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
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


export default function GoalsPage() {

  const [rows, setRows] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [fundOpen, setFundOpen] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [loading, setLoading] =
    useState(false);


  const [form] =
    Form.useForm();

  const [fundForm] =
    Form.useForm();


  const load = () => {

    axios
      .get(
        "/api/goals",
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
          "Unable to load goals."
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
        "/api/goals",
        {
          title: values.title,

          targetAmount:
            values.targetAmount,

          currentAmount: 0,

          savedAmount: 0,

          deadline:
            values.deadline.format(
              "YYYY-MM-DD"
            ),
        },
        auth()
      );


      message.success(
        "Goal created successfully."
      );


      setOpen(false);

      form.resetFields();

      load();


    } catch {

      message.error(
        "Unable to create goal."
      );

    } finally {

      setLoading(false);

    }

  };


  const addFunds = async (values) => {

    setLoading(true);


    try {

      await axios.put(
        `/api/goals/${selected.id}/add-funds`,
        null,
        {
          ...auth(),

          params: {
            amount:
              values.amount,
          },
        }
      );


      message.success(
        "Funds added successfully."
      );


      setFundOpen(false);

      fundForm.resetFields();

      load();


    } catch {

      message.error(
        "Unable to add funds."
      );

    } finally {

      setLoading(false);

    }

  };


  const remove = async (id) => {

    try {

      await axios.delete(
        `/api/goals/${id}`,
        auth()
      );


      message.success(
        "Goal deleted successfully."
      );


      load();

    } catch {

      message.error(
        "Unable to delete goal."
      );

    }

  };


  const columns = [

    {
      title: "Goal",
      dataIndex: "title",
    },

    {
      title: "Target",
      dataIndex: "targetAmount",

      render: (value) =>
        Number(value || 0).toFixed(2),
    },

    {
      title: "Saved",

      render: (_, record) =>
        Number(
          record.currentAmount ??
          record.savedAmount ??
          0
        ).toFixed(2),
    },

    {
      title: "Deadline",
      dataIndex: "deadline",
    },

    {
      title: "Progress",

      render: (_, record) => {

        const current =
          Number(
            record.currentAmount ??
            record.savedAmount ??
            0
          );

        const target =
          Number(
            record.targetAmount || 0
          );


        const percent =
          target > 0
            ? Math.min(
                100,
                Math.round(
                  (current / target) * 100
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

    {
      title: "Actions",

      render: (_, record) => (

        <Space>

          <Button
            size="small"
            onClick={() => {

              setSelected(record);

              fundForm.resetFields();

              setFundOpen(true);

            }}
          >
            Add Funds
          </Button>


          <Popconfirm
            title="Delete this goal?"
            onConfirm={() =>
              remove(record.id)
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
            Savings Goals
          </h1>

          <p className="page-subtitle">
            Create goals and track your progress
          </p>

        </div>


        <Button
          type="primary"
          onClick={() =>
            setOpen(true)
          }
        >
          Create Goal
        </Button>

      </div>


      <Card>

        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText:
              "No goals found",
          }}
        />

      </Card>


      <Modal
        title="Create Goal"
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
            label="Goal Title"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >

            <Input
              placeholder="Goal title"
            />

          </Form.Item>


          <Form.Item
            label="Target Amount"
            name="targetAmount"
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
              placeholder="Target amount"
            />

          </Form.Item>


          <Form.Item
            label="Deadline"
            name="deadline"
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
              disabledDate={(date) =>
                date &&
                date.isBefore(
                  dayjs(),
                  "day"
                )
              }
            />

          </Form.Item>


          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Save Goal
          </Button>

        </Form>

      </Modal>


      <Modal
        title="Add Funds"
        open={fundOpen}
        onCancel={() =>
          setFundOpen(false)
        }
        footer={null}
      >

        <Form
          form={fundForm}
          layout="vertical"
          onFinish={addFunds}
        >

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


          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Add Funds
          </Button>

        </Form>

      </Modal>

    </>
  );
}