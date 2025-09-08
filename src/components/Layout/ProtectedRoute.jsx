import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import { useRoles } from "../../Context/PermissionsContext";

const ProtectedRoute = ({ 
  permissions = [], // Array of permission patterns to check
  requireAll = false, // If true, user must have ALL permissions. If false, user needs ANY permission
  children 
}) => {
  const { permissions: userPermissions } = useRoles();
  const navigate = useNavigate();
  
  console.log('userPermissions', userPermissions);
  
  // If no permissions are specified, allow access (for dashboard, etc.)
  if (!permissions || permissions.length === 0) {
    return children;
  }

  // Helper function to check if user has a permission pattern
  const hasPermissionPattern = (pattern) => {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    const matchingPermissions = userPermissions.filter(permission => permission.startsWith(pattern));
    
    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Checking pattern "${pattern}":`, {
        userPermissions,
        matchingPermissions,
        hasAccess: matchingPermissions.length > 0
      });
    }
    
    return matchingPermissions.length > 0;
  };

  // Check permissions based on requireAll flag
  const hasAccess = requireAll 
    ? permissions.every(hasPermissionPattern)
    : permissions.some(hasPermissionPattern);

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('ProtectedRoute access check:', {
      requiredPermissions: permissions,
      userPermissions,
      requireAll,
      hasAccess
    });
  }

  if (!hasAccess) {
    return (
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle={
          <div>
            <p>Sorry, you don't have permission to access this page.</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Required permissions: {permissions.join(', ')}
            </p>
          </div>
        }
        extra={[
          <Button 
            key="back"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>,
          <Button 
            key="dashboard"
            type="primary" 
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </Button>
        ]}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
