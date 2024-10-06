import { Button } from "antd";
import ChooseDate from "./ChooseDate";
// import SelectComp from "./SelectComp";

// eslint-disable-next-line react/prop-types
function FilterTable({ isInsert, nameInsert, setInsertBtn, range, setRange }) {
  return (
    <div className="filter-content w-100 d-flex justify-content-end p-4 gap-3">
      {/* <SelectComp value={currSort} handleChange={handleSort} /> */}
      <ChooseDate range={range} setRange={setRange} />

      {isInsert && (
        <Button
          className="filter-item btn-insert d-none"
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
