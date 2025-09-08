import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { UserOutlined, ExperimentOutlined, CalendarOutlined } from '@ant-design/icons';
import { doctorsAPI, testsAPI, usersAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalTests: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch doctors and tests data
        const [doctorsResponse, testsResponse , totalAdmins] = await Promise.all([
          doctorsAPI.getAll(),
          testsAPI.getAll(),
          usersAPI.getAll()
        ]);

        setStats({
          totalDoctors: doctorsResponse.data?.data?.length || 0,
          totalTests: testsResponse.data?.data?.length || 0,
          totalAdmins: totalAdmins.data?.data?.length || 0, // Placeholder for now
        });
        // console.log(stats.totalTests);
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values on error
        setStats({
          totalDoctors: 0,
          totalTests: 0,
          totalAdmins: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard Overview</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Doctors"
              value={stats.totalDoctors}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Tests"
              value={stats.totalTests}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Users"
              value={stats.totalAdmins}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

     <Row
      justify="center" // ✅ Center horizontally
      style={{ marginTop: 40 }}
    >
      <Col xs={24} sm={20} md={16} lg={12} xl={10}> 
        <Card
          title="Quick Actions"
          size="small"
          bordered={false}
          style={{
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)", // ✅ Professional shadow
          }}
        >
          <p style={{ fontSize: "15px", marginBottom: "8px" }}>
            Welcome to <b>CAR-N-KEY Admin Panel</b>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.65)" }}>
            Use the sidebar navigation.
          </p>
        </Card>
      </Col>
    </Row>
    </div>
  );
};

export default Dashboard; 