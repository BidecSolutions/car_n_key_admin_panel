import React, { createContext, useState } from "react";
import axios from "axios";
import { message } from "antd";

// Context create
export const RoleContext = createContext();

// Provider component
export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Register API (user register)
  const register = async (values) => {
    try {
      const response = await axios.post(
        "https://baitussalam.datainovate.com/backend/api/user/register",
        {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
          phone: values.phone,
          billing_address: values.billing_address,
        }
      );

      if (response.data.success) {
        message.success(response.data.message, 2);
        localStorage.setItem("token", response.data.token);
        return {
          token: response.data.token,
          role: "user",
        };
      } else {
        message.error(response.data.message || "Registration failed");
        return null;
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
      return null;
    }
  };

  // ✅ Login API (combined admin/user)
  const login = async (values) => {
    try {
      let response;
      let role;

      // Try admin login first
      response = await axios.post(
        "https://baitussalam.datainovate.com/backend/api/admin/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        role = "admin";
      } else {
        // If admin login fails, try user login
        response = await axios.post(
          "https://baitussalam.datainovate.com/backend/api/user/login",
          {
            email: values.email,
            password: values.password,
          }
        );

        if (response.data.success) {
          role = "user";
        } else {
          message.error("Invalid credentials");
          return null;
        }
      }

      // Save token and show message
      localStorage.setItem("token", response.data.token);
      message.success(response.data.message, 2);
      console.log(`${role} Token:`, response.data.token);

      return {
        token: response.data.token,
        role,
      };
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
      return null;
    }
  };

  // ✅ Get Tests API
  const getTests = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get(
        "https://baitussalam.datainovate.com/backend/api/tests",
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

    if (response.data.success) {
      const tests = response.data.data || [];
      console.log("Fetched Tests:", tests);
      return tests; // return array of tests
    } else {
      message.error(response.data.message || "Failed to fetch tests");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tests:", error);
    message.error("Something went wrong while fetching tests");
    return [];
  }
};

  // ✅ Create Test API
  const createTest = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://baitussalam.datainovate.com/backend/api/admin/tests/store",
        {
          name: values.name,
          category_id: values.category_id,
          price: values.price,
          description: values.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Test created successfully", 2);
        return response.data.data; // return newly created test
      } else {
        message.error(response.data.message || "Failed to create test");
        return null;
      }
    } catch (error) {
      console.error("Error creating test:", error);
      message.error("Something went wrong while creating test");
      return null;
    }
  };

  // ✅ Get Doctors API
  const getDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://baitussalam.datainovate.com/backend/api/doctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const doctors = response.data.data || [];
        return doctors;
      } else {
        message.error(response.data.message || "Failed to fetch doctors");
        return [];
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Something went wrong while fetching doctors");
      return [];
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRoles([]);
    
    // Trigger permission reset
    const event = new CustomEvent('userChange', {
      detail: { type: 'logout' }
    });
    window.dispatchEvent(event);
    
    message.success("Logged out successfully", 2);
    window.location.href = "/login";
  };

  const value = {
    roles,
    loading,
    register,
    login,
    getTests
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
