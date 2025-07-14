export interface IUser {
  _id?: string;
  _doc?: {
    email: string;
    username: string;
    password: string;
    photo: string;
    role?: string;
  };
  email: string;
  username: string;
  password: string;
  photo: string;
  role?: string;
}
