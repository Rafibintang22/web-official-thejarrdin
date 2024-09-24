import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import DetailDataController from "../utils/detailDataController";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import formatDate from "../utils/formatDate";
import { FileOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
function ModalDetail({ judulDetail }) {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { isDetailOpen, oneDataID, setDetailOpen } = DetailDataController();
  const [dataOne, setDataOne] = useState(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchOneData = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(`${urlServer}/data/${oneDataID}`, headers);
        const responseData = response.data;
        console.log(responseData);

        let transformedFile = [];
        if (responseData?.File.includes(",")) {
          transformedFile = responseData?.File.split(",").map((url) => url.trim());
        } else {
          transformedFile = responseData?.File; // Jika tidak ada koma, jadikan sebagai array dengan satu elemen
        }

        setDataOne({
          ...responseData,
          File: transformedFile, // Menambahkan transformedFile ke dalam responseData
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchOneData();
  }, [isDetailOpen]);

  return (
    <Modal
      title={judulDetail}
      centered
      width={1000}
      open={isDetailOpen}
      onOk={() => setDetailOpen(null, null)}
      onCancel={() => setDetailOpen(null, null)}
      footer={[
        <Button key="tutup" type="primary" onClick={() => setDetailOpen(null, null)}>
          Tutup
        </Button>,
      ]}
    >
      <div className="d-flex flex-column gap-3">
        <div className="form-input text d-flex align-items-center">
          <label htmlFor="" className="w-25">
            Judul dokumen
          </label>
          <Input style={{ color: "#616161" }} value={dataOne?.Judul} disabled />
        </div>

        <div className="form-input text d-flex align-items-center">
          <label htmlFor="" className="w-25">
            Tanggal diunggah
          </label>
          <Input style={{ color: "#616161" }} value={formatDate(dataOne?.TglDibuat)} disabled />
        </div>

        <div className="form-input text d-flex align-items-center">
          <label htmlFor="" className="w-25">
            Diunggah oleh
          </label>
          <Input style={{ color: "#616161" }} value={dataOne?.DibuatOleh} disabled />
        </div>

        <div className="form-input text d-flex align-items-center">
          <label htmlFor="" className="w-25">
            Tujuan
          </label>
          <Input style={{ color: "#616161" }} value={dataOne?.UserTujuan} disabled />
        </div>

        <div className="form-input text d-flex flex-column gap-3">
          <label htmlFor="" className="w-25">
            File/folder dokumen
          </label>
          {Array.isArray(dataOne?.File) ? (
            <div className="d-flex gap-3">
              {dataOne?.File.map((url, i) => (
                <Button
                  shape="rounded"
                  icon={<FileOutlined />}
                  key={i}
                  onClick={() => window.open(url, "_blank")}
                >
                  Lihat file/folder {i + 1}
                </Button>
              ))}
            </div>
          ) : (
            <div className="d-flex gap-3">
              <Button
                shape="rounded"
                icon={<FileOutlined />}
                onClick={() => window.open(dataOne?.File, "_blank")}
              >
                Lihat file/folder
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalDetail;
