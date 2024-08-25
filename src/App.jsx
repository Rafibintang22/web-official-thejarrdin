import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import Home from "./pages/Home";
import Laporan from "./pages/Laporan";
import MasukanAspirasi from "./pages/MasukanAspirasi";
import Pengumuman from "./pages/Pengumuman";
import TagihanBulanan from "./pages/TagihanBulanan";
import PengumumanPengelola from "./pages/PengumumanPengelola";
import InformasiPaket from "./pages/InformasiPaket";
import BuletinKegiatan from "./pages/BuletinKegiatan";

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
