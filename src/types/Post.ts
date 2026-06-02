import type {User} from "./User.ts";

export type Post = {
  id: string;
  userId: string;
  content: string;
  image?: string;
  comments?: string[];
  likes: Partial<User>[];
  dislikes: Partial<User>[];
  createdAt: string;
};
