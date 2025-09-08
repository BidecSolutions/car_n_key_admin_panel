import React, { useEffect } from "react";
import { Form, Input, Button, message, Switch, Row, Col, Select } from "antd";

const ColorForm = ({ visible, onCancel, onSubmit, initialValues = null, loading = false }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      form.resetFields();
      message.success(initialValues ? "Code updated successfully!" : "Code added successfully!");
    } catch (error) {
      message.error("Failed to save code. Please try again.");
      console.error("Error submitting code form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 1,
      }}
    >
      <Row gutter={16}>
 
        {/* value */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Color Name"
            rules={[{ required: true, message: "Please enter Color Name" }]}
          >
            <Input placeholder="e.g. White" />
          </Form.Item>
        </Col>

         <Form.Item
            name="hex"
            label="Hex Code"
            rules={[{ required: true, message: "Please select a color" }]}
          >
            <Input
              type="color"
              style={{ width: "100%", height: "30px", padding: 0, border: "none" }}
            />
          </Form.Item>
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Code" : "Add Code"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ColorForm;
