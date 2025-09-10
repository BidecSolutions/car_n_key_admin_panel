import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";

const TrimList = ({
  trims = [],
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
          ? "Trim deleted successfully!"
          : "Trim restored successfully!"
      );
    } catch (error) {
      message.error(
        action === "delete"
          ? "Failed to delete Trim. Please try again."
          : "Failed to restore Trim. Please try again."
      );
      console.error("Error updating Trim:", error);
    }
  };

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 70 },

  { title: "Name", dataIndex: "name", key: "name" },

  { title: "Slug", dataIndex: "slug", key: "slug" },

  { title: "Year", dataIndex: "year", key: "year" },

  { title: "Transmission", dataIndex: "transmissionType", key: "transmissionType" },

  { title: "Drivetrain", dataIndex: "drivetrain", key: "drivetrain" },

  {
    title: "MSRP",
    dataIndex: "msrp",
    key: "msrp",
    render: (value) => (value ? `$${value.toLocaleString()}` : "N/A"),
  },

  { title: "Vehicle Model ID", dataIndex: "vehicleModelId", key: "vehicleModelId" },

  { title: "Engine Type ID", dataIndex: "engineTypeId", key: "engineTypeId" },

  {
    title: "Features Count",
    dataIndex: "trimFeatures",
    key: "trimFeatures",
    render: (features) => features?.length ?? 0,
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
      dataSource={Array.isArray(trims) ? trims : []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} Trim`,
      }}
      onChange={onTableChange}
    />
  );
};

export default TrimList;
