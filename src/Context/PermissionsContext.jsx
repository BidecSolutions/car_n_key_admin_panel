// src/Context/PermissionsContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Context create
const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Function to load permissions from localStorage
  const loadPermissions = useCallback(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.roles && Array.isArray(userData.roles)) {
        setRoles(userData.roles);
        
        const extracted = userData.roles.flatMap(role =>
          role.permissions?.map(p => p.name) || []
        );
        setPermissions(extracted);
      } else {
        // No user data or roles, clear permissions
        setRoles([]);
        setPermissions([]);
        console.log("No user data found, clearing permissions");
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      setRoles([]);
      setPermissions([]);
    }
  }, []);

  // Function to reset permissions (called on logout)
  const resetPermissions = useCallback(() => {
    setRoles([]);
    setPermissions([]);
    console.log("Permissions reset");
  }, []);

  // Function to update permissions (called on login)
  const updatePermissions = useCallback((userData) => {
    if (userData?.roles && Array.isArray(userData.roles)) {
      setRoles(userData.roles);
      
      const extracted = userData.roles.flatMap(role =>
        role.permissions?.map(p => p.name) || []
      );
      setPermissions(extracted);
      console.log("Permissions updated:", extracted);
    } else {
      resetPermissions();
    }
  }, [resetPermissions]);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Listen for storage changes (when user logs in/out in another tab or after login)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          // User data was updated
          loadPermissions();
        } else {
          // User data was removed (logout)
          resetPermissions();
        }
      }
    };

    // Listen for custom events (for same-tab login/logout)
    const handleUserChange = (e) => {
      if (e.detail?.type === 'login') {
        updatePermissions(e.detail.userData);
      } else if (e.detail?.type === 'logout') {
        resetPermissions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChange', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChange', handleUserChange);
    };
  }, [loadPermissions, resetPermissions, updatePermissions]);

  const value = {
    roles,
    permissions,
    resetPermissions,
    updatePermissions,
    loadPermissions
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// ✅ custom hook
export const useRoles = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('useRoles must be used within a PermissionProvider');
  }
  return context;
};
