import React from "react";
import { Table, Tag } from "antd";

const ViewList = ({ role }) => {
  if (!role) return null;

  const columns = [
    { title: "Module", dataIndex: "module", key: "module" },
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  // backend se agar permissions [] aata hai to safe handle karna
  const data = role.permissions?.map((perm, index) => ({
    key: index,
    module: perm.module || "-",
    permission: perm.permissionName || perm,
  })) || [];

  return (
    <div>
      <h3>
        <strong>Role Name:</strong> {role.name}
      </h3>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </div>
  );
};

export default ViewList;