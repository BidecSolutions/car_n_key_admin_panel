import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { faqsAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import FaqsList from "../components/Faqs/FaqsList";
import FaqForm from "../components/Faqs/FaqForm";

const Faqs = () => {
  const toast = useToast();
  const [faqs, setFaqs] = useState([]);
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
    fetchfaqs();
  }, [pagination.current, pagination.pageSize]);

  const fetchfaqs = async () => {
    try {
      setLoading(true);
      const response = await faqsAPI.getAll();

      const faqsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setFaqs(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: faqsData.length,
      }));
    } catch (error) {
      console.error("Error fetching faqs:", error);
      message.error(error?.message || "Failed to fetch faqs. Please try again.");
      setFaqs([]);
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
      await faqsAPI.toggle_status(id, action);
      await fetchfaqs();
      toast.success(
        action === "delete" ? "Faqs deleted!" : "Faqs restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Faqs:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      setFormLoading(true);

       if (values.foundedYear) {
      values.foundedYear = parseInt(values.foundedYear, 10);
    }

      if (editingCode) {
        await faqsAPI.update(editingCode.id, values);
      } else {
        await faqsAPI.create(values);
      }

      toast.success("Faq saved successfully!");
      setTimeout(() => setModalVisible(false), 300);

      await fetchfaqs();
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
        <h1>Faqs</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Faq
        </Button>
      </div>

      {/* faqs Table */}
      <FaqsList
        faqs={faqs}
        loading={loading}
        onEdit={handleEditCode}
        onDelete={handleDeleteCode}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingCode ? "Edit Faq" : "Add New Faq"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <FaqForm
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

export default Faqs;
