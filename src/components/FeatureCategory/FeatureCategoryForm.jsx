import React, { useEffect } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";

const FeatureCategoryForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // ✅ Set initial form values
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
      message.success(
        initialValues
          ? "Feature Category updated successfully!"
          : "Feature Category added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Feature Category. Please try again.");
      console.error("Error submitting Feature Category form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        {/* Feature Category Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Feature Category Name"
            rules={[{ required: true, message: "Please enter Feature Category Name" }]}
          >
            <Input placeholder="e.g. Seats Feature" />
          </Form.Item>
        </Col>

        {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input placeholder="e.g. seats-feature" />
          </Form.Item>
        </Col>

        {/* Description */}
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the feature category" />
          </Form.Item>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Feature Category" : "Add Feature Category"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeatureCategoryForm;
