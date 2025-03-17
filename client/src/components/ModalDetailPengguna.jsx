import { Button, Input, Modal, Popover } from "antd";
import React, { useState } from "react";
import DetailDataController from "../utils/detailDataController";
import { DeleteTwoTone } from "@ant-design/icons";

function ModalDetailPengguna({ judulDetail }) {
    const { isDetailOpen, oneDataID, setDetailOpen } = DetailDataController();
    const [loading, setLoading] = useState(false); // Tambahkan state loading
    // console.log(oneDataID);

    return (
        <Modal
            title={judulDetail}
            loading={loading}
            centered
            width={1000}
            open={isDetailOpen}
            onOk={() => {
                setDetailOpen(null, null);
            }}
            onCancel={() => {
                setDetailOpen(null, null);
            }}
            footer={[
                <>
                    <div className="d-flex w-100 justify-content-between gap-3">
                        <div>
                            <Popover content={<p>Hapus akun pengguna</p>} trigger={"hover"}>
                                <Button
                                    key="delete"
                                    variant="outlined"
                                    icon={<DeleteTwoTone twoToneColor="#f5222d" />}
                                    danger
                                ></Button>
                            </Popover>
                        </div>
                        <div className="d-flex gap-3">
                            <Button
                                key="tutup"
                                className="text-light bg-secondary"
                                onClick={() => {
                                    setDetailOpen(null, null);
                                }}
                            >
                                Tutup
                            </Button>
                            <Button key="simpan" type="primary">
                                Simpan
                            </Button>
                        </div>
                    </div>
                </>,
            ]}
        >
            <div className="d-flex flex-column gap-3">
                <div className="form-input text d-flex align-items-center">
                    <label htmlFor="" className="w-25">
                        Nama
                    </label>
                    <Input style={{ color: "#616161" }} />
                </div>

                <div className="form-input text d-flex align-items-center">
                    <label htmlFor="" className="w-25">
                        Email
                    </label>
                    <Input style={{ color: "#616161" }} />
                </div>

                <div className="form-input text d-flex align-items-center">
                    <label htmlFor="" className="w-25">
                        No Telepon
                    </label>
                    <Input style={{ color: "#616161" }} />
                </div>

                <div className="form-input text d-flex align-items-center">
                    <label htmlFor="" className="w-25">
                        Alamat
                    </label>
                    <Input style={{ color: "#616161" }} />
                </div>

                <div className="form-input text d-flex align-items-center">
                    <label htmlFor="" className="w-25">
                        No Unit
                    </label>
                    <Input style={{ color: "#616161" }} />
                </div>
            </div>
        </Modal>
    );
}

export default ModalDetailPengguna;
