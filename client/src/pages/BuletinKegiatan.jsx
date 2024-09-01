import Column from "antd/es/table/Column";
import HeaderKonten from "../components/HeaderKonten";
import Sidebar from "../components/Sidebar";
import { Menu, Table } from "antd";
import FilterTable from "../components/Filter/FilterTable";
import ModalInsert from "../components/ModalInsert";
import { useState } from "react";

function BuletinKegiatan() {
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
  return (
    <>
      <div className="container-main w-100 d-flex">
        <Sidebar />
        <div className="container-content w-100 h-100 d-flex flex-column bg-light">
          <HeaderKonten
            judul={"Data Buletin Kegiatan"}
            isInsert={true}
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
        judulInsert={"Tambah Buletin Kegiatan"}
      />
    </>
  );
}

export default BuletinKegiatan;
