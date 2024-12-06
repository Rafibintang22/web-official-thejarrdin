import React from "react";
import FilterTable from "../Filter/FilterTable";
import { Menu, Table } from "antd";
import columns from "../../constaints/columnsTable";

function DataFiturLayout({
  hasPengurus,
  setModalInsert,
  range,
  setRange,
  searchValue,
  handleSearch,
  currTipeData,
  setCurrTipeData,
  menuInsert,
  loading,
  dataTable,
  filteredDataTable,
  handleTableChange,
  pagination,
  fieldDetail,
  setDetailOpen,
  nameInsert,
}) {
  return (
    <>
      <FilterTable
        isInsert={hasPengurus ? true : false}
        nameInsert={nameInsert}
        setInsertBtn={setModalInsert}
        range={range}
        setRange={setRange}
        searchValue={searchValue}
        onChangeSearch={handleSearch}
      />
      <Menu
        onClick={(e) => setCurrTipeData(e.key)}
        selectedKeys={[currTipeData]}
        mode="horizontal"
        items={menuInsert}
        className="d-flex w-100 justify-content-start"
      />

      <div className="w-100 p-4">
        <Table
          scroll={{ x: "max-content" }}
          loading={loading}
          dataSource={searchValue === "" || null || undefined ? dataTable : filteredDataTable}
          onChange={handleTableChange}
          pagination={pagination}
          columns={columns(fieldDetail, setDetailOpen)}
        />
      </div>
    </>
  );
}

export default DataFiturLayout;
