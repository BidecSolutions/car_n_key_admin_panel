import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Select,
  InputNumber,
} from "antd";
import { getCountries } from "../../utils/helpers";
import { brandsAPI } from "../../services/api";

const { Option } = Select;

const VehicalModalForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  
    // ✅ Fetch brand with status true
    useEffect(() => {
      const fetchBrand = async () => {
        try {
          const res = await brandsAPI.getAll();
          const activeBrand = res.data.data.filter((ft) => ft.status === true);
          setBrands(activeBrand);
        } catch (error) {
          console.error("Error fetching Brand:", error);
        }
      };
      fetchBrand();
    }, []);

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
          ? "Vehicle Model updated successfully!"
          : "Vehicle Model added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Vehicle Model. Please try again.");
      console.error("Error submitting Vehicle Model form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: true,
      }}
    >
      <Row gutter={16}>
        {/* Vehicle Model Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Vehicle Model Name"
            rules={[{ required: true, message: "Please enter Vehicle Model Name" }]}
          >
            <Input placeholder="e.g. Model XYZ-2" />
          </Form.Item>
        </Col>

        {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input placeholder="e.g. model-xyz-2" />
          </Form.Item>
        </Col>

        {/* Year Start */}
        {/* <Col span={12}>
          <Form.Item
            name="yearStart"
            label="Start Year"
            rules={[{ required: true, message: "Please enter start year" }]}
          >
            <InputNumber
              placeholder="e.g. 2012"
              min={1900}
              max={2100}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col> */}
        <Col span={12}>
  <Form.Item name="yearStart" label="Start Year">
    <Select placeholder="Select start year">
      {Array.from({ length: 100 }, (_, i) => {
        const year = new Date().getFullYear() - i; // last 100 years
        return (
          <Option key={year} value={year}>
            {year}
          </Option>
        );
      })}
    </Select>
  </Form.Item>
</Col>

        {/* Year End */}
        {/* <Col span={12}>
          <Form.Item
            name="yearEnd"
            label="End Year"
            rules={[{ required: true, message: "Please enter end year" }]}
          >
            <InputNumber
              placeholder="e.g. 2025"
              min={1900}
              max={2100}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item name="yearEnd" label="End Year">
            <Select placeholder="Select end year">
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i; // last 100 years
                return (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>

        {/* Brand */}
        <Col span={12}>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please select a brand" }]}
          >
            <Select placeholder="Select Brand">
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Vehicle Model" : "Add Vehicle Model"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VehicalModalForm;
