import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { Image_URL } from "../../utils/constants";

const EngineTypeList = ({
  engineType = [],
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onTableChange,
}) => {
  const handleAction = async (id, action) => {
    try {
      await onDelete(id, action);
      message.success(
        action === "delete"
          ? "Engine Type deleted successfully!"
          : "Engine Type restored successfully!"
      );
    } catch (error) {
      message.error(
        action === "delete"
          ? "Failed to delete Engine Type. Please try again."
          : "Failed to restore Engine Type. Please try again."
      );
      console.error("Error updating Engine Type:", error);
    }
  };

  const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 70 },
  { title: "Name", dataIndex: "name", key: "name" },
//   { title: "Fuel Type ID", dataIndex: "fuelTypeId", key: "fuelTypeId" },
  { title: "Horsepower", dataIndex: "horsepower", key: "horsepower" },
  {
    title: "Torque",
    dataIndex: "torque",
    key: "torque",
    render: (value) => value ?? "N/A",
  },
  {
    title: "Cylinders",
    dataIndex: "cylinders",
    key: "cylinders",
    render: (value) => value ?? "N/A",
  },
  {
    title: "Displacement",
    dataIndex: "displacement",
    key: "displacement",
    render: (value) => value ?? "N/A",
  },
  {
    title: "Aspiration",
    dataIndex: "aspiration",
    key: "aspiration",
    render: (value) => value ?? "N/A",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => onEdit(record)}
        >
          Edit
        </Button>
        {record.status ? (
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleAction(record.id, "delete")}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Do you want to restore this item?"
            onConfirm={() => handleAction(record.id, "restore")}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" icon={<RollbackOutlined />} size="small">
              Restore
            </Button>
          </Popconfirm>
        )}
      </Space>
    ),
  },
];



  return (
    <Table
      columns={columns}
      dataSource={Array.isArray(engineType) ? engineType : []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} Body Type`,
      }}
      onChange={onTableChange}
    />
  );
};

export default EngineTypeList;
