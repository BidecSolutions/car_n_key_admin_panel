import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col, Select } from "antd";
import { featureCategoryAPI } from "../../services/api";

const { Option } = Select;

const FeaturesForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  // ✅ Fetch Feature Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await featureCategoryAPI.getAll();
        const activeCategories = res.data.data.filter((cat) => cat.status === true);
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching feature categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
        initialValues ? "Feature updated successfully!" : "Feature added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Feature. Please try again.");
      console.error("Error submitting Feature form:", error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        {/* Category */}
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label="Feature Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select Feature Category">
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Feature Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Feature Name"
            rules={[{ required: true, message: "Please enter Feature Name" }]}
          >
            <Input placeholder="e.g. Heated Seats" />
          </Form.Item>
        </Col>

        {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input placeholder="e.g. heated-seats" />
          </Form.Item>
        </Col>

        {/* Description */}
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the feature" />
          </Form.Item>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Feature" : "Add Feature"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeaturesForm;
