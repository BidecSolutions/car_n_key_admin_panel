import React from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRoles } from '../../Context/PermissionsContext';

const PermissionsList = ({
  Rolepermissions = [],
  loading = false,
  onEdit,
  onDelete,
  pagination,
  onTableChange
}) => {
   const { permissions } = useRoles();
  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      message.success('Permission deleted successfully!');
    } catch (error) {
      message.error('Failed to delete permission. Please try again.');
      console.error('Error deleting permission:', error);
    }
  };

  console.log('permissions list ', Rolepermissions);

  const columns = [
    {
      title: 'S.NO',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Module Name',
      dataIndex: 'module_name',
      key: 'module',
      sorter: true,
    },
    {
      title: 'Permission Name',
      dataIndex: 'permission_name', // corrected field name
      key: 'permissionName',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {permissions.includes("permission.edit") && (

          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          )}
          {permissions.includes("permission.delete") && (

          <Popconfirm
            title="Are you sure you want to delete this permission?"
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
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={Rolepermissions || []}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} permissions`,
      }}
      onChange={onTableChange}
      scroll={{ x: 800 }}
    />
  );
};

export default PermissionsList;
