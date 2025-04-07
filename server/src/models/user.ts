export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
};

export type UserInput = Omit<User, "id">;
