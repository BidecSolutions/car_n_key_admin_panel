import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { bodyTypeAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import BodyTypeList from "../components/BodyType/BodyTypeList";
import BodyTypeForm from "../components/BodyType/BodyTypeForm";

const BodyType = () => {
  const toast = useToast();
  const [bodyType, setBodyType] = useState([]);
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
    fetchbodyType();
  }, [pagination.current, pagination.pageSize]);

  const fetchbodyType = async () => {
    try {
      setLoading(true);
      const response = await bodyTypeAPI.getAll();

      const bodyTypeData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setBodyType(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: bodyTypeData.length,
      }));
    } catch (error) {
      console.error("Error fetching bodyType:", error);
      message.error(error?.message || "Failed to fetch bodyType. Please try again.");
      setBodyType([]);
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
      await bodyTypeAPI.toggle_status(id, action);
      await fetchbodyType();
      toast.success(
        action === "delete" ? "Brand deleted!" : "Brand restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

const handleFormSubmit = async (formData) => {
  try {
    setFormLoading(true);

    if (editingCode) {
      await bodyTypeAPI.update(editingCode.id, formData);
    } else {
      await bodyTypeAPI.create(formData);
    }

    toast.success("Code saved successfully!");
    setTimeout(() => setModalVisible(false), 300);

    await fetchbodyType();
  } catch (error) {
    console.error("Error saving code:", error);

    let errMsg = error?.response?.data?.message;
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.join(", ");
    } else if (typeof errMsg !== "string") {
      errMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong. Please try again.";
    }
    toast.error(errMsg);
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
        <h1>Body Type</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Body Type
        </Button>
      </div>

      {/* bodyType Table */}
      <BodyTypeList
        bodyType={bodyType}
        loading={loading}
        onEdit={handleEditCode}
        onDelete={handleDeleteCode}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingCode ? "Edit Brand" : "Add New Brand"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <BodyTypeForm
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

export default BodyType;
