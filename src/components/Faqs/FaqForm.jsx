import React, { useEffect } from "react";
import { Form, Input, Button, Space, message, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const FaqForm = ({ visible, onCancel, onSubmit, initialValues = null, loading = false }) => {
  const [form] = Form.useForm();

useEffect(() => {
  if (visible && initialValues) {
    form.setFieldsValue({
      faqs: Array.isArray(initialValues)
        ? initialValues.map(faq => ({
            question: faq.question,
            answer: faq.answer,
          }))
        : [{
            question: initialValues.question,
            answer: initialValues.answer,
          }],
    });
  } else if (visible) {
    form.resetFields();
  }
}, [visible, initialValues, form]);


  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      message.success(initialValues ? "FAQs updated successfully!" : "FAQs added successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to save FAQs. Please try again.");
      console.error("Error submitting FAQ form:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        faqs: [{ question: "", answer: "" }],
      }}
    >
      <Form.List name="faqs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Col span={12}>
                <Form.Item
                  {...restField}
                  name={[name, "question"]}
                  label="Question"
                  rules={[{ required: true, message: "Please enter a question" }]}
                >
                  <Input placeholder="Enter question" style={{ width: 300 }} />
                </Form.Item>
                </Col>

                <Col span={12}>
                <Form.Item
                  {...restField}
                  name={[name, "answer"]}
                  label="Answer"
                  rules={[{ required: true, message: "Please enter an answer" }]}
                >
                  <Input.TextArea placeholder="Enter answer" style={{ width: 400 }} />
                </Form.Item>
                </Col>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add FAQ
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Action Buttons */}
      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update FAQs" : "Add FAQs"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FaqForm;
