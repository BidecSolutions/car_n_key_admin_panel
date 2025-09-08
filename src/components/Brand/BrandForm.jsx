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

const BrandForm = ({
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
          ? "Brand updated successfully!"
          : "Brand added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Brand. Please try again.");
      console.error("Error submitting Brand form:", error);
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
        {/* Brand Name */}
        <Col span={12}>
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: "Please enter Brand Name" }]}
          >
            <Input placeholder="e.g. Honda" />
          </Form.Item>
        </Col>

        {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter Slug" }]}
          >
            <Input placeholder="e.g. honda" />
          </Form.Item>
        </Col>

        {/* Country Dropdown */}
        <Col span={12}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select
              placeholder="Select a country"
              showSearch
              optionFilterProp="children"
            >
              {countries.map((c) => (
                <Option key={c.code} value={c.name}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Founded Year */}
<Col span={12}>
  <Form.Item name="foundedYear" label="Founded Year">
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


        {/* Logo Upload */}
         {/* Slug */}
        <Col span={12}>
          <Form.Item
            name="logoUrl"
            label="Logo Url"
            rules={[{ required: true, message: "Please enter Logo Url" }]}
          >
            <Input placeholder="e.g. /logo-bmw-com-gray.svg" />
          </Form.Item>
        </Col>
        {/* <Col span={24}>
          <Form.Item
            label="Brand Logo"
            rules={[{ required: true, message: "Please upload a brand logo" }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              onChange={handleLogoChange}
              onRemove={() => setLogoBase64(null)}
            >
              {fileList.length >= 1 ? null : (
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              )}
            </Upload>
          </Form.Item>
        </Col> */}

        {/* Status */}
        {/* <Col span={12}>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Col> */}
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Brand" : "Add Brand"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
