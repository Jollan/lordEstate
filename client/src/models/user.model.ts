import { Chat } from "./chat.model";
import { Metadata } from "./models";
import { Post } from "./post.model";

interface Common {
  username: string;
  email: string;
  avatar?: string;
}

export interface UserInfo extends Common {
  password: string;
}

export type Credentials = Pick<UserInfo, "username" | "password">;

export interface User extends Common, Metadata {
  chatIds: string[];
  chats?: Chat[];
  posts?: Post[];
  savedPosts?: any[]
}

export interface UserPosts {
  userPosts: Post[];
  savedPosts: Post[];
}
