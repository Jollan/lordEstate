import {
  Modal,
  Button,
  Header,
  Icon,
  ModalActions,
  ModalContent,
} from "semantic-ui-react";
import "./SessionExpiredModal.scss";
import { useContext } from "react";
import { SessionExpiredModalContext } from "../../context/Modal.context";
import { AuthContext } from "../../context/Auth.context";

const SessionExpiredModal = () => {
  const { isSessionExpired } = useContext(SessionExpiredModalContext);
  const { updateCurrentUser } = useContext(AuthContext);

  return (
    <Modal open={isSessionExpired} size="tiny">
      <Header icon="warning sign" content="Session Expired" />
      <ModalContent>
        <p>
          Your session has expired. Please log in again to continue using the
          application.
        </p>
      </ModalContent>
      <ModalActions>
        <Button
          primary
          onClick={() => {
            updateCurrentUser(null);
            window.location.href = "/authen";
          }}
        >
          <Icon name="sign-in" /> Login
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default SessionExpiredModal;
