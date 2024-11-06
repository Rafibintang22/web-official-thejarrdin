import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { urlServer } from "./endpoint";

const UseSessionCheck = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    // console.log(userSession);

    if (!userSession || !userSession?.AuthKey) {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
      return;
    }

    // Redirect to homepage if user is on the login page and already logged in
    if (location.pathname === "/login") {
      navigate("/");
      return;
    }

    const verifySession = async () => {
      const headers = {
        headers: {
          authorization: userSession?.AuthKey,
        },
      };
      try {
        const response = await axios.get(`${urlServer}/user/session`, headers);
        // console.log(response);
      } catch (error) {
        // console.log(error);
        navigate("/login");
      }
    };

    verifySession();
  }, [navigate]);
};

export default UseSessionCheck;
