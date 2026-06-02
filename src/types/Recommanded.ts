import type {User} from "./User.ts";

export interface UserRecommended {
  id: string;
  username: string;
  profilePicture?: string;
  score: number;
  shared_friends: number;
  shared_groups: number;
  shared_pages: number;
  email: string;
  role: string;
  created_at: string;
  usersBanned?: Partial<User>[];
}
