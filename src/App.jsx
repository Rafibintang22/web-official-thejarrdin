import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import Home from "./pages/Home";
import Laporan from "./pages/Laporan";

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
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
