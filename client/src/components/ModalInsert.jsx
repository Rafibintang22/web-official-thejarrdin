import { InboxOutlined, SaveTwoTone } from "@ant-design/icons";
import { Button, Input, Menu, Modal, Popover, Select, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";

function ModalInsert({ currState, setState, judulInsert }) {
  const menuInsert = [
    {
      label: "Unggah dokumen",
      key: "unggah",
    },
    {
      label: "Link/url dokumen",
      key: "link",
    },
  ];
  const [current, setCurrent] = useState("unggah");

  const opsiUser = [
    { label: "Ahmad Rizal", value: 1 },
    { label: "Samuel Haratua", value: 2 },
    { label: "Rafi rizky", value: 3 },
    { label: "Indah Sanjana", value: 4 },
    { label: "Adrian Lusikooy", value: 5 },
    { label: "Jason", value: 6 },
  ];

  const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const form = () => {
    if (current === "unggah") {
      return (
        <div className="d-flex flex-column gap-3">
          <div className="form-input text d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Judul dokumen
            </label>
            <Input />
          </div>
          <div className="form-input select d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Dibuat untuk
            </label>
            <Select
              className="w-100"
              mode="multiple"
              allowClear
              placeholder="Pilih..."
              //   onChange={handleChange}
              options={opsiUser}
            />
          </div>

          <div className="form-input file">
            <Dragger height={250}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data
                or other banned files.
              </p>
            </Dragger>
          </div>
        </div>
      );
    } else if (current === "link") {
      return (
        <div className="d-flex flex-column gap-3">
          <div className="form-input text d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Judul dokumen
            </label>
            <Input />
          </div>
          <div className="form-input select d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Dibuat untuk
            </label>
            <Select
              className="w-100"
              mode="multiple"
              allowClear
              placeholder="Pilih..."
              //   onChange={handleChange}
              options={opsiUser}
            />
          </div>
          <div className="form-input text d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Link/url dokumen
            </label>
            <Input />
          </div>
        </div>
      );
    }
  };
  return (
    <Modal
      title={judulInsert}
      centered
      width={1000}
      open={currState}
      onOk={() => setState(false)}
      onCancel={() => setState(false)}
      footer={[
        <>
          <div className="d-flex w-100 justify-content-between">
            <div>
              <Popover content={<p>Simpan di draft</p>} trigger={"hover"}>
                <Button key="save" icon={<SaveTwoTone twoToneColor={"#399051"} />}></Button>
              </Popover>
            </div>
            <div className="d-flex gap-3">
              <Button
                key="kembali"
                className="text-light bg-secondary"
                onClick={() => setState(false)}
              >
                Kembali
              </Button>

              <Button key="unggah" type="primary">
                Unggah
              </Button>
            </div>
          </div>
        </>,
      ]}
    >
      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        mode="horizontal"
        items={menuInsert}
        className="d-flex w-100 justify-content-start"
      />
      {menuInsert.map((item, i) => (
        <>
          {current === item.key && (
            <div key={i} className="container form-container p-3">
              {form()}
            </div>
          )}
        </>
      ))}
    </Modal>
  );
}

export default ModalInsert;
