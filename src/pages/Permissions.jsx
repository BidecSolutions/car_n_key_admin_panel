import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PermissionsList from "../components/Permission/PermissionList"; // Table component
import PermissionsForm from "../components/Permission/PermissionsForm"; // Form component
import { permissionsAPI } from "../services/api"; // API service
import { DEFAULT_PAGE_SIZE, DEFAULT_CURRENT_PAGE } from "../utils/constants";
import { useRoles } from "../Context/PermissionsContext";

const Permissions = () => {
  const [Mypermissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [pagination, setPagination] = useState({
    current: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const { permissions } = useRoles();

  useEffect(() => {
    fetchPermissions();
    console.log("fetchPermissions" , fetchPermissions());
    
  }, [pagination.current, pagination.pageSize]);

 const fetchPermissions = async () => {
  try {
    setLoading(true);
    const response = await permissionsAPI.getAll();

    const inventoryPermissions = response.data?.data || {};
    console.log("inventoryPermissions", inventoryPermissions);

    // Convert object -> array
    // const permissionsData = Object.entries(inventoryPermissions).flatMap(
    //   ([moduleName, actions]) =>
    //     Object.keys(actions).map((action) => ({
    //       module: moduleName,
    //       action: action
    //     }))
    // );

    // console.log("permissionsData", permissionsData);

    setPermissions(inventoryPermissions);

    setPagination((prev) => ({
      ...prev,
      total: inventoryPermissions.length,
    }));
  } catch (error) {
    console.error("Error fetching permissions:", error);
    message.error("Failed to fetch permissions. Please try again.");
    setPermissions([]);
  } finally {
    setLoading(false);
  }
};


  const handleAddPermission = () => {
    setEditingPermission(null);
    setModalVisible(true);
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setModalVisible(true);
  };

  const handleDeletePermission = async (id) => {
    try {
      await permissionsAPI.delete(id); // DELETE /permissions/:id
      await fetchPermissions();
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting permission:", error);
      return Promise.reject(error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setFormLoading(true);
      if (editingPermission) {
        await permissionsAPI.update(editingPermission.id, {...values, guard: "admin-api"}); // PUT /permissions/:id
      } else {
        await permissionsAPI.create({...values, guard: "admin-api"}); // POST /permissions
      }
      setModalVisible(false);
      await fetchPermissions();
    } catch (error) {
      console.error("Error saving permission:", error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPermission(null);
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
        <h1>Permissions Management</h1>
          {permissions.includes("permission.create") && (

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddPermission}
        >
          Add Permission
        </Button>
          )}
      </div>

      {/* Permissions Table */}
      <PermissionsList
        Rolepermissions={Mypermissions}
        loading={loading}
        onEdit={handleEditPermission}
        onDelete={handleDeletePermission}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingPermission ? "Edit Permission" : "Add New Permission"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <PermissionsForm
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          initialValues={editingPermission}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Permissions;
