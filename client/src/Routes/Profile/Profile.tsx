import { Button } from "semantic-ui-react";
import "./Profile.scss";
import Avatar from "../../components/Avatar/Avatar";
import ChatArea from "./ChatArea/ChatArea";
import { Suspense, useContext, useState } from "react";
import { rctClass, title } from "../../lib/utils";
import {
  Await,
  defer,
  Link,
  LoaderFunction,
  useLoaderData,
} from "react-router-dom";
import { AuthContext } from "../../context/Auth.context";
import Page from "../../components/Page/Page";
import { getUserPosts } from "../../services/user";
import { User, UserPosts } from "../../models/user.model";
import ListPlaceholder from "../../components/ListPlaceholder/ListPlaceholder";
import ChatListPlaceholder from "./ChatList/ChatListPlaceholder/ChatListPlaceholder";
import { getChats } from "../../services/chat";
import { Chat as IChat } from "../../models/chat.model";
import { ChatContextProvider } from "../../context/Chat.context";
import UserPostList from "./UserPostList/UserPostList";
import ChatList from "./ChatList/ChatList";
import { ProfileContextProvider } from "../../context/Profile.context";
import AsyncErrorPage from "../ErrorPage/AsyncErrorPage/AsyncErrorPage";

interface LoaderData {
  posts: Axios.IPromise<Axios.AxiosXHR<UserPosts>>;
  chats: Axios.IPromise<Axios.AxiosXHR<IChat[]>>;
}

export const loader: LoaderFunction = () => {
  const posts = getUserPosts();
  const chats = getChats();
  return defer({ posts, chats });
};

const Profile = () => {
  const data = useLoaderData() as LoaderData;
  const { currentUser } = useContext(AuthContext);

  return (
    <Page className="profile" responsivity>
      <ProfileContextProvider>
        <Page.PageLeft>
          <div className="content">
            <div className="user-info">
              <div className="head">
                <div className="title">User Information</div>
                <Button as={Link} to="/profile/update" color="yellow">
                  Update profile
                </Button>
              </div>
              <div className="info">
                <div className="avatar">
                  <span>Avatar: </span>
                  <Avatar image={currentUser!.avatar!} />
                </div>
                <div className="username">
                  <span>Username: </span>
                  <b>{title(currentUser!.username)}</b>
                </div>
                <div className="email">
                  <span>Email: </span>
                  <b>{currentUser!.email}</b>
                </div>
              </div>
            </div>
            <Suspense fallback={<ListPlaceholder />}>
              <Await resolve={data.posts} errorElement={<AsyncErrorPage />}>
                <div className="posts">
                  <UserPostList />
                </div>
              </Await>
            </Suspense>
          </div>
        </Page.PageLeft>
        <Page.PageRight>
          <div className="content">
            <div className="title">Messages</div>
            <Suspense fallback={<ChatListPlaceholder />}>
              <Await resolve={data.chats} errorElement={<AsyncErrorPage />}>
                <ChatContextProvider>
                  <ChatLayout />
                </ChatContextProvider>
              </Await>
            </Suspense>
          </div>
        </Page.PageRight>
      </ProfileContextProvider>
    </Page>
  );
};

export interface ChatMeta {
  chatId: string;
  correspondent: Partial<User>;
}

interface ChatLayoutProps {}

const ChatLayout = ({}: ChatLayoutProps) => {
  const [chatMeta, setChatMeta] = useState<ChatMeta>(null!);

  return (
    <div className={"chat-layout" + rctClass({ collapse: chatMeta })}>
      <div className="chat-list">
        <ChatList onOpenChat={setChatMeta} chatMeta={chatMeta} />
      </div>
      <div className="chat-area-container">
        <ChatArea onCloseChat={() => setChatMeta(null!)} chatMeta={chatMeta} />
      </div>
    </div>
  );
};

export default Profile;
