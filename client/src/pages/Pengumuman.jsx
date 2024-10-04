import { useEffect, useState } from "react";
import { Menu, Table } from "antd";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import { Fitur } from "../models/FiturModel";
import UseSessionCheck from "../utils/useSessionCheck";
import columns from "../constaints/columnsTable";
import Sidebar from "../components/Sidebar";
import HeaderKonten from "../components/HeaderKonten";
import FilterTable from "../components/Filter/FilterTable";
import ModalInsert from "../components/ModalInsert";
import DetailDataController from "../utils/detailDataController";
import ModalDetail from "../components/ModalDetail";
import HakAkses from "../utils/hakAkses";
import toogleSidebarMobile from "../utils/toogleSidebarMobile";
import SidebarMobile from "../components/SidebarMobile";
import { sortDataTable, sortDataController } from "../utils/filterTable";

function Pengumuman() {
  UseSessionCheck();
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Pengumuman";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengurus, hasPelakuKomersil } = HakAkses();
  const { isSidebarMobileOpen } = toogleSidebarMobile();
  const { currSort, setCurrSort } = sortDataController();

  const menuInsert = [
    { label: "Untuk saya", key: "untukSaya" },
    ...(hasPengurus ? [{ label: "Data diunggah", key: "dataDiunggah" }] : []),
  ];

  const [dataTable, setDataTable] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  axios.defaults.withCredentials = true;

  const fetchData = async () => {
    setLoading(true);
    const headers = {
      headers: {
        authorization: userSession?.AuthKey,
      },
    };
    try {
      const response = await axios.get(
        `${urlServer}/data/${Fitur["Pengumuman"]}/${
          currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
        }`,
        headers
      );
      setDataTable(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.length,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortData = (event) => {
    const valueSort = event.target.value;
    setLoading(true);
    if (valueSort === "Judul") {
      setCurrSort(valueSort);
      setDataTable(sortDataTable(dataTable, "Judul", true)); // Sort by Judul ascending
    } else if (valueSort === "DibuatOleh") {
      setCurrSort(valueSort);
      setDataTable(sortDataTable(dataTable, "DibuatOleh", true)); // Sort by DibuatOleh ascending
    } else if (valueSort === "TglDibuat") {
      setCurrSort(valueSort);
      setDataTable(sortDataTable(dataTable, "TglDibuat", false)); // Sort by TglDibuat descending
    } else {
      fetchData();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [
    currTipeData,
    // pagination.current,
    // pagination.pageSize
  ]);

  // console.log(dataTable);

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
                judul={"Data Pengumuman"}
                isInsert={hasPengurus || hasPelakuKomersil}
                nameInsert={"Tambah Pengumuman"}
                setInsertBtn={setModalInsert}
              />
              <FilterTable
                isInsert={hasPengurus}
                nameInsert={"Tambah Pengumuman"}
                setInsertBtn={setModalInsert}
                currSort={currSort}
                handleSort={handleSortData}
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
                  columns={columns(fieldDetail, setDetailOpen)}
                />
              </div>
            </div>
          </div>
          {modalInsert && (
            <ModalInsert
              currState={modalInsert}
              setState={setModalInsert}
              judulInsert={"Tambah Pengumuman"}
            />
          )}
          {isDetailOpen === "Pengumuman" && <ModalDetail judulDetail={"Detail Pengumuman"} />}
        </>
      )}

      {isSidebarMobileOpen && <SidebarMobile />}
    </>
  );
}

export default Pengumuman;
