import Column from "antd/es/table/Column";
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

function PengumumanPengelola() {
  UseSessionCheck();
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const [dataTable, setDataTable] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");
  const menuInsert = [
    {
      label: "Untuk saya",
      key: "untukSaya",
    },
    {
      label: "Data diunggah",
      key: "dataDiunggah",
    },
  ];

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
          `${urlServer}/data/${Fitur["PengumumanPengelola"]}/${
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
            judul={"Data Pengumuman Pengelola"}
            isInsert={true}
            nameInsert={"Tambah Pengumuman Pengelola"}
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
            <Table dataSource={dataTable} columns={columns} />
          </div>
        </div>
      </div>
      {modalInsert && (
        <ModalInsert
          currState={modalInsert}
          setState={setModalInsert}
          judulInsert={"Tambah Pengumuman Pengelola"}
        />
      )}
    </>
  );
}

export default PengumumanPengelola;
