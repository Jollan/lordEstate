import { useAsyncError } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { useErrorToast } from "../../../lib/hooks";

export const AsynErrorPage = () => {
  const error: any = useAsyncError();

  useErrorToast()(error)

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred.";
  const errorCode = error?.response?.status || "Error";

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
      <h1>Something went wrong!</h1>
      <strong>Error Code:</strong> {errorCode}
      <br />
      <strong>Message:</strong> {errorMessage}
      <details style={{ whiteSpace: "pre-wrap" }}>
        {error?.stack || "No details available"}
      </details>
      <Button size="mini" onClick={handleRefresh} style={{ marginTop: "10px" }}>
        Try Again
      </Button>
    </div>
  );
};

export default AsynErrorPage;
