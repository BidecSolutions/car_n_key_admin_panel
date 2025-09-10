import React, { useEffect } from "react";
import { Form, Input, Button, message, Switch } from "antd";

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
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status === true, // true/false mapping
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      // Convert status to boolean if needed
      values.status = values.status ? true : false;

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
        status: true, // default active
      }}
    >
      {/* First Name */}
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          { required: true, message: "Please enter first name" },
          { min: 2, message: "First name must be at least 2 characters" },
        ]}
      >
        <Input placeholder="Enter first name" />
      </Form.Item>

      {/* Last Name */}
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          { required: true, message: "Please enter last name" },
          { min: 2, message: "Last name must be at least 2 characters" },
        ]}
      >
        <Input placeholder="Enter last name" />
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

      {/* Status */}
      <Form.Item name="status" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      {/* Buttons */}
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
