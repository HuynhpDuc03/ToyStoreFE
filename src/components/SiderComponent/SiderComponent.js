import React from 'react'
// import Sider from "antd/es/layout/Sider";
import { Layout,Menu } from 'antd';
import { BarChartOutlined, DollarOutlined, LogoutOutlined, ProductOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as UserService from '../../../src/services/UserService';
import { resetUser } from '../../redux/userSlide';

const { Sider } = Layout;

const SiderComponent = ({collapsed,user,selectKey}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleLogout = async () => {
        await UserService.logoutUser()
        dispatch(resetUser())
        navigate('/SignIn')
    }
  return (
    <Sider  style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        
      }} trigger={null} breakpoint="lg" collapsible collapsed={collapsed}>
      <p className="mt-3" style={{textAlign:"center", fontSize:"18px", color: "#fff", textTransform:"capitalize"}}>
        {user?.name}
      </p>
    
      <Menu
        theme="dark"
        mode="inline"
        className="mt-3"
        defaultSelectedKeys={[selectKey]}
        items={[
          {
            key: "1",
            icon: <BarChartOutlined />,
            label: <Link to="/Dashboard">Trang chủ</Link>,
          },
          {
            key: "2",
            icon: <ProductOutlined />,
            label: <Link to="/AdminProduct">Quản lý Sản Phẩm</Link>,
          },
          {
            key: "3",
            icon: <DollarOutlined />,
            label: <Link to="/AdminOrder">Quản Lý Đơn Hàng</Link>,
          },
          {
            key: "4",
            icon: <UserOutlined />,
            label: <Link to="/AdminUser">Quản Lý Người Dùng</Link>,
          },
          {
            key: "5",
            icon: <TagsOutlined />,
            label: <Link to="/AdminCoupon">Quản Lý Giảm Giá</Link>,
          },
        ]}
      />
       <Menu
        theme="dark"
        mode="inline"
        style={{ position: "absolute", bottom: 0, width: "100%" }}
      >
        <Menu.Item key="5" icon={<LogoutOutlined />}>
          <Link onClick={(e) => {e.preventDefault();handleLogout();}}>Đăng xuất</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default SiderComponent
