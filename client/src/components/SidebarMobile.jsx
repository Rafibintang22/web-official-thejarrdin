import { Button, ConfigProvider, Menu, Modal } from "antd";
import { multiRoleAkses } from "../models/menuRoleAkses";
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toogleSidebarMobile from "../utils/toogleSidebarMobile";

function SidebarMobile() {
    const navigate = useNavigate();
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const dataUser = userSession?.dataUser;
    const [rolesUser, setRolesUser] = useState([]);
    const [isLogout, setLogout] = useState(false);
    useEffect(() => {
        const transformedRole = () => {
            const transformedData = dataUser?.Role.map((data) => data.Nama.replace(/\s+/g, "")); // Menghapus semua spasi);
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

    const { isSidebarMobileOpen, setIsSidebarMobileOpen } = toogleSidebarMobile();
    const toggleisSidebarMobileOpen = () => {
        setIsSidebarMobileOpen(isSidebarMobileOpen);
    };

    console.log(isSidebarMobileOpen, "SIDEBARMOBILE");

    return (
        <div className="sidebar-mobile h-100 pt-3 pb-3 d-flex flex-column justify-content-between gap-3 w-100">
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: "#FFFFFF",
                        controlItemBgActive: "#F1F6F2",
                    },
                }}
            >
                <div className="head-sidebar ps-4 pe-3 d-flex flex-column gap-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column text-dark">
                            <p>Selamat datang,</p>
                            <p className="fw-semibold">{dataUser?.Nama}</p>
                        </div>
                        <Button type="primary" onClick={toggleisSidebarMobileOpen}>
                            {isSidebarMobileOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </div>
                </div>
                <Menu
                    className="h-100 d-flex flex-column gap-3"
                    mode="inline"
                    theme="light"
                    inlineisSidebarOpen={isSidebarMobileOpen}
                    items={itemsMenu}
                    defaultSelectedKeys={[window.location.pathname]}
                    onClick={({ key }) => {
                        toggleisSidebarMobileOpen();
                        navigate(key);
                    }}
                />
                <Button
                    className="ms-4 me-3"
                    type="primary"
                    danger
                    ghost
                    onClick={() => setLogout(true)}
                >
                    <LogoutOutlined />
                    Keluar
                </Button>{" "}
            </ConfigProvider>
            <Modal
                title="Apakah anda yakin untuk keluar?"
                open={isLogout}
                onCancel={() => setLogout(false)}
                onOk={() => navigate("/logout")}
                okText="Iya"
                cancelText="Tidak"
                okType="danger"
                centered
            ></Modal>
        </div>
    );
}

export default SidebarMobile;
