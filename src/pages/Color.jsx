import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { colorsAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import ColorList from "../components/Color/ColorList";
import ColorForm from "../components/Color/ColorForm";
import { useToast } from "../utils/common/ToastProvider";

const Color = () => {
  const toast = useToast();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [pagination, setPagination] = useState({
    current: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  useEffect(() => {
    fetchcolors();
  }, [pagination.current, pagination.pageSize]);

  const fetchcolors = async () => {
    try {
      setLoading(true);
      const response = await colorsAPI.getAll();

      const colorsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setColors(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: colorsData.length,
      }));
    } catch (error) {
      console.error("Error fetching colors:", error);
      message.error(error?.message || "Failed to fetch colors. Please try again.");
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCode = () => {
    setEditingCode(null);
    setModalVisible(true);
  };

  const handleEditCode = (code) => {
    setEditingCode(code);
    setModalVisible(true);
  };

  const handleDeleteCode = async (id, action = "delete") => {
    try {
      await colorsAPI.toggle_status(id, action);
      await fetchcolors();
      toast.success(
        action === "delete" ? "Code deleted!" : "Code restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating code:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setFormLoading(true);

      if (editingCode) {
        await colorsAPI.update(editingCode.id, values);
      } else {
        await colorsAPI.create(values);
      }

      toast.success("Code saved successfully!");
      setTimeout(() => setModalVisible(false), 300);

      await fetchcolors();
    } catch (error) {
      console.error("Error saving code:", error);
  
    // Handle different message formats
    let errMsg = error?.response?.data?.message;

    if (Array.isArray(errMsg)) {
      errMsg = errMsg.join(", "); // Combine multiple errors
    } else if (typeof errMsg !== "string") {
      errMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
    }

    toast.error(errMsg); // 👈 use toast instead of message
  } finally {
    setFormLoading(false);
  }
};

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingCode(null);
  };

  const handleTableChange = (paginationInfo) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>Colors</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Color
        </Button>
      </div>

      {/* colors Table */}
      <ColorList
        colors={colors}
        loading={loading}
        onEdit={handleEditCode}
        onDelete={handleDeleteCode}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingCode ? "Edit Code" : "Add New Code"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <ColorForm
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleFormSubmit}
          initialValues={editingCode}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Color;
