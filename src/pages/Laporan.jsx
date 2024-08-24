import Column from "antd/es/table/Column";
import HeaderKonten from "../components/HeaderKonten";
import Line from "../components/Line";
import Sidebar from "../components/Sidebar";
import { DatePicker, Select, Table } from "antd";
const { RangePicker } = DatePicker;

function Laporan() {
  const optionFilter = [
    { value: "Judul", label: "Judul" },
    { value: "Dibuat oleh", label: "Dibuat oleh" },
    { value: "Tanggal", label: "Tanggal" },
  ];
  return (
    <div className="container-laporan w-100 d-flex">
      <Sidebar />
      <div className="container-content w-100 h-100 d-flex flex-column bg-light">
        <HeaderKonten judul={"Data Laporan"} isInsert={true} nameInsert={"Tambah Data Laporan"} />
        <div className="filter-content w-100 d-flex justify-content-end p-4 gap-3">
          <Select placeholder={"Sort: Berdasarkan"} style={{ width: 200 }} options={optionFilter} />
          <RangePicker />
        </div>
        <div className="tipeData-content w-100 d-flex justify-content-start ps-4 p-3 gap-4">
          <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
            <p>Untuk saya</p>
            <Line bgColour={"black"} width={100} />
          </div>
          <div className="d-flex flex-column" style={{ cursor: "pointer" }}>
            <p>Data diunggah</p>
            {/* <Line bgColour={"black"} width={100} /> */}
          </div>
        </div>

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
  );
}

export default Laporan;
