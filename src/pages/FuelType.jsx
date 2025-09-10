import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { fuelTypeAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import { useToast } from "../utils/common/ToastProvider";
import FuelTypeList from "../components/FuelType/FuelTypeList";
import FuelTypeForm from "../components/FuelType/FuelTypeForm";

const FuelType = () => {
  const toast = useToast();
  const [fuelType, setFuelType] = useState([]);
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
    fetchfuelType();
  }, [pagination.current, pagination.pageSize]);

  const fetchfuelType = async () => {
    try {
      setLoading(true);
      const response = await fuelTypeAPI.getAll();

      const fuelTypeData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setFuelType(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: fuelTypeData.length,
      }));
    } catch (error) {
      console.error("Error fetching fuelType:", error);
      message.error(error?.message || "Failed to fetch fuelType. Please try again.");
      setFuelType([]);
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
      await fuelTypeAPI.toggle_status(id, action);
      await fetchfuelType();
      toast.success(
        action === "delete" ? "Fuel Type deleted!" : "Fuel Type restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Fuel Type:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

const handleFormSubmit = async (formData) => {
  try {
    setFormLoading(true);

    if (editingCode) {
      await fuelTypeAPI.update(editingCode.id, formData);
    } else {
      await fuelTypeAPI.create(formData);
    }

    toast.success("Fuel Type saved successfully!");
    setTimeout(() => setModalVisible(false), 300);

    await fetchfuelType();
  } catch (error) {
    console.error("Error saving Fuel Type:", error);

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
        <h1>Fuel Type</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Fuel Type
        </Button>
      </div>

      {/* fuelType Table */}
      <FuelTypeList
        fuelType={fuelType}
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
        <FuelTypeForm
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

export default FuelType;
