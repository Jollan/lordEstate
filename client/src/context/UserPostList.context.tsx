import { createContext, ReactNode, useEffect, useState } from "react";
import { UserPosts } from "../models/user.model";
import { Post } from "../models/post.model";
import { cloneDeep, remove } from "lodash-es";

export const UserPostListContext = createContext<{
  data?: UserPosts;
  setPost?: (post: Post & { saved: boolean }) => void;
}>({} as any);

interface UserPostListContextProviderProps {
  posts: UserPosts;
  children: ReactNode;
}
export const UserPostListContextProvider = ({
  posts,
  children,
}: UserPostListContextProviderProps) => {
  const [post, setPost] = useState<Post & { saved: boolean }>();
  const [data, setData] = useState(cloneDeep(posts));

  useEffect(() => {
    const { userPosts, savedPosts } = data;
    if (post) {
      const index = userPosts.findIndex((val) => val.id === post.id);
      if (index !== -1) {
        userPosts[index] = post;
      }
      if (post.saved) {
        savedPosts.push(post);
        setData({ userPosts, savedPosts });
      } else {
        remove(savedPosts, (value) => value.id === post.id);
        setData({ userPosts, savedPosts });
      }
    }
  }, [post]);

  return (
    <UserPostListContext.Provider value={{ data, setPost }}>
      {children}
    </UserPostListContext.Provider>
  );
};
