import HeaderKonten from "../components/HeaderKonten";
import Sidebar from "../components/Sidebar";
import { Menu, Table } from "antd";
import FilterTable from "../components/Filter/FilterTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import UseSessionCheck from "../utils/useSessionCheck";
import columns from "../constaints/columnsTable";
import DetailDataController from "../utils/detailDataController";
import HakAkses from "../utils/hakAkses";
import ModalInsertAspirasi from "../components/ModalInsertAspirasi";
import ModalDetailAspirasi from "../components/ModalDetailAspirasi";
import toogleSidebarMobile from "../utils/toogleSidebarMobile";
import SidebarMobile from "../components/SidebarMobile";

function MasukanAspirasi() {
  UseSessionCheck();
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Aspirasi";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengurus, hasPemilikUnit } = HakAkses();
  const { isSidebarMobileOpen } = toogleSidebarMobile();
  const menuInsert = [
    {
      label: "Untuk saya",
      key: "untukSaya",
    },
  ];
  // Jika hasPengurus true ATAU hasPemilikUnit, tambahkan "Data diunggah" ke dalam menu
  if (hasPengurus || hasPemilikUnit) {
    menuInsert.push({
      label: "Data diunggah",
      key: "dataDiunggah",
    });
  }
  const [dataTable, setDataTable] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(
          `${urlServer}/aspirasi/${currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"}`,
          headers
        );
        console.log(response);
        setDataTable(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currTipeData]);
  console.log(loading);

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
    // fetchData(); // Fetch data after changing pagination
  };
  return (
    <>
      {!isSidebarMobileOpen && (
        <>
          <div className="container-main w-100 d-flex">
            <Sidebar />
            <div className="container-content w-100 h-100 d-flex flex-column bg-light">
              <HeaderKonten
                judul={"Data Masukan & Aspirasi"}
                isInsert={hasPengurus || hasPemilikUnit ? true : false}
                nameInsert={"Tambah Masukan & Aspirasi"}
                setInsertBtn={setModalInsert}
              />
              <FilterTable
                isInsert={hasPengurus || hasPemilikUnit ? true : false}
                nameInsert={"Tambah Masukan & Aspirasi"}
                setInsertBtn={setModalInsert}
              />
              <Menu
                onClick={(e) => setCurrTipeData(e.key)}
                selectedKeys={[currTipeData]}
                mode="horizontal"
                items={menuInsert}
                className="d-flex w-100 justify-content-start"
              />

              <div className="w-100 p-4">
                <Table
                  scroll={{ x: "max-content" }}
                  loading={loading}
                  dataSource={dataTable}
                  onChange={handleTableChange}
                  pagination={pagination}
                  columns={columns(fieldDetail, setDetailOpen, currTipeData)}
                />
              </div>
            </div>
          </div>
          {modalInsert && (
            <ModalInsertAspirasi
              currState={modalInsert}
              setState={setModalInsert}
              judulInsert={"Tambah Masukan & Aspirasi"}
            />
          )}

          {isDetailOpen === "Aspirasi" && (
            <ModalDetailAspirasi
              judulDetail={"Detail Masukan & Aspirasi"}
              tipeDetail={currTipeData}
            />
          )}
        </>
      )}
      {isSidebarMobileOpen && <SidebarMobile />}
    </>
  );
}

export default MasukanAspirasi;
