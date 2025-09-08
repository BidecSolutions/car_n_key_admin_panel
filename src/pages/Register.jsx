import React from "react";
import { Form, Input, Button, Checkbox, message, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        "https://baitussalam.datainovate.com/backend/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            address: values.address,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        message.success("User registered successfully!");
        form.resetFields();
        navigate("/"); 
      } else {
        message.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 700, // ✅ thoda bara kardiya takay 2 columns fit ho
        margin: "50px auto",
        padding: 32,
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: 24,
          fontSize: "24px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        Create an Account
      </h2>

      <Form
        form={form}
        layout="vertical"
        name="registerForm"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input size="large" placeholder="Enter your full name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter your address!" }]}
            >
              <Input size="large" placeholder="Enter your address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password size="large" placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Confirm password" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("You must accept the terms"),
                },
              ]}
            >
              <Checkbox>I agree to the Terms and Conditions</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Register
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ marginRight: 8 }}>Already have an account?</span>
        <Link
          to="/login"
          style={{
            color: "#1890ff",
            fontWeight: 500,
            textDecoration: "underline",
          }}
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
