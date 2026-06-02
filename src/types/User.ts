export type User = {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  role: Role;
  friends?: Partial<User>[];
  usersBanned?: Partial<User>[];
};

export type Role = "USER" | "ADMIN" | "BANNED";
