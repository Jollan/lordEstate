import { useRouteError } from "react-router-dom";
import { Button, Icon, Container, Header, Segment } from "semantic-ui-react";
import { useSessionExpiredModal } from "../../../lib/hooks";

const RouteErrorPage = () => {
  const error: any = useRouteError();

  useSessionExpiredModal()(error);

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "An unknown error occurred.";
  const errorCode = error?.response?.status || "Error";

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <Container text style={{ paddingTop: "5rem", textAlign: "center" }}>
      <Segment placeholder>
        <Header as="h1" icon>
          <Icon name="exclamation triangle" color="red" />
          Oops! Something went wrong.
        </Header>
        <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
          We're sorry for the inconvenience. Here's what we know about the
          error:
        </p>
        <Segment
          inverted
          color="red"
          textAlign="left"
          style={{ fontFamily: "monospace" }}
        >
          <strong>Error Code:</strong> {errorCode}
          <br />
          <strong>Message:</strong> {errorMessage}
        </Segment>
        <p style={{ marginTop: "1.5rem", fontSize: "1rem", color: "grey" }}>
          If this issue persists, please contact our support team.
        </p>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Button color="green" onClick={handleGoHome}>
            <Icon name="home" /> Go to Home
          </Button>
          <Button color="blue" onClick={handleRefresh}>
            <Icon name="refresh" /> Refresh Page
          </Button>
        </div>
      </Segment>
    </Container>
  );
};

export default RouteErrorPage;
