import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../services/api";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Trigger permission update
  const triggerPermissionUpdate = (userData) => {
    const event = new CustomEvent("userChange", {
      detail: { type: "login", userData },
    });
    window.dispatchEvent(event);
  };

  // 🔹 Handle Login
// 🔹 Handle Login
const handleLogin = async (values) => {
  setLoading(true);
  try {
    // Try Admin Login
    let response = await authAPI.loginAdmin(values);
    if (response.data.success) {
      const user = response.data?.data.user;
      const token = response.data?.data.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      triggerPermissionUpdate(user);

      toast.success(response.data.message || "Admin login successful!");
      navigate("/"); // Admin dashboard
      return;
    } else {
      toast.error(response.data.message || "Invalid admin credentials!");
      setLoading(false); // ❌ stop loader immediately
      return;
    }
  } catch (adminError) {
    try {
      // Try User Login
      let response = await authAPI.loginUser(values);
      if (response.data.success) {
        const user = response.data.data;
        const token = response.data.token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        triggerPermissionUpdate(user);

        toast.success(response.data.message || "User login successful!");
        navigate("/user-dashboard");
        return;
      } else {
        toast.error(response.data.message || "Invalid user credentials!");
        setLoading(false); // ❌ stop loader immediately
        return;
      }
    } catch (userError) {
      toast.error(
        userError?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      setLoading(false); // ❌ stop loader immediately
      return;
    }
  } finally {
    // only close loading if still true (for success flow)
    setLoading(false);
  }
};


  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 24,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>

      {/* Login Form */}
      <Form
        form={form}
        layout="vertical"
        name="loginForm"
        onFinish={handleLogin}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      {/* Register Link */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ marginRight: 8 }}>Don’t have an account?</span>
        <Link
          to="/register"
          style={{
            color: "#1890ff",
            fontWeight: 500,
            textDecoration: "underline",
          }}
        >
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
