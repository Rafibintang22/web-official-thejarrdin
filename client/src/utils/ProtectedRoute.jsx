import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const userRoles = userSession?.dataUser?.Role?.map((role) => role.Nama) || [];

    // Cek apakah user memiliki salah satu role yang diperbolehkan
    const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));

    return isAuthorized ? <>{element}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
