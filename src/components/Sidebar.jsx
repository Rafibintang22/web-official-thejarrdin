import { Button, ConfigProvider, Menu } from "antd";
import { multiRoleAkses } from "../models/menuRoleAkses";
import { useState } from "react";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

function Sidebar() {
  const rolesUser = ["Pengurus", "Pengelola", "PemilikUnit"];
  const arr = multiRoleAkses(rolesUser);
  const itemsMenu = arr.map((item) => ({
    label: item.label,
    key: item.key,
    icon: <img src={item.icon} width={25} height={25} />,
  }));

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className="sidebar h-100 pt-5 pb-3 d-flex flex-column justify-content-between"
      style={{ width: collapsed ? "80px" : "20%", backgroundColor: "#F1F6F2" }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#F1F6F2",
            controlItemBgActive: "#ffffff",
          },
          components: {
            Menu: {
              itemPaddingInline: 100,
            },
          },
        }}
      >
        <div className="head-sidebar ps-4 pe-3 d-flex justify-content-between">
          {!collapsed && <p className="fw-semibold">Selamat datang, Rafi</p>}
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{
              marginBottom: 16,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>

        <Menu
          className="h-100"
          defaultSelectedKeys={["laporan"]}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={itemsMenu}
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
