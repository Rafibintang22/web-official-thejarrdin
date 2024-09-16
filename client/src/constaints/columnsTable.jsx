// columns.jsx
import { Button } from "antd";

const columns = [
  {
    title: "Judul",
    dataIndex: "Judul",
    key: "Judul",
  },
  {
    title: "Dibuat oleh",
    dataIndex: "DibuatOleh",
    key: "DibuatOleh",
  },
  {
    title: "Tanggal dibuat",
    dataIndex: "TglDibuat",
    key: "TglDibuat",
  },
  {
    title: "File",
    dataIndex: "File",
    key: "File",
    render: (text, record) => (
      <Button onClick={() => window.open(record.File, "_blank")}>Open</Button>
    ),
  },
];

export default columns;
