import { Button, ConfigProvider, Menu } from "antd";
import { multiRoleAkses } from "../models/menuRoleAkses";
import { useState } from "react";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
useNavigate;

function Sidebar() {
  const navigate = useNavigate();
  const rolesUser = ["Pengurus", "Pengelola", "PemilikUnit"];
  const arr = multiRoleAkses(rolesUser);
  const itemsMenu = arr.map((item) => ({
    label: item.label,
    key: item.key,
    icon: <img src={item.icon} width={25} height={25} />,
  }));
  const newItem = {
    label: "Home",
    key: "/",
    icon: "https://img.icons8.com/ios/100/home--v1.png",
  };
  // Menambahkan item baru pada index awal
  itemsMenu.unshift({
    label: newItem.label,
    key: newItem.key,
    icon: <img src={newItem.icon} width={25} height={25} />,
  });

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className="sidebar h-100 pt-3 pb-3 d-flex flex-column justify-content-between gap-3"
      style={{ width: collapsed ? "80px" : "20%", backgroundColor: "#F1F6F2" }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#F1F6F2",
            controlItemBgActive: "#ffffff",
          },
        }}
      >
        <div className="head-sidebar ps-4 pe-3 d-flex flex-column gap-4">
          <div className="d-flex justify-content-between">
            {!collapsed && (
              <div className="d-flex flex-column">
                <p>Selamat datang,</p>
                <p className="fw-semibold">Rafi Bintang</p>
              </div>
            )}
            <Button type="primary" onClick={toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
        </div>

        <Menu
          className="h-100 d-flex flex-column gap-3"
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={itemsMenu}
          defaultSelectedKeys={[window.location.pathname]}
          onClick={({ key }) => {
            navigate(key);
          }}
        />

        <Button className="ms-4 me-3" type="primary" danger ghost>
          <LogoutOutlined />
          {!collapsed && "Keluar"}
        </Button>
      </ConfigProvider>
    </div>
  );
}

export default Sidebar;
