import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRoles } from '../../Context/PermissionsContext';

const UsersList = ({
  users = [],
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onTableChange
}) => {
  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      message.success('User deleted successfully!');
    } catch (error) {
      message.error('Failed to delete user. Please try again.');
      console.error('Error deleting user:', error);
    }
  };
  const { permissions } = useRoles();

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    key: "name",
    render: (_, record) => (
      <strong>{`${record.firstName} ${record.lastName}`}</strong>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Guard",
    dataIndex: "guard",
    key: "guard",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) =>
      status ? (
        <Tag color="green">Active</Tag>
      ) : (
        <Tag color="red">Inactive</Tag>
      ),
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
        {/* {permissions.includes("admin.edit") && ( */}
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
        {/* )} */}
        {/* {permissions.includes("admin.delete") && ( */}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        {/* )} */}
      </Space>
    ),
  },
];


  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} users`,
      }}
      onChange={onTableChange}
      scroll={{ x: 800 }}
    />
  );
};

export default UsersList;