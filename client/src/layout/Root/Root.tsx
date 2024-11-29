import { Container } from "semantic-ui-react";
import "./Root.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <Container>
      <Navbar>
        <Outlet />
      </Navbar>
    </Container>
  );
};

export default Root;
