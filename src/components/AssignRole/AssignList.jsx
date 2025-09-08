import React from "react";
import { Table, Button, Space, Tag } from "antd";
import { useRoles } from "../../Context/PermissionsContext";

const AssignList = ({ onEdit, onDelete, data, loading = false }) => {
  const { permissions } = useRoles();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Admin Name", dataIndex: "admin_name", key: "admin_name" },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles) =>
        roles?.map((r, idx) => (
          <Tag key={idx} color="blue">
            {r}
          </Tag>
        )),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {permissions.includes("assignrole.edit") && (
            <Button type="link" onClick={() => onEdit(record)}>
              Edit
            </Button>
          )}
          {/* {permissions.includes("assignrole.delete") && (
            <Button danger type="link" onClick={() => onDelete(record.id)}>
              Delete
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      loading={loading}
      dataSource={Array.isArray(data) ? data : []}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default AssignList;
