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

function BuletinKegiatan() {
  UseSessionCheck();
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "BuletinKegiatan";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengelola } = HakAkses();
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

  const [dataTable, setDataTable] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const headers = {
      headers: {
        authorization: userSession?.AuthKey,
      },
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${urlServer}/data/${Fitur["BuletinKegiatan"]}/${
            currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
          }`,
          headers
        );
        console.log(response);
        setDataTable(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currTipeData]);
  return (
    <>
      <div className="container-main w-100 d-flex">
        <Sidebar />
        <div className="container-content w-100 h-100 d-flex flex-column bg-light">
          <HeaderKonten
            judul={"Data Buletin Kegiatan"}
            isInsert={hasPengelola ? true : false}
            nameInsert={"Tambah Buletin Kegiatan"}
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
              columns={columns(fieldDetail, setDetailOpen)}
            />
          </div>
        </div>
      </div>
      {modalInsert && (
        <ModalInsert
          currState={modalInsert}
          setState={setModalInsert}
          judulInsert={"Tambah Buletin Kegiatan"}
        />
      )}

      {isDetailOpen === "BuletinKegiatan" && (
        <ModalDetail judulDetail={"Detail Buletin Kegiatan"} />
      )}
    </>
  );
}

export default BuletinKegiatan;
