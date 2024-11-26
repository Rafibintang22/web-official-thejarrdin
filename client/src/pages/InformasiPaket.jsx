import HeaderKonten from "../components/HeaderKonten";
import Sidebar from "../components/Sidebar";
import { Menu, Table } from "antd";
import FilterTable from "../components/Filter/FilterTable";
import ModalInsert from "../components/ModalInsert";
import { useEffect, useState } from "react";
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
import { formatDate } from "../utils/formatDate";
import { addDays, addYears } from "date-fns";

function InformasiPaket() {
  UseSessionCheck();
  // Date state for one year range
  const [range, setRange] = useState([
    {
      startDate: addYears(new Date(), -1), // One year ago from today
      endDate: addDays(new Date(), 1), // Tomorrow's date
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Informasi Paket";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengelola } = HakAkses();
  const { isSidebarMobileOpen } = toogleSidebarMobile();
  const menuInsert = [
    {
      label: "Untuk saya",
      key: "untukSaya",
    },
  ];
  // Jika hasPengelola true, tambahkan "Data diunggah" ke dalam menu
  if (hasPengelola) {
    menuInsert.push({
      label: "Data diunggah",
      key: "dataDiunggah",
    });
  }

  const [searchValue, setSearchValue] = useState("");
  const [filteredDataTable, setFilteredDataTable] = useState([]);
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
          `${urlServer}/data/${Fitur["InformasiPaket"]}/${
            currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
          }/${range[0].startDate.getTime()}/${range[0].endDate.getTime()}`,
          headers
        );
        const transformedData = response.data.map((data) => ({
          ...data,
          TglDibuat: formatDate(data.TglDibuat),
        }));
        setDataTable(transformedData);
        setPagination((prev) => ({
          ...prev,
          total: response.data.length,
        }));
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currTipeData, range]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    const searchTerm = value.toLowerCase();
    const filtered = dataTable.filter(
      (item) =>
        item.Judul.toLowerCase().includes(searchTerm) ||
        item.DibuatOleh.toLowerCase().includes(searchTerm)
    );
    setFilteredDataTable(filtered);
  };

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
                judul={"Data Informasi Paket"}
                isInsert={hasPengelola ? true : false}
                nameInsert={"Tambah Informasi Paket"}
                setInsertBtn={setModalInsert}
                searchValue={searchValue}
                onChangeSearch={handleSearch}
              />
              <FilterTable
                isInsert={hasPengelola ? true : false}
                nameInsert={"Tambah Informasi Paket"}
                setInsertBtn={setModalInsert}
                range={range}
                setRange={setRange}
                searchValue={searchValue}
                onChangeSearch={handleSearch}
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
                  dataSource={
                    searchValue === "" || null || undefined ? dataTable : filteredDataTable
                  }
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
              judulInsert={"Tambah Informasi Paket"}
            />
          )}

          {isDetailOpen === "Informasi Paket" && (
            <ModalDetail judulDetail={"Detail Informasi Paket"} />
          )}
        </>
      )}
      {isSidebarMobileOpen && <SidebarMobile />}
    </>
  );
}

export default InformasiPaket;
