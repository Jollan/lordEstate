import "./Guarded.scss";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.context";

const Guarded = () => {
  const { currentUser } = useContext(AuthContext);
  return <>{!currentUser ? <Navigate to="/authen" /> : <Outlet />}</>;
};

export default Guarded;
