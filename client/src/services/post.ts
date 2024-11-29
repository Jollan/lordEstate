import Axios from "../lib/http.client";
import { Post, PostInfo, SearchResponse } from "../models/post.model";

export const createPost = (info: PostInfo) => {
  return Axios.post<Post>("/posts", info);
};

export const getPost = (id: string) => {
  return Axios.get<Post>(`/posts/${id}`);
};

export const updatePost = (id: string, info: Partial<PostInfo>) => {
  return Axios.put<Post>(`/posts/${id}`, info);
};

export const deletePost = (id: string) => {
  return Axios.delete<void>(`/posts/${id}`);
};

export const searchPosts = (query: string) => {
  return Axios.get<SearchResponse>(`/posts/search${query}`);
};
