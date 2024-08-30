import Line from "../components/Line";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
// eslint-disable-next-line react/prop-types
function HeaderKonten({ judul, isInsert, nameInsert }) {
  return (
    <div className="container-header-content d-flex flex-column w-100">
      <div className="header-content w-100 d-flex justify-content-between align-items-center p-4 bg-light">
        <h5>{judul}</h5>
        <div className={`d-flex gap-3 ${isInsert ? "w-50" : "w-25"}`}>
          <Input placeholder="Cari.." prefix={<SearchOutlined />} />
          {isInsert && <Button type="primary">{nameInsert}</Button>}
        </div>
      </div>
      <Line bgColour={"#ACACAC"} width={100} />
    </div>
  );
}

export default HeaderKonten;
