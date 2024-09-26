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
import ModalInsertAspirasi from "../components/ModalInsertAspirasi";

function MasukanAspirasi() {
  UseSessionCheck();
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const fieldDetail = "Aspirasi";
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { hasPengurus, hasPemilikUnit } = HakAkses();
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
  const [dataTable, setDataTable] = useState(null);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(
          `${urlServer}/data/${Fitur["Aspirasi"]}/${
            currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
          }`,
          headers
        );
        console.log(response);
        setDataTable(response.data);
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
            judul={"Data Masukan & Aspirasi"}
            isInsert={hasPengurus || hasPemilikUnit ? true : false}
            nameInsert={"Tambah Masukan & Aspirasi"}
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
              loading={dataTable ? false : true}
              dataSource={dataTable}
              columns={columns(fieldDetail, setDetailOpen)}
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

      {isDetailOpen === "Aspirasi" && <ModalDetail judulDetail={"Detail Masukan & Aspirasi"} />}
    </>
  );
}

export default MasukanAspirasi;
