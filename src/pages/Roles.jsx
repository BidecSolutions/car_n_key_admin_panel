import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import RolesList from "../components/Roles/RolesList";
import RolesForm from "../components/Roles/RolesForm";
import ViewList from "../components/Roles/ViewList"; // 👈 import view list
import { rolesAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useRoles } from "../Context/PermissionsContext";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false); // 👈 for view modal
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // 👈 store role for view
  const [pagination, setPagination] = useState({
    current: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const { permissions } = useRoles();

  useEffect(() => {
    fetchRoles();
  }, [pagination.current, pagination.pageSize]);

  const fetchRoles = async () => {
  try {
    setLoading(true);
    const response = await rolesAPI.getAll(); // GET /roles
    const rolesData = response.data?.data;

    // agar ek object aa raha hai to array banado
    const rolesArray = Array.isArray(rolesData) ? rolesData : [rolesData];

    setRoles(rolesArray);

    setPagination((prev) => ({
      ...prev,
      total: rolesArray.length,
    }));
  } catch (error) {
    console.error("Error fetching roles:", error);
    message.error("Failed to fetch roles. Please try again.");
    setRoles([]);
  } finally {
    setLoading(false);
  }
};


  const handleAddRole = () => {
    setEditingRole(null);
    setModalVisible(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setModalVisible(true);
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setViewModalVisible(true);
  };

  const handleDeleteRole = async (id) => {
    try {
      await rolesAPI.delete(id); 
      await fetchRoles();
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting role:", error);
      return Promise.reject(error);
    }
  };

 const handleFormSubmit = async (values) => {
  try {
    setFormLoading(true);
    if (editingRole) {
     await rolesAPI.update(editingRole.id, {...values, guard: "admin-api"}); 
      
    } else {
      await rolesAPI.create({...values, guard: "admin-api"}); 
    }
    setModalVisible(false);
    await fetchRoles();
    message.success(editingRole ? "Role updated!" : "Role created!");
  } catch (error) {
    console.error("Error saving role:", error);
    message.error("Failed to save role!");
    throw error;
  } finally {
    setFormLoading(false);
  }
};


  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingRole(null);
  };

  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>Roles Management</h1>
          {/* {permissions.includes("role.create") && ( */}

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRole}
        >
          Add Role
        </Button>
           {/* )}  */}
      </div>

      <RolesList
        roles={roles}
        loading={loading}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onView={handleViewRole} 
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingRole ? "Edit Role" : "Add New Role"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width="90%"        
       style={{ top: 40 }}    
       bodyStyle={{
       maxHeight: "70vh",  
       overflowY: "auto",   
       padding: "20px",
  }}
        destroyOnClose
      >
        <RolesForm
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          initialValues={editingRole}
          loading={formLoading}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        title="Role Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        <ViewList role={selectedRole} />
      </Modal>
    </div>
  );
};

export default Roles;