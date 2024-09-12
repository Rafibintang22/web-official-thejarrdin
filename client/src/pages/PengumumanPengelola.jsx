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

function PengumumanPengelola() {
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
      try {
        const response = await axios.get(`${urlServer}/data/${Fitur["PengumumanPengelola"]}`);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
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
            <Table>
              <Column title={"Judul"} />
              <Column title={"Dibuat oleh"} />
              <Column title={"Tanggal dibuat"} />
              <Column title={"Aksi"} />
            </Table>
          </div>
        </div>
      </div>
      <ModalInsert
        currState={modalInsert}
        setState={setModalInsert}
        judulInsert={"Tambah Pengumuman Pengelola"}
      />
    </>
  );
}

export default PengumumanPengelola;
