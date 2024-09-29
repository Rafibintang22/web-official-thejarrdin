// columns.jsx
import { CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { urlServer } from "../utils/endpoint";
import axios from "axios";

const userSession = JSON.parse(localStorage.getItem("userSession"));
axios.defaults.withCredentials = true;
const updateIsRead = async (Id) => {
  const body = {
    MessageID: Id,
  };
  const headers = {
    headers: {
      authorization: userSession?.AuthKey,
    },
  };
  try {
    await axios.patch(`${urlServer}/aspirasi`, body, headers);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
const columns = (isDetailOpen, setDetailOpen, tipeAspirasi = "") => [
  {
    title: "Judul",
    dataIndex: "Judul",
    key: "Judul",
  },
  {
    title: "Diunggah oleh",
    dataIndex: "DibuatOleh",
    key: "DibuatOleh",
  },
  {
    title: "Tanggal dibuat",
    dataIndex: "TglDibuat",
    key: "TglDibuat",
    defaultSortOrder: "descend",
  },
  isDetailOpen === "Aspirasi" && tipeAspirasi === "untukSaya"
    ? {
        title: "Status",
        dataIndex: "IsRead",
        key: "IsRead",
        render: (text, record) => (
          <Button
            key="isRead"
            type={record.IsRead ? "primary" : ""}
            icon={record.IsRead ? <CheckOutlined /> : false}
            onClick={() => updateIsRead(record.Id)}
          >
            {record.IsRead ? "Dibaca" : "Tandai untuk dibaca"}
          </Button>
        ),
      }
    : {},
  {
    title: "Aksi",
    dataIndex: "Id",
    key: "Id",
    render: (text, record) => (
      <Button onClick={() => setDetailOpen(isDetailOpen, record.Id)}>Lihat detail</Button>
    ),
  },
];

export default columns;
