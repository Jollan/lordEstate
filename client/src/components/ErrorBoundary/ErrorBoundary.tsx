import { Component, ReactNode, ErrorInfo } from "react";
import { Button, Icon, Container, Header, Segment } from "semantic-ui-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;

      return (
        <Container text style={{ paddingTop: "5rem", textAlign: "center" }}>
          <Segment placeholder>
            <Header as="h1" icon>
              <Icon name="bug" color="red" />
              Something went wrong
            </Header>
            <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
              We apologize for the inconvenience. Here's what we know:
            </p>
            <Segment
              inverted
              color="red"
              textAlign="left"
              style={{ fontFamily: "monospace" }}
            >
              <strong>Error:</strong> {error?.message || "Unknown error"}
              <br />
              <strong>Stack Trace:</strong>
              {errorInfo?.componentStack || "No details available"}
            </Segment>
            <p style={{ marginTop: "1.5rem", fontSize: "1rem", color: "grey" }}>
              You can try reloading the page or go back to the homepage.
            </p>
            <div style={{ marginTop: "2rem", display: 'flex' }}>
              <Button color="blue" onClick={this.handleReload}>
                <Icon name="refresh" /> Reload Page
              </Button>
              <Button color="green" onClick={this.handleGoHome}>
                <Icon name="home" /> Go to Homepage
              </Button>
            </div>
          </Segment>
        </Container>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
