// columns.jsx
import { Button } from "antd";

const columns = (isDetailOpen, setDetailOpen) => [
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
