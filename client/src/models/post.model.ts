import { Metadata } from "../models/models";
import { User } from "../models/user.model";

type Type = "rent" | "buy";
type Property = "apartement" | "house" | "condo" | "land";

export interface PostInfo {
  postData: PostData;
  postDetail: PostDetailInfo;
}

export interface Post extends Common, Metadata {
  user?: Partial<User>;
  userId: string;
  city?: City;
  cityId?: string;
  postDetail?: PostDetail;
  savedPosts?: SavedPost[];
  hidden?: boolean;
}

export type SearchResponse = { nbPage: number; count: number; posts: Post[] };

export interface SearchParams {
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  property?: string;
  bedroom?: string;
  page?: string;
  limit?: string;
}

export interface City {
  id: string;
  name: string;
}

interface Common {
  title: string;
  price: number;
  images: string[];
  address: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  type: Type;
  property: Property;
}

interface PostData extends Common {
  city: string;
}

interface PostDetailInfo {
  desc: string;
  utilities?: string;
  pet?: string;
  income?: string;
  size?: number;
  school?: number;
  bus?: number;
  restaurant?: number;
}

interface PostDetail extends PostDetailInfo {
  id: string;
  post?: Post;
  postId: string;
}

interface SavedPost {
  user?: User;
  post?: Post;
  userId: string;
  postId: string;
}
