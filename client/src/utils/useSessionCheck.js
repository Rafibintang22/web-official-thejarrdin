import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { urlServer } from "./endpoint";

const UseSessionCheck = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Menggunakan useLocation untuk mendapatkan path terkini
  const [hasRedirected, setHasRedirected] = useState(false); // Flag untuk mencegah navigasi berulang

  useEffect(() => {
    if (hasRedirected) return; // Jika sudah ada redirect, hentikan eksekusi

    const userSession = JSON.parse(localStorage.getItem("userSession"));

    // Jika session tidak ditemukan atau AuthKey tidak ada
    if (!userSession || !userSession.AuthKey) {
      if (location.pathname !== "/login") {
        setHasRedirected(true); // Set flag agar navigasi tidak berulang
        navigate("/login");
      }
      return;
    }

    // Jika user berada di halaman login dan sudah login
    if (location.pathname === "/login") {
      setHasRedirected(true); // Set flag agar navigasi tidak berulang
      navigate("/");
      return;
    }

    // Verifikasi session ke server
    const verifySession = async () => {
      try {
        await axios.get(`${urlServer}/user/session`, {
          headers: {
            authorization: userSession.AuthKey, // Kirim AuthKey sebagai header
          },
        });
      } catch (error) {
        // Jika terjadi error (misalnya session tidak valid), kembalikan ke login
        setHasRedirected(true);
        navigate("/login");
      }
    };

    verifySession();
  }, [location.pathname, navigate, hasRedirected]);

  return null; // Hook ini tidak perlu merender apapun
};

export default UseSessionCheck;
