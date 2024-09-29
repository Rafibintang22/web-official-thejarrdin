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

function Pengumuman() {
  UseSessionCheck();
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Pengumuman";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengurus } = HakAkses();

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

  useEffect(() => {
    fetchData();
  }, [
    currTipeData,
    // pagination.current,
    // pagination.pageSize
  ]);

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
      <div className="container-main w-100 d-flex">
        <Sidebar />
        <div className="container-content w-100 h-100 d-flex flex-column bg-light">
          <HeaderKonten
            judul={"Data Pengumuman"}
            isInsert={hasPengurus}
            nameInsert={"Tambah Pengumuman"}
            setInsertBtn={setModalInsert}
          />
          <FilterTable />
          <Menu
            onClick={(e) => setCurrTipeData(e.key)}
            selectedKeys={[currTipeData]}
            mode="horizontal"
            items={menuInsert}
            className="d-flex w-100 justify-content-start"
          />

          <div className="w-100 p-4">
            <Table
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
  );
}

export default Pengumuman;
