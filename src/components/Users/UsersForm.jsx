import React, { useEffect } from "react";
import { Form, Input, Button, message, Switch, Select } from "antd";

const { Option } = Select;

const UsersForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      // edit mode me status ko convert karna zaroori hai
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status === 1, // 1 => true, 0 => false
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      // switch ke value ko backend ke liye int me convert karna
      values.status = values.status ? 1 : 0;

      await onSubmit(values);
      form.resetFields();

      message.success(
        initialValues
          ? "User updated successfully!"
          : "User added successfully!"
      );
    } catch (error) {
      message.error("Failed to save user data. Please try again.");
      console.error("Error submitting user form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        role: "user",
        status: 1, // default active
      }}
    >
      {/* Full Name */}
      <Form.Item
        name="name"
        label="Full Name"
        rules={[
          { required: true, message: "Please enter full name" },
          { min: 2, message: "Name must be at least 2 characters" },
        ]}
      >
        <Input placeholder="Enter user's full name" />
      </Form.Item>

      {/* Email */}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter email address" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Enter user's email address" />
      </Form.Item>

      {/* Phone */}
      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          { required: true, message: "Please enter phone number" },
          { min: 10, message: "Phone must be at least 10 digits" },
        ]}
      >
        <Input placeholder="Enter user's phone number" />
      </Form.Item>

      

      {/* Password - only for add new */}
      {!initialValues && (
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      )}

      
      <Form.Item
        name="status"
        label="Status"
        valuePropName="checked" 
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      
      <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update User" : "Add User"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UsersForm;