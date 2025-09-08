import React, { useState } from "react";
import { Button, Drawer, Form, Input, message } from "antd";
import { authAPI } from "../services/api";

const ChangePassword = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const openDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const handleChangePassword = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You must be logged in!");
        return;
      }

      const response = await authAPI.changePassword(values, token);

      if (response.data.success) {
        message.success("Password changed successfully!");
        closeDrawer();
        form.resetFields();
      } else {
        message.error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      message.error("Error changing password");
      console.error(error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={openDrawer}>
        Change Password
      </Button>

      <Drawer
        title="Change Password"
        placement="right"
        onClose={closeDrawer}
        open={visible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[{ required: true, message: "Please enter your old password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="new_password"
            rules={[{ required: true, message: "Please enter a new password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Update Password
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default ChangePassword;
