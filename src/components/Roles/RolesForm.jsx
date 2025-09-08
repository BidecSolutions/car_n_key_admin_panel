import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Divider, message } from "antd";
import { permissionsAPI } from "../../services/api";

const actions = ["create", "list", "edit", "delete"]; // ✅ Actions list

const RolesForm = ({ visible, onCancel, onSubmit, initialValues = null, loading }) => {
  const [form] = Form.useForm();
  const [permissionsData, setPermissionsData] = useState([]);
  const [fetching, setFetching] = useState(false);

  // ✅ Group data by module
  const groupData = (data) => {
      console.log("Fetched initialValues:", initialValues);

    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.module_name]) grouped[item.module_name] = [];
      grouped[item.module_name].push(item);
    });
    return grouped;
  };

  const fetchPermissions = async () => {
    try {
      setFetching(true);
      const response = await permissionsAPI.getAll();

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      console.log("Fetched permissions:", data);
      setPermissionsData(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      message.error("Failed to fetch permissions. Please try again.");
      setPermissionsData([]);
    } finally {
      setFetching(false);
    }
  };

 useEffect(() => {
  if (visible) {
    fetchPermissions();

    if (initialValues) {
      const permMap = {};

      (initialValues.permissions || []).forEach((p) => {
        
        const [module, action] = p.name.split(".");
        const moduleName = p.module_name || module;
        if (!permMap[moduleName]) permMap[moduleName] = {};
        permMap[moduleName][action.toLowerCase()] = true;
      });

      form.setFieldsValue({
        name: initialValues.name,
        permissions: permMap,
      });

      console.log("Mapped Permissions for Form:", permMap);
    } else {
      form.resetFields();
    }
  }
}, [visible, initialValues, form]);


 const handleSubmit = (values) => {
  const selectedPermissions = [];

  Object.keys(values.permissions || {}).forEach((module) => {
    Object.keys(values.permissions[module] || {}).forEach((action) => {
      if (values.permissions[module][action]) {
        
        selectedPermissions.push(`${module.toLowerCase()}.${action.toLowerCase()}`);
      }
    });
  });

  const payload = {
    name: values.name,
    permissions: selectedPermissions,
  };

  console.log("Final Payload:", payload);
  onSubmit(payload);
  form.resetFields();
  onCancel();
};



  const handleSelectAll = (module, checked) => {
    const currentValues = form.getFieldsValue();
    const newPermissions = { ...currentValues.permissions };

    if (!newPermissions[module]) newPermissions[module] = {};

    actions.forEach((action) => {
      newPermissions[module][action] = checked;
    });
    console.log("newPermissions" , newPermissions);
    

    form.setFieldsValue({ permissions: newPermissions });
  };

  const groupedModules = groupData(permissionsData);

  return (
    <div className="flex justify-center items-start min-h-screen pt-0">
      <div className="bg-white rounded-xl w-full max-w-7xl">
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={handleSubmit}
          initialValues={{ name: "", permissions: {} }}
          className="space-y-6"
        >
          {/* Role Name */}
          <Form.Item
            name="name"
            label={<span className="text-lg font-medium">Role Name</span>}
            rules={[
              { required: true, message: "Please enter role name" },
              { min: 2, message: "Role name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="Enter role name"
              className="h-12 text-lg"
              style={{ width: "70%" }}
            />
          </Form.Item>

          <Divider>Permissions</Divider>

          {/* Scrollable container */}
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #f0f0f0",
              padding: "8px",
            }}
          >
            
            <Row style={{ fontWeight: "bold", paddingBottom: 8 }}>
              <Col span={4}>Permission</Col>
              <Col span={2} style={{ textAlign: "center" }}>
                Select All
              </Col>
              {actions.map((action) => (
                <Col key={action} span={3} style={{ textAlign: "center" }}>
                  {action}
                </Col>
              ))}
            </Row>

            
            {Object.keys(groupedModules).map((module) => (
              <React.Fragment key={module}>
                {/* Module Header */}
                <Row
                  style={{
                    fontWeight: "bold",
                    background: "#f0f0f0",
                    padding: "6px 0",
                    fontSize: "16px",
                  }}
                >
                  <Col span={24}>{module}</Col>
                </Row>

                {/* Permissions */}
                <Row style={{ padding: "10px 0", fontSize: "15px" }}>
                  <Col span={4}>{module} Permissions</Col>
                  <Col span={2} style={{ textAlign: "center" }}>
                    <Checkbox
                      onChange={(e) => handleSelectAll(module, e.target.checked)}
                      className="scale-125"
                    />
                  </Col>

                  {actions.map((action) => (
                    <Col key={action.trim()} span={3} style={{ textAlign: "center" }}>
                      <Form.Item
                        name={["permissions", module, action.trim().toLowerCase()]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox className="scale-125" />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </React.Fragment>
            ))}
          </div>

          {/* Footer Buttons */}
          <Form.Item
            wrapperCol={{ offset: 4, span: 20 }}
            style={{ textAlign: "right", marginTop: 16 }}
          >
            <Button onClick={onCancel} style={{ marginRight: 12 }} size="large">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {initialValues ? "Update Role" : "Add Role"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RolesForm;
