import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import UsersList from "../components/Users/UserList";
import UsersForm from "../components/Users/UsersForm";
import { usersAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useRoles } from "../Context/PermissionsContext";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const { permissions } = useRoles();

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await usersAPI.getAll(); // GET /admin/list

    // Response se data nikalo
    const usersData = response.data?.data || [];

    setUsers(usersData); // sidha array set karna hai

    setPagination((prev) => ({
      ...prev,
      total: usersData.length, // total users count
    }));

    console.log("Fetched Users:", usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    message.error("Failed to fetch users. Please try again.");
    setUsers([]);
  } finally {
    setLoading(false);
  }
};


  const handleAddUser = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await usersAPI.delete(id); // DELETE /users/:id
      await fetchUsers();
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting user:", error);
      return Promise.reject(error);
    }
  };

  const handleFormSubmit = async (values) => {
  try {
    setFormLoading(true);

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      status: values.status ? 1 : 0,
      // sirf add ke time password bhejna hai
      ...(editingUser ? {} : { password: values.password }),
    };

    if (editingUser) {
      await usersAPI.update(editingUser.id, payload);
    } else {
      await usersAPI.create(payload);
    }

    setModalVisible(false);
    await fetchUsers();
  } catch (error) {
    console.error("Error saving user:", error.response?.data || error);
    throw error;
  } finally {
    setFormLoading(false);
  }
};


  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
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
        <h1>Users Management</h1>
          {permissions?.includes("admin.create") && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
          )}
      </div>

      {/* Users Table */}
      <UsersList
        users={users}
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <UsersForm
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          initialValues={editingUser}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Users;