import { Form, FormInput, Button, Segment, Message } from "semantic-ui-react";
import "./ProfileUpdate.scss";
import { useContext, useState } from "react";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { AuthContext } from "../../context/Auth.context";
import Page from "../../components/Page/Page";
import { updateUser } from "../../services/user";
import { sanitize } from "../../lib/utils";
import { UserInfo } from "../../models/user.model";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useErrorToast } from "../../lib/hooks";

const ProfileUpdate = () => {
  const { currentUser, updateCurrentUser } = useContext(AuthContext);

  const [avatar, setAvatar] = useState(currentUser!.avatar);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const errorToast = useErrorToast();

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
      const res = await updateUser(data, currentUser!.id!);
      updateCurrentUser(res.data);
      navigate("/profile");
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      const message = error.response?.data.message ?? error.message;
      errorToast(error, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="update" responsivity>
      <>
        <Page.PageLeft>
          <div className="content">
            <h2 className="ui header">Profile update</h2>
            <Form onSubmit={handleSubmit} loading={loading} error={!!error}>
              <Segment textAlign="center">
                <FormInput
                  name="username"
                  id="username"
                  fluid
                  label="Username"
                  placeholder="Username"
                />
                <FormInput
                  type="email"
                  name="email"
                  id="email"
                  fluid
                  label="E-Mail"
                  placeholder="E-Mail"
                />
                <FormInput
                  type="password"
                  name="password"
                  id="password"
                  fluid
                  label="Password"
                  placeholder="Password"
                />
                <Button fluid type="submit" color="teal">
                  Update
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
          </div>
        </Page.PageLeft>
        <Page.PageRight>
          <div className="content">
            <UploadAvatar avatar={avatar!} setAvatar={setAvatar} />
          </div>
        </Page.PageRight>
      </>
    </Page>
  );
};

export default ProfileUpdate;
