import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Transition,
} from "semantic-ui-react";
import "./Login.scss";
import { useContext, useState } from "react";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { rctClass, sanitize } from "../../lib/utils";
import { login, register } from "../../services/auth";
import { NavbarContext } from "../../context/Navbar.context";
import { AuthContext } from "../../context/Auth.context";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Page from "../../components/Page/Page";
import { UserInfo } from "../../models/user.model";

const Login = () => {
  const [loginMode, setLoginMode] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { collapse } = useContext(NavbarContext);
  const { currentUser, updateCurrentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const inputs = Object.fromEntries(formData) as any;
    const data = sanitize({
      ...inputs,
      username: inputs.username.toLowerCase(),
      avatar,
    }) as UserInfo;

    try {
      const res = await (loginMode ? login(data) : register(data));
      updateCurrentUser(res.data);
      navigate("/");
      toast.success("Connected successfully!");
    } catch (axiosError: any) {
      setError(axiosError.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  if (currentUser) return <Navigate to="/" />;
  else
    return (
      <Page className="login" responsivity={!loginMode}>
        <>
          <Page.PageLeft
            className={rctClass({
              ["ui dimmable dimmed"]: !loginMode,
              ["collapse blurring"]: collapse,
            })}
          >
            <div className="content">
              <Grid verticalAlign="middle">
                <Grid.Column>
                  <Header as="h2" color="teal" textAlign="center">
                    {loginMode ? "Log-in to your account" : "Create an account"}
                  </Header>
                  <Form
                    size="large"
                    onSubmit={handleSubmit}
                    error={!!error}
                    loading={loading}
                  >
                    <Segment stacked>
                      <Form.Input
                        name="username"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                        required
                      />
                      {!loginMode && (
                        <Form.Input
                          name="email"
                          type="email"
                          fluid
                          icon="mail"
                          iconPosition="left"
                          placeholder="E-Mail address"
                          required
                        />
                      )}
                      <Form.Input
                        name="password"
                        type="password"
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        required
                        minLength={8}
                      />
                      <Button fluid type="submit" color="teal" size="large">
                        {loginMode ? "Login" : "Register"}
                      </Button>
                    <Message
                      error
                      icon="times circle outline"
                      header="Something went wrong"
                      content={error}
                      onDismiss={() => setError("")}
                    />
                    </Segment>
                  </Form>
                  <Message style={{ textAlign: "center" }}>
                    {loginMode ? (
                      <span>
                        New to us?
                        <b onClick={() => setLoginMode(false)}>Register</b>
                      </span>
                    ) : (
                      <span>
                        Already have an account?
                        <b onClick={() => setLoginMode(true)}>Login</b>
                      </span>
                    )}
                  </Message>
                </Grid.Column>
              </Grid>
            </div>
          </Page.PageLeft>
          <Page.PageRight
            className={rctClass({
              ["ui dimmable dimmed"]: !loginMode,
              blurring: !collapse,
            })}
          >
            <div className="content">
              <Transition visible={loginMode} animation="scale" duration={500}>
                <img src="./bg.png" alt="background-image" />
              </Transition>
              {!loginMode && <UploadAvatar {...{ avatar, setAvatar }} />}
            </div>
          </Page.PageRight>
        </>
      </Page>
    );
};

export default Login;
