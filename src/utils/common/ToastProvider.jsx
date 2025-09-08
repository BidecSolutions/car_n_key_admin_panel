// src/components/common/ToastProvider.jsx
import React, { createContext, useContext } from "react";
import { message } from "antd";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const toast = {
    success: (content, duration = 3) =>
      messageApi.open({ type: "success", content, duration }),
    error: (content, duration = 5) =>
      messageApi.open({ type: "error", content, duration }),
    warning: (content, duration = 4) =>
      messageApi.open({ type: "warning", content, duration }),
    info: (content, duration = 3) =>
      messageApi.open({ type: "info", content, duration }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
