import { Button } from "antd";
import ChooseDate from "./ChooseDate";
import SelectComp from "./SelectComp";

function FilterTable({ isInsert, nameInsert, setInsertBtn }) {
  return (
    <div className="filter-content w-100 d-flex justify-content-end p-4 gap-3">
      <SelectComp />
      <ChooseDate />

      {isInsert && (
        <Button
          className="filter-item btn-insert"
          type="primary"
          onClick={() => setInsertBtn(true)}
        >
          {nameInsert}
        </Button>
      )}
    </div>
  );
}

export default FilterTable;
