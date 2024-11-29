import { Container } from "semantic-ui-react";
import "./Guard.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.context";

const Guard = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      {!currentUser ? (
        <Navigate to="/authen" />
      ) : (
        <Container>
          <Navbar>
            <Outlet />
          </Navbar>
        </Container>
      )}
    </>
  );
};

export default Guard;
