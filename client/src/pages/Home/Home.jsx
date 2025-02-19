import React, { useEffect, useState } from "react";
import GlobalLayout from "../../components/Layout/GlobalLayout";
import MainContent from "../../components/Layout/MainCOntent";
import { Avatar, Badge, Empty, Modal, Popconfirm } from "antd";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import DetailDataController from "../../utils/detailDataController";
import axios from "axios";
import { urlServer } from "../../utils/endpoint";
import { bagiArrayAkses, multiRoleAkses } from "../../models/menuRoleAkses";
import formatString from "../../utils/formatString";
import { fiturMaping2 } from "../../utils/mappingFiturID";
import HomeLayout from "../../components/Layout/HomeLayout";
import { formatDate } from "../../utils/formatDate";
import { threelogo } from "../../../public/assets/images";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";

function Home() {
  const navigate = useNavigate();
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  // console.log(userSession);

  const dataUser = userSession?.dataUser;
  const [rolesUser, setRolesUser] = useState([]);
  const [isNotifOpen, setNotif] = useState(false);
  const handleModalNotif = () => {
    setNotif(!isNotifOpen);
  };
  const [dataNotif, setDataNotif] = useState(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const { setDetailOpen } = DetailDataController();

  const contentInfoRole = (role) => {
    switch (role) {
      case "Pengurus":
        return (
          <div>
            <p>Membuat Pengumuman</p>
            <p>Membuat Laporan</p>
            <p>Menerima Aspirasi</p>
          </div>
        );

      case "Pengelola":
        return (
          <div>
            <p>Membuat Tagihan Bulanan</p>
            <p>Membuat Buletin Kegiatan</p>
            <p>Membuat Informasi Paket</p>
            <p>Membuat Pengumuman Pengelola</p>
          </div>
        );

      case "Pemilik Unit":
        return (
          <div>
            <p>Membuat Aspirasi</p>
            <p>Menerima Pengumuman</p>
            <p>Menerima Laporan</p>
            <p>Menerima Tagihan Bulanan</p>
            <p>Menerima Buletin Kegiatan</p>
            <p>Menerima Informasi Paket</p>
          </div>
        );

      case "Pelaku Komersil":
        return (
          <div>
            <p>Membuat Pengumuman Usaha</p>
            <p>Menerima Pengumuman</p>
            <p>Menerima Laporan</p>
            <p>Menerima Tagihan Bulanan</p>
            <p>Menerima Buletin Kegiatan</p>
            <p>Menerima Informasi Paket</p>
          </div>
        );
    }
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const transformedRole = () => {
      const transformedData = dataUser?.Role.map((data) => data.Nama.replace(/\s+/g, "")); // Menghapus semua spasi);
      const arr = multiRoleAkses(transformedData);
      const arr2 = bagiArrayAkses(arr);

      setRolesUser(arr2);
    };

    const fetchNotif = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(`${urlServer}/notif`, headers);
        // console.log(response);

        setDataNotif(response.data.Notif);
        setTotalUnread(response.data.TotalUnRead);
      } catch (error) {
        // console.log(error);
      }
    };

    transformedRole();
    fetchNotif();
  }, []);

  const handleNotifOpen = async (id, fiturId, tipe) => {
    const url = formatString(fiturMaping2[fiturId]);
    const body = {
      Id: id,
      Tipe: tipe,
    };
    const headers = {
      headers: {
        authorization: userSession?.AuthKey,
      },
    };

    try {
      await axios.patch(`${urlServer}/notif`, body, headers);
      // console.log(response);
      setDetailOpen(fiturMaping2[fiturId], id);
      navigate(`/${url}`);
    } catch (error) {
      // console.log(error);
    }
  };
  const Header = () => {
    return (
      <div className="header bg-theme shadow p-3 ps-5 pe-5 d-flex w-100 justify-content-between align-items-center">
        <h5 className="text-light fw-medium" style={{ fontSize: "15px" }}>
          Selamat Datang, {dataUser?.Nama}
        </h5>
        <Badge count={totalUnread}>
          <Avatar
            onClick={handleModalNotif}
            style={{ cursor: "pointer" }}
            shape="circle"
            size={"large"}
            className="bg-theme2"
            icon={<FontAwesomeIcon size="xs" icon={faBell} color="#024332" />}
          />
        </Badge>
      </div>
    );
  };
  const Footer = () => {
    return (
      <div className="footer p-3 ps-5 pe-5 d-flex w-100 justify-content-between align-items-center">
        <img
          className="img-threeLogo"
          src={threelogo}
          alt="3 logo"
          style={{ width: "350px", height: "75px" }}
        />
        <div
          className="d-flex border border-top btn-home-logout justify-content-center align-items-center rounded-circle border border-2"
          style={{ height: "45px", width: "45px", cursor: "pointer" }}
          onClick={() => navigate("/logout")}
        >
          <FontAwesomeIcon size="sm" icon={faArrowRightFromBracket} color="#FFFFFF" />
        </div>
      </div>
    );
  };
  return (
    <>
      <GlobalLayout active={"home"}>
        <MainContent
          header={<Header />}
          content={
            <HomeLayout
              dataUser={dataUser}
              rolesUser={rolesUser}
              contentInfoRole={contentInfoRole}
            />
          }
          footer={<Footer />}
        />
      </GlobalLayout>

      <Modal title="Notifikasi" open={isNotifOpen} onCancel={handleModalNotif} footer={false}>
        {dataNotif && dataNotif.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {dataNotif.map((notif, i) => (
              <Popconfirm
                key={i}
                icon={false}
                title="Lihat Notifikasi?"
                description={notif.IsRead ? "" : "Lihat untuk tandai notif menjadi dibaca"}
                onConfirm={() => handleNotifOpen(notif.Id, notif.FiturID, notif.Tipe)}
                okText="Lihat"
                cancelText="Tutup"
              >
                <div
                  className={`${!notif.IsRead ? "btn-theme2" : "btn-white border"} p-3 rounded`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between">
                    <p className="fw-semibold">{fiturMaping2[notif.FiturID]}</p>
                    <p>{formatDate(notif.TglDibuat)}</p>
                  </div>
                  {notif.Judul}
                </div>
              </Popconfirm>
            ))}
          </div>
        ) : (
          <Empty description="Tidak ada notifikasi terbaru" />
        )}
      </Modal>
    </>
  );
}

export default Home;
