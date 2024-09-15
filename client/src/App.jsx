import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import {
  Home,
  Laporan,
  MasukanAspirasi,
  Pengumuman,
  TagihanBulanan,
  PengumumanPengelola,
  InformasiPaket,
  BuletinKegiatan,
  Login,
  Logout,
} from "./pages/index";

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
            <Route path="/laporan" element={<Laporan />}></Route>
            <Route path="/masukan&Aspirasi" element={<MasukanAspirasi />}></Route>
            <Route path="/pengumuman" element={<Pengumuman />}></Route>
            <Route path="/tagihanbulanan" element={<TagihanBulanan />}></Route>
            <Route path="/pengumumanpengelola" element={<PengumumanPengelola />}></Route>
            <Route path="/informasipaket" element={<InformasiPaket />}></Route>
            <Route path="/buletinkegiatan" element={<BuletinKegiatan />}></Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
