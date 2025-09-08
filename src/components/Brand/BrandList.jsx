import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";

const BrandList = ({
  brands = [],
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
          ? "Brand deleted successfully!"
          : "Brand restored successfully!"
      );
    } catch (error) {
      message.error(
        action === "delete"
          ? "Failed to delete Brand. Please try again."
          : "Failed to restore Brand. Please try again."
      );
      console.error("Error updating Brand:", error);
    }
  };

  const columns = [
     { title: "ID", dataIndex: "id", key: "id", width: 70 },
  { title: "Brand Name", dataIndex: "name", key: "name" },
  {
    title: "Logo",
    dataIndex: "logoUrl",
    key: "logoUrl",
    render: (logoUrl) => (
      <img
        src={logoUrl}
        alt="Brand Logo"
        width={40}
        height={40}
        style={{ objectFit: "contain" }}
        preview={false}
      />
    ),
  },
  { title: "Country", dataIndex: "country", key: "country" },
  {
    title: "Founded Year",
    dataIndex: "foundedYear",
    key: "foundedYear",
    render: (year) => (year ? year : "N/A"),
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
              title="Are you sure you want to delete this brand?"
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
              title="Do you want to restore this brand?"
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
      dataSource={Array.isArray(brands) ? brands : []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} brands`,
      }}
      onChange={onTableChange}
    />
  );
};

export default BrandList;
