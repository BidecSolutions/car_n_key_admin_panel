import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";

const ColorList = ({
  colors = [],
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
          ? "Color deleted successfully!"
          : "Color restored successfully!"
      );
    } catch (error) {
      message.error(
        action === "delete"
          ? "Failed to delete color. Please try again."
          : "Failed to restore color. Please try again."
      );
      console.error("Error updating color:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Color Name", dataIndex: "name", key: "name" },
      {
    title: "Hexa Code",
    dataIndex: "hex",
    key: "hex",
    render: (hex) => (
      <Space>
        {/* Color Circle */}
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: hex,
            border: "1px solid #ddd",
          }}
        />
        {/* Show hex text */}
        <span>{hex}</span>
      </Space>
    ),
  },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === true ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
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
          {record.status == true ? (
            <Popconfirm
              title="Are you sure you want to delete this color?"
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
              title="Do you want to restore this color?"
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
      dataSource={Array.isArray(colors) ? colors : []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} colors`,
      }}
      onChange={onTableChange}
    />
  );
};

export default ColorList;
