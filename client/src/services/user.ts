import Axios from "../lib/http.client";
import { User, UserInfo, UserPosts } from "../models/user.model";

export const getUserPosts = () => {
  return Axios.get<UserPosts>("/users/posts");
};

export const savePost = (postId: string) => {
  return Axios.post<{ message: string }>("/users/savePost", { postId });
};

export const getUsers = () => {
  return Axios.get<User[]>("/users");
};

export const getUser = (id: string) => {
  return Axios.get<User>(`/users/${id}`);
};

export const updateUser = (info: UserInfo, id: string) => {
  return Axios.put<User>(`/users/${id}`, info);
};

export const deleteUser = (id: string) => {
  return Axios.delete<void>(`/users/${id}`);
};

export const getUnreadChatCount = () => {
  return Axios.get<number>("/users/chats/unread");
};
