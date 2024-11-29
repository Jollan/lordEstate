import Axios from "../lib/http.client";
import { Credentials, User, UserInfo } from "../models/user.model";

export const register = (info: UserInfo) => {
  return Axios.post<User>("/authen/register", info);
};

export const login = (credentials: Credentials) => {
  return Axios.post<User>("/authen/login", credentials);
};

export const logout = () => {
  return Axios.post<void>("/authen/logout");
};
