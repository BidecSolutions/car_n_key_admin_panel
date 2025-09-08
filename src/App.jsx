import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import AssignRole from './pages/AssignRole';
import ViewList from './components/Roles/ViewList';
import { RoleProvider } from './Context/RolesContext'; // ✅ import
import Register from './pages/Register';
import PrivateRoute from './PrivateRoute';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './pages/Login';
import { PermissionProvider } from './Context/PermissionsContext';
import Color from './pages/Color';
import Brand from './pages/Brand';

const App = () => {
  return (
    
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <PermissionProvider>

        <RoleProvider>
          <Router>

            <Routes>
              {/* Public route */}
              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/login" element={<Login />} />
              {/* Private routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                {/* Dashboard - accessible to all authenticated users */}
                <Route index element={<Dashboard />} />

                {/* Colors routes - require colors permissions */}
                <Route
                  path="colors"
                  element={
                    // <ProtectedRoute permissions={["doctor."]}>
                      <Color />
                    // </ProtectedRoute>
                  }
                />

                {/* Brands routes - require brands permissions */}
                <Route
                  path="brands"
                  element={
                    // <ProtectedRoute permissions={["doctor."]}>
                      <Brand />
                    // </ProtectedRoute>
                  }
                />

                {/* Users routes - require admin permissions */}
                <Route
                  path="users"
                  element={
                    <ProtectedRoute permissions={["admin."]}>
                      <Users />
                    </ProtectedRoute>
                  }
                />

                {/* Roles routes - require role permissions */}
                <Route
                  path="roles"
                  element={
                    <ProtectedRoute permissions={["role."]}>
                      <Roles />
                    </ProtectedRoute>
                  }
                />

                {/* Permissions routes - require permission permissions */}
                <Route
                  path="permissions"
                  element={
                    <ProtectedRoute permissions={["permission."]}>
                      <Permissions />
                    </ProtectedRoute>
                  }
                />

                {/* Assign Role routes - require assignrole permissions */}
                <Route
                  path="assignRole"
                  element={
                    <ProtectedRoute permissions={["assignrole."]}>
                      <AssignRole />
                    </ProtectedRoute>
                  }
                />

                {/* View List - accessible if user has role permissions */}
                <Route
                  path="viewList"
                  element={
                    <ProtectedRoute permissions={["role."]}>
                      <ViewList />
                    </ProtectedRoute>
                  }
                />

                
              </Route>
            </Routes>
          </Router>
        </RoleProvider>
      </PermissionProvider>

    </ConfigProvider>
  );
};

export default App;
