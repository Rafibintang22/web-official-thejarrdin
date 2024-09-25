import { SaveTwoTone } from "@ant-design/icons";
import { Button, Input, Menu, Modal, Popover, Result } from "antd";
import useValidator from "../constaints/FormValidation";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

// eslint-disable-next-line react/prop-types
function ModalInsertAspirasi({ currState, setState, judulInsert }) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));

  const { ValidationStatus, setValidationStatus, setCloseAlert } = useValidator();
  const [formData, setFormData] = useState({ Judul: "", Pesan: "" });
  // console.log(formData, "FORMDATA");

  const handleFormDataChange = (tipe, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [tipe]: value,
    }));
  };

  const form = () => {
    return (
      <div className="d-flex flex-column gap-3">
        <div className="form-input text d-flex align-items-start">
          <label htmlFor="" className="w-25">
            Judul aspirasi
          </label>
          <Input
            value={formData["Judul"]}
            placeholder="Masukkan judul aspirasi"
            onChange={(e) => handleFormDataChange("Judul", e.target.value)}
          />
        </div>
        <div className="form-input text d-flex align-items-start">
          <label htmlFor="" className="w-25">
            Pesan
          </label>
          <TextArea
            value={formData["Pesan"]}
            placeholder="Tuliskan pesan atau aspirasi Anda"
            onChange={(e) => handleFormDataChange("Pesan", e.target.value)}
            autoSize={{
              minRows: 2,
              maxRows: 10,
            }}
          />
        </div>
      </div>
    );
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
                key="tutup"
                className="text-light bg-secondary"
                onClick={() => setState(false)}
              >
                Tutup
              </Button>

              <Button key="unggah" type="primary">
                Unggah
              </Button>
            </div>
          </div>
        </>,
      ]}
    >
      {ValidationStatus && (
        <Modal
          open={ValidationStatus}
          onCancel={() => {
            setState(false), setCloseAlert, window.location.reload();
          }}
          footer={null}
          centered={true}
        >
          <Result
            status={ValidationStatus.Path !== "Berhasil" ? "error" : "success"}
            title={ValidationStatus.Message}
          />
        </Modal>
      )}
      {form()}
    </Modal>
  );
}

export default ModalInsertAspirasi;
