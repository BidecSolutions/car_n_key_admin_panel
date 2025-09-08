import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AssignList from "../components/AssignRole/AssignList";
import AssignForm from "../components/AssignRole/AssignForm";
import { AssignRoleAdmins } from "../services/api";
import { useRoles } from "../Context/PermissionsContext";

const AssignRole = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const { permissions } = useRoles();

  const fetchAssignments = async () => {
    try {
      const res = await AssignRoleAdmins.getAll();
      const data = res.data?.data || [];
      setAssignments(
        data.map((u) => ({
          id: u.admin_id,
          admin_id: u.admin_id,
          admin_name: u.admin_name,
          roles: u.roles || [],
        }))
      );
    } catch (e) {
      message.error("Failed to fetch assigned roles!");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSuccess = () => {
    setModalVisible(false);
    setEditingRecord(null);
    fetchAssignments(); // reload after success
  };

  const handleDelete = async (id) => {
    try {
      await AssignRoleAdmins.delete(id);
      message.success("Role deleted successfully!");
      fetchAssignments();
    } catch (e) {
      message.error("Failed to delete role!");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1>Assign Roles</h1>
        {permissions.includes("assignrole.create") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Assign Role
          </Button>
        )}
      </div>

      <AssignList
        data={assignments}
        onEdit={(record) => {
          setEditingRecord(record);
          setModalVisible(true);
          fetchAssignments
        }}
        onDelete={handleDelete}
      />

      <Modal
        title={editingRecord ? "Edit Role Assignment" : "Assign New Role"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
        }}
        footer={null}
        destroyOnClose
      >
        <AssignForm
          initialValues={editingRecord}
          onSuccess={handleSuccess}
          onCancel={() => {
            setModalVisible(false);
            setEditingRecord(null);
          }}
          loading={loading}
          fetchAssignments={fetchAssignments}
        />
      </Modal>
    </div>
  );
};

export default AssignRole;
