import Column from "antd/es/table/Column";
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
import useDataUser from "../constaints/dataLoginUser";
import { columns } from "../constaints/columnsTable";

function TagihanBulanan() {
  UseSessionCheck();
  const { headers } = useDataUser();
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
      try {
        const response = await axios.get(`${urlServer}/data/${Fitur["TagihanBulanan"]}`, headers);
        console.log(response);
        setDataTable(response.data);
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
            judul={"Data Tagihan Bulanan"}
            isInsert={true}
            nameInsert={"Tambah Tagihan Bulanan"}
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
            <Table dataSource={dataTable} columns={columns}>
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
        judulInsert={"Tambah Tagihan Bulanan"}
      />
    </>
  );
}

export default TagihanBulanan;
