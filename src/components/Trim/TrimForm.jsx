import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col, Select, InputNumber } from "antd";
import { engineTypeAPI, featuresAPI, vehicalModalAPI } from "../../services/api";

const { Option } = Select;

const TrimForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [models, setModels] = useState([])
    const [engines, setEngines] = useState([])
  const [features, setFeatures] = useState([])

  // ✅ Fetch Models, Engines, Features
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelRes, engineRes, featureRes] = await Promise.all([
          vehicalModalAPI.getAll(),
          engineTypeAPI.getAll(),
          featuresAPI.getAll(),
        ]);

        setModels(modelRes.data.data || []);
        setEngines(engineRes.data.data || []);
        setFeatures(featureRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load form data");
      }
    };

    if (visible) fetchData();
  }, [visible]);


  // ✅ Set initial form values
  useEffect(() => {
    if (visible && initialValues) {
    form.setFieldsValue({
      ...initialValues,
      featureIds: initialValues.trimFeatures?.map(f => f.featureId) || [],
    });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      form.resetFields();
      message.success(
        initialValues ? "Trim updated successfully!" : "Trim added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Trim. Please try again.");
      console.error("Error submitting Trim form:", error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        {/* Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Trim Name"
            rules={[{ required: true, message: "Please enter trim name" }]}
          >
            <Input placeholder="e.g. XLE" />
          </Form.Item>
        </Col>

        {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input placeholder="e.g. xle-2025" />
          </Form.Item>
        </Col>

        {/* Year */}
         <Col span={12}>
          <Form.Item name="year" label="Year">
            <Select placeholder="Select year">
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

        {/* Transmission */}
        <Col span={12}>
        <Form.Item
  name="transmissionType"
  label="Transmission"
  rules={[{ required: true, message: "Please select transmission type" }]}
>
  <Select placeholder="Select Transmission">
    <Option value="AUTOMATIC">Automatic</Option>
    <Option value="MANUAL">Manual</Option>
    <Option value="CVT">CVT (Continuously Variable)</Option>
    <Option value="DCT">DCT (Dual-Clutch)</Option>
    <Option value="AMT">AMT (Automated Manual)</Option>
    <Option value="TIPTRONIC">Tiptronic</Option>
    <Option value="TORQUE_CONVERTER">Torque Converter</Option>
  </Select>
</Form.Item>
</Col>

        {/* Drivetrain */}
        <Col span={12}>
       <Form.Item
  name="drivetrain"
  label="Drivetrain"
  rules={[{ required: true, message: "Please select drivetrain" }]}
>
  <Select placeholder="Select Drivetrain">
    <Option value="FWD">FWD (Front-Wheel Drive)</Option>
    <Option value="RWD">RWD (Rear-Wheel Drive)</Option>
    <Option value="AWD">AWD (All-Wheel Drive)</Option>
    <Option value="4WD">4WD (Four-Wheel Drive)</Option>
    <Option value="2WD">2WD (Two-Wheel Drive)</Option>
  </Select>
</Form.Item>
</Col>

        {/* MSRP */}
        <Col span={12}>
          <Form.Item
            name="msrp"
            label="MSRP"
            rules={[{ required: true, message: "Please enter MSRP" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>

        {/* Vehicle Model */}
        <Col span={12}>
          <Form.Item
            name="vehicleModelId"
            label="Vehicle Model"
            rules={[{ required: true, message: "Please select a vehicle model" }]}
          >
            <Select placeholder="Select Vehicle Model">
              {models.map((model) => (
                <Option key={model.id} value={model.id}>
                  {model.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Engine Type */}
        <Col span={12}>
          <Form.Item
            name="engineTypeId"
            label="Engine Type"
            rules={[{ required: true, message: "Please select an engine type" }]}
          >
            <Select placeholder="Select Engine Type">
              {engines.map((engine) => (
                <Option key={engine.id} value={engine.id}>
                  {engine.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Features */}
        <Col span={24}>
          <Form.Item
            name="featureIds"
            label="Features"
            rules={[{ required: true, message: "Please select features" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Features"
              allowClear
            >
              {features.map((feature) => (
                <Option key={feature.id} value={feature.id}>
                  {feature.name}
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
          {initialValues ? "Update Trim" : "Add Trim"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TrimForm;
