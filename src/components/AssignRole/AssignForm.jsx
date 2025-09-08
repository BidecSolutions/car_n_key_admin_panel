import React, { useContext, useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import { rolesAPI, usersAPI, AssignRoleAdmins } from "../../services/api"; // ✅ Users API bhi import kiya
// import { RoleContext } from "../../Context/RolesContext";

// import { RoleContext } from "../../Context/RolesContext"; // ✅ Context

const { Option } = Select;

const AssignForm = ({
  onSubmit,
  onCancel,
  initialValues,
  loading = false,
  fetchAssignments
  // set
}) => {

  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [FormLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        role: roles
      });
    }
  }, [initialValues]);

  const fetchRoles = async () => {
    try {
      setFetchingRoles(true);
      const response = await rolesAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      const filteredUsers = data.filter((data) => {
        return data.guard_name === "admin-api"
      });
      console.log(filteredUsers)
      setRoles(filteredUsers);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Failed to fetch roles. Please try again.");
      setRoles([]);
    } finally {
      setFetchingRoles(false);
    }
  };


  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const response = await usersAPI.getAll(); // GET /users
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  //   useEffect(() => {
  //   if (initialValues && users.length > 0 && roles.length > 0) {
  //     form.setFieldsValue({
  //       admin_id: initialValues.admin_id,
  //       role: Array.isArray(initialValues.role)
  //         ? initialValues.role.map((r) => r.admin_name) 
  //         : [initialValues.admin_name], 
  //     });
  //   }
  //   console.log(initialValues  ,"initialValues");

  // }, [initialValues, users, roles, form]);
  useEffect(() => {
    if (initialValues && users.length > 0 && roles.length > 0) {
      form.setFieldsValue({
        admin_id: initialValues.admin_id, // direct admin id
        role: initialValues.roles || [],  // roles array as it is (["Doctor"])
      });
    }
    console.log(initialValues, "initialValues");
  }, [initialValues, users, roles, form]);


  const handleFinish = async (values) => {
    try {
      setFormLoading(true); // Loading state start
      console.log("values", values);

      const payLoad = {
        admin_id: values.admin_id,
        role: values.role,
      };



      if (initialValues) {
        // Update existing assignment
        const res = await AssignRoleAdmins.update(initialValues.id, payLoad);
        console.log("Updated Admin ID:", payLoad.admin_id);
        console.log("Updated Role:", payLoad.role);
        console.log("Response:", res.data);
        message.success("Role updated successfully!");
        await fetchUsers();
      } else {
        // Create new assignment
        const res = await AssignRoleAdmins.create(payLoad);
        console.log("Created Admin ID:", payLoad.admin_id);
        console.log("Created Role:", payLoad.role);
        console.log("Response:", res.data);
        message.success("Role assigned successfully!");
        await fetchRoles();
      }


      form.resetFields();
      if (fetchAssignments) await fetchAssignments();
      if (onCancel) onCancel();

    } catch (error) {
      console.error("Error creating/updating role:", error);
      message.error("Failed to save role!");
      throw error;
    } finally {
      setFormLoading(false); // Loading state end
    }
  };


  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      style={{ marginTop: 10 }}
    >

      <Form.Item
        name="admin_id"
        label="Select Admin"
        rules={[{ required: true, message: "Please select a admin" }]}
      >
        <Select placeholder="Choose a user" loading={fetchingUsers} >
          {users?.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item
        name="role"
        label="Select Roles"
        rules={[{ required: true, message: "Please select at least one role" }]}
      >
        <Select
          mode="multiple"
          placeholder="Choose roles"
          allowClear
          loading={fetchingRoles}
        >
          {roles.map((role) => (
            <Option key={role.id} value={role.name}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} >
            Assign
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default AssignForm;
