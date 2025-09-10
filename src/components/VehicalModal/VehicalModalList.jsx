import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";

const VehicalModalList = ({
  vehicalModal = [],
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
          ? "Vehical Modal deleted successfully!"
          : "Vehical Modal restored successfully!"
      );
    } catch (error) {
      message.error(
        action === "delete"
          ? "Failed to delete Vehical Modal. Please try again."
          : "Failed to restore Vehical Modal. Please try again."
      );
      console.error("Error updating Vehical Modal:", error);
    }
  };

const columns = [
  { title: "ID", dataIndex: "id", key: "id", width: 70 },

  { title: "Name", dataIndex: "name", key: "name" },

  { title: "Slug", dataIndex: "slug", key: "slug" },

  { title: "Start Year", dataIndex: "yearStart", key: "yearStart" },

  { title: "End Year", dataIndex: "yearEnd", key: "yearEnd" },

  { title: "Brand ID", dataIndex: "brandId", key: "brandId" },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
  },

//   {
//     title: "Created At",
//     dataIndex: "createdAt",
//     key: "createdAt",
//     render: (date) => new Date(date).toLocaleString(),
//   },

//   {
//     title: "Updated At",
//     dataIndex: "updatedAt",
//     key: "updatedAt",
//     render: (date) => new Date(date).toLocaleString(),
//   },

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
      dataSource={Array.isArray(vehicalModal) ? vehicalModal : []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} Vehical Modal`,
      }}
      onChange={onTableChange}
    />
  );
};

export default VehicalModalList;
