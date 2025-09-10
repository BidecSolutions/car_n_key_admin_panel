import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const BodyTypeForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj); // 👈 binary image
      }

      await onSubmit(formData);
      form.resetFields();
      setFileList([]);
      message.success(
        initialValues
          ? "Body Type updated successfully!"
          : "Body Type added successfully!"
      );
    } catch (error) {
      message.error("Failed to save Body Type. Please try again.");
      console.error("Error submitting Body Type form:", error);
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: "",
      }}
    >
      <Row gutter={16}>
        {/* Body Type Name */}
        <Col span={24}>
          <Form.Item
            name="name"
            label="Body Type Name"
            rules={[{ required: true, message: "Please enter Body Type Name" }]}
          >
            <Input placeholder="e.g. Honda" />
          </Form.Item>
        </Col>

        {/* Image Upload */}
        <Col span={24}>
          <Form.Item
            label="Body Type Logo"
            rules={[{ required: true, message: "Please upload a Body Type logo" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false} // prevent auto-upload
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={() => setFileList([])}
            >
              {fileList.length >= 1 ? null : (
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update Body Type" : "Add Body Type"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BodyTypeForm;
