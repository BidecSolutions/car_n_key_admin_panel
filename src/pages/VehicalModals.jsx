import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { vehicalModalAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import VehicalModalList from "../components/VehicalModal/VehicalModalList";
import VehicalModalForm from "../components/VehicalModal/VehicalModalForm";


const VehicalModal = () => {
  const toast = useToast();
  const [vehicalModal, setVehicalModal] = useState([]);
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
    fetchvehicalModal();
  }, [pagination.current, pagination.pageSize]);

  const fetchvehicalModal = async () => {
    try {
      setLoading(true);
      const response = await vehicalModalAPI.getAll();

      const vehicalModalData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setVehicalModal(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: vehicalModalData.length,
      }));
    } catch (error) {
      console.error("Error fetching vehicalModal:", error);
      message.error(error?.message || "Failed to fetch vehicalModal. Please try again.");
      setVehicalModal([]);
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
      await vehicalModalAPI.toggle_status(id, action);
      await fetchvehicalModal();
      toast.success(
        action === "delete" ? "Vehical Modal deleted!" : "Vehical Modal restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Vehical Modal:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

const handleFormSubmit = async (formData) => {
  try {
    setFormLoading(true);

        if (formData.yearEnd) {
      formData.yearEnd = parseInt(formData.yearEnd, 10);
    }
      if (formData.yearStart) {
      formData.yearStart = parseInt(formData.yearStart, 10);
    }

    if (editingCode) {
      await vehicalModalAPI.update(editingCode.id, formData);
    } else {
      await vehicalModalAPI.create(formData);
    }

    toast.success("Vehical Modal saved successfully!");
    setTimeout(() => setModalVisible(false), 300);

    await fetchvehicalModal();
  } catch (error) {
    console.error("Error saving Vehical Modal:", error);

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
        <h1>Vehical Modal</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Vehical Modal
        </Button>
      </div>

      {/* vehicalModal Table */}
      <VehicalModalList
        vehicalModal={vehicalModal}
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
        <VehicalModalForm
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

export default VehicalModal;
