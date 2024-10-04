import HeaderKonten from "../components/HeaderKonten";
import Sidebar from "../components/Sidebar";
import { Menu, Table } from "antd";
import FilterTable from "../components/Filter/FilterTable";
import { useEffect, useState } from "react";
import ModalInsert from "../components/ModalInsert";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import { Fitur } from "../models/FiturModel";
import UseSessionCheck from "../utils/useSessionCheck";
import columns from "../constaints/columnsTable";
import DetailDataController from "../utils/detailDataController";
import ModalDetail from "../components/ModalDetail";
import HakAkses from "../utils/hakAkses";
import toogleSidebarMobile from "../utils/toogleSidebarMobile";
import SidebarMobile from "../components/SidebarMobile";
import { sortDataController, sortDataTable } from "../utils/filterTable";

function Laporan() {
  UseSessionCheck();
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Laporan";
  // console.log(isDetailOpen);
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengurus } = HakAkses();
  const { isSidebarMobileOpen } = toogleSidebarMobile();
  const { currSort, setCurrSort } = sortDataController();
  const menuInsert = [
    {
      label: "Untuk saya",
      key: "untukSaya",
    },
  ];
  // Jika hasPengurus true, tambahkan "Data diunggah" ke dalam menu
  if (hasPengurus) {
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
          `${urlServer}/data/${Fitur["Laporan"]}/${
            currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
          }`,
          headers
        );
        // console.log(response.data);
        setDataTable(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currTipeData]);

  const handleSortData = (event) => {
    const valueSort = event?.target?.value;
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
    }
    setLoading(false);
  };

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
                judul={"Data Laporan"}
                isInsert={hasPengurus ? true : false}
                nameInsert={"Tambah Data Laporan"}
                setInsertBtn={setModalInsert}
              />
              <FilterTable
                isInsert={hasPengurus ? true : false}
                nameInsert={"Tambah Data Laporan"}
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
              judulInsert={"Tambah Data Laporan"}
            />
          )}

          {isDetailOpen === "Laporan" && <ModalDetail judulDetail={"Detail Laporan"} />}
        </>
      )}
      {isSidebarMobileOpen && <SidebarMobile />}
    </>
  );
}

export default Laporan;
