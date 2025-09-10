import React from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { Image_URL } from "../../utils/constants";

const BodyTypeList = ({
  bodyType = [],
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
  { title: "Name", dataIndex: "name", key: "name" },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) => (
      <img
        src={`${Image_URL}${image}`}
        alt="Brand"
        width={40}
        height={40}
        style={{ objectFit: "contain", borderRadius: 4 }}
      />
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => new Date(date).toLocaleString(),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date) => new Date(date).toLocaleString(),
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
      dataSource={Array.isArray(bodyType) ? bodyType : []}
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

export default BodyTypeList;
