import ChooseDate from "./ChooseDate";
import SelectComp from "./SelectComp";

function FilterTable() {
  return (
    <div className="filter-content w-100 d-flex justify-content-end p-4 gap-3">
      <SelectComp />
      <ChooseDate />
    </div>
  );
}

export default FilterTable;
