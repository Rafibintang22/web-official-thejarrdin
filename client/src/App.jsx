import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Home, DataFitur, Login, Logout } from "./pages/index";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const dataUser = userSession?.dataUser;
    console.log(dataUser);

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#399051",
                        colorBorder: "#E0E0E0",
                    },

                    components: {
                        Select: {
                            colorText: "#000000",
                        },
                    },
                }}
            >
                <Router>
                    <Routes>
                        <Route path="*" element={<Navigate to="/" replace />} />
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>
                        <Route
                            path="/laporan"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Laporan"} />}
                                    allowedRoles={["Pengurus", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/masukan&aspirasi"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Masukan & Aspirasi"} />}
                                    allowedRoles={["Pengurus", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/pengumuman"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Pengumuman"} />}
                                    allowedRoles={["Pengurus", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/tagihanbulanan"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Tagihan Bulanan"} />}
                                    allowedRoles={["Pengelola", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/pengumumanpengelola"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Pengumuman Pengelola"} />}
                                    allowedRoles={["Pengelola", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/informasipaket"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Informasi Paket"} />}
                                    allowedRoles={["Pengelola", "Pemilik Unit"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/buletinkegiatan"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Buletin Kegiatan"} />}
                                    allowedRoles={["Pengelola", "Pemilik Unit", "Pelaku Komersil"]}
                                />
                            }
                        ></Route>
                        <Route
                            path="/daftarpengguna"
                            element={
                                <ProtectedRoute
                                    element={<DataFitur active={"Pengguna"} />}
                                    allowedRoles={["Admin"]}
                                />
                            }
                        ></Route>
                    </Routes>
                </Router>
            </ConfigProvider>
        </>
    );
}

export default App;
