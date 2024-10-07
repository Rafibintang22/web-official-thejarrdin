import { InboxOutlined, SaveTwoTone } from "@ant-design/icons";
import { Button, Input, Menu, Modal, Popover, Result, Select } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import axios, { formToJSON } from "axios";
import { urlServer } from "../utils/endpoint";
import useValidator from "../constaints/FormValidation";
import { inputValidator } from "../utils/inputValidator";
import { fiturMaping } from "../utils/mappingFiturID";

// eslint-disable-next-line react/prop-types
function ModalInsert({ currState, setState, judulInsert, dataOne = null }) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  // console.log(userSession);

  // const [uploadProgress, setUploadProgress] = useState(0); // State untuk melacak progress upload
  const { ValidationStatus, setValidationStatus, setCloseAlert } = useValidator();
  const [formData, setFormData] = useState(
    dataOne ? dataOne : { Judul: "", UserTujuan: [], FileFolder: [] }
  );
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  // console.log(formData, "FORMDATA");

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
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleCurrentMenu = (value) => {
    if (dataOne) {
      setFormData({ ...formData, FileFolder: "" });
      setCurrent(value);
    } else {
      setFormData({ Judul: "", UserTujuan: [], FileFolder: "" });
      setCurrent(value);
    }
  };
  const handleSelectChange = (value) => {
    if (value.includes("Pilih Semua")) {
      const allValuesExceptPilihSemua = opsiUser
        .filter(
          (option) =>
            option.value !== "Pilih Semua" &&
            option.value !== "Pilih Semua Pengurus" &&
            option.value !== "Pilih Semua Pengelola" &&
            option.value !== "Pilih Semua Pemilik Unit" &&
            option.value !== "Pilih Semua Pelaku Komersil"
        ) // Filter out "Pilih Semua"
        .map((option) => option.value); // Get all other values

      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: allValuesExceptPilihSemua,
      }));
    } else if (value.includes("Pilih Semua Pengurus")) {
      // Filter opsiUser yang memiliki role dengan nama "Pengurus"
      const usersWithPengurusRole = opsiUser
        .filter((option) => option.role && option.role.some((role) => role.Nama === "Pengurus"))
        .map((option) => option.value); // Ambil nilai (user ID)

      // Update UserTujuan dengan user yang memiliki role "Pengurus"
      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: usersWithPengurusRole,
      }));
    } else if (value.includes("Pilih Semua Pengelola")) {
      // Filter opsiUser yang memiliki role dengan nama "Pengelola"
      const usersWithPengelolaRole = opsiUser
        .filter((option) => option.role && option.role.some((role) => role.Nama === "Pengelola"))
        .map((option) => option.value);

      // Update UserTujuan dengan user yang memiliki role "Pengelola"
      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: usersWithPengelolaRole,
      }));
    } else if (value.includes("Pilih Semua Pemilik Unit")) {
      // Filter opsiUser yang memiliki role dengan nama "Pemilik Unit"
      const usersWithPemilikUnitRole = opsiUser
        .filter((option) => option.role && option.role.some((role) => role.Nama === "Pemilik Unit"))
        .map((option) => option.value);

      // Update UserTujuan dengan user yang memiliki role "Pemilik Unit"
      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: usersWithPemilikUnitRole,
      }));
    } else if (value.includes("Pilih Semua Pelaku Komersil")) {
      // Filter opsiUser yang memiliki role dengan nama "Pelaku Komersil"
      const usersWithPelakuKomersilRole = opsiUser
        .filter(
          (option) => option.role && option.role.some((role) => role.Nama === "Pelaku Komersil")
        )
        .map((option) => option.value);

      // Update UserTujuan dengan user yang memiliki role "Pelaku Komersil"
      setFormData((prevData) => ({
        ...prevData,
        UserTujuan: usersWithPelakuKomersilRole,
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
        const currentUserID = userSession?.dataUser?.UserID;

        // Transform the data and filter out the current userID
        const transformedData = responseData
          .filter((data) => data.UserID !== currentUserID) // Exclude the current userID
          .map((data) => ({
            value: data.UserID,
            label: data.Nama,
            role: data.Role,
          }));

        // Set the opsiUser state while keeping "Pilih Semua" as the first option
        setOpsiUser([
          { value: "Pilih Semua", label: "Pilih Semua" },
          { value: "Pilih Semua Pengurus", label: "Pilih Semua Pengurus" },
          { value: "Pilih Semua Pengelola", label: "Pilih Semua Pengelola" },
          { value: "Pilih Semua Pemilik Unit", label: "Pilih Semua Pemilik Unit" },
          { value: "Pilih Semua Pelaku Komersil", label: "Pilih Semua Pelaku Komersil" },
          ...transformedData,
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    if (!dataOne) {
      fetchDataUser();
    }
  }, []);

  const form = () => {
    return (
      <div className="d-flex flex-column gap-3">
        <div className="form-input text d-flex align-items-start">
          <label htmlFor="" className="d-flex w-25 gap-2">
            <p className="text-danger">*</p>
            Judul dokumen
          </label>
          <Input
            value={formData["Judul"]}
            placeholder="Masukkan judul dokumen"
            onChange={(e) => handleFormDataChange("Judul", e.target.value)}
            style={{ color: "#616161" }}
            disabled={dataOne ? true : false}
          />
        </div>
        {!dataOne && (
          <div className="form-input select d-flex align-items-start">
            <label htmlFor="" className="d-flex w-25 gap-2">
              <p className="text-danger">*</p>
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
        )}
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
          <div className="form-input text d-flex align-items-start">
            <label htmlFor="" className="d-flex w-25 gap-2">
              <p className="text-danger">*</p>
              Link/url dokumen
            </label>
            <Input
              placeholder="Masukkan link/url dari dokumen Anda"
              value={formData["FileFolder"]}
              onChange={(e) => handleFormDataChange("FileFolder", e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  const formatFormData = (formData) => {
    let newFormData = new FormData();

    for (const key in formData) {
      if (key === "FileFolder" && Array.isArray(formData[key])) {
        formData[key].map((file) => {
          const fileObj = file.originFileObj;
          newFormData.append(key, fileObj);
        });
      } else {
        newFormData.append(key, formData[key]);
      }
    }
    newFormData.append("FiturID", fiturMaping[judulInsert]);
    newFormData.append("TglDibuat", new Date().getTime());
    newFormData.append("UserID_dibuat", userSession?.dataUser?.UserID);

    return newFormData;
  };

  //agar ketika FileFolder berukuran 1 array dan di formToJSON akan tetap berformat array
  //karena kalau tidak formToJSON akan mengubah array berukuran 1 itu menjadi object biasa
  const normalizeFileFolder = (data) => {
    // Jika FileFolder adalah array dari objek file, kita bisa mengambil hanya metadata yang diperlukan
    if (!Array.isArray(data.FileFolder)) {
      data.FileFolder = [data.FileFolder];
    }

    // Konversi UserTujuan dari string karena formTOJSOn "2,3" menjadi array [2, 3]
    data.UserTujuan = data.UserTujuan.split(",").map(Number);

    // Pastikan ID dan Tanggal dalam format number
    data.FiturID = Number(data.FiturID);
    data.TglDibuat = Number(data.TglDibuat);
    data.UserID_dibuat = Number(data.UserID_dibuat);

    return data;
  };

  // console.log(uploadProgress);

  console.log(formData);

  const insertFormData = async () => {
    setLoading(true); // Set loading ke true saat login dijalankan
    try {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      const formattedFormData = formatFormData(formData);

      const normalizedData = normalizeFileFolder(formToJSON(formattedFormData)); // Normalisasi file folder untuk validasi
      // console.log(normalizedData, "TEST");

      // Lakukan validasi menggunakan Joi
      const validateFunction = inputValidator["DataFitur"];
      validateFunction(normalizedData);

      //POST REQUEST
      await axios.post(`${urlServer}/data`, formattedFormData, headers);
      setLoading(false);
      setValidationStatus("Berhasil", "Data berhasil ditambahkan");
    } catch (error) {
      // console.log(error);
      setLoading(false);
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
      loading={loading}
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

              <Button loading={loading} key="unggah" type="primary" onClick={insertFormData}>
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
            //jika gagal maka modal aler saja yg ditutup
            if (ValidationStatus.Path !== "Berhasil") {
              setCloseAlert();
            } else {
              //jika berhasil maka modal alert & modal form  yg ditutup
              setCloseAlert(), setState(false), window.location.reload();
            }
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
