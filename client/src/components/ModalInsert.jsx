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
  // console.log(userSession);

  const { ValidationStatus, setValidationStatus, setCloseAlert } = useValidator();
  const [formData, setFormData] = useState({ Judul: "", UserTujuan: [], FileFolder: "" });
  console.log(formData, "FORMDATA");

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

  const propsUploadImg = {
    name: judulInsert,
    multiple: true,
    listType: "picture",
    accept: ".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,.xlxs",
    beforeUpload(file) {
      //jika size > 5Mb
      if (file.size > 5242880) {
        return true;
      } else {
        return false;
      }
    },
    onChange(info) {
      setFormData((prevData) => ({ ...prevData, FileFolder: info.fileList }));
      // axios.post(`${urlServer}/data`, info, {
      //   onUploadProgress: (event) => {
      //     console.log(event);
      //   },
      // });
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
            <Dragger height={250} {...propsUploadImg}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Klik atau tarik file ke area ini untuk mengunggah</p>
              <p className="ant-upload-hint">
                Mendukung unggah file tunggal atau dalam jumlah banyak. Ukuran file maksimal adalah
                5 Mb
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

  // const insertFormData = async () => {
  //   try {
  //     const headers = {
  //       headers: {
  //         authorization: userSession?.AuthKey,
  //         "Content-Type": "multipart/form-data", // Important for file uploads
  //       },
  //     };
  //     const formattedFormData = formatFormData(formData);
  //     // console.log(formattedFormData, "FORMATTED");

  //     // const validateFunction = inputValidator["DataFitur"];
  //     // validateFunction(formattedFormData);

  //     const response = await axios.post(`${urlServer}/data`, formattedFormData, headers);
  //     // console.log(response);
  //   } catch (error) {
  //     // console.log(error);

  //     if (error?.response?.data?.error) {
  //       setValidationStatus(error.path, error.response.data.error);
  //     } else {
  //       setValidationStatus(error.path, error.message);
  //     }
  //   }
  // };
  const insertFormData = async () => {
    try {
      const headers = {
        authorization: userSession?.AuthKey,
        "Content-Type": "multipart/form-data",
      };
      let formattedFormData = new FormData();

      for (const key in formData) {
        if (key === "FileFolder" && Array.isArray(formData[key])) {
          formData[key].forEach((file) => {
            const fileObj = file.originFileObj || file;
            formattedFormData.append(key, fileObj);
          });
        } else {
          formattedFormData.append(key, formData[key]);
        }
      }

      formattedFormData.append("FiturID", fiturMaping[judulInsert]);
      formattedFormData.append("TglDibuat", new Date().getTime());
      formattedFormData.append("UserID_dibuat", userSession?.dataUser?.userID);

      console.log(formattedFormData, "FORMATED");

      const response = await fetch(`${urlServer}/data`, {
        method: "POST",
        headers: headers,
        body: formattedFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload data");
      }

      const responseData = await response.json();
      message.success("Data successfully uploaded!");
      console.log("Server Response:", responseData);
    } catch (error) {
      console.error("Error uploading form data:", error);
      setValidationStatus(null, error.message || "An error occurred");
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
