import React, { useState } from "react";
import { Card, Tag, Collapse, Button, Divider } from "antd";
import { useRoles } from "../../Context/PermissionsContext";

const { Panel } = Collapse;

const PermissionDebugger = () => {
  const { permissions } = useRoles();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Button 
          type="primary" 
          size="small"
          onClick={() => setIsVisible(true)}
        >
          🔐 Debug Permissions
        </Button>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      width: 350, 
      maxHeight: '60vh',
      overflow: 'auto',
      zIndex: 1000 
    }}>
      <Card 
        title="Permission Debugger" 
        size="small"
        extra={
          <Button size="small" onClick={() => setIsVisible(false)}>
            ✕
          </Button>
        }
      >
        <Collapse size="small">
          <Panel header={`Current Permissions (${permissions?.length || 0})`} key="permissions">
            <div style={{ maxHeight: 150, overflow: 'auto' }}>
              {permissions && permissions.length > 0 ? (
                permissions.map((permission, index) => (
                  <Tag key={index} style={{ margin: 2, fontSize: '10px' }}>
                    {permission}
                  </Tag>
                ))
              ) : (
                <Tag color="red">No permissions found</Tag>
              )}
            </div>
          </Panel>
        </Collapse>

        <Divider style={{ margin: '8px 0' }} />
        
        <div style={{ fontSize: '10px', color: '#999' }}>
          💡 Development mode only
        </div>
      </Card>
    </div>
  );
};

export default PermissionDebugger; 