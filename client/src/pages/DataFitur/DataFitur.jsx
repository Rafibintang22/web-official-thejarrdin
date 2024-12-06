import { useEffect, useState } from "react";
import GlobalLayout from "../../components/Layout/GlobalLayout";
import MainContent from "../../components/Layout/MainCOntent";
import HeaderKonten from "../../components/HeaderKonten";
import DataFiturLayout from "../../components/Layout/DataFiturLayout";
import { addDays, addYears } from "date-fns";
import DetailDataController from "../../utils/detailDataController";
import HakAkses from "../../utils/hakAkses";
import toogleSidebarMobile from "../../utils/toogleSidebarMobile";
import ModalInsert from "../../components/ModalInsert";
import ModalDetail from "../../components/ModalDetail";
import SidebarMobile from "../../components/SidebarMobile";
import axios from "axios";
import { urlServer } from "../../utils/endpoint";
import { Fitur } from "../../models/FiturModel";
import { formatDate } from "../../utils/formatDate";

function DataFitur({ active }) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  // Date state for one year range
  const [range, setRange] = useState([
    {
      startDate: addYears(new Date(), -1), // One year ago from today
      endDate: addDays(new Date(), 1), // Tomorrow's date
      key: "selection",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { isDetailOpen, setDetailOpen } = DetailDataController();
  const { hasPengurus } = HakAkses();
  const { isSidebarMobileOpen } = toogleSidebarMobile();
  const menuInsert = [
    {
      label: "Untuk saya",
      key: "untukSaya",
    },
  ];
  // Jika hasPengurus true, tambahkan "Data diunggah" ke dalam menu
  if (hasPengurus) {
    menuInsert.push({
      label: "Data diunggah",
      key: "dataDiunggah",
    });
  }
  const [searchValue, setSearchValue] = useState("");
  const [filteredDataTable, setFilteredDataTable] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [currTipeData, setCurrTipeData] = useState("untukSaya");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    const searchTerm = value.toLowerCase();
    const filtered = dataTable.filter(
      (item) =>
        item.Judul.toLowerCase().includes(searchTerm) ||
        item.DibuatOleh.toLowerCase().includes(searchTerm)
    );
    setFilteredDataTable(filtered);
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
    // fetchData(); // Fetch data after changing pagination
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        console.log(Fitur[active], "TEST");

        const response = await axios.get(
          `${urlServer}/data/${Fitur[active]}/${
            currTipeData === "untukSaya" ? "untukUser" : "dibuatUser"
          }/${range[0].startDate.getTime()}/${range[0].endDate.getTime()}`,
          headers
        );
        // console.log(response);

        const transformedData = response.data.map((data) => ({
          ...data,
          TglDibuat: formatDate(data.TglDibuat),
        }));
        setDataTable(transformedData);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [active, currTipeData, range]);

  useEffect(() => {
    // Reset range and currTipeData when active changes
    setRange([
      {
        startDate: addYears(new Date(), -1), // One year ago from today
        endDate: addDays(new Date(), 1), // Tomorrow's date
        key: "selection",
      },
    ]);
    setCurrTipeData("untukSaya");
  }, [active]);

  return (
    <>
      <GlobalLayout>
        {!isSidebarMobileOpen && (
          <>
            <MainContent
              header={
                <HeaderKonten
                  judul={`Data ${active}`}
                  isInsert={hasPengurus ? true : false}
                  nameInsert={`Tambah Data ${active}`}
                  setInsertBtn={setModalInsert}
                  searchValue={searchValue}
                  onChangeSearch={handleSearch}
                />
              }
              content={
                <DataFiturLayout
                  hasPengurus={hasPengurus}
                  setModalInsert={setModalInsert}
                  range={range}
                  setRange={setRange}
                  searchValue={searchValue}
                  handleSearch={handleSearch}
                  currTipeData={currTipeData}
                  setCurrTipeData={setCurrTipeData}
                  menuInsert={menuInsert}
                  loading={loading}
                  dataTable={dataTable}
                  filteredDataTable={filteredDataTable}
                  handleTableChange={handleTableChange}
                  pagination={pagination}
                  fieldDetail={active}
                  setDetailOpen={setDetailOpen}
                  nameInsert={`Tambah Data ${active}`}
                />
              }
            />

            {modalInsert && (
              <ModalInsert
                currState={modalInsert}
                setState={setModalInsert}
                judulInsert={`Tambah Data ${active}`}
              />
            )}

            {isDetailOpen && <ModalDetail judulDetail={`Detail ${active}`} />}
          </>
        )}
        {isSidebarMobileOpen && <SidebarMobile />}
      </GlobalLayout>
    </>
  );
}

export default DataFitur;
