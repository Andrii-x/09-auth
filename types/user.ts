export type User = {
  username: string;
  email: string;
  avatar: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type UpdateUserData = Pick<User, "username">;
