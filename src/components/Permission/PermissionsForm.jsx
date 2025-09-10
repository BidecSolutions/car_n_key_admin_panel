import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';


const { Option } = Select;

// const moduleOptions = ['Users', 'Roles', 'Doctors']; // example modules, tum API se bhi fetch kar sakte ho

const PermissionsForm = ({ visible, onCancel, onSubmit, initialValues = {}, loading = false }) => {
  const [form] = Form.useForm();


  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      {/* Module Name */}
      <Form.Item
        name="module"
        label="Module Name"
        rules={[{ required: true, message: 'Please enter permission name!' }]}
      >
        <Input placeholder="Enter Permission Name" />
      </Form.Item>

      {/* Permission Name */}
      <Form.Item
        name="permission_name"
        label="Permission Name"
        rules={[{ required: true, message: 'Please enter permission name!' }]}
      >
        <Input placeholder="Enter Permission Name" />
      </Form.Item>

      {/* Name */}
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter name!' }]}
      >
        <Input placeholder="Enter Name" />
      </Form.Item>

      {/* Submit & Cancel Buttons */}
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button onClick={() => { form.resetFields(); onCancel(); }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default PermissionsForm;