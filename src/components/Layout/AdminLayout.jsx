import React, { useContext, useState } from "react";
import { Layout, Menu, theme, Button, Avatar } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { RoleContext } from "../../Context/RolesContext";
import { useRoles } from "../../Context/PermissionsContext";
import ProfileDrawer from "./ProfileDrawer"; // ✅ apna component import
import { Footer } from "antd/es/layout/layout";
// import PermissionDebugger from "./PermissionDebugger"; // 🔐 Permission debugger for development

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ✅ Profile Drawer state
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(RoleContext);
  const { permissions } = useRoles(); // Get user permissions

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Helper function to check if user has any permission for a module
  const hasAnyPermission = (permissionPrefixes) => {
    if (!permissions || !Array.isArray(permissions)) return false;
    return permissionPrefixes.some(prefix => 
      permissions.some(permission => permission.startsWith(prefix))
    );
  };

  // Sidebar Menu Items with permission checks
  const getAllMenuItems = () => [
    { 
      key: "/", 
      icon: <DashboardOutlined />, 
      label: "Dashboard",
      show: true // Dashboard is always visible
    },
    { 
      key: "/doctors", 
      icon: <UserOutlined />, 
      label: "Doctors",
      show: hasAnyPermission(["doctor."])
    },
    { 
      key: "/tests", 
      icon: <ExperimentOutlined />, 
      label: "Tests",
      show: hasAnyPermission(["tests."])
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      show: hasAnyPermission(["test category.", "branches.", "codes.", "hero."]),
      children: [
        { 
          key: "/test-categories", 
          label: "Test Category",
          show: hasAnyPermission(["test category."])
        },
        { 
          key: "/branches", 
          label: "Branches",
          show: hasAnyPermission(["branches."])
        },
        { 
          key: "/codes", 
          label: "Codes",
          show: hasAnyPermission(["codes."])
        },
        // { 
        //   key: "/Hero-section", 
        //   label: "Hero Section",
        //   show: hasAnyPermission(["hero."])
        // },
      ],
    },
    {
      key: "user-management",
      icon: <TeamOutlined />,
      label: "User Management",
      show: hasAnyPermission(["admin.", "role.", "permission.", "assignrole.", "customer."]),
      children: [
        { 
          key: "/users", 
          icon: <UserOutlined />, 
          label: "Users",
          show: hasAnyPermission(["admin."])
        },
        { 
          key: "/roles", 
          icon: <IdcardOutlined />, 
          label: "Roles",
          show: hasAnyPermission(["role."])
        },
        { 
          key: "/permissions", 
          icon: <SafetyCertificateOutlined />, 
          label: "Permissions",
          show: hasAnyPermission(["permission."])
        },
        { 
          key: "/AssignRole", 
          icon: <SwapOutlined />, 
          label: "Assign-Role",
          show: hasAnyPermission(["assignrole."])
        },
        { 
          key: "/customer", 
          icon: <UserOutlined />, 
          label: "Customer",
          show: hasAnyPermission(["customer."])
        },
      ],
    },
    { 
      key: "/career", 
      icon: <UserOutlined />, 
      label: "Career Form",
      show: hasAnyPermission(["career."])
    },
    { 
      key: "/contact", 
      icon: <UserOutlined />, 
      label: "Contact",
      show: hasAnyPermission(["contact."])
    },
  ];

  // Filter menu items based on permissions
  // const filterMenuItems = (items) => {
  //   return items
  //     .filter(item => item.show)
  //     .map(item => {
  //       if (item.children) {
  //         const filteredChildren = item.children.filter(child => child.show);
  //         if (filteredChildren.length > 0) {
  //           return {
  //             ...item,
  //             children: filteredChildren
  //           };
  //         }
  //         return null;
  //       }
  //       return item;
  //     })
  //     .filter(Boolean);
  // };
  const filterMenuItems = (items) => {
  return items
    .filter(item => item.show)
    .map(item => {
      const { show, ...rest } = item; // ⬅ remove "show"

      if (item.children) {
        const filteredChildren = item.children.filter(child => child.show).map(child => {
          const { show, ...childRest } = child; // ⬅ remove "show" from children too
          return childRest;
        });

        if (filteredChildren.length > 0) {
          return {
            ...rest,
            children: filteredChildren,
          };
        }
        return null;
      }

      return rest;
    })
    .filter(Boolean);
};


  const menuItems = filterMenuItems(getAllMenuItems());

  const handleMenuClick = ({ key }) => {
    if (!key.startsWith("/")) return;
    navigate(key);
  };

  const getPageTitle = () => {
    const findLabel = (items) => {
      for (const item of items) {
        if (item.key === location.pathname) return item.label;
        if (item.children) {
          const childLabel = findLabel(item.children);
          if (childLabel) return childLabel;
        }
      }
      return null;
    };
    return findLabel(getAllMenuItems()) || "Dashboard";
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Trigger permission reset
    const event = new CustomEvent('userChange', {
      detail: { type: 'logout' }
    });
    window.dispatchEvent(event);
    
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: borderRadiusLG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1890ff",
            fontWeight: "bold",
            fontSize: collapsed ? "12px" : "16px",
          }}
        >
          {collapsed ? "CNK" : "Car-N-Key"}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <h2 style={{ margin: 0, marginLeft: 16 }}>{getPageTitle()}</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            
            <Button
              type="default"
              shape="round"
              icon={<Avatar size="small" icon={<UserOutlined />} />}
              onClick={() => setIsProfileOpen(true)} 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 12px",
                fontWeight: "500",
                background: "#f0f2f5",
                border: "1px solid #d9d9d9",
              }}
            >
              Profile
            </Button>

            {/* Logout Button */}
            <Button
              type="primary"
              shape="round"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      <Footer
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        margin: "16px",
        padding: "12px 24px",
        fontSize: "14px",
        color: "rgba(0,0,0,0.65)",
        boxShadow: "0 -1px 4px rgba(0,0,0,0.06)",
        textAlign: "center", 
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Left side */}
        <div style={{ flex: 1, textAlign: "left" }}>
          © {new Date().getFullYear()} Car-n-Key.
        </div>

        {/* Center full width */}
        <div style={{ flex: 1, textAlign: "right" }}>
          Powered by{" "}
          <a
            href="https://bidecsol.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1890ff", fontWeight: "500" }}
          >
            BidecSol
          </a>
        </div>
      </div>
    </Footer>



        <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        {/* <PermissionDebugger /> */}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
