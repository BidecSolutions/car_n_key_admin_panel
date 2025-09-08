import React, { useState } from "react";
import { Drawer, Avatar, Descriptions, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UsersForm from "../../components/Users/UsersForm";

const ProfileDrawer = ({ open, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = async (values) => {
    console.log("Updated Values:", values);

    // Yahan API call karni hogi update ke liye
    // await updateUserAPI(values);

    localStorage.setItem("user", JSON.stringify(values));
    setIsEditing(false);
  };

  return (
    <Drawer
      title={isEditing ? "Update Profile" : "User Profile"}
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      footer={
        !isEditing && (
          <div style={{ textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Close
            </Button>
            <Button type="primary" onClick={handleUpdateClick}>
              Update
            </Button>
          </div>
        )
      }
    >
      {isEditing ? (
        <UsersForm
          visible={true}
          onCancel={handleCancelEdit}
          onSubmit={handleFormSubmit}
          initialValues={user}
        />
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <h2 style={{ marginTop: "10px" }}>{user.name || "Guest User"}</h2>
            <p style={{ color: "gray" }}>{user.email || "No email"}</p>
          </div>

          <Descriptions column={1} bordered>
  <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
  <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
  <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>

</Descriptions>

        </>
      )}
    </Drawer>
  );
};

export default ProfileDrawer;
