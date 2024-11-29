import { useContext } from "react";
import {
  UserPostListContextProvider,
  UserPostListContext,
} from "../../../context/UserPostList.context";
import { Link, useAsyncValue } from "react-router-dom";
import { Button } from "semantic-ui-react";
import List from "../../../components/List/List";
import { UserPosts } from "../../../models/user.model";

const UserPostList = () => {
  const { data } = useAsyncValue() as Axios.AxiosXHR<UserPosts>;

  return (
    <UserPostListContextProvider posts={data}>
      <_UserPostList />
    </UserPostListContextProvider>
  );
};

const _UserPostList = () => {
  const { data } = useContext(UserPostListContext);

  return (
    <>
      <div className="user-post-list">
        <div className="head">
          <div className="title">My Posts</div>
          <Button as={Link} to="/posts/add" color="yellow">
            Create New Post
          </Button>
        </div>
        <div className="list">
          <List data={data!.userPosts} />
        </div>
      </div>
      <div className="saved-post-list">
        <div className="head">
          <div className="title">Saved Posts</div>
        </div>
        <div className="list">
          <List data={data!.savedPosts} />
        </div>
      </div>
      <div className="hidden-post-list">
        <div className="head">
          <div className="title">Hidden Posts</div>
        </div>
        <div className="list">
          <List data={[]} />
        </div>
      </div>
    </>
  );
};

export default UserPostList;
