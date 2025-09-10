import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { engineTypeAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import EngineTypeList from "../components/EngineType/EngineTypeList";
import EngineForm from "../components/EngineType/engineTypeForm";

const EngineType = () => {
  const toast = useToast();
  const [engineType, setEngineType] = useState([]);
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
    fetchengineType();
  }, [pagination.current, pagination.pageSize]);

  const fetchengineType = async () => {
    try {
      setLoading(true);
      const response = await engineTypeAPI.getAll();

      const engineTypeData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setEngineType(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: engineTypeData.length,
      }));
    } catch (error) {
      console.error("Error fetching engineType:", error);
      message.error(error?.message || "Failed to fetch engineType. Please try again.");
      setEngineType([]);
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
      await engineTypeAPI.toggle_status(id, action);
      await fetchengineType();
      toast.success(
        action === "delete" ? "Engine Type deleted!" : "Engine Type restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Engine Type:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

const handleFormSubmit = async (formData) => {
  try {
    setFormLoading(true);

    if (editingCode) {
      await engineTypeAPI.update(editingCode.id, formData);
    } else {
      await engineTypeAPI.create(formData);
    }

    toast.success("Engine Type saved successfully!");
    setTimeout(() => setModalVisible(false), 300);

    await fetchengineType();
  } catch (error) {
    console.error("Error saving Engine Type:", error);

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
        <h1>Engine Type</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Engine Type
        </Button>
      </div>

      {/* engineType Table */}
      <EngineTypeList
        engineType={engineType}
        loading={loading}
        onEdit={handleEditCode}
        onDelete={handleDeleteCode}
        pagination={pagination}
        onTableChange={handleTableChange}
      />

      {/* Modal Form */}
      <Modal
        title={editingCode ? "Edit Engine Type" : "Add New Engine Type"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <EngineForm
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

export default EngineType;
