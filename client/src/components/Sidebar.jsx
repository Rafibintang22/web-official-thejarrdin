import { Button, ConfigProvider, Menu } from "antd";
import { multiRoleAkses } from "../models/menuRoleAkses";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import toogleSidebar from "../utils/toogleSidebar";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const dataUser = userSession?.dataUser;
  const [rolesUser, setRolesUser] = useState([]);
  useEffect(() => {
    const transformedRole = () => {
      const transformedData = dataUser.Role.map((data) => data.Nama.replace(/\s+/g, "")); // Menghapus semua spasi);
      const arr = multiRoleAkses(transformedData);

      setRolesUser(arr);
    };

    transformedRole();
  }, []);

  const itemsMenu = rolesUser.map((item) => ({
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

  const { isSidebarOpen, setIsSidebarOpen } = toogleSidebar();
  const toggleisSidebarOpen = () => {
    setIsSidebarOpen(isSidebarOpen);
  };

  return (
    <div
      className="sidebar h-100 pt-3 pb-3 d-flex flex-column justify-content-between gap-3"
      style={{ width: isSidebarOpen ? "80px" : "20%", backgroundColor: "#F1F6F2" }}
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
            {!isSidebarOpen && (
              <div className="d-flex flex-column">
                <p>Selamat datang,</p>
                <p className="fw-semibold">{dataUser?.Nama}</p>
              </div>
            )}
            <Button type="primary" onClick={toggleisSidebarOpen}>
              {isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
        </div>

        <Menu
          className="h-100 d-flex flex-column gap-3"
          mode="inline"
          theme="light"
          inlineisSidebarOpen={isSidebarOpen}
          items={itemsMenu}
          defaultSelectedKeys={[window.location.pathname]}
          onClick={({ key }) => {
            navigate(key);
          }}
        />

        <Button
          className="ms-4 me-3"
          type="primary"
          danger
          ghost
          onClick={() => navigate("/logout")}
        >
          <LogoutOutlined />
          {!isSidebarOpen && "Keluar"}
        </Button>
      </ConfigProvider>
    </div>
  );
}

export default Sidebar;
