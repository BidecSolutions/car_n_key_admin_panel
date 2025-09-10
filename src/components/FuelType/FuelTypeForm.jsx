import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Select,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64, getCountries } from "../../utils/helpers";

const { Option } = Select;

const FuelTypeForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [logoBase64, setLogoBase64] = useState(null);
  const [fileList, setFileList] = useState([]); // 👈 control Upload state
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(getCountries());
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
      // const payload = {
      //   ...values,
      //   foundedYear: values.foundedYear
      //     ? values.foundedYear.format("YYYY")
      //     : null,
      //   logoUrl: logoBase64,
      // };

      await onSubmit(values);
      form.resetFields();
      setLogoBase64(null);
      setFileList([]);
      message.success(
        initialValues
          ? "Fuel Type updated successfully!"
          : "Fuel Type added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Fuel Type. Please try again.");
      console.error("Error submitting Fuel Type form:", error);
    }
  };

  const handleLogoChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const file = newFileList[0];
    if (file && file.originFileObj) {
      const base64 = await getBase64(file.originFileObj);
      setLogoBase64(base64);
    } else if (newFileList.length === 0) {
      setLogoBase64(null);
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
        {/* Fuel Type Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Fuel Type Name"
            rules={[{ required: true, message: "Please enter Fuel Type Name" }]}
          >
            <Input placeholder="e.g. Petrol" />
          </Form.Item>
        </Col>

      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Fuel Type" : "Add Fuel Type"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FuelTypeForm;
