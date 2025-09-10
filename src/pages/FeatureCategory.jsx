import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { featureCategoryAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import FeatureCategoryList from "../components/FeatureCategory/FeatureCategoryList";
import FeatureCategoryForm from "../components/FeatureCategory/FeatureCategoryForm";

const FeatureCategory = () => {
  const toast = useToast();
  const [feature, setFeature] = useState([]);
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
    fetchfeature();
  }, [pagination.current, pagination.pageSize]);

  const fetchfeature = async () => {
    try {
      setLoading(true);
      const response = await featureCategoryAPI.getAll();

      const featureData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setFeature(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: featureData.length,
      }));
    } catch (error) {
      console.error("Error fetching feature:", error);
      message.error(error?.message || "Failed to fetch feature. Please try again.");
      setFeature([]);
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
      await featureCategoryAPI.toggle_status(id, action);
      await fetchfeature();
      toast.success(
        action === "delete" ? "Feature deleted!" : "Feature restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Feature:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

const handleFormSubmit = async (formData) => {
  try {
    setFormLoading(true);

    if (editingCode) {
      await featureCategoryAPI.update(editingCode.id, formData);
    } else {
      await featureCategoryAPI.create(formData);
    }

    toast.success("Feature saved successfully!");
    setTimeout(() => setModalVisible(false), 300);

    await fetchfeature();
  } catch (error) {
    console.error("Error saving Feature:", error);

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
        <h1>Feature Category</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Feature Category
        </Button>
      </div>

      {/* feature Table */}
      <FeatureCategoryList
        features={feature}
        loading={loading}
        onEdit={handleEditCode}
        onDelete={handleDeleteCode}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingCode ? "Edit Feature" : "Add New Feature"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <FeatureCategoryForm
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

export default FeatureCategory;
