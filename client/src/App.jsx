import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Home, DataFitur, Login, Logout } from "./pages/index";

function App() {
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
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/laporan" element={<DataFitur active={"Laporan"} />}></Route>
            {/* <Route path="/laporantest" element={<DataFitur />}></Route> */}
            <Route
              path="/masukan&aspirasi"
              element={<DataFitur active={"Masukan & Aspirasi"} />}
            ></Route>
            <Route path="/pengumuman" element={<DataFitur active={"Pengumuman"} />}></Route>
            <Route
              path="/tagihanbulanan"
              element={<DataFitur active={"Tagihan Bulanan"} />}
            ></Route>
            <Route
              path="/pengumumanpengelola"
              element={<DataFitur active={"Pengumuman Pengelola"} />}
            ></Route>
            <Route
              path="/informasipaket"
              element={<DataFitur active={"Informasi Paket"} />}
            ></Route>
            <Route
              path="/buletinkegiatan"
              element={<DataFitur active={"Buletin Kegiatan"} />}
            ></Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
