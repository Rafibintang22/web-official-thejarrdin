import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { urlServer } from "../utils/endpoint";
import useDataUser from "../constaints/dataLoginUser";

function Logout() {
  const navigate = useNavigate();
  const { headers } = useDataUser();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(`${urlServer}/logout`, headers);
        console.log(response);

        // Remove userSession from localStorage
        localStorage.removeItem("userSession");
        // Redirect to login page or home page
        navigate("/login"); // Change this to the path you want to navigate to after logout
      } catch (error) {
        console.log(error.message);
      }
    };

    logout();
  }, []);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}

export default Logout;
