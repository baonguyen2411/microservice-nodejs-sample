export type UserRoles = 'ADMIN' | 'USER';
export interface IUser {
  _id?: string;
  _doc?: {
    email: string;
    username: string;
    password: string;
    photo: string;
    role?: UserRoles;
  };
  email: string;
  username: string;
  password: string;
  photo: string;
  role?: UserRoles;
}
