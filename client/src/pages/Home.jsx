import { faBell } from "@fortawesome/free-regular-svg-icons";
import { multiRoleAkses, bagiArrayAkses } from "../models/menuRoleAkses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { threelogo } from "../../public/assets/images/index";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { urlServer } from "../utils/endpoint";
import UseSessionCheck from "../utils/useSessionCheck";
import useDataUser from "../constaints/dataLoginUser";

function Home() {
  UseSessionCheck();
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const { dataUser } = useDataUser();
  const [rolesUser, setRolesUser] = useState([]);
  const navigate = useNavigate();

  // console.log(dataUser);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchRole = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(`${urlServer}/role`, headers);
        const responseData = response.data;
        // console.log(responseData);

        const transformedData = responseData.Role.map((data) => data.Nama.replace(/\s+/g, "")); // Menghapus semua spasi);
        const arr = multiRoleAkses(transformedData);
        const arr2 = bagiArrayAkses(arr);

        setRolesUser(arr2);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRole();
  }, []);

  return (
    <>
      <div className="container-home d-flex w-100 h-100 flex-column p-4">
        <div className="header container d-flex w-100 justify-content-between">
          <h5 className="text-light fw-medium">Selamat Datang, {dataUser?.nama}</h5>
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-theme2"
            style={{ height: "45px", width: "45px", cursor: "pointer" }}
          >
            <FontAwesomeIcon size="lg" icon={faBell} color="#024332" />
          </div>
        </div>

        <div className="container d-flex justify-content-center align-items-center flex-column flex-wrap h-100">
          {rolesUser.map((arrAkses, i) => (
            <div
              key={i}
              className={`hexagonArea d-flex ${i === 0 ? "first" : "last"} ${
                arrAkses.length % 2 === 0 && i !== 0 ? "genap" : ""
              }`}
            >
              {arrAkses.map((akses, j) => (
                <div
                  key={j}
                  className="hexagon p-2 shadow shadow-lg"
                  onClick={() => {
                    navigate(akses.key);
                  }}
                >
                  {/* <FontAwesomeIcon icon={akses.icon} size="2xl" /> */}
                  <img width={35} height={35} src={akses.icon} alt={`img-icon-${j}`} />
                  <p className="text-center fw-medium">{akses.label}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="footer container d-flex w-100 justify-content-between">
          <img src={threelogo} alt="3 logo" style={{ width: "250px", height: "50px" }} />
          <div
            className="d-flex btn-home-logout justify-content-center align-items-center rounded-circle border border-2"
            style={{ height: "45px", width: "45px", cursor: "pointer" }}
            onClick={() => navigate("/logout")}
          >
            <FontAwesomeIcon size="sm" icon={faArrowRightFromBracket} color="#FFFFFF" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
