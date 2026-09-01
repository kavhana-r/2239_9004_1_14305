import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { DashboardOutlined, TransactionOutlined, WalletOutlined, TrophyOutlined, TeamOutlined, DollarOutlined, TagsOutlined, BarChartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';

const { Sider, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = String(user?.role || '').toUpperCase().includes('ADMIN');

  const userItems = [
    { key:'/dashboard', icon:<DashboardOutlined />, label:<Link to="/dashboard">Dashboard</Link> },
    { key:'/transactions', icon:<TransactionOutlined />, label:<Link to="/transactions">Transactions</Link> },
    { key:'/budgets', icon:<WalletOutlined />, label:<Link to="/budgets">Budgets</Link> },
    { key:'/goals', icon:<TrophyOutlined />, label:<Link to="/goals">Goals</Link> },
  ];
  const adminItems = [
    { key:'/admin/stats', icon:<BarChartOutlined />, label:<Link to="/admin/stats">Admin Stats</Link> },
    { key:'/admin/users', icon:<TeamOutlined />, label:<Link to="/admin/users">User Management</Link> },
    { key:'/admin/currencies', icon:<DollarOutlined />, label:<Link to="/admin/currencies">Currency Management</Link> },
    { key:'/admin/categories', icon:<TagsOutlined />, label:<Link to="/admin/categories">Category Management</Link> },
  ];

  return (
    <div className="app-shell">
      <Navbar />
      <Layout style={{minHeight:'calc(100vh - 64px)'}}>
        <Sider breakpoint="lg" collapsedWidth="0" theme="light">
          <div style={{height:24}} />
          <Menu mode="inline" selectedKeys={[location.pathname]} items={isAdmin ? [...userItems,...adminItems] : userItems} />
        </Sider>
        <Content><div className="page-content"><Outlet /></div></Content>
      </Layout>
    </div>
  );
}
