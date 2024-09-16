import { InboxOutlined, SaveTwoTone } from "@ant-design/icons";
import { Button, Input, Menu, Modal, Popover, Result, Select, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import useValidator from "../constaints/FormValidation";
import { inputValidator } from "../utils/inputValidator";
import { fiturMaping } from "../utils/mappingFiturID";

// eslint-disable-next-line react/prop-types
function ModalInsert({ currState, setState, judulInsert }) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  console.log(userSession);

  const { ValidationStatus, setValidationStatus, setCloseAlert } = useValidator();
  const [formData, setFormData] = useState({ Judul: "", UserTujuan: [], FileFolder: "" });
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

  const [opsiUser, setOpsiUser] = useState([]);

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

  const handleCurrentMenu = (value) => {
    setFormData({ Judul: "", UserTujuan: [], FileFolder: "" });
    setCurrent(value);
  };
  const handleSelectChange = (value) => {
    if (value.includes("Pilih Semua")) {
      const allValuesExceptPilihSemua = opsiUser
        .filter((option) => option.value !== "Pilih Semua") // Filter out "Pilih Semua"
        .map((option) => option.value); // Get all other values

      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: allValuesExceptPilihSemua,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: value,
      }));
    }
  };
  const handleFormDataChange = (tipe, value) => {
    if (tipe === "UserTujuan") {
      handleSelectChange(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [tipe]: value,
      }));
    }
  };

  // console.log(formData);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchDataUser = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(`${urlServer}/user`, headers);
        const responseData = response.data;

        const currentUserID = userSession?.dataUser?.userID;

        // Transform the data and filter out the current userID
        const transformedData = responseData
          .filter((data) => data.userID !== currentUserID) // Exclude the current userID
          .map((data) => ({
            value: data.userID,
            label: data.nama,
          }));

        // Set the opsiUser state while keeping "Pilih Semua" as the first option
        setOpsiUser([{ value: "Pilih Semua", label: "Pilih Semua" }, ...transformedData]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataUser();
  }, []);

  const form = () => {
    return (
      <div className="d-flex flex-column gap-3">
        <div className="form-input text d-flex align-items-center">
          <label htmlFor="" className="w-25">
            Judul dokumen
          </label>
          <Input
            value={formData["Judul"]}
            onChange={(e) => handleFormDataChange("Judul", e.target.value)}
          />
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
            value={formData["UserTujuan"]}
            onChange={(value) => handleFormDataChange("UserTujuan", value)}
            optionFilterProp="label"
            options={opsiUser}
          />
        </div>
        {current === "unggah" && (
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
        )}

        {current === "link" && (
          <div className="form-input text d-flex align-items-center">
            <label htmlFor="" className="w-25">
              Link/url dokumen
            </label>
            <Input
              value={formData["FileFolder"]}
              onChange={(e) => handleFormDataChange("FileFolder", e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  const formatFormData = (formData) => {
    let fiturID = fiturMaping[judulInsert];
    let newFormData = {
      ...formData,
      FiturID: fiturID,
      TglDibuat: new Date().getTime(),
      UserID_dibuat: userSession?.dataUser?.userID,
    };

    return newFormData;
  };

  const insertFormData = async () => {
    try {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      const formattedFormData = formatFormData(formData);
      // console.log(formattedFormData, "FORMATTED");

      const validateFunction = inputValidator["DataFitur"];
      validateFunction(formattedFormData);

      const response = await axios.post(`${urlServer}/data`, formattedFormData, headers);
      // console.log(response);
    } catch (error) {
      // console.log(error);

      if (error?.response?.data?.error) {
        setValidationStatus(error.path, error.response.data.error);
      } else {
        setValidationStatus(error.path, error.message);
      }
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
            {ValidationStatus && (
              <Modal open={ValidationStatus} onCancel={setCloseAlert} footer={null} centered={true}>
                <Result status="error" title={ValidationStatus.Message} />
              </Modal>
            )}
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

              <Button key="unggah" type="primary" onClick={insertFormData}>
                Unggah
              </Button>
            </div>
          </div>
        </>,
      ]}
    >
      <Menu
        onClick={(e) => handleCurrentMenu(e.key)}
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
