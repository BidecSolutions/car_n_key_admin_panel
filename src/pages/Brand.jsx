import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import "antd/dist/reset.css";
import { PlusOutlined } from "@ant-design/icons";
import { brandsAPI } from "../services/api";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURRENT_PAGE,
} from "../utils/constants";
import BrandList from "../components/Brand/BrandList";
import { useToast } from "../utils/common/ToastProvider";
import BrandForm from "../components/Brand/BrandForm";

const Brand = () => {
  const toast = useToast();
  const [brands, setBrands] = useState([]);
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
    fetchbrands();
  }, [pagination.current, pagination.pageSize]);

  const fetchbrands = async () => {
    try {
      setLoading(true);
      const response = await brandsAPI.getAll();

      const brandsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

        console.log(response.data)
      setBrands(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: brandsData.length,
      }));
    } catch (error) {
      console.error("Error fetching brands:", error);
      message.error(error?.message || "Failed to fetch brands. Please try again.");
      setBrands([]);
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
      await brandsAPI.toggle_status(id, action);
      await fetchbrands();
      toast.success(
        action === "delete" ? "Brand deleted!" : "Brand restored!"
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating Brand:", error);
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
        await brandsAPI.update(editingCode.id, values);
      } else {
        await brandsAPI.create(values);
      }

      toast.success("Code saved successfully!");
      setTimeout(() => setModalVisible(false), 300);

      await fetchbrands();
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
        <h1>Brands</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCode}
        >
          Add Brand
        </Button>
      </div>

      {/* brands Table */}
      <BrandList
        brands={brands}
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
        <BrandForm
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

export default Brand;
