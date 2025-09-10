import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col, Select, InputNumber } from "antd";
import { fuelTypeAPI } from "../../services/api";

const { Option } = Select;

const EngineForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fuelTypes, setFuelTypes] = useState([]);

  // ✅ Fetch fuel types with status true
  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const res = await fuelTypeAPI.getAll();
        const activeFuelTypes = res.data.data.filter((ft) => ft.status === true);
        setFuelTypes(activeFuelTypes);
      } catch (error) {
        console.error("Error fetching fuel types:", error);
      }
    };
    fetchFuelTypes();
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
        initialValues
          ? "Engine updated successfully!"
          : "Engine added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Engine. Please try again.");
      console.error("Error submitting Engine form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        aspiration: "Naturally Aspirated", // default
      }}
    >
      <Row gutter={16}>
        {/* Engine Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Engine Name"
            rules={[{ required: true, message: "Please enter Engine Name" }]}
          >
            <Input placeholder="e.g. Toyota Supra" />
          </Form.Item>
        </Col>

        {/* Fuel Type */}
        <Col span={12}>
          <Form.Item
            name="fuelTypeId"
            label="Fuel Type"
            rules={[{ required: true, message: "Please select Fuel Type" }]}
          >
            <Select placeholder="Select Fuel Type">
              {fuelTypes.map((ft) => (
                <Option key={ft.id} value={ft.id}>
                  {ft.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Horsepower */}
        <Col span={12}>
          <Form.Item
            name="horsepower"
            label="Horsepower"
            rules={[{ required: true, message: "Please enter Horsepower" }]}
          >
            <InputNumber placeholder="e.g. 382" min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Torque */}
        <Col span={12}>
          <Form.Item name="torque" label="Torque">
            <InputNumber placeholder="e.g. 368" min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Cylinders */}
        <Col span={12}>
          <Form.Item name="cylinders" label="Cylinders">
            <InputNumber placeholder="e.g. 6" min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Displacement */}
        <Col span={12}>
          <Form.Item name="displacement" label="Displacement (L)">
            <InputNumber
              placeholder="e.g. 3.0"
              min={0}
              step={0.1}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Aspiration */}
        <Col span={12}>
          <Form.Item name="aspiration" label="Aspiration">
            <Select placeholder="Select Aspiration">
              <Option value="Naturally Aspirated">Naturally Aspirated</Option>
              <Option value="Turbocharged">Turbocharged</Option>
              <Option value="Twin-Turbo">Twin-Turbo</Option>
              <Option value="Supercharged">Supercharged</Option>
              <Option value="Twin-Charged">Twin-Charged</Option>
              <Option value="Electric Supercharged">Electric Supercharged</Option>
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
          {initialValues ? "Update Engine" : "Add Engine"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EngineForm;
